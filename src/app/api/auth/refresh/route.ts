import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RefreshToken from '@/models/RefreshToken';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function generateRandomToken() {
    return crypto.randomBytes(40).toString('hex');
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { refresh_token } = await req.json();

        if (!refresh_token) {
            return NextResponse.json(
                { message: 'Token is required' },
                { status: 400 }
            );
        }

        const tokenDef = await RefreshToken.findOne({ token: refresh_token }).populate('userId');

        if (!tokenDef || tokenDef.revoked || Date.now() >= tokenDef.expiresAt.getTime()) {
            // If token is revoked, it might be a reuse attempt (security risk)
            // In a real app, you might want to revoke all tokens for this user tree
            return NextResponse.json(
                { message: 'Invalid or expired Refresh Token' },
                { status: 400 }
            );
        }

        const user = tokenDef.userId;
        const secret = process.env.JWT_SECRET || 'secret';

        // Rotate Token
        const newRefreshTokenString = generateRandomToken();
        const newRefreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Revoke old token
        tokenDef.revoked = new Date();
        tokenDef.replacedByToken = newRefreshTokenString;
        await tokenDef.save();

        // Create new token
        await RefreshToken.create({
            token: newRefreshTokenString,
            userId: user._id,
            expiresAt: newRefreshTokenExpires,
        });

        // Generate new Access Token
        const newAccessToken = jwt.sign(
            { userId: user._id, email: user.email },
            secret,
            { expiresIn: '15m' }
        );

        return NextResponse.json({
            access_token: newAccessToken,
            refresh_token: newRefreshTokenString,
            token_type: 'Bearer',
            expires_in: 900
        });

    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

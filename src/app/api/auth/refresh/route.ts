import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

interface RefreshTokenPayload extends jwt.JwtPayload {
    userId: string;
    tokenType: string;
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

        const secret = process.env.JWT_SECRET || 'secret';
        let payload: RefreshTokenPayload;

        try {
            payload = jwt.verify(refresh_token, secret) as RefreshTokenPayload;
        } catch (err) {
            return NextResponse.json(
                { message: 'Invalid or expired Refresh Token' },
                { status: 401 }
            );
        }

        if (payload.tokenType !== 'refresh') {
            return NextResponse.json(
                { message: 'Invalid token type' },
                { status: 400 }
            );
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Generate new Access Token
        const newAccessToken = jwt.sign(
            { userId: user._id, email: user.email },
            secret,
            { expiresIn: '15m' }
        );

        // Optionally rotate refresh token
        const refreshTokenExpires = 7 * 24 * 60 * 60; // seconds
        const newRefreshTokenString = jwt.sign(
            {
                userId: user._id,
                tokenType: 'refresh'
            },
            secret,
            { expiresIn: refreshTokenExpires }
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

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AuthCode from '@/models/AuthCode';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function base64URLEncode(str: Buffer) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function sha256(buffer: string) {
    return crypto.createHash('sha256').update(buffer).digest();
}

function generateRandomToken() {
    return crypto.randomBytes(40).toString('hex');
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        let code, code_verifier;

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            code = formData.get('code')?.toString();
            code_verifier = formData.get('code_verifier')?.toString();
        } else {
            const json = await req.json();
            code = json.code;
            code_verifier = json.code_verifier;
        }

        if (!code || !code_verifier) {
            return NextResponse.json(
                { message: 'Missing code or code_verifier' },
                { status: 400 }
            );
        }

        const authCodeDef = await AuthCode.findOne({ code }).populate('userId');

        if (!authCodeDef) {
            return NextResponse.json(
                { message: 'Invalid or expired Authorization Code' },
                { status: 400 }
            );
        }

        if (authCodeDef.expiresAt < new Date()) {
            return NextResponse.json(
                { message: 'Authorization Code expired' },
                { status: 400 }
            );
        }

        const hash = sha256(code_verifier);
        const calculatedChallenge = base64URLEncode(hash);

        if (calculatedChallenge !== authCodeDef.codeChallenge) {
            return NextResponse.json(
                { message: 'PKCE verification failed' },
                { status: 400 }
            );
        }

        const user = authCodeDef.userId;
        const secret = process.env.JWT_SECRET || 'secret';

        // Generate Access Token (short-lived, e.g., 15 minutes)
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            secret,
            { expiresIn: '15m' }
        );

        // Generate ID Token (OIDC standard, contains claims)
        const idToken = jwt.sign(
            {
                sub: user._id,
                name: user.name,
                email: user.email,
                companyId: user.company,
                iat: Math.floor(Date.now() / 1000)
            },
            secret,
            { expiresIn: '1h' }
        );

        // Generate Refresh Token (long-lived, e.g., 7 days)
        // Stateless: We sign it with the secret. No DB storage.
        const refreshTokenExpires = 7 * 24 * 60 * 60; // seconds
        const refreshTokenString = jwt.sign(
            {
                userId: user._id,
                tokenType: 'refresh'
            },
            secret,
            { expiresIn: refreshTokenExpires }
        );

        // REMOVED: await RefreshToken.create(...)

        await AuthCode.deleteOne({ _id: authCodeDef._id });

        return NextResponse.json({
            access_token: accessToken,
            refresh_token: refreshTokenString,
            id_token: idToken,
            token_type: 'Bearer',
            expires_in: 900
        });

    } catch (error) {
        console.error('Token error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

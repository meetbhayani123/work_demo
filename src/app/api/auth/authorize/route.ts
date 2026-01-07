import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import AuthCode from '@/models/AuthCode';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { email, password, code_challenge, code_challenge_method } = await req.json();

        if (!email || !password || !code_challenge || !code_challenge_method) {
            return NextResponse.json(
                { message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate a random authorization code
        const code = crypto.randomBytes(16).toString('hex');

        // Expires in 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await AuthCode.create({
            code,
            userId: user._id,
            codeChallenge: code_challenge,
            codeChallengeMethod: code_challenge_method,
            expiresAt,
        });

        return NextResponse.json({ code });

    } catch (error) {
        console.error('Authorize error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { name, email, password, companyName } = await req.json();

        if (!name || !email || !password || !companyName) {
            return NextResponse.json(
                { message: 'Please provide all fields' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const companyCode = companyName.toLowerCase().replace(/\s+/g, '') + Math.floor(1000 + Math.random() * 9000);

        const company = await Company.create({
            name: companyName,
            code: companyCode,
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            company: company._id,
        });

        return NextResponse.json(
            { message: 'User created successfully', user },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal Server Error', error },
            { status: 500 }
        );
    }
}

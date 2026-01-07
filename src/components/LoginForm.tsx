'use client';

import React, { useState } from 'react';
import { Card, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { generateRandomString, generateCodeChallenge } from '@/utils/pkce';
import Link from 'next/link';

const { Title } = Typography;

const LoginForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Auth Context
    const { saveCodeVerifier } = useAuth();

    // State for PKCE
    const [codeChallenge, setCodeChallenge] = useState('');
    const [codeVerifier, setCodeVerifierState] = useState('');

    // Generate PKCE once on mount
    React.useEffect(() => {
        const initPKCE = async () => {
            const verifier = generateRandomString(128);
            setCodeVerifierState(verifier);
            saveCodeVerifier(verifier); // Save to context/localstorage

            const challenge = await generateCodeChallenge(verifier);
            setCodeChallenge(challenge);
        };
        initPKCE();
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // 1. Authorize Request
                const authResponse = await fetch('/api/auth/authorize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                        code_challenge: codeChallenge,
                        code_challenge_method: 'S256',
                    }),
                });

                const authData = await authResponse.json();

                if (!authResponse.ok) {
                    throw new Error(authData.message || 'Authorization failed');
                }

                const { code } = authData;

                // 2. Redirect to Callback with Code
                router.push(`/auth/callback?code=${code}`);

            } catch (error: any) {
                console.error('Login error:', error);
                message.error(error.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="max-w-md mx-auto p-4 w-full">
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                <div className="bg-white p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h1>

                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <Input
                                size="large"
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Enter your email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                status={formik.touched.email && formik.errors.email ? 'error' : ''}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Enter your password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                status={formik.touched.password && formik.errors.password ? 'error' : ''}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm hover:underline" style={{ color: '#e91e63' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            className="w-full bg-pink-600 hover:bg-pink-700 font-bold border-none h-12 text-lg mt-2"
                            style={{ backgroundColor: '#e91e63' }}
                        >
                            LOGIN
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default LoginForm;

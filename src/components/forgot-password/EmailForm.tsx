'use client';

import React from 'react';
import { Card, Input, Button, message, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

const EmailForm = () => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: (values) => {
            message.loading({ content: 'Sending OTP...', key: 'otp' });
            setTimeout(() => {
                message.success({ content: 'OTP sent to your email!', key: 'otp' });
                // Pass email via query param to the next page
                router.push(`/forgot-password/verify?email=${encodeURIComponent(values.email)}`);
            }, 1000);
        },
    });

    return (
        <div className="max-w-md mx-auto p-4 w-full">
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                <div className="bg-white p-6">
                    <div className='flex items-center mb-6 relative'>
                        <Link href="/login" className="absolute left-0 text-gray-500 hover:text-gray-800">
                            <ArrowLeftOutlined style={{ fontSize: '20px' }} />
                        </Link>
                        <h1 className="text-2xl font-bold text-center w-full text-gray-800">Forgot Password</h1>
                    </div>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="text-center mb-4">
                            <Text type="secondary">Enter your email address to receive a verification code.</Text>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <Input
                                    size="large"
                                    prefix={<MailOutlined className="text-gray-400" />}
                                    placeholder="email@example.com"
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

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={formik.isSubmitting}
                                className="w-full bg-pink-600 hover:bg-pink-700 font-bold border-none h-12 text-lg"
                                style={{ backgroundColor: '#e91e63' }}
                            >
                                SEND OTP
                            </Button>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EmailForm;

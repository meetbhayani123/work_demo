'use client';

import React from 'react';
import { Card, Button, message, Typography, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const { Text } = Typography;

const VerifyForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'your email';

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: Yup.object({
            otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
        }),
        onSubmit: (values) => {
            message.loading({ content: 'Verifying OTP...', key: 'verify' });
            setTimeout(() => {
                message.success({ content: 'OTP Verified!', key: 'verify' });
                router.push('/forgot-password/reset');
            }, 1000);
        },
    });

    const handleOtpChange = (value: string) => {
        formik.setFieldValue('otp', value);
    };

    return (
        <div className="max-w-md mx-auto p-4 w-full">
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                <div className="bg-white p-6">
                    <div className='flex items-center mb-6 relative'>
                        <Link href="/forgot-password" className="absolute left-0 text-gray-500 hover:text-gray-800">
                            <ArrowLeftOutlined style={{ fontSize: '20px' }} />
                        </Link>
                        <h1 className="text-2xl font-bold text-center w-full text-gray-800">Verification</h1>
                    </div>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="text-center mb-4">
                            <Text type="secondary">Enter the 6-digit code sent to <span className="font-bold">{email}</span></Text>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-8 flex flex-col items-center">
                                <label className="block text-sm font-medium text-gray-700 mb-4">OTP Code</label>
                                <Input.OTP
                                    length={6}
                                    size="large"
                                    value={formik.values.otp}
                                    onChange={handleOtpChange}
                                    status={formik.touched.otp && formik.errors.otp ? 'error' : ''}
                                />
                                {formik.touched.otp && formik.errors.otp && (
                                    <div className="text-red-500 text-sm mt-2 text-center">{formik.errors.otp}</div>
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
                                VERIFY OTP
                            </Button>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default VerifyForm;

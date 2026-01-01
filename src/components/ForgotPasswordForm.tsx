'use client';

import React, { useState } from 'react';
import { Card, Input, Button, message, Steps, Typography } from 'antd';
import { MailOutlined, SafetyCertificateOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const ForgotPasswordForm = () => {
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    const validationSchemas = [
        Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        Yup.object({
            otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
        }),
        Yup.object({
            newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
    ];

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: validationSchemas[current],
        onSubmit: (values) => {
            if (current === 2) {
                console.log('Password Reset:', values);
                message.success('Password Reset Successful!');
                router.push('/login');
            } else {
                handleNext();
            }
        },
    });

    const handleNext = async () => {
        const errors = await formik.validateForm();
        const currentStepFields = Object.keys(validationSchemas[current].fields);

        // Touch fields to show errors
        const touchedFields = currentStepFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
        formik.setTouched({ ...formik.touched, ...touchedFields });

        // Check if current step fields have errors
        const hasErrors = currentStepFields.some(field => errors[field as keyof typeof errors]);

        if (!hasErrors) {
            if (current === 0) {
                message.loading({ content: 'Sending OTP...', key: 'otp' });
                setTimeout(() => {
                    message.success({ content: 'OTP sent to your email!', key: 'otp' });
                    setCurrent(current + 1);
                }, 1000);
            } else if (current === 1) {
                message.loading({ content: 'Verifying OTP...', key: 'verify' });
                setTimeout(() => {
                    message.success({ content: 'OTP Verified!', key: 'verify' });
                    setCurrent(current + 1);
                }, 1000);
            }
        }
    };

    const steps = [
        {
            title: 'Email',
            icon: <MailOutlined />,
            content: (
                <div className="flex flex-col gap-4 py-4">
                    <div className="text-center mb-4">
                        <Text type="secondary">Enter your email address to receive a verification code.</Text>
                    </div>
                    <div>
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
                </div>
            )
        },
        {
            title: 'Verify',
            icon: <SafetyCertificateOutlined />,
            content: (
                <div className="flex flex-col gap-4 py-4">
                    <div className="text-center mb-4">
                        <Text type="secondary">Enter the 6-digit code sent to {formik.values.email}</Text>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                        <Input
                            size="large"
                            placeholder="123456"
                            maxLength={6}
                            className="text-center tracking-widest text-lg"
                            name="otp"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.otp && formik.errors.otp ? 'error' : ''}
                        />
                        {formik.touched.otp && formik.errors.otp && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.otp}</div>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Reset',
            icon: <LockOutlined />,
            content: (
                <div className="flex flex-col gap-4 py-4">
                    <div className="text-center mb-4">
                        <Text type="secondary">Create a new strong password.</Text>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <Input.Password
                            size="large"
                            placeholder="New Password"
                            name="newPassword"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.newPassword && formik.errors.newPassword ? 'error' : ''}
                        />
                        {formik.touched.newPassword && formik.errors.newPassword && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <Input.Password
                            size="large"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            status={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                        )}
                    </div>
                </div>
            )
        }
    ];

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

                    <Steps
                        current={current}
                        className="mb-8 custom-steps"
                        labelPlacement="vertical"
                        size="small"
                        items={steps.map((item) => ({ key: item.title, title: item.title, icon: item.icon }))}
                    />

                    <div className="steps-content min-h-[200px]">
                        {steps[current].content}
                    </div>

                    <Button
                        type="primary"
                        onClick={current === 2 ? formik.submitForm : handleNext}
                        size="large"
                        loading={formik.isSubmitting}
                        className="w-full bg-pink-600 hover:bg-pink-700 font-bold border-none h-12 text-lg mt-6"
                        style={{ backgroundColor: '#e91e63' }}
                    >
                        {current === 0 ? 'SEND OTP' : current === 1 ? 'VERIFY OTP' : 'RESET PASSWORD'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPasswordForm;

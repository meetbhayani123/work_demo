'use client';

import React from 'react';
import { Card, Input, Button, message, Typography } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

const ResetForm = () => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: (values) => {
            message.loading({ content: 'Resetting Password...', key: 'reset' });
            setTimeout(() => {
                message.success({ content: 'Password Reset Successful!', key: 'reset' });
                router.push('/login');
            }, 1000);
        },
    });

    return (
        <div className="max-w-md mx-auto p-4 w-full">
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                <div className="bg-white p-6">
                    <h1 className="text-2xl font-bold text-center w-full text-gray-800 mb-6">Reset Password</h1>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="text-center mb-4">
                            <Text type="secondary">Create a new strong password for your account.</Text>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined className="text-gray-400" />}
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
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined className="text-gray-400" />}
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

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={formik.isSubmitting}
                                className="w-full bg-pink-600 hover:bg-pink-700 font-bold border-none h-12 text-lg"
                                style={{ backgroundColor: '#e91e63' }}
                            >
                                RESET PASSWORD
                            </Button>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ResetForm;

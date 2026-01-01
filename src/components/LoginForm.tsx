'use client';

import React from 'react';
import { Card, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Link from 'next/link';

const { Title } = Typography;

const LoginForm = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Login values:', values);
            message.success('Login Successful!');
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

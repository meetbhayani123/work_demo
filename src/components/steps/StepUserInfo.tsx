'use client';

import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

const StepUserInfo: React.FC = () => {
    return (
        <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
                </Form.Item>

                <Form.Item
                    label="Display Name"
                    name="displayName"
                    rules={[{ required: true, message: 'Please enter a display name' }]}
                >
                    <Input prefix={<IdcardOutlined />} placeholder="Display Name" size="large" />
                </Form.Item>
            </div>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter a password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                </Form.Item>
            </div>
        </div>
    );
};

export default StepUserInfo;

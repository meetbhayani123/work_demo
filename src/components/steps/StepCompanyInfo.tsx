'use client';

import React from 'react';
import { Form, Input } from 'antd';
import { ShopOutlined, TagOutlined } from '@ant-design/icons';

const StepCompanyInfo: React.FC = () => {
    return (
        <div className="py-4">
            <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: true, message: 'Please enter company name' }]}
            >
                <Input prefix={<ShopOutlined />} placeholder="Company Name" size="large" />
            </Form.Item>

            <Form.Item
                label="Company Display Name"
                name="companyDisplayName"
                rules={[{ required: true, message: 'Please enter company display name' }]}
            >
                <Input prefix={<TagOutlined />} placeholder="Company Display Name" size="large" />
            </Form.Item>

            <Form.Item
                label="Description"
                name="companyDescription"
                rules={[{ required: false }]}
            >
                <Input.TextArea
                    placeholder="Describe your company..."
                    rows={4}
                    showCount
                    maxLength={500}
                />
            </Form.Item>
        </div>
    );
};

export default StepCompanyInfo;

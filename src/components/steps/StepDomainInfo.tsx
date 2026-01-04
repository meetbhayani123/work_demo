'use client';

import React from 'react';
import { Form, Input } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const StepDomainInfo: React.FC = () => {
    return (
        <div className="py-4">
            <Form.Item
                label="Domain Name"
                name="domainName"
                rules={[{ required: true, message: 'Please enter domain name' }]}
            >
                <Input prefix={<><GlobalOutlined /> https://</>} placeholder="yourdomain.com" size="large" />
            </Form.Item>

            <Form.Item
                label="Description"
                name="domainDescription"
                rules={[{ required: true, message: 'Please enter description' }]}
            >
                <Input.TextArea
                    placeholder="Describe your domain..."
                    rows={4}
                    showCount
                    maxLength={500}
                />
            </Form.Item>
        </div>
    );
};

export default StepDomainInfo;

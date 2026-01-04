'use client';

import React, { useState } from 'react';
import { Steps, message, Card, Typography, Result, Button, Form } from 'antd';
import { UserOutlined, ShopOutlined, GlobalOutlined } from '@ant-design/icons';
import StepUserInfo from './steps/StepUserInfo';
import StepCompanyInfo from './steps/StepCompanyInfo';
import StepDomainInfo from './steps/StepDomainInfo';
import { FormData } from './types';

const { Title } = Typography;

const MultiStepForm = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm<FormData>();
    const [isComplete, setIsComplete] = useState(false);

    // Define fields for each step to validate on Next
    const stepFields = [
        ['name', 'displayName', 'email', 'password', 'confirmPassword'], // Step 0
        ['companyName', 'companyDisplayName', 'companyDescription'],     // Step 1
        ['domainName', 'domainDescription']                              // Step 2
    ];

    const handleNext = async () => {
        try {
            // Validate fields for the current step
            await form.validateFields(stepFields[current]);
            setCurrent(current + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handlePrev = () => {
        setCurrent(current - 1);
    };

    const onFinish = (values: FormData) => {
        console.log('Final Submission:', values);
        setIsComplete(true);
        message.success('Registration Complete!');
    };

    const steps = [
        {
            title: 'User Info',
            icon: <UserOutlined />,
            content: <StepUserInfo />,
        },
        {
            title: 'Company Info',
            icon: <ShopOutlined />,
            content: <StepCompanyInfo />,
        },
        {
            title: 'Domain Info',
            icon: <GlobalOutlined />,
            content: <StepDomainInfo />,
        },
    ];

    if (isComplete) {
        return (
            <div className="max-w-md mx-auto p-4 w-full">
                <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                    <Result
                        status="success"
                        title="Successfully Registered!"
                        subTitle="Your account, company, and domain have been set up."
                        extra={[
                            <Button type="primary" key="console" onClick={() => window.location.reload()}>
                                Go to Console
                            </Button>,
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4 w-full">
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                <div className="bg-white p-6">
                    <Title level={2} className="text-center mb-8 text-gray-800">Registration</Title>

                    <Steps
                        current={current}
                        className="mb-8"
                        labelPlacement="vertical"
                        items={steps.map((item) => ({ key: item.title, title: item.title, icon: item.icon }))}
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        initialValues={{}} // Optional: provide defaults if needed
                    >
                        <div className="steps-content">
                            {steps[current].content}
                        </div>

                        <div className="steps-action flex justify-between mt-8 gap-4">
                            <Button
                                onClick={handlePrev}
                                size="large"
                                disabled={current === 0}
                                className={`w-1/2 font-bold ${current === 0 ? 'opacity-50' : 'opacity-100 hover:opacity-100'}`}
                            >
                                Previous
                            </Button>

                            {current < steps.length - 1 && (
                                <Button
                                    type="primary"
                                    onClick={handleNext}
                                    size="large"
                                    className='w-1/2 bg-pink-600 hover:bg-pink-700 font-bold border-none'
                                >
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className='w-1/2 bg-pink-600 hover:bg-pink-700 font-bold border-none'
                                >
                                    Submit
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default MultiStepForm;

'use client';

import React, { useState } from 'react';
import { Steps, Button, message, Card, Typography } from 'antd';
import { UserOutlined, ContactsOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import StepName from './steps/StepName';
import StepContact from './steps/StepContact';
import StepBirth from './steps/StepBirth';
import StepSubmit from './steps/StepSubmit';

const { Title } = Typography;

interface FormData {
    firstName: string;
    lastName: string;
    dob: Dayjs | null;
    email: string;
    phone: string;
}

const MultiStepForm = () => {
    const [current, setCurrent] = useState(0);

    const validationSchemas = [
        Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
        }),
        Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
        }),
        Yup.object({
            dob: Yup.object().required('Date of Birth is required').nullable(),
        }),
        Yup.object({}), // No validation for submit step
    ];

    const formik = useFormik<FormData>({
        initialValues: {
            firstName: '',
            lastName: '',
            dob: null,
            email: '',
            phone: '',
        },
        validationSchema: validationSchemas[current],
        onSubmit: (values) => {
            console.log('Final Submission:', values);
            message.success('Registration Complete!');
        },
    });

    const next = async () => {
        // Trigger validation for the current step
        const errors = await formik.validateForm();
        const touched = await formik.setTouched(
            // Mark all fields in current step as touched to show errors
            Object.keys(validationSchemas[current].fields).reduce((acc, text) => {
                acc[text] = true;
                return acc;
            }, {} as any)
        );

        // Check if the specific fields for this step are valid
        // Since validateForm returns ALL errors, we should check if any errors exist for the fields in the current step schema
        // But simply checking isEmpty(errors) might be enough if we rely on the schema switching, 
        // however schema switching happens on render. We need to validate against the *current* schema.

        // Actually, since we switch schemas based on `current`, validateForm() uses the current schema!
        // So if object keys of errors is empty, we are good.

        if (Object.keys(errors).length === 0) {
            setCurrent(current + 1);
        } else {
            message.error('Please fix the errors before proceeding.');
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Name',
            icon: <UserOutlined />,
            content: <StepName
                values={formik.values}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
            />,
        },
        {
            title: 'Contact',
            icon: <ContactsOutlined />,
            content: <StepContact
                values={formik.values}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
            />,
        },
        {
            title: 'Birth',
            icon: <CalendarOutlined />,
            content: <StepBirth
                values={formik.values}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                errors={formik.errors}
                touched={formik.touched}
            />,
        },
        {
            title: 'Submit',
            icon: <CheckCircleOutlined />,
            content: <StepSubmit values={formik.values} />,
        },
    ];

    return (
        <div className="max-w-md mx-auto p-4 w-full">
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-none w-full">
                <div className="bg-white p-6">
                    <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Signup Form</h1>

                    <Steps
                        current={current}
                        className="mb-8 custom-steps"
                        labelPlacement="vertical"
                        items={steps.map((item) => ({ key: item.title, title: item.title, icon: item.icon }))}
                    />

                    <div className="steps-content min-h-[250px]">
                        {steps[current].content}
                    </div>

                    <div className="steps-action flex justify-between mt-8 gap-4">
                        <Button
                            onClick={() => prev()}
                            size="large"
                            disabled={current === 0}
                            className={`w-1/2 font-bold ${current === 0 ? 'opacity-50' : 'bg-pink-600 text-white hover:bg-pink-700 border-none'}`}
                            style={current !== 0 ? { backgroundColor: '#e91e63', color: 'white' } : {}}
                        >
                            PREVIOUS
                        </Button>

                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()} size="large" className='w-1/2 bg-pink-600 hover:bg-pink-700 font-bold border-none' style={{ backgroundColor: '#e91e63' }}>
                                NEXT
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={formik.submitForm} size="large" className='w-1/2 bg-pink-600 hover:bg-pink-700 font-bold border-none' style={{ backgroundColor: '#e91e63' }}>
                                SUBMIT
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MultiStepForm;

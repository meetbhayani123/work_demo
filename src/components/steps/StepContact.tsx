'use client';

import React from 'react';
import { Input, Typography } from 'antd';
import { FormikErrors, FormikTouched } from 'formik';

const { Title } = Typography;

interface StepContactProps {
    values: {
        email: string;
        phone: string;
    };
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    errors: FormikErrors<{ email: string; phone: string }>;
    touched: FormikTouched<{ email: string; phone: string }>;
}

const StepContact: React.FC<StepContactProps> = ({ values, handleChange, handleBlur, errors, touched }) => {
    return (
        <div className="flex flex-col gap-4 py-4">
            <Title level={4}>Contact Info:</Title>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input
                    size="large"
                    name="email"
                    placeholder="email@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    status={touched.email && errors.email ? 'error' : ''}
                />
                {touched.email && errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input
                    size="large"
                    name="phone"
                    placeholder="123-456-7890"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    status={touched.phone && errors.phone ? 'error' : ''}
                />
                {touched.phone && errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
            </div>
        </div>
    );
};

export default StepContact;

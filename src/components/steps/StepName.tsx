'use client';

import React from 'react';
import { Input, Typography } from 'antd';
import { FormikErrors, FormikTouched } from 'formik';

const { Title } = Typography;

interface StepNameProps {
    values: {
        firstName: string;
        lastName: string;
    };
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    errors: FormikErrors<{ firstName: string; lastName: string }>;
    touched: FormikTouched<{ firstName: string; lastName: string }>;
}

const StepName: React.FC<StepNameProps> = ({ values, handleChange, handleBlur, errors, touched }) => {
    return (
        <div className="flex flex-col gap-4 py-4">
            <Title level={4}>Name Info:</Title>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input
                    size="large"
                    name="firstName"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    status={touched.firstName && errors.firstName ? 'error' : ''}
                />
                {touched.firstName && errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input
                    size="large"
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    status={touched.lastName && errors.lastName ? 'error' : ''}
                />
                {touched.lastName && errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
            </div>
        </div>
    );
};

export default StepName;

'use client';

import React from 'react';
import { DatePicker, Typography } from 'antd';
import { FormikErrors, FormikTouched } from 'formik';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;

interface StepBirthProps {
    values: {
        dob: Dayjs | null;
    };
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
    errors: FormikErrors<{ dob: Dayjs | null }>;
    touched: FormikTouched<{ dob: Dayjs | null }>;
}

const StepBirth: React.FC<StepBirthProps> = ({ values, setFieldValue, setFieldTouched, errors, touched }) => {
    return (
        <div className="flex flex-col gap-4 py-4">
            <Title level={4}>Birth Info:</Title>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="Select Date"
                    value={values.dob}
                    onChange={(date) => {
                        setFieldValue('dob', date);
                        setFieldTouched('dob', true);
                    }}
                    status={touched.dob && errors.dob ? 'error' : ''}
                />
                {touched.dob && errors.dob && <div className="text-red-500 text-sm mt-1">{errors.dob as string}</div>}
            </div>
        </div>
    );
};

export default StepBirth;

'use client';

import React from 'react';
import { Typography } from 'antd';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;

interface StepSubmitProps {
    values: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: Dayjs | null;
    };
}

const StepSubmit: React.FC<StepSubmitProps> = ({ values }) => {
    return (
        <div className="flex flex-col gap-4 py-4 text-center">
            <Title level={4}>Review Your Info</Title>
            <div className="text-left bg-gray-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {values.firstName} {values.lastName}</p>
                <p><strong>Email:</strong> {values.email}</p>
                <p><strong>Phone:</strong> {values.phone}</p>
                <p><strong>DOB:</strong> {values.dob?.format('YYYY-MM-DD')}</p>
            </div>
        </div>
    );
};

export default StepSubmit;

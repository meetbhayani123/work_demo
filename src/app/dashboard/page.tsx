'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';

const statsData = [
    {
        title: 'Total Users',
        value: 112893,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <UserOutlined />,
        suffix: 'Active',
        trend: 'up',
        percent: 11.28,
        color: 'bg-green-50'
    },
    {
        title: 'Total Sales',
        value: 92822,
        precision: 2,
        valueStyle: { color: '#cf1322' },
        prefix: <DollarOutlined />,
        suffix: 'USD',
        trend: 'down',
        percent: 9.3,
        color: 'bg-red-50'
    },
    {
        title: 'New Orders',
        value: 1893,
        precision: 0,
        valueStyle: { color: '#1677ff' },
        prefix: <ShoppingCartOutlined />,
        suffix: 'Today',
        trend: 'up',
        percent: 2.4,
        color: 'bg-blue-50'
    }
];

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'key',
        key: 'key',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Customer',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Status',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags: string[]) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
];

const data = [
    {
        key: '#ORD-001',
        name: 'John Brown',
        amount: '$300.00',
        tags: ['completed'],
    },
    {
        key: '#ORD-002',
        name: 'Jim Green',
        amount: '$125.50',
        tags: ['processing'],
    },
    {
        key: '#ORD-003',
        name: 'Joe Black',
        amount: '$60.00',
        tags: ['rejected'],
    },
];

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                    <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>

                <Row gutter={[16, 16]}>
                    {statsData.map((stat, index) => (
                        <Col xs={24} sm={8} key={index}>
                            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                                <Statistic
                                    title={<span className="text-gray-500 font-medium">{stat.title}</span>}
                                    value={stat.value}
                                    precision={stat.precision}
                                    valueStyle={stat.valueStyle}
                                    prefix={stat.prefix}
                                    suffix={
                                        <span className="text-xs text-gray-400 ml-2">{stat.suffix}</span>
                                    }
                                />
                                <div className={`mt-4 flex items-center gap-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                    <span>{stat.percent}%</span>
                                    <span className="text-gray-400">from last month</span>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card title="Recent Orders" bordered={false} className="shadow-sm">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </Card>
            </div>
        </DashboardLayout>
    );
}

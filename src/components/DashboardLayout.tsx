'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    FileTextOutlined,
    LogoutOutlined,
    BellOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const userMenu = {
        items: [
            {
                key: 'profile',
                label: 'My Profile',
                icon: <UserOutlined />,
            },
            {
                key: 'settings',
                label: 'Settings',
                icon: <SettingOutlined />,
            },
            {
                type: 'divider' as const,
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: <LogoutOutlined />,
                danger: true,
            },
        ],
    };

    return (
        <Layout className="min-h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="bg-slate-900"
                breakpoint="lg"
                collapsedWidth="80"
                onBreakpoint={(broken) => {
                    if (broken) {
                        setCollapsed(true);
                    }
                }}
            >
                <div className="h-16 flex items-center justify-center p-4 bg-slate-950/50">
                    {collapsed ? (
                        <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                            IG
                        </div>
                    ) : (
                        <Title level={4} className="!m-0 !text-white whitespace-nowrap">
                            iGoodWork
                        </Title>
                    )}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    className="bg-slate-900 border-none px-2"
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: '2',
                            icon: <UserOutlined />,
                            label: 'Users',
                        },
                        {
                            key: '3',
                            icon: <FileTextOutlined />,
                            label: 'Reports',
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: '4',
                            icon: <SettingOutlined />,
                            label: 'Settings',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{ padding: 0, background: colorBgContainer }}
                    className="flex justify-between items-center px-4 sticky top-0 z-10 shadow-sm"
                >
                    <div className="flex items-center">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-lg w-16 h-16 hover:bg-gray-100"
                        />
                        <Title level={4} className="!m-0 ml-4 hidden md:block">
                            Dashboard
                        </Title>
                    </div>

                    <div className="flex items-center gap-4 pr-4">
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            className="text-lg rounded-full"
                        />
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <Dropdown menu={userMenu} placement="bottomRight" arrow>
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <Avatar size="large" icon={<UserOutlined />} className="bg-pink-100 text-pink-600" />
                                <div className="hidden md:block leading-tight">
                                    <Text strong className="block">John Doe</Text>
                                    <Text type="secondary" className="text-xs">Admin</Text>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    className="m-6 p-6 min-h-[280px]"
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;

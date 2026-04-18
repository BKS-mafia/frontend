"use client";

import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function HomePage() {
    const router = useRouter();

    const handleCreateRoom = () => {
        // Переход на страницу создания комнаты / настроек игры
        router.push('/roomEdit');
    };

    const handleJoinRoom = () => {
        // Переход на страницу ввода кода комнаты
        router.push('/join');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: 500,
                    textAlign: 'center',
                    borderRadius: 24,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    background: 'var(--ant-color-bg-container)',
                }}
            >
                <Title
                    level={1}
                    style={{
                        fontSize: '4rem',
                        marginBottom: 8,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    MafAI
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 48 }}>
                    Мафия с нейросетевыми игроками
                </Text>

                <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={handleCreateRoom}
                        block
                        style={{ height: 48, fontSize: '1.2rem' }}
                    >
                        Создать комнату
                    </Button>
                    <Button
                        size="large"
                        icon={<LinkOutlined />}
                        onClick={handleJoinRoom}
                        block
                        style={{ height: 48, fontSize: '1.2rem' }}
                    >
                        Присоединиться
                    </Button>
                </Space>
            </Card>
        </div>
    );
}
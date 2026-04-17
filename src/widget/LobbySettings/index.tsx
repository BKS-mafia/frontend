"use client";

import React, { useState, useMemo } from 'react';
import {
    Card,
    InputNumber,
    Slider,
    Table,
    Checkbox,
    Button,
    Typography,
    Space,
    Row,
    Col,
    Alert,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RoleConfig {
    name: string;
    count: number;        // для "Мирный" будет вычисляться, не редактируется
    canBeHuman: boolean;
    canBeAI: boolean;
    isAuto?: boolean;     // флаг, что роль вычисляется автоматически
}

export interface GameSettingsDTO {
    totalPlayers: number;
    peopleCount: number;
    aiCount: number;
    roles: {
        name: string;
        count: number;
        canBeHuman: boolean;
        canBeAI: boolean;
    }[];
}

const   LobbySettings: React.FC<{ onStart?: (settings: GameSettingsDTO) => void }> = ({ onStart }) => {
    const [totalPlayers, setTotalPlayers] = useState<number>(8);
    const [peopleCount, setPeopleCount] = useState<number>(5);
    const aiCount = totalPlayers - peopleCount;

    // Роли: у мирного count будет пересчитываться, поэтому начальное значение неважно
    const [roles, setRoles] = useState<RoleConfig[]>([
        { name: 'Мирный', count: 4, canBeHuman: true, canBeAI: true, isAuto: true },
        { name: 'Мафия', count: 2, canBeHuman: true, canBeAI: true },
        { name: 'Комиссар', count: 1, canBeHuman: true, canBeAI: true },
        { name: 'Доктор', count: 1, canBeHuman: true, canBeAI: true },
    ]);

    // Вычисляем сумму всех ролей, кроме мирного
    const sumOtherRoles = useMemo(() => {
        return roles
            .filter(r => r.name !== 'Мирный')
            .reduce((sum, r) => sum + r.count, 0);
    }, [roles]);

    // Автоматическое количество мирных
    const autoPeaceCount = totalPlayers - sumOtherRoles;
    const isValidRoles = autoPeaceCount >= 0 && sumOtherRoles <= totalPlayers;

    // Обновляем count у мирного в состоянии для корректного отображения (но пользователь не редактирует)
    // Чтобы данные в DTO были актуальными, при формировании settings будем подставлять autoPeaceCount.
    // Для единообразия можно обновлять состояние при каждом изменении зависимостей.
    React.useEffect(() => {
        setRoles(prev => prev.map(role =>
            role.name === 'Мирный'
                ? { ...role, count: autoPeaceCount >= 0 ? autoPeaceCount : 0 }
                : role
        ));
    }, [autoPeaceCount]);

    const handleTotalPlayersChange = (value: number | null) => {
        const newTotal = value ?? 8;
        setTotalPlayers(newTotal);
        if (peopleCount > newTotal) setPeopleCount(newTotal);
    };

    const handlePeopleSliderChange = (value: number) => {
        setPeopleCount(value);
    };

    const updateRoleCount = (index: number, newCount: number) => {
        const updated = [...roles];
        // Запрещаем менять count у мирного
        if (updated[index].name === 'Мирный') return;
        updated[index].count = Math.max(0, newCount);
        setRoles(updated);
    };

    const updateRoleFlag = (index: number, field: 'canBeHuman' | 'canBeAI', value: boolean) => {
        const updated = [...roles];
        updated[index][field] = value;
        setRoles(updated);
    };

    const handleStart = () => {
        if (!isValidRoles) return;
        const settings: GameSettingsDTO = {
            totalPlayers,
            peopleCount,
            aiCount,
            roles: roles.map(r => ({
                name: r.name,
                count: r.name === 'Мирный' ? autoPeaceCount : r.count,
                canBeHuman: r.canBeHuman,
                canBeAI: r.canBeAI,
            })),
        };
        console.log('Game Settings DTO:', settings);
        if (onStart) onStart(settings);
    };

    // Колонки таблицы
    const columns: ColumnsType<RoleConfig & { index: number }> = [
        {
            title: 'Роль',
            dataIndex: 'name',
            key: 'name',
            width: 120,
        },
        {
            title: 'Количество',
            dataIndex: 'count',
            key: 'count',
            width: 120,
            render: (count: number, record: any) => {
                if (record.name === 'Мирный') {
                    // Отображаем вычисленное значение, disabled
                    return (
                        <InputNumber
                            value={autoPeaceCount}
                            disabled
                            style={{ width: '100%' }}
                        />
                    );
                }
                return (
                    <InputNumber
                        min={0}
                        max={totalPlayers}
                        value={count}
                        onChange={(val) => updateRoleCount(record.index, val ?? 0)}
                        style={{ width: '100%' }}
                    />
                );
            },
        },
        {
            title: 'Может быть человеком',
            dataIndex: 'canBeHuman',
            key: 'canBeHuman',
            align: 'center',
            width: 150,
            render: (checked: boolean, record: any) => (
                <Checkbox
                    checked={checked}
                    onChange={(e) => updateRoleFlag(record.index, 'canBeHuman', e.target.checked)}
                />
            ),
        },
        {
            title: 'Может быть ИИ',
            dataIndex: 'canBeAI',
            key: 'canBeAI',
            align: 'center',
            width: 150,
            render: (checked: boolean, record: any) => (
                <Checkbox
                    checked={checked}
                    onChange={(e) => updateRoleFlag(record.index, 'canBeAI', e.target.checked)}
                />
            ),
        },
    ];

    const tableData = roles.map((role, idx) => ({ ...role, index: idx, key: idx }));

    return (
        <Card style={{ maxWidth: 900, margin: '2rem auto' }}>
            <Title level={3} style={{ textAlign: 'center' }}>
                Настройки игры
            </Title>

            <Row gutter={[16, 16]} align="middle">
                <Col span={8}><Text strong>Общее число игроков:</Text></Col>
                <Col span={8}>
                    <InputNumber
                        min={4}
                        max={20}
                        value={totalPlayers}
                        onChange={handleTotalPlayersChange}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={8}><Text type="secondary">от 4 до 20</Text></Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Space orientation="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span><UserOutlined /> Люди: {peopleCount}</span>
                            <span><RobotOutlined /> ИИ: {aiCount}</span>
                        </div>
                        <Slider
                            min={0}
                            max={totalPlayers}
                            step={1}
                            value={peopleCount}
                            onChange={handlePeopleSliderChange}
                            tooltip={{ formatter: (val) => `${val}` }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">0</Text>
                            <Text type="secondary">{totalPlayers}</Text>
                        </div>
                    </Space>
                </Col>
            </Row>

            <Row style={{ marginTop: 32 }}>
                <Col span={24}>
                    <Title level={4}>Роли</Title>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                        size="middle"
                        bordered
                    />
                </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    {!isValidRoles && (
                        <Alert
                            message="Ошибка количества ролей"
                            description={`Сумма ролей (мафия + комиссар + доктор) = ${sumOtherRoles} не должна превышать общее число игроков (${totalPlayers})`}
                            type="error"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}
                    {autoPeaceCount < 0 && (
                        <Alert
                            message="Невозможно распределить роли"
                            description="Слишком много мафии, комиссаров и докторов. Уменьшите их количество."
                            type="error"
                            showIcon
                        />
                    )}
                </Col>
            </Row>

            <Row justify="center" style={{ marginTop: 32 }}>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleStart}
                    disabled={!isValidRoles}
                    icon={<PlusOutlined />}
                >
                    Старт игры
                </Button>
            </Row>
        </Card>
    );
};

export default LobbySettings;
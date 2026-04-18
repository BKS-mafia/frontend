// src/widget/TelegramClone/index.tsx

"use client";

import { useParams } from 'next/navigation';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    Layout,
    Input,
    Avatar,
    Typography,
    Button,
    Divider,
    Badge,
    ConfigProvider,
    Empty,
    Card,
    Radio,
    Space,
} from 'antd';
import {
    UserOutlined,
    MessageOutlined,
    SearchOutlined,
    TeamOutlined,
    SendOutlined,
    LockOutlined,
} from '@ant-design/icons';

import { ChatMessage, SystemNotification } from '@/src/entities/chat';
import type { ChatMessage as ChatMessageType } from '@/src/entities/chat/model/types';
import type { SystemNotification as SystemNotificationType } from '@/src/entities/chat/model/types';

const { Sider, Content } = Layout;
const { Text } = Typography;

// ==================== Константы ====================
const CURRENT_USER_ID = 'user-1';
const CURRENT_USER_NAME = 'Алексей';

// ==================== Тип для голосования ====================
interface VotingMessage {
    id: string;
    type: 'voting';
    title: string;
    options: { userId: string; userName: string }[];
    chatId: string;
}

// Тип чата
interface Chat {
    id: string;
    name: string;
    type: 'general' | 'mafia' | 'commissioner' | 'private';
    icon?: React.ReactNode;
    lastMessage?: string;
    lastMessageTime?: string;
    unread?: number;
}

// ==================== Моковые данные ====================
const mockPlayers = [
    { userId: 'user-1', userName: 'Алексей (Вы)' },
    { userId: 'user-2', userName: 'Мафия Игорь' },
    { userId: 'user-3', userName: 'Комиссар Анна' },
    { userId: 'user-4', userName: 'Мирный Дмитрий' },
    { userId: 'user-5', userName: 'Доктор Елена' },
    { userId: 'ai-1', userName: '🤖 AI-Мафия' },
    { userId: 'ai-2', userName: '🤖 AI-Мирный' },
    { userId: 'ai-3', userName: '🤖 AI-Комиссар' },
];

const mockChats: Chat[] = [
    { id: 'general', name: 'Общий чат', type: 'general', icon: <TeamOutlined />, lastMessage: 'Голосуем!', lastMessageTime: '12:34', unread: 2 },
    { id: 'mafia', name: 'Шёпот мафии', type: 'mafia', icon: <LockOutlined />, lastMessage: 'Убиваем Анну?', lastMessageTime: '12:30', unread: 1 },
    { id: 'commissioner', name: 'Комиссар', type: 'commissioner', icon: <UserOutlined />, lastMessage: 'Проверь Игоря', lastMessageTime: '12:28', unread: 0 },
];

const messagesByChat: Record<string, ChatMessageType[]> = {
    general: [
        { id: 'g1', userId: 'user-2', userName: 'Мафия Игорь', text: 'Всем привет!', timestamp: Date.now() - 3600000, isOwn: false },
        { id: 'g2', userId: CURRENT_USER_ID, userName: CURRENT_USER_NAME, text: 'Привет! Как игра?', timestamp: Date.now() - 3500000, isOwn: true },
        { id: 'g3', userId: 'ai-1', userName: '🤖 AI-Мафия', text: 'Я думаю, что Мирные должны объединиться', timestamp: Date.now() - 3400000, isOwn: false },
    ],
    mafia: [
        { id: 'm1', userId: 'user-2', userName: 'Мафия Игорь', text: 'Кого убираем?', timestamp: Date.now() - 2000000, isOwn: false },
        { id: 'm2', userId: 'ai-1', userName: '🤖 AI-Мафия', text: 'Предлагаю Анну', timestamp: Date.now() - 1900000, isOwn: false },
    ],
    commissioner: [
        { id: 'c1', userId: 'user-3', userName: 'Комиссар Анна', text: 'Проверил Игоря — он мафия', timestamp: Date.now() - 1500000, isOwn: false },
    ],
};

const notificationsByChat: Record<string, SystemNotificationType[]> = {
    general: [
        { id: 's1', type: 'join', message: 'Алексей присоединился к комнате', timestamp: Date.now() - 7200000 },
        { id: 's2', type: 'phase_change', message: '🌙 Началась ночь. Мафия просыпается', timestamp: Date.now() - 6000000 },
        { id: 's3', type: 'phase_change', message: '☀️ Наступил день. Общее голосование!', timestamp: Date.now() - 4000000 },
    ],
    mafia: [
        { id: 'sm1', type: 'phase_change', message: '🔪 Мафия, выберите жертву', timestamp: Date.now() - 5000000 },
    ],
    commissioner: [
        { id: 'sc1', type: 'phase_change', message: '🕵️ Комиссар, ваш ход', timestamp: Date.now() - 4500000 },
    ],
};

const votingMessagesByChat: Record<string, VotingMessage[]> = {
    general: [
        {
            id: 'v1',
            type: 'voting',
            title: 'Кого исключить из игры?',
            options: mockPlayers.filter(p => p.userId !== CURRENT_USER_ID),
            chatId: 'general',
        },
    ],
    mafia: [],
    commissioner: [],
};

// ==================== Компонент голосования (без таймера) ====================
const VotingMessageComponent: React.FC<{
    voting: VotingMessage;
    onVote: (selectedUserId: string, votingId: string) => void;
    disabled: boolean;
}> = ({ voting, onVote, disabled }) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSubmit = () => {
        if (selected) {
            onVote(selected, voting.id);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div style={{ maxWidth: '70%' }}>
                <div
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 18,
                        padding: '10px 14px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0',
                    }}
                >
                    <Text strong style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8 }}>
                        🎭 Ведущий
                    </Text>
                    <div style={{ fontWeight: 500, marginBottom: 12 }}>{voting.title}</div>
                    <Radio.Group onChange={(e) => setSelected(e.target.value)} value={selected} disabled={disabled} style={{ width: '100%', marginBottom: 12 }}>
                        <Space orientation="vertical" style={{ width: '100%' }}>
                            {voting.options.map(opt => (
                                <Radio key={opt.userId} value={opt.userId}>
                                    <Avatar size={24} icon={<UserOutlined />} style={{ marginRight: 8 }} />
                                    {opt.userName}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                    <Button
                        type="primary"
                        size="small"
                        block
                        onClick={handleSubmit}
                        disabled={!selected || disabled}
                    >
                        Проголосовать
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ==================== Основной компонент ====================
const TelegramClone: React.FC = () => {
    const params = useParams();
    const roomId = params.id;

    const [chats, setChats] = useState<Chat[]>(mockChats);
    const [selectedChatId, setSelectedChatId] = useState<string>('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessageText, setNewMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages = messagesByChat[selectedChatId] || [];
    const notifications = notificationsByChat[selectedChatId] || [];
    const [votingMessages, setVotingMessages] = useState<VotingMessage[]>(votingMessagesByChat[selectedChatId] || []);

    // При смене чата обновляем голосования
    useEffect(() => {
        setVotingMessages(votingMessagesByChat[selectedChatId] || []);
    }, [selectedChatId]);

    const allItems = useMemo(() => {
        const items: (ChatMessageType | SystemNotificationType | { type: 'voting'; data: VotingMessage })[] = [
            ...messages,
            ...notifications,
            ...votingMessages.map(vm => ({ type: 'voting' as const, data: vm })),
        ];
        return items.sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, notifications, votingMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allItems]);

    const handleSendMessage = () => {
        if (!newMessageText.trim()) return;
        const newMessage: ChatMessageType = {
            id: `msg-${Date.now()}`,
            userId: CURRENT_USER_ID,
            userName: CURRENT_USER_NAME,
            text: newMessageText.trim(),
            timestamp: Date.now(),
            isOwn: true,
        };
        messagesByChat[selectedChatId] = [...messages, newMessage];
        setChats(prev => prev.map(chat =>
            chat.id === selectedChatId
                ? { ...chat, lastMessage: newMessage.text, lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                : chat
        ));
        setNewMessageText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleVote = useCallback((selectedUserId: string, votingId: string) => {
        // Удаляем это голосование из чата
        setVotingMessages(prev => prev.filter(vm => vm.id !== votingId));
        const votedPlayer = mockPlayers.find(p => p.userId === selectedUserId);
        if (votedPlayer) {
            const notif: SystemNotificationType = {
                id: `vote-result-${Date.now()}`,
                type: 'phase_change',
                message: `🗳️ Вы проголосовали за ${votedPlayer.userName}`,
                timestamp: Date.now(),
            };
            notificationsByChat[selectedChatId] = [...notifications, notif];
            // Обновляем состояние уведомлений для ререндера
            // В реальном приложении лучше использовать общее состояние, но для моков достаточно
        }
    }, [selectedChatId, notifications]);

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = (item: any) => {
        if (item.type === 'voting') {
            return (
                <VotingMessageComponent
                    key={item.data.id}
                    voting={item.data}
                    onVote={handleVote}
                    disabled={false}
                />
            );
        }
        if ('type' in item && (item.type === 'join' || item.type === 'leave' || item.type === 'role_assigned' || item.type === 'phase_change')) {
            return <SystemNotification key={item.id} notification={item} />;
        }
        return <ChatMessage key={item.id} message={item} />;
    };

    const renderChatArea = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={40} icon={chats.find(c => c.id === selectedChatId)?.icon || <TeamOutlined />} style={{ backgroundColor: '#3b82f6' }} />
                    <div style={{ marginLeft: 12 }}>
                        <div style={{ fontWeight: 500, fontSize: 16 }}>{chats.find(c => c.id === selectedChatId)?.name}</div>
                        <Text type="secondary" style={{ fontSize: 13 }}>Комната #{roomId}</Text>
                    </div>
                </div>
            </div>
            <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
                {allItems.length === 0 ? <Empty description="Нет сообщений" /> : allItems.map((item, idx) => renderItem(item))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e5e5', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Написать сообщение..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        size="large"
                    />
                    <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} disabled={!newMessageText.trim()} />
                </div>
            </div>
        </div>
    );

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#3b82f6' } }}>
            <Layout style={{ height: '100vh' }}>
                <Sider width={340} style={{ backgroundColor: '#fff', borderRight: '1px solid #e5e5e5' }}>
                    <div style={{ padding: '16px 12px' }}>
                        <Input placeholder="Поиск чатов" prefix={<MessageOutlined />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Divider style={{ margin: 0 }} />
                    <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
                        {filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                style={{
                                    padding: '10px 12px',
                                    cursor: 'pointer',
                                    borderRadius: 12,
                                    margin: '2px 4px',
                                    backgroundColor: selectedChatId === chat.id ? '#f0f7ff' : 'transparent',
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Badge dot={chat.unread > 0} color="#3b82f6" offset={[-4, 36]}>
                                        <Avatar size={48} icon={chat.icon || <UserOutlined />} style={{ backgroundColor: '#64748b' }} />
                                    </Badge>
                                    <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong style={{ fontSize: 15, color: '#1e293b' }}>{chat.name}</Text>
                                            <Text style={{ fontSize: 12, color: '#94a3b8' }}>{chat.lastMessageTime}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180, color: '#64748b' }}>
                                                {chat.lastMessage}
                                            </Text>
                                            {chat.unread > 0 && (
                                                <Badge count={chat.unread} style={{ backgroundColor: '#3b82f6' }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Sider>
                <Content>{renderChatArea()}</Content>
            </Layout>
        </ConfigProvider>
    );
};

export default TelegramClone;
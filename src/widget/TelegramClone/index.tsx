    
    import { useParams } from 'next/navigation'
    import React, { useState, useRef, useEffect } from 'react';
    import {
        Layout,
        Input,
        Avatar,
        Typography,
        Form,
        Button,
        Switch,
        Divider,
        Badge,
        ConfigProvider,
        Empty,
    } from 'antd';
    import {
        UserOutlined,
        SettingOutlined,
        MessageOutlined,
        SearchOutlined,
        LockOutlined,
        PhoneOutlined,
        MailOutlined,
        TeamOutlined,
        SendOutlined,
    } from '@ant-design/icons';
    
    const { Sider, Content } = Layout;
    const { Text, Title } = Typography;
    
    // ==================== DTO / Типы данных с сервера ====================
    
    import MessageDTO from "@/src/shared/MessageDTO"
    import ChatDTO from "@/src/shared/ChatDTO"


    const CURRENT_USER_ID = 'user-1';
    
    // ==================== Моковые данные ====================
    const mockChats: ChatDTO[] = [
        {
            id: 1,
            name: 'Иван Петров',
            lastMessage: 'Привет, как дела?',
            lastMessageTime: '12:34',
            unread: 2,
            avatar: null,
            online: true,
        },
        {
            id: 2,
            name: 'Рабочая группа',
            lastMessage: 'Дедлайн завтра в 18:00',
            lastMessageTime: '09:15',
            unread: 0,
            avatar: null,
            online: false,
            isGroup: true,
        },
        {
            id: 3,
            name: 'Анна Смирнова',
            lastMessage: 'Отправила файлы по проекту',
            lastMessageTime: 'Вчера',
            unread: 1,
            avatar: null,
            online: true,
        },
    ];
    
    const mockMessages: Record<number, MessageDTO[]> = {
        1: [
            {
                id: 'm1',
                chatId: 1,
                senderId: 'user-2',
                text: 'Привет! Как твои дела?',
                timestamp: '12:30',
                isOwn: false,
            },
            {
                id: 'm2',
                chatId: 1,
                senderId: CURRENT_USER_ID,
                text: 'Привет! Всё отлично, работаю над проектом',
                timestamp: '12:32',
                isOwn: true,
            },
            {
                id: 'm3',
                chatId: 1,
                senderId: 'user-2',
                text: 'Здорово! Когда покажешь результат?',
                timestamp: '12:33',
                isOwn: false,
            },
            {
                id: 'm4',
                chatId: 1,
                senderId: CURRENT_USER_ID,
                text: 'Думаю, к вечеру будет что показать',
                timestamp: '12:34',
                isOwn: true,
            },
        ],
        2: [
            {
                id: 'm5',
                chatId: 2,
                senderId: 'user-3',
                text: 'Коллеги, напоминаю про дедлайн',
                timestamp: '09:00',
                isOwn: false,
            },
            {
                id: 'm6',
                chatId: 2,
                senderId: CURRENT_USER_ID,
                text: 'Понял, успеваю',
                timestamp: '09:15',
                isOwn: true,
            },
        ],
        3: [
            {
                id: 'm7',
                chatId: 3,
                senderId: 'user-4',
                text: 'Привет, скинула файлы в облако',
                timestamp: 'Вчера',
                isOwn: false,
            },
            {
                id: 'm8',
                chatId: 3,
                senderId: CURRENT_USER_ID,
                text: 'Спасибо, посмотрю',
                timestamp: 'Вчера',
                isOwn: true,
            },
        ],
    };
    
    
    
const TelegramClone: React.FC = () => {
    const params = useParams(); 
    const roomId = params.id;
    console.log(roomId)

    const [chats, setChats] = useState<ChatDTO[]>(mockChats);
    const [messages, setMessages] = useState<Record<number, MessageDTO[]>>(mockMessages);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessageText, setNewMessageText] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedChat = chats.find((c) => c.id === selectedChatId);
    const currentMessages = selectedChatId ? messages[selectedChatId] || [] : [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    const handleSendMessage = () => {
        if (!newMessageText.trim() || !selectedChatId) return;

        const newMessage: MessageDTO = {
            id: `m${Date.now()}`,
            chatId: selectedChatId,
            senderId: CURRENT_USER_ID,
            text: newMessageText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
        };

        setMessages((prev) => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
        }));

        setChats((prev) =>
            prev.map((chat) =>
                chat.id === selectedChatId
                    ? {
                          ...chat,
                          lastMessage: newMessage.text,
                          lastMessageTime: newMessage.timestamp,
                      }
                    : chat
            )
        );

        setNewMessageText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSelectChat = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    // ==================== Рендер областей ====================
    const renderChatArea = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Шапка чата */}
            <div
                style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                }}
            >
                {selectedChat ? (
                    <>
                        <Avatar
                            size={40}
                            icon={selectedChat.isGroup ? <TeamOutlined /> : <UserOutlined />}
                            src={selectedChat.avatar}
                        />
                        <div style={{ marginLeft: 12, flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 16, color: '#1e293b' }}>
                                {selectedChat.name}
                            </div>
                            <Text type="secondary" style={{ fontSize: 13, color: '#64748b' }}>
                                {selectedChat.online ? 'онлайн' : 'был(а) недавно'}
                            </Text>
                        </div>
                    </>
                ) : (
                    <Text type="secondary" style={{ color: '#64748b' }}>
                        Выберите чат
                    </Text>
                )}
            </div>

            {/* Область сообщений */}
            <div
                style={{
                    flex: 1,
                    padding: '16px 20px',
                    overflowY: 'auto',
                    backgroundColor: '#f9fafb',
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {currentMessages.length === 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#94a3b8',
                        }}
                    >
                        <MessageOutlined style={{ fontSize: 48, opacity: 0.5, marginBottom: 16 }} />
                        <Text style={{ color: '#64748b' }}>Нет сообщений. Напишите первым!</Text>
                    </div>
                ) : (
                    currentMessages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                                marginBottom: 12,
                            }}
                        >
                            {!msg.isOwn && (
                                <Avatar
                                    size={32}
                                    icon={<UserOutlined />}
                                    style={{ marginRight: 8, flexShrink: 0 }}
                                />
                            )}
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: '10px 14px',
                                    borderRadius: 18,
                                    backgroundColor: msg.isOwn ? '#3b82f6' : '#ffffff',
                                    color: msg.isOwn ? '#ffffff' : '#1e293b',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    wordBreak: 'break-word',
                                    border: msg.isOwn ? 'none' : '1px solid #e2e8f0',
                                }}
                            >
                                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        marginTop: 4,
                                        textAlign: 'right',
                                        opacity: 0.7,
                                        color: msg.isOwn ? '#ffffff' : '#64748b',
                                    }}
                                >
                                    {msg.timestamp}
                                </div>
                            </div>
                            {msg.isOwn && (
                                <Avatar
                                    size={32}
                                    icon={<UserOutlined />}
                                    style={{ marginLeft: 8, flexShrink: 0 }}
                                />
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div
                style={{
                    padding: '12px 20px',
                    borderTop: '1px solid #e5e5e5',
                    backgroundColor: '#ffffff',
                }}
            >
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Написать сообщение..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{ borderRadius: 20 }}
                        size="large"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        style={{ borderRadius: 20, width: 48 }}
                        size="large"
                        disabled={!newMessageText.trim()}
                    />
                </div>
            </div>
        </div>
    );


    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#3b82f6',
                    borderRadius: 8,
                },
            }}
        >
            <Layout style={{ height: '100vh' }}>
                <Sider
                    width={340}
                    style={{
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #e5e5e5',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                    }}
                >
                    <div style={{ padding: '16px 12px' }}>
                        <Input
                            placeholder="Поиск"
                            prefix={<SearchOutlined style={{ color: '#a0a0a0' }} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ borderRadius: 20, backgroundColor: '#f5f5f5', border: 'none' }}
                            size="large"
                        />
                    </div>
                    <Divider style={{ margin: '12px 0 0' }} />

                    <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
                        {filteredChats.length === 0 ? (
                            <Empty description="Чаты не найдены" style={{ marginTop: 40 }} />
                        ) : (
                            filteredChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat.id)}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        borderRadius: 12,
                                        margin: '2px 4px',
                                        backgroundColor:
                                            selectedChatId === chat.id ? '#f0f7ff' : 'transparent',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedChatId !== chat.id) {
                                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedChatId !== chat.id) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Badge dot={chat.online} color="#22c55e" offset={[-4, 36]}>
                                            <Avatar
                                                size={48}
                                                icon={chat.isGroup ? <TeamOutlined /> : <UserOutlined />}
                                                src={chat.avatar}
                                                style={{
                                                    backgroundColor: chat.isGroup ? '#3b82f6' : '#64748b',
                                                }}
                                            />
                                        </Badge>
                                        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text
                                                    strong={chat.unread > 0}
                                                    style={{
                                                        fontSize: 15,
                                                        fontWeight: chat.unread > 0 ? 600 : 400,
                                                        color: chat.unread > 0 ? '#1e293b' : '#334155',
                                                    }}
                                                >
                                                    {chat.name}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#94a3b8' }}>
                                                    {chat.lastMessageTime}
                                                </Text>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 180,
                                                        color: chat.unread > 0 ? '#475569' : '#94a3b8',
                                                    }}
                                                >
                                                    {chat.lastMessage}
                                                </Text>
                                                {chat.unread > 0 && (
                                                    <Badge
                                                        count={chat.unread}
                                                        style={{
                                                            backgroundColor: '#3b82f6',
                                                            fontSize: 12,
                                                            minWidth: 20,
                                                            height: 20,
                                                            lineHeight: '20px',
                                                            borderRadius: 10,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Sider>

                <Content style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
                    {renderChatArea()}
                </Content>
            </Layout>
        </ConfigProvider>
    );
};

export default TelegramClone;

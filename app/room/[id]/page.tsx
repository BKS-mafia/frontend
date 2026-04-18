"use client";

import TelegramClone from "@/src/widget/TelegramClone/index";




// ==================== DTO / Типы данных с сервера ====================
interface MessageDTO {
    id: string;
    chatId: number;
    senderId: string;
    text: string;
    timestamp: string;
    isOwn: boolean;
}

interface ChatDTO {
    id: number;
    name: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
    avatar: string | null;
    online: boolean;
    isGroup?: boolean;
}

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




// ==================== Компонент ====================
const Page = () => {
    return (
        <div>
            <TelegramClone/>
        </div>
    );
};

export default Page;
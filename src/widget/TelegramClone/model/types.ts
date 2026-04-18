import { VotingMessage } from '@/src/entities/voting';
import { ChatMessage, SystemNotification } from '@/src/entities/chat';

export interface Chat {
    id: string;
    name: string;
    type: 'general' | 'mafia' | 'commissioner' | 'private';
    icon?: React.ReactNode;
    lastMessage?: string;
    lastMessageTime?: string;
    unread?: number;
}

export interface ChatData {
    messages: ChatMessage[];
    notifications: SystemNotification[];
    votingMessages: VotingMessage[];
}
export interface ChatMessage {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: number;
    isOwn?: boolean; // для фронта, можно вычислять по userId
}

export interface SystemNotification {
    id: string;
    type: 'join' | 'leave' | 'role_assigned' | 'phase_change';
    message: string;
    timestamp: number;
}

export interface VotingOption {
    userId: string;
    userName: string;
}
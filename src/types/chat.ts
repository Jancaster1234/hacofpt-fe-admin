/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConversationUser {
    id: string;
    conversationId: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    deletedByUserName: string | null;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
}

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    fileUrls: string[];
    reactions: any[];
    createdAt: string;
    updatedAt: string;
    createdByUserName: string;
    deleted: boolean;
}

export interface ChatListItem {
    id: number;
    name: string;
    avatarUrl: string;
    lastMessage?: string;
    lastMessageTime?: string;
    isUnread: boolean;
    conversationUsers: ConversationUser[];
}

export interface Chat {
    id: string;
    type: string;
    name: string;
    avatarUrl: string | null;
    conversationUsers: ConversationUser[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    createdByUserName: string;
} 
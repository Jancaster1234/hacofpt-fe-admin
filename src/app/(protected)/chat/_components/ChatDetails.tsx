/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaSmile, FaFile, FaFileWord, FaFilePdf, FaFileExcel, FaFileImage, FaFileAlt, FaFileAudio, FaFileVideo, FaFileArchive } from 'react-icons/fa';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useAuth } from "@/hooks/useAuth_v0";
import { toast } from "sonner";

interface User {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    name?: string;
}

interface ConversationUser {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    // ... các trường khác
}

interface Message {
    id: string;
    conversationId: string;
    content: string;
    fileUrls: string[];
    reactions: any[]; // Có thể định nghĩa cụ thể hơn
    createdAt: string;
    updatedAt: string;
    createdByUserName: string;
    deleted: boolean;
}

interface Chat {
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

interface ChatDetailsProps {
    chatId: string;
    chats: Chat[];
    onSendMessage: (content: string, messageData?: any) => Promise<void>;
    onReaction: (messageId: string, reactionType: string) => Promise<void>;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatId, chats, onSendMessage, onReaction }) => {
    const chat = chats.find((chat) => chat.id === chatId);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [file, setFile] = useState<string | null>(null);
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Fetch users list
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/user", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (response.ok) {
                    const res = await response.json();
                    setUsers(res);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Function to get user's full name
    const getUserFullName = (username: string) => {
        const foundUser = users.find(u => u.username == username);
        return foundUser ? `${foundUser?.name} ` : username;
    };

    useEffect(() => {
        if (file) {
            console.log('File state changed to:', file);
            handleSendMessage(message);
        }
    }, [file]);

    // Thêm useEffect để handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!chat) {
        return (
            <div className="w-2/3 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No chat selected</p>
            </div>
        );
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getFileName = (fileUrl: string) => {
        // Trích xuất tên file từ URL
        const decodedUrl = decodeURIComponent(fileUrl);
        const parts = decodedUrl.split('/');
        const lastPart = parts[parts.length - 1];
        // Nếu có UUID trong tên file (format: uuid_filename)
        if (lastPart.includes('_')) {
            return lastPart.split('_').slice(1).join('_');
        }
        return lastPart;
    };

    const getFileIcon = (fileUrl: string) => {
        const extension = fileUrl.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'doc':
            case 'docx':
                return <FaFileWord size={16} />;
            case 'pdf':
                return <FaFilePdf size={16} />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel size={16} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage size={16} />;
            case 'mp3':
            case 'wav':
            case 'ogg':
                return <FaFileAudio size={16} />;
            case 'mp4':
            case 'avi':
            case 'mov':
                return <FaFileVideo size={16} />;
            case 'zip':
            case 'rar':
            case '7z':
                return <FaFileArchive size={16} />;
            case 'txt':
                return <FaFileAlt size={16} />;
            default:
                return <FaFile size={16} />;
        }
    };

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        try {
            // Encode nội dung trước khi gửi
            const encodedContent = encodeURIComponent(content);
            await onSendMessage(encodedContent);
            setMessage('');
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage((prev) => prev + emojiObject.emoji);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const formData = new FormData();
                formData.append('files', e.target.files[0]);

                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const res = await response.json();
                    const fileUrl = res?.data[0]?.fileUrl;
                    if (fileUrl) {
                        await onSendMessage('', fileUrl);
                        setFile(null);
                        toast.success("File uploaded successfully");
                    }
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || "Failed to upload file");
                }
            } catch {
                toast.error("An error occurred while uploading file");
            }
        }
    };

    const handleReaction = async (messageId: string, reactionType: string) => {
        if (!user) return;

        try {
            await onReaction(messageId, reactionType);
        } catch {
            toast.error("An error occurred while adding reaction");
        }
    };

    return (
        <div className="w-2/3 flex flex-col bg-white h-full">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-300">
                    <img
                        src={chat.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg"}
                        alt={chat.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="font-semibold">{chat.name}</h2>
                    <p className="text-sm text-gray-500">
                        {chat.conversationUsers.length} members
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.messages.map((message) => {
                    const isCurrentUser = message?.createdByUserName && user?.username && message.createdByUserName === user.username;
                    return (
                        <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] group relative ${isCurrentUser
                                ? 'bg-blue-500 text-white rounded-2xl rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none'
                                } p-3 shadow`}
                            >
                                {!isCurrentUser && (
                                    <p className="text-xs text-gray-600 font-semibold mb-1">
                                        {getUserFullName(message.createdByUserName)}
                                    </p>
                                )}

                                {/* Message content */}
                                {message.fileUrls?.length > 0 ? (
                                    message.fileUrls.map((fileUrl, index) => (
                                        <div key={index} className="mt-2">
                                            {fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                                <img src={fileUrl} alt="Attachment" className="rounded-lg max-w-xs" />
                                            ) : (
                                                <a
                                                    href={fileUrl}
                                                    download
                                                    className={`${isCurrentUser ? 'text-white' : 'text-blue-600'} underline flex items-center gap-2`}
                                                >
                                                    {getFileIcon(fileUrl)}
                                                    {getFileName(fileUrl)}
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>{decodeURIComponent(message.content || '')}</p>
                                )}

                                {/* Timestamp */}
                                <p className="text-xs text-right mt-1 opacity-70">
                                    {formatTime(message.createdAt)}
                                </p>

                                {/* Reactions */}
                                {message.reactions?.length > 0 && (
                                    <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                        <div className="bg-white rounded-full px-2 py-1 shadow-sm flex items-center space-x-1">
                                            {message.reactions.map((reaction, i) => (
                                                <span key={i} className="text-sm">
                                                    {getReactionEmoji(reaction.reactionType)}
                                                </span>
                                            ))}
                                            <span className="text-xs text-gray-500">{message.reactions.length}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Reaction buttons - show on hover */}
                                <div className={`absolute ${isCurrentUser ? 'right-0' : 'left-0'} -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                                    <div className="bg-white rounded-full shadow-lg p-1 flex items-center space-x-1">
                                        {[
                                            { type: 'LIKE', emoji: '👍' },
                                            { type: 'LOVE', emoji: '❤️' },
                                            { type: 'HAHA', emoji: '😂' },
                                            { type: 'WOW', emoji: '😮' },
                                            { type: 'SAD', emoji: '😢' },
                                            { type: 'ANGRY', emoji: '😠' }
                                        ].map((reaction, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleReaction(message.id, reaction.type)}
                                                className="text-sm hover:scale-110 transition-transform p-1 pointer-events-auto"
                                            >
                                                {reaction.emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(message);
                }} className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="p-2 flex items-center justify-center text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
                    >
                        <FaSmile size={20} />
                    </button>
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute z-50" style={{ bottom: '400px' }}>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    <label className="p-2 flex items-center justify-center text-gray-500 hover:text-blue-500 cursor-pointer rounded-full hover:bg-gray-100">
                        <FaPaperclip size={20} />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 border rounded-full focus:outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div >
    );
};

const getReactionEmoji = (reactionType: string): string => {
    switch (reactionType) {
        case 'LIKE': return '👍';
        case 'LOVE': return '❤️';
        case 'HAHA': return '😂';
        case 'WOW': return '😮';
        case 'SAD': return '😢';
        case 'ANGRY': return '😠';
        default: return '';
    }
};

export default ChatDetails;
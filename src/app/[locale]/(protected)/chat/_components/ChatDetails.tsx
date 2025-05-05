// src/app/[locale]/(protected)/chat/_components/ChatDetails.tsx
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaSmile, FaFile, FaFileWord, FaFilePdf, FaFileExcel, FaFileImage, FaFileAlt, FaFileAudio, FaFileVideo, FaFileArchive } from 'react-icons/fa';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useAuth } from "@/hooks/useAuth_v0";
import { toast } from "sonner";
import { Chat } from '@/types/chat';

interface User {
    id: string;
    name: string;
    username: string;
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
    const [activeReactionBar, setActiveReactionBar] = useState<string | null>(null);

    // State để quản lý modal hiển thị ảnh
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Hàm đóng modal
    const closeImageModal = () => {
        setSelectedImage(null);
    };

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

    const getOtherUserAvatar = () => {
        if (!chat?.conversationUsers || !user?.id) {
            return "https://randomuser.me/api/portraits/men/99.jpg";
        }
        const otherUser = chat.conversationUsers.find(u => u.userId !== user.id);
        return otherUser?.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg";
    };

    return (
        <div className="w-2/3 flex flex-col bg-white h-full">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-300">
                    <img
                        src={getOtherUserAvatar()}
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
                    // Tooltip for full date/time
                    const fullDate = formatTime(message.createdAt);
                    return (
                        <div key={message.id} className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end`}>
                            {/* Avatar for others */}
                            {!isCurrentUser && (
                                <img
                                    src={getOtherUserAvatar()}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full mr-2 self-end"
                                />
                            )}
                            <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end ml-auto' : 'items-start mr-auto'} relative group`}>
                                {/* Name for others */}
                                {!isCurrentUser && (
                                    <span className="text-xs text-gray-500 font-medium mb-1 ml-1">{getUserFullName(message.createdByUserName)}</span>
                                )}
                                <div className="flex items-center w-full">
                                    {/* Nếu là mình, bubble trước, rồi icon */}
                                    {isCurrentUser && (
                                        <button
                                            type="button"
                                            className="mr-2 text-lg text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={() => setActiveReactionBar(activeReactionBar === message.id ? null : message.id)}
                                            tabIndex={-1}
                                        >
                                            <FaSmile />
                                        </button>
                                    )}
                                    <div
                                        className={`px-4 py-2 ${isCurrentUser
                                            ? 'bg-[#1877f2] text-white rounded-2xl rounded-br-md'
                                            : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                                            } shadow-sm break-words relative`}
                                    >

                                        {/* Nội dung tin nhắn */}
                                        {message.fileUrls?.length > 0 ? (
                                            <div className="space-y-2">
                                                {message.fileUrls.map((fileUrl, index) => {
                                                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
                                                    return isImage ? (
                                                        <img
                                                            key={index}
                                                            src={fileUrl}
                                                            alt="attachment"
                                                            className="rounded-md max-w-[120px] max-h-[120px] object-cover cursor-pointer"
                                                            onClick={() => setSelectedImage(fileUrl)} // Mở modal khi click vào ảnh
                                                        />
                                                    ) : (
                                                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-200 rounded-lg">
                                                            <div className="text-gray-600">
                                                                {getFileIcon(fileUrl)}
                                                            </div>
                                                            <a
                                                                href={fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                                                                download
                                                            >
                                                                {getFileName(fileUrl)}
                                                            </a>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-sm whitespace-pre-wrap break-words">{decodeURIComponent(message.content)}</span>
                                        )}
                                    </div>
                                    {/* Nếu là người khác, icon trước, rồi bubble */}
                                    {!isCurrentUser && (
                                        <button
                                            type="button"
                                            className="ml-2 text-lg text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={() => setActiveReactionBar(activeReactionBar === message.id ? null : message.id)}
                                            tabIndex={-1}
                                        >
                                            <FaSmile />
                                        </button>
                                    )}
                                </div>
                                {/* Emoji reactions */}
                                {message.reactions && message.reactions.length > 0 && (
                                    <div className="flex space-x-1 mt-1">
                                        {message.reactions.map((reaction, index) => (
                                            <span
                                                key={index}
                                                className="bg-white rounded-full px-2 py-1 text-xs shadow-sm border"
                                            >
                                                {getReactionEmoji(reaction.reactionType)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {/* Reaction bar: only show if activeReactionBar === message.id */}
                                {activeReactionBar === message.id && (
                                    <div className={`absolute ${isCurrentUser ? 'right-0' : 'left-0'} -bottom-7 z-40`}>
                                        <div className="bg-white rounded-full shadow-lg p-1 flex items-center space-x-1 pointer-events-auto">
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
                                                    onClick={() => { handleReaction(message.id, reaction.type); setActiveReactionBar(null); }}
                                                    className="text-sm hover:scale-110 transition-transform p-1 pointer-events-auto"
                                                >
                                                    {reaction.emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Tooltip for full date/time */}
                                <span className="msg-tooltip invisible absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none">
                                    {fullDate}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Modal hiển thị ảnh chi tiết */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeImageModal} // Đóng modal khi click ra ngoài
                >
                    <img
                        src={selectedImage}
                        alt="Detail"
                        className="max-w-full max-h-full rounded-md"
                        onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click vào ảnh
                    />
                </div>
            )}

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
// src/app/[locale]/(protected)/chat/_components/ChatList.tsx
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { ChatListItem } from "@/types/chat";
import ImageModal from './ImageModal';

interface ChatListProps {
  chats: ChatListItem[];
  onChatSelect: (chatId: string) => void;
  onCreateNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  onChatSelect,
  onCreateNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Check if it's within the last 7 days
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    }

    // Otherwise show the date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getOtherUserAvatar = (chat: ChatListItem) => {
    console.log("Current user:", user);
    console.log("Chat data:", chat);
    console.log("Conversation users:", chat.conversationUsers);

    if (!chat.conversationUsers || !user?.id) {
      console.log("No conversation users or user ID, using default avatar");
      return "https://randomuser.me/api/portraits/men/99.jpg";
    }

    const otherUser = chat.conversationUsers.find((u) => u.userId !== user.id);
    console.log("Found other user:", otherUser);

    if (!otherUser?.avatarUrl) {
      console.log("No avatar URL found for other user, using default");
    }

    return (
      otherUser?.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg"
    );
  };

  // Lọc danh sách chat dựa trên search query
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/3 bg-white border-r border-gray-200">
      {/* Header với tiêu đề và nút tạo cuộc hội thoại mới */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Chats</h2>
        <button
          onClick={onCreateNewChat}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Create new chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Input search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Danh sách chat */}
      <div className="overflow-y-auto" style={{ height: "calc(100% - 150px)" }}>
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            onClick={() => onChatSelect(chat.id.toString())}
          >
            <div className="flex items-center">
              <img
                src={getOtherUserAvatar(chat)}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover"
                onClick={() => handleImageClick(getOtherUserAvatar(chat))}
                style={{ cursor: 'pointer' }}
              />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.name}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatMessageTime(chat.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage
                    ? decodeURIComponent(chat.lastMessage)
                    : "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <img
        src="image-url.jpg" // Replace with dynamic image URL
        alt="Chat Image"
        onClick={() => handleImageClick('image-url.jpg')}
        style={{ cursor: 'pointer' }}
      />
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default ChatList;

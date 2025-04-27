// src/app/[locale]/(protected)/chat/_components/CreateChatModal.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";

interface User {
  id: string;
  name: string;
  image: string;
}
interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (user: User) => void;
  users: User[];
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat,
  users,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleSubmit = () => {
    if (selectedUser) {
      onCreateChat(selectedUser);
      setSelectedUser(null);
      onClose();
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Select User to Chat</h2>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Scrollable user list */}
        <div className="mb-4 max-h-96 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-2 cursor-pointer ${
                selectedUser?.id === user.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <p className="ml-3 text-sm font-medium text-gray-900">
                {user.name}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!selectedUser}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;

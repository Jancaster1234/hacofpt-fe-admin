// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Notifications.tsx
"use client";

import React, { useState, useEffect } from "react";
import { NotificationType } from "@/types/entities/notification";
import { NotificationMethod } from "@/types/entities/notificationDelivery";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth_v0";
import { notificationService } from "@/services/notification.service";
import { useWebSocket } from '@/contexts/WebSocketContext';

enum RoleType {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  JUDGE = "JUDGE",
  MENTOR = "MENTOR",
  GUEST = "GUEST",
  TEAM_MEMBER = "TEAM_MEMBER",
  TEAM_LEADER = "TEAM_LEADER",
}

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  username: string;
  email: string;
}

interface NotificationData {
  id: string;
  sender: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  type: NotificationType;
  content: string;
  metadata: string;
  notificationDeliveries: {
    id: string;
    recipients: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    }[];
    role: string;
    method: string;
    status: string;
    read: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface NotificationsProps {
  hackathonId: string;
}

export default function Notifications({ hackathonId }: NotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState({
    recipientEmail: "",
    type: "GENERAL" as NotificationType,
    content: "",
    metadata: "",
  });
  const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
  const [notificationMethod, setNotificationMethod] =
    useState<NotificationMethod>("IN_APP");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [recipientType, setRecipientType] = useState<"users" | "role">("users");
  const [selectedRole, setSelectedRole] = useState<RoleType>(RoleType.ADMIN);
  const { user } = useAuth();
  const { client, isConnected } = useWebSocket();

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      if (user?.id) {
        await fetchNotifications();
      }
    };
    loadData();
  }, [hackathonId]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to create a hackathon");
        return;
      }
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchNotifications = async () => {
    if (!user?.id) {
      toast.error("User ID is required");
      return;
    }

    setLoading(true);
    try {
      const { data, message } = await notificationService.getAllNotifications();

      if (data) {
        setNotifications(data);
      } else {
        toast.error(message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    if (newNotification.content.trim() === "") {
      toast.error("Please enter notification content");
      return;
    }

    if (recipientType === "users" && selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    try {
      const requestBody = {
        type: newNotification.type,
        content: newNotification.content,
        metadata: newNotification.metadata || JSON.stringify({}),
        notificationDeliveryRequest: {
          method: notificationMethod,
          ...(recipientType === "users"
            ? { recipientIds: selectedRecipients.map((r) => r.id) }
            : { role: selectedRole }),
        },
      };

      const { data, message } = await notificationService.createNotification(
        requestBody
      );

      if (data) {
        setNotifications([data, ...notifications]);

        // Send WebSocket notification to each recipient
        if (recipientType === "users" && notificationMethod === "IN_APP") {
          selectedRecipients.forEach(recipient => {

            // Gửi qua WebSocket thay vì gọi API trực tiếp
            if (client && isConnected) {
              const notificationBody = {
                id: data.id,
                content: newNotification.content,
                type: newNotification.type,
                metadata: newNotification.metadata || "{}",
                isRead: false
              };

              console.log('Sending notification via WebSocket:', notificationBody);

              client.publish({
                destination: `/app/notifications/${recipient.id}`,
                body: JSON.stringify(notificationBody)
              });
            } else {
              console.error('WebSocket not connected');
              toast.error('Failed to send notification: WebSocket not connected');
            }
          });
        }

        // Reset form
        setNewNotification({
          recipientEmail: "",
          type: "GENERAL",
          content: "",
          metadata: "",
        });
        setSelectedRecipients([]);
        setSelectedRole(RoleType.ADMIN);

        toast.success(message || "Notification created successfully!");
      } else {
        toast.error(message || "Failed to create notification");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  const toggleRecipientSelection = (user: User) => {
    if (selectedRecipients.some((r) => r.id === user.id)) {
      setSelectedRecipients(selectedRecipients.filter((r) => r.id !== user.id));
    } else {
      setSelectedRecipients([...selectedRecipients, user]);
    }
  };

  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case "MESSAGE":
        return "bg-blue-100 text-blue-800";
      case "MENTOR_REQUEST":
        return "bg-purple-100 text-purple-800";
      case "TEAM_INVITE":
        return "bg-green-100 text-green-800";
      case "HACKATHON_UPDATE":
        return "bg-yellow-100 text-yellow-800";
      case "TASK_UPDATE":
        return "bg-orange-100 text-orange-800";
      case "GENERAL":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Notification</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Type
          </label>
          <select
            value={newNotification.type}
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                type: e.target.value as NotificationType,
              })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="GENERAL">General</option>
            <option value="MESSAGE">Message</option>
            <option value="MENTOR_REQUEST">Mentor Request</option>
            <option value="TEAM_INVITE">Team Invite</option>
            <option value="HACKATHON_UPDATE">Hackathon Update</option>
            <option value="TASK_UPDATE">Task Update</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={newNotification.content}
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                content: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Enter notification content..."
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metadata (JSON)
          </label>
          <textarea
            value={newNotification.metadata}
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                metadata: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md font-mono text-sm"
            rows={2}
            placeholder='{"key": "value"}'
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add JSON metadata for this notification
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="users"
                checked={recipientType === "users"}
                onChange={(e) =>
                  setRecipientType(e.target.value as "users" | "role")
                }
                className="mr-2"
              />
              Specific Users
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="role"
                checked={recipientType === "role"}
                onChange={(e) =>
                  setRecipientType(e.target.value as "users" | "role")
                }
                className="mr-2"
              />
              Role
            </label>
          </div>
        </div>

        {recipientType === "users" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Recipients
            </label>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <div className="mb-2 border rounded-md p-3 max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedRecipients.some((r) => r.id === user.id)}
                    onChange={() => toggleRecipientSelection(user)}
                    className="mr-2"
                  />
                  <label htmlFor={`user-${user.id}`} className="text-sm">
                    {user.name} ({user.email})
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleType)}
              className="w-full p-2 border rounded-md"
            >
              {Object.values(RoleType).map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Method
          </label>
          <select
            value={notificationMethod}
            onChange={(e) =>
              setNotificationMethod(e.target.value as NotificationMethod)
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="IN_APP">In-App</option>
            <option value="EMAIL">Email</option>
            <option value="PUSH">Push Notification</option>
            <option value="SMS">SMS</option>
            <option value="WEB">Web</option>
          </select>
        </div>

        <button
          onClick={createNotification}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Send Notification
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p>No notifications found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(
                      notification.type
                    )}`}
                  >
                    {notification.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-3 relative group w-full">
                <p
                  className="text-gray-800 font-medium line-clamp-2 w-full break-all cursor-pointer"
                >
                  {notification.content}
                </p>
                <div
                  className="absolute left-0 z-50 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 shadow-lg max-w-xs w-max break-words"
                  style={{ top: '100%', marginTop: 4 }}
                >
                  {notification.content}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm space-y-2 sm:space-y-0">
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const recipients = [
                      ...new Set(
                        notification.notificationDeliveries.flatMap((d) =>
                          d.recipients.map((r) => `${r.firstName} ${r.lastName}`)
                        )
                      ),
                    ];
                    const maxTags = 3;
                    const visibleRecipients = recipients.slice(0, maxTags);
                    const hiddenRecipients = recipients.slice(maxTags);
                    const tagColors = [
                      "bg-blue-100 text-blue-800",
                      "bg-green-100 text-green-800",
                      "bg-purple-100 text-purple-800",
                      "bg-pink-100 text-pink-800",
                      "bg-yellow-100 text-yellow-800",
                    ];
                    return (
                      <>
                        {visibleRecipients.map((name, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-medium max-w-[120px] truncate inline-block ${tagColors[idx % tagColors.length]}`}
                            title={name}
                          >
                            {name}
                          </span>
                        ))}
                        {hiddenRecipients.length > 0 && (
                          <span className="relative group">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700 cursor-pointer"
                            >
                              +{hiddenRecipients.length}
                            </span>
                            <div
                              className="absolute left-0 z-50 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 shadow-lg max-w-xs w-max break-words"
                              style={{ top: '100%', marginTop: 4 }}
                            >
                              {hiddenRecipients.map((name, idx) => (
                                <div key={idx}>{name}</div>
                              ))}
                            </div>
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  {[
                    ...new Set(
                      notification.notificationDeliveries.map(
                        (d) => `${d.method} (${d.status})`
                      )
                    ),
                  ].map((status, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${getDeliveryStatusColor(
                        notification.notificationDeliveries[0].status
                      )}`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

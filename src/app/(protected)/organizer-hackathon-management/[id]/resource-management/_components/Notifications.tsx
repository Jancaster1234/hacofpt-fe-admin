// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Notifications.tsx
import React, { useState, useEffect } from "react";
import { fetchMockNotifications } from "../_mocks/fetchMockNotifications";
import { Notification, NotificationType } from "@/types/entities/notification";
import { NotificationMethod } from "@/types/entities/notificationDelivery";
import { User } from "@/types/entities/user";

interface NotificationsProps {
  hackathonId: string;
}

export default function Notifications({ hackathonId }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // Mock users for recipient selection
  const mockUsers = [
    {
      id: "user1",
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      username: "alices",
      avatarUrl: "/avatars/alice.jpg",
    },
    {
      id: "user2",
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@example.com",
      username: "bobj",
      avatarUrl: "/avatars/bob.jpg",
    },
    {
      id: "user3",
      firstName: "Carol",
      lastName: "Williams",
      email: "carol.williams@example.com",
      username: "carolw",
      avatarUrl: "/avatars/carol.jpg",
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, [hackathonId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Assuming we're using the current user's ID as sender for fetching
      const userId = "current-user-id"; // In a real app, get this from auth
      const data = await fetchMockNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async () => {
    if (newNotification.content.trim() === "") {
      alert("Please enter notification content");
      return;
    }

    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    try {
      // In a real app, you would send this to an API
      const newNotifications = selectedRecipients.map((recipient) => {
        const notification: Notification = {
          id: `new-${Date.now()}-${recipient.id}`,
          senderId: "current-user-id", // In a real app, get from auth
          recipientId: recipient.id,
          recipient: recipient,
          type: newNotification.type,
          content: newNotification.content,
          metadata: newNotification.metadata || JSON.stringify({}),
          isRead: false,
          notificationDeliveries: [
            {
              id: `delivery-${Date.now()}`,
              method: notificationMethod,
              status: "PENDING",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return notification;
      });

      // Add the new notifications to the existing list
      setNotifications([...newNotifications, ...notifications]);

      // Reset form
      setNewNotification({
        recipientEmail: "",
        type: "GENERAL",
        content: "",
        metadata: "",
      });
      setSelectedRecipients([]);

      alert("Notifications created successfully!");
    } catch (error) {
      console.error("Error creating notification:", error);
      alert("Failed to create notification");
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
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Notification</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Recipients
          </label>
          <div className="mb-2 border rounded-md p-3 max-h-40 overflow-y-auto">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedRecipients.some((r) => r.id === user.id)}
                  onChange={() => toggleRecipientSelection(user)}
                  className="mr-2"
                />
                <label htmlFor={`user-${user.id}`} className="text-sm">
                  {user.firstName} {user.lastName} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>

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
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p>No notifications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(
                    notification.type
                  )}`}
                >
                  {notification.type.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="mb-2 font-medium">{notification.content}</p>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-600 mr-2">To:</span>
                  <span className="font-medium">
                    {notification.recipient
                      ? `${notification.recipient.firstName} ${notification.recipient.lastName}`
                      : notification.recipientId}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="mr-1">Status:</span>
                  {notification.notificationDeliveries.map(
                    (delivery, index) => (
                      <span
                        key={delivery.id}
                        className={`${getDeliveryStatusColor(
                          delivery.status
                        )} ${index > 0 ? "ml-2" : ""}`}
                      >
                        {delivery.method} ({delivery.status})
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

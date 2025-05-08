// src/components/header/NotificationDropdown.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth_v0";
import { toast } from "sonner";
import Image from "next/image";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Message, StompSubscription } from "@stomp/stompjs";
import NotificationDetailModal from "./NotificationDetailModal";

interface Notification {
  id: string;
  content: string;
  metadata: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  isRead: boolean;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { client, isConnected } = useWebSocket();

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  useEffect(() => {
    let subscription: StompSubscription | null = null;

    const setupSubscription = async () => {
      if (!isConnected || !client || !user?.id) return;

      try {
        // Wait a short moment to ensure connection is fully established
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (client.connected) {
          // Subscribe to the topic that matches the backend's destination
          // The backend uses: messagingTemplate.convertAndSend("/topic/notifications/" + userId, notificationResponse);
          const topic = `/topic/notifications/${user.id}`;
          console.log(`Subscribing to topic: ${topic}`);

          subscription = client.subscribe(topic, (message: Message) => {
            try {
              const newNotification = JSON.parse(message.body);
              console.log("Received WebSocket notification:", newNotification);
              setNotifications((prev) => [newNotification, ...prev]);
              toast.info(newNotification.content);
            } catch (error) {
              console.error("Error parsing notification message:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error setting up WebSocket subscription:", error);
        toast.error("Failed to connect to notification service");
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isConnected, client, user?.id]);

  const fetchNotifications = async () => {
    try {
      if (!user?.id) {
        toast.error("Please login to view notifications");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No access token found");
        return;
      }

      setLoading(true);
      const response = await fetch(`/api/notifications/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data) {
        setNotifications(data.data || []);
      } else {
        const error = await response.json();
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications"
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    if (!notification.isRead) {
      try {
        const response = await fetch("/api/notifications/read-status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            notificationIds: [notification.id],
            isRead: true,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to mark notification as read"
          );
        }

        // Update local state
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Failed to mark notification as read");
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>

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
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg transition-colors cursor-pointer ${
                      notification.isRead
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={
                            notification.sender.avatarUrl ||
                            "https://greenscapehub-media.s3.ap-southeast-1.amazonaws.com/hacofpt/504c1e5a-bc1f-4fe7-8905-d3bbbb12cabd_smiling-young-man-illustration_1308-174669.avif"
                          }
                          alt={`${notification.sender.name}'s avatar`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start mb-2">
                          <p
                            className={`text-sm font-medium ${
                              notification.isRead
                                ? "text-gray-900"
                                : "text-blue-900"
                            }`}
                          >
                            {notification.sender.name}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p
                          className={`text-sm break-words ${
                            notification.isRead
                              ? "text-gray-800"
                              : "text-blue-800"
                          }`}
                        >
                          {truncateContent(notification.content)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3 text-center">
              <button
                onClick={() => fetchNotifications()}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      )}

      <NotificationDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />
    </div>
  );
}

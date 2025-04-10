// src/components/header/NotificationDropdown.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth_v0";
import { toast } from "sonner";
import Image from "next/image";
import { notificationService } from "@/services/notification.service";

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
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      if (!user?.id) {
        toast.error("Please login to view notifications");
        return;
      }

      setLoading(true);
      // Using the notification service instead of direct fetch
      const response = await notificationService.getAllNotifications();

      if (response && response.data) {
        setNotifications(response.data || []);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as read when dropdown is opened
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      markNotificationsAsRead();
    }
  }, [isOpen]);

  const markNotificationsAsRead = async () => {
    try {
      const unreadNotifications = notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id);

      if (unreadNotifications.length > 0) {
        await notificationService.updateReadStatusBulk({
          notificationIds: unreadNotifications,
          read: true,
        });

        // Update local state to reflect read status
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
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
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={
                            notification.sender.avatarUrl ||
                            "https://randomuser.me/api/portraits/men/99.jpg"
                          }
                          alt={notification.sender.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.sender.name}
                          </p>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">
                          {notification.content}
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
    </div>
  );
}

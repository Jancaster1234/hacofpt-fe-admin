// src/services/notification.service.ts

import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";
type NotificationPayload = {
  type:
    | "MESSAGE"
    | "MENTOR_REQUEST"
    | "TEAM_INVITE"
    | "HACKATHON_UPDATE"
    | "TASK_UPDATE"
    | "GENERAL";
  content: string;
  metadata: string;
  notificationDeliveryRequest: {
    recipientIds: string[];
    role:
      | "ADMIN"
      | "ORGANIZER"
      | "JUDGE"
      | "MENTOR"
      | "GUEST"
      | "TEAM_MEMBER"
      | "TEAM_LEADER";
    method: "IN_APP" | "EMAIL" | "PUSH" | "SMS" | "WEB";
  };
};

type BulkUpdateReadStatusRequest = {
  notificationIds: string[];
  isRead: boolean;
};
class NotificationService {
  async createNotification(data: {
    type: string;
    content: string;
    metadata: string;
    notificationDeliveryRequest: {
      recipientIds: string[];
      role: string;
      method: string;
    };
  }): Promise<{ data: any; message?: string }> {
    try {
      const response = await apiService.auth.post(
        "/communication-service/api/v1/notifications",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create notification");
      }

      return {
        data: response.data,
        message: response.message || "Notification created successfully",
      };
    } catch (error: any) {
      return handleApiError(
        error,
        {} as any,
        "[Notification Service] Error creating notification:"
      );
    }
  }

  async getAllNotifications(): Promise<{ data: any[]; message?: string }> {
    try {
      const response = await apiService.auth.get(
        "/communication-service/api/v1/notifications"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve notifications");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError(
        error,
        [],
        "[Notification Service] Error getting notifications:"
      );
    }
  }

  async getNotificationById(
    id: string
  ): Promise<{ data: any; message?: string }> {
    try {
      const response = await apiService.auth.get(
        `/communication-service/api/v1/notifications/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve notification");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError(
        error,
        {} as any,
        "[Notification Service] Error getting notification:"
      );
    }
  }

  async deleteNotification(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/notifications/${id}`
      );

      return {
        message: response.message || "Notification deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Notification Service] Error deleting notification:",
        error.message
      );
      throw error;
    }
  }

  async updateReadStatusBulk(data: {
    notificationIds: string[];
    isRead: boolean;
  }): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.put(
        "/communication-service/api/v1/notifications/notification-deliveries/read-status",
        data
      );

      return {
        message: response.message || "Read status updated successfully",
      };
    } catch (error: any) {
      console.error(
        "[Notification Service] Error updating read status:",
        error.message
      );
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

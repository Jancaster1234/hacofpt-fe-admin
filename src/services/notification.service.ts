// src/services/notification.service.ts
import { apiService } from "@/services/apiService_v0";
import { Notification } from "@/types/entities/notification";

class NotificationService {
  async getNotificationsBySenderId(
    senderId: string
  ): Promise<Partial<Notification>[]> {
    try {
      const response = await apiService.auth.get<Partial<Notification>[]>(
        `/communication-service/api/v1/notifications/sender/${senderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications by senderId:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

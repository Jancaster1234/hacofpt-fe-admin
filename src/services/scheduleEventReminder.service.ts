// src/services/scheduleEventReminder.service.ts
import { apiService } from "@/services/apiService_v0";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";
import { handleApiError } from "@/utils/errorHandler";

class ScheduleEventReminderService {
  // Create a new reminder for a schedule event
  async createScheduleEventReminder(data: {
    scheduleEventId: string;
    userId: string;
    remindAt: string;
  }): Promise<{ data: ScheduleEventReminder; message?: string }> {
    try {
      const response = await apiService.auth.post<ScheduleEventReminder>(
        "/communication-service/api/v1/schedule-event-reminders",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create schedule event reminder");
      }

      return {
        data: response.data,
        message:
          response.message || "Schedule event reminder created successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder>(
        error,
        {} as ScheduleEventReminder,
        "[ScheduleEventReminder Service] Error creating Schedule Event Reminder:"
      );
    }
  }

  // Update an existing reminder for a schedule event
  async updateScheduleEventReminder(
    id: string,
    data: {
      scheduleEventId: string;
      userId: string;
      remindAt: string;
    }
  ): Promise<{ data: ScheduleEventReminder; message?: string }> {
    try {
      const response = await apiService.auth.put<ScheduleEventReminder>(
        `/communication-service/api/v1/schedule-event-reminders/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update schedule event reminder"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Schedule event reminder updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder>(
        error,
        {} as ScheduleEventReminder,
        "[ScheduleEventReminder Service] Error updating Schedule Event Reminder:"
      );
    }
  }

  // Delete a schedule event reminder
  async deleteScheduleEventReminder(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/schedule-event-reminders/${id}`
      );

      return {
        message:
          response.message || "Schedule event reminder deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[ScheduleEventReminder Service] Error deleting Schedule Event Reminder:",
        error.message
      );
      throw error;
    }
  }

  // Get a schedule event reminder by ID
  async getScheduleEventReminder(
    id: string
  ): Promise<{ data: ScheduleEventReminder; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder>(
        `/communication-service/api/v1/schedule-event-reminders/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedule event reminder");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder>(
        error,
        {} as ScheduleEventReminder,
        "[ScheduleEventReminder Service] Error fetching Schedule Event Reminder:"
      );
    }
  }

  // Get all schedule event reminders for a specific user
  async getScheduleEventRemindersByUserId(
    userId: string
  ): Promise<{ data: ScheduleEventReminder[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders/by-user/${userId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedule event reminders for user");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder[]>(
        error,
        [],
        "[ScheduleEventReminder Service] Error fetching Schedule Event Reminders for user:"
      );
    }
  }

  // Get all schedule event reminders for a specific schedule event
  async getScheduleEventRemindersByScheduleEventId(
    scheduleEventId: string
  ): Promise<{ data: ScheduleEventReminder[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders/by-schedule-event/${scheduleEventId}`
      );

      if (!response || !response.data) {
        throw new Error(
          "Failed to retrieve schedule event reminders for schedule event"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder[]>(
        error,
        [],
        "[ScheduleEventReminder Service] Error fetching Schedule Event Reminders for schedule event:"
      );
    }
  }

  // Get all schedule event reminders
  async getAllScheduleEventReminders(): Promise<{
    data: ScheduleEventReminder[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve all schedule event reminders");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder[]>(
        error,
        [],
        "[ScheduleEventReminder Service] Error fetching all Schedule Event Reminders:"
      );
    }
  }

  // Get a schedule event reminder by scheduleEventId and userId
  async getScheduleEventReminderByScheduleEventIdAndUserId(
    scheduleEventId: string,
    userId: string
  ): Promise<{ data: ScheduleEventReminder; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEventReminder[]>(
        `/communication-service/api/v1/schedule-event-reminders/by-user-and-schedule-event?userId=${userId}&scheduleEventId=${scheduleEventId}`
      );

      if (!response || !response.data) {
        throw new Error(
          "No schedule event reminder found for given scheduleEventId and userId"
        );
      }

      return {
        data: response.data[0], // take the first object
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventReminder>(
        error,
        {} as ScheduleEventReminder,
        "[ScheduleEventReminder Service] Error fetching Schedule Event Reminder by scheduleEventId and userId:"
      );
    }
  }
}

export const scheduleEventReminderService = new ScheduleEventReminderService();

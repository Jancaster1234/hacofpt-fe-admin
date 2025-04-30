// src/services/scheduleEvent.service.ts
import { apiService } from "@/services/apiService_v0";
import { ScheduleEvent } from "@/types/entities/scheduleEvent";
import { handleApiError } from "@/utils/errorHandler";
import { FileUrl } from "@/types/entities/fileUrl";
class ScheduleEventService {
  async createScheduleEvent(data: {
    scheduleId: string;
    name: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    eventLabel?: string;
    isRecurring?: boolean;
    recurrenceRule?: string;
  }): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.post<ScheduleEvent>(
        "/communication-service/api/v1/schedule-events",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create schedule event");
      }

      return {
        data: response.data,
        message: response.message || "Schedule event created successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error creating schedule event:"
      );
    }
  }

  async updateScheduleEvent(
    id: string,
    data: {
      scheduleId: string;
      name: string;
      description?: string;
      location: string;
      startTime: string;
      endTime: string;
      eventLabel?: string;
      isRecurring?: boolean;
      recurrenceRule?: string;
      fileUrls?: string[];
    }
  ): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.put<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update schedule event");
      }

      return {
        data: response.data,
        message: response.message || "Schedule event updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error updating schedule event:"
      );
    }
  }

  // Used when update schedule event information (without fileUrls)
  async updateScheduleEventInformation(
    id: string,
    data: {
      scheduleId: string;
      name?: string;
      description?: string;
      location?: string;
      startTime?: string;
      endTime?: string;
      eventLabel?: string;
      isRecurring?: boolean;
      recurrenceRule?: string;
    }
  ): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.put<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/update-info/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update schedule event information"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Schedule event information updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error updating schedule event information:"
      );
    }
  }

  // Create Schedule Event Files (associate fileUrls with a schedule event)
  async createScheduleEventFiles(
    scheduleEventId: string,
    fileUrls: string[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.put<FileUrl[]>(
        `/communication-service/api/v1/schedule-events/update-files/${scheduleEventId}`,
        { data: { fileUrls } }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to attach files to schedule event"
        );
      }

      return {
        data: response.data.fileUrls,
        message: response.message || "Schedule event files added successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[Schedule Event Service] Error creating schedule event files:"
      );
    }
  }

  async deleteScheduleEvent(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/schedule-events/${id}`
      );

      return {
        message: response.message || "Schedule event deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Schedule Event Service] Error deleting schedule event:",
        error.message
      );
      throw error;
    }
  }

  async getScheduleEventById(
    id: string
  ): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve schedule event"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error getting schedule event:"
      );
    }
  }

  async getAllScheduleEvents(): Promise<{
    data: ScheduleEvent[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ScheduleEvent[]>(
        "/communication-service/api/v1/schedule-events"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedule events");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent[]>(
        error,
        [],
        "[Schedule Event Service] Error getting schedule events:"
      );
    }
  }

  async getScheduleEventsByScheduleId(
    scheduleId: string
  ): Promise<{ data: ScheduleEvent[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEvent[]>(
        `/communication-service/api/v1/schedule-events/by-schedule/${scheduleId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedule events by schedule ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent[]>(
        error,
        [],
        "[Schedule Event Service] Error getting schedule events by schedule ID:"
      );
    }
  }
}

export const scheduleEventService = new ScheduleEventService();

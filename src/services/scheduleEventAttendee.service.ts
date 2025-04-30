// src/services/scheduleEventAttendee.service.ts
import { apiService } from "@/services/apiService_v0";
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";
import { handleApiError } from "@/utils/errorHandler";

class ScheduleEventAttendeeService {
  // Add a user as an attendee for a schedule event
  async addAttendeeToScheduleEvent(data: {
    scheduleEventId: string;
    userId: string;
    status?: string;
  }): Promise<{ data: ScheduleEventAttendee; message?: string }> {
    try {
      const response = await apiService.auth.post<ScheduleEventAttendee>(
        "/communication-service/api/v1/schedule-event-attendees",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to add attendee to schedule event");
      }

      return {
        data: response.data,
        message:
          response.message || "Attendee added to schedule event successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventAttendee>(
        error,
        {} as ScheduleEventAttendee,
        "[ScheduleEventAttendee Service] Error adding attendee to schedule event:"
      );
    }
  }

  // Update an attendee's information for a schedule event
  async updateScheduleEventAttendee(
    id: string,
    data: {
      scheduleEventId: string;
      userId: string;
      status?: string;
    }
  ): Promise<{ data: ScheduleEventAttendee; message?: string }> {
    try {
      const response = await apiService.auth.put<ScheduleEventAttendee>(
        `/communication-service/api/v1/schedule-event-attendees/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update schedule event attendee"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Schedule event attendee updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventAttendee>(
        error,
        {} as ScheduleEventAttendee,
        "[ScheduleEventAttendee Service] Error updating schedule event attendee:"
      );
    }
  }

  async updateScheduleEventAttendeeStatus(
    id: string,
    data: {
      scheduleEventId: string;
      userId: string;
      status?: string;
    }
  ): Promise<{ data: ScheduleEventAttendee; message?: string }> {
    try {
      const response = await apiService.auth.put<ScheduleEventAttendee>(
        `/communication-service/api/v1/schedule-event-attendees/${id}/status?status=${data.status}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update schedule event attendee"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Schedule event attendee updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventAttendee>(
        error,
        {} as ScheduleEventAttendee,
        "[ScheduleEventAttendee Service] Error updating schedule event attendee:"
      );
    }
  }

  // Remove a user as an attendee from a schedule event
  async removeAttendeeFromScheduleEvent(
    id: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/schedule-event-attendees/${id}`
      );

      return {
        message:
          response.message ||
          "Attendee removed from schedule event successfully",
      };
    } catch (error: any) {
      console.error(
        "[ScheduleEventAttendee Service] Error removing attendee from schedule event:",
        error.message
      );
      throw error;
    }
  }

  // Get all attendees for a specific schedule event
  async getAttendeesByScheduleEventId(
    scheduleEventId: string
  ): Promise<{ data: ScheduleEventAttendee[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEventAttendee[]>(
        `/communication-service/api/v1/schedule-event-attendees/by-event/${scheduleEventId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve attendees for schedule event");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventAttendee[]>(
        error,
        [],
        "[ScheduleEventAttendee Service] Error fetching attendees for schedule event:"
      );
    }
  }

  // Get all attendees for a specific user
  async getAttendeesByUserId(
    userId: string
  ): Promise<{ data: ScheduleEventAttendee[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEventAttendee[]>(
        `/communication-service/api/v1/schedule-event-attendees/by-user/${userId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve attendees for user");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEventAttendee[]>(
        error,
        [],
        "[ScheduleEventAttendee Service] Error fetching attendees for user:"
      );
    }
  }
}

export const scheduleEventAttendeeService = new ScheduleEventAttendeeService();

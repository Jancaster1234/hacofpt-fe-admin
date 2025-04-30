// src/services/schedule.service.ts
import { apiService } from "@/services/apiService_v0";
import { Schedule } from "@/types/entities/schedule";
import { handleApiError } from "@/utils/errorHandler";

class ScheduleService {
  async createSchedule(data: {
    teamId: string;
    name: string;
    description: string;
  }): Promise<{ data: Schedule; message?: string }> {
    try {
      const response = await apiService.auth.post<Schedule>(
        "/communication-service/api/v1/schedules",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create schedule");
      }

      return {
        data: response.data,
        message: response.message || "Schedule created successfully",
      };
    } catch (error: any) {
      return handleApiError<Schedule>(
        error,
        {} as Schedule,
        "[Schedule Service] Error creating schedule:"
      );
    }
  }

  async updateSchedule(
    id: string,
    data: {
      name: string;
      description: string;
    }
  ): Promise<{ data: Schedule; message?: string }> {
    try {
      const response = await apiService.auth.put<Schedule>(
        `/communication-service/api/v1/schedules/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update schedule");
      }

      return {
        data: response.data,
        message: response.message || "Schedule updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Schedule>(
        error,
        {} as Schedule,
        "[Schedule Service] Error updating schedule:"
      );
    }
  }

  async getAdminSchedule(): Promise<{ data: Schedule; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/admin`
      );

      if (!response || !response.data || response.data.length === 0) {
        throw new Error("No admin schedules found");
      }

      return {
        data: response.data[0],
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule>(
        error,
        {} as Schedule,
        "[Schedule Service] Error getting admin schedule:"
      );
    }
  }

  async getHackathonOperatingScheduleByHackathonId(
    hackathonId: string
  ): Promise<{ data: Schedule; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/operating?hackathonId=${hackathonId}`
      );

      if (!response || !response.data || response.data.length === 0) {
        throw new Error("No hackathon operating schedules found");
      }

      return {
        data: response.data[0],
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule>(
        error,
        {} as Schedule,
        "[Schedule Service] Error getting hackathon operating schedule:"
      );
    }
  }

  async deleteSchedule(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/schedules/${id}`
      );

      return {
        message: response.message || "Schedule deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Schedule Service] Error deleting schedule:",
        error.message
      );
      throw error;
    }
  }

  async getScheduleById(
    id: string
  ): Promise<{ data: Schedule; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule>(
        `/communication-service/api/v1/schedules/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve schedule");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule>(
        error,
        {} as Schedule,
        "[Schedule Service] Error getting schedule:"
      );
    }
  }

  async getAllSchedules(): Promise<{ data: Schedule[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        "/communication-service/api/v1/schedules"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedules");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule[]>(
        error,
        [],
        "[Schedule Service] Error getting schedules:"
      );
    }
  }

  async getSchedulesByTeamId(
    teamId: string
  ): Promise<{ data: Schedule[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/by-team/${teamId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedules by team ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule[]>(
        error,
        [],
        "[Schedule Service] Error getting schedules by team ID:"
      );
    }
  }

  async getSchedulesByTeamIdAndHackathonId(
    teamId: string,
    hackathonId: string
  ): Promise<{ data: Schedule[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/by-team-and-hackathon?teamId=${teamId}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error(
          "Failed to retrieve schedules by team ID and hackathon ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule[]>(
        error,
        [],
        "[Schedule Service] Error getting schedules by team ID and hackathon ID:"
      );
    }
  }

  async getSchedulesByCreatedByUsernameAndHackathonId(
    createdByUsername: string,
    hackathonId: string
  ): Promise<{ data: Schedule[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Schedule[]>(
        `/communication-service/api/v1/schedules/by-created-and-hackathon?createdByUsername=${createdByUsername}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error(
          "Failed to retrieve schedules by creator username and hackathon ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Schedule[]>(
        error,
        [],
        "[Schedule Service] Error getting schedules by creator username and hackathon ID:"
      );
    }
  }
}

export const scheduleService = new ScheduleService();

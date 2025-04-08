// src/services/mentorTeamLimit.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorTeamLimit } from "@/types/entities/mentorTeamLimit";
import { handleApiError } from "@/utils/errorHandler";

class MentorTeamLimitService {
  async createMentorTeamLimit(data: {
    hackathonId: string;
    mentorId: string;
    teamId: string;
    maxTeams: number;
    maxMentors: number;
  }): Promise<{ data: MentorTeamLimit; message?: string }> {
    try {
      const response = await apiService.auth.post<MentorTeamLimit>(
        "/hackathon-service/api/v1/mentor-team-limits",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create mentor team limit"
        );
      }

      return {
        data: response.data,
        message: response.message || "Mentor team limit created successfully",
      };
    } catch (error: any) {
      return handleApiError<MentorTeamLimit>(
        error,
        {} as MentorTeamLimit,
        "[Mentor Team Limit Service] Error creating mentor team limit:"
      );
    }
  }

  async updateMentorTeamLimit(data: {
    id?: string;
    hackathonId: string;
    mentorId: string;
    teamId: string;
    maxTeams: number;
    maxMentors: number;
  }): Promise<{ data: MentorTeamLimit; message?: string }> {
    try {
      const response = await apiService.auth.put<MentorTeamLimit>(
        `/hackathon-service/api/v1/mentor-team-limits`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update mentor team limit"
        );
      }

      return {
        data: response.data,
        message: response.message || "Mentor team limit updated successfully",
      };
    } catch (error: any) {
      return handleApiError<MentorTeamLimit>(
        error,
        {} as MentorTeamLimit,
        "[Mentor Team Limit Service] Error updating mentor team limit:"
      );
    }
  }
}

export const mentorTeamLimitService = new MentorTeamLimitService();

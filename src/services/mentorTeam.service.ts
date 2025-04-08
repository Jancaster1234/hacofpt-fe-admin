// src/services/mentorTeam.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { handleApiError } from "@/utils/errorHandler";

class MentorTeamService {
  async getMentorTeamsByHackathonAndTeam(
    hackathonId: string,
    teamId: string
  ): Promise<{ data: MentorTeam[]; message?: string }> {
    try {
      const response = await apiService.auth.post<MentorTeam[]>(
        "/hackathon-service/api/v1/mentor-teams/filter-by-hackathon-and-team",
        {
          hackathonId: hackathonId,
          teamId: teamId,
        }
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve mentor teams");
      }

      return {
        data: response.data,
        message: response.message || "Mentor teams retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<MentorTeam[]>(
        error,
        [],
        "[MentorTeam Service] Error fetching mentor teams by hackathon and team:"
      );
    }
  }

  async getMentorTeamsByMentorId(
    mentorId: string
  ): Promise<{ data: MentorTeam[]; message?: string }> {
    try {
      const response = await apiService.auth.post<MentorTeam[]>(
        "/hackathon-service/api/v1/mentor-teams/filter-by-mentor",
        {
          data: mentorId,
        }
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve mentor teams");
      }

      return {
        data: response.data,
        message: response.message || "Mentor teams retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<MentorTeam[]>(
        error,
        [],
        "[MentorTeam Service] Error fetching mentor teams by mentor ID:"
      );
    }
  }
}

export const mentorTeamService = new MentorTeamService();

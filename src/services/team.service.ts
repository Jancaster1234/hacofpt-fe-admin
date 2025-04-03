// src/services/team.service.ts
import { apiService } from "@/services/apiService_v0";
import { Team } from "@/types/entities/team";
import { handleApiError } from "@/utils/errorHandler";

class TeamService {
  async getTeamById(teamId: string): Promise<{ data: Team; message?: string }> {
    try {
      const response = await apiService.auth.get<Team>(
        `/hackathon-service/api/v1/teams/${teamId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team");
      }

      return {
        data: response.data,
        message: response.message || "Team retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Team>(
        error,
        {} as Team,
        "[Team Service] Error fetching team by ID:"
      );
    }
  }

  async getTeamsByUserAndHackathon(
    userId: string,
    hackathonId: string
  ): Promise<{ data: Team[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Team[]>(
        `/api/v1/teams/by-user-and-hackathon?userId=${userId}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve teams");
      }

      return {
        data: response.data,
        message: response.message || "Teams retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Team[]>(
        error,
        [],
        "[Team Service] Error fetching teams by userId and hackathonId:"
      );
    }
  }
}

export const teamService = new TeamService();

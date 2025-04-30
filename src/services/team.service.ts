// src/services/team.service.ts
import { apiService } from "@/services/apiService_v0";
import { Team } from "@/types/entities/team";
import { handleApiError } from "@/utils/errorHandler";

class TeamService {
  async getAllTeams(): Promise<{ data: Team[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Team[]>(
        `/hackathon-service/api/v1/teams`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve all teams");
      }

      return {
        data: response.data,
        message: response.message || "All teams retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Team[]>(
        error,
        [],
        "[Team Service] Error fetching all teams:"
      );
    }
  }

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
        `/hackathon-service/api/v1/teams/by-user-and-hackathon?userId=${userId}&hackathonId=${hackathonId}`
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

  async getTeamsByHackathonId(
    hackathonId: string
  ): Promise<{ data: Team[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Team[]>(
        `/hackathon-service/api/v1/teams/by-hackathon/${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve teams for hackathon");
      }

      return {
        data: response.data,
        message: response.message || "Teams retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Team[]>(
        error,
        [],
        "[Team Service] Error fetching teams by hackathonId:"
      );
    }
  }

  async createBulkTeams(
    teams: {
      teamLeaderId: string;
      teamMembers: {
        userId: string;
      }[];
      teamHackathons: {
        hackathonId: string;
        status: "ACTIVE" | "INACTIVE";
      }[];
    }[]
  ): Promise<{ data: Team[]; message?: string }> {
    try {
      const response = await apiService.auth.post<Team[]>(
        `/hackathon-service/api/v1/teams/bulk`,
        { data: teams }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create teams");
      }

      return {
        data: response.data,
        message: response.message || "Teams created successfully",
      };
    } catch (error: any) {
      return handleApiError<Team[]>(
        error,
        [],
        "[Team Service] Error creating bulk teams:"
      );
    }
  }
}

export const teamService = new TeamService();

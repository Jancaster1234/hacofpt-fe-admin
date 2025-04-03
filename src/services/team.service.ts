// src/services/team.service.ts
import { apiService } from "@/services/apiService_v0";
import { Team } from "@/types/entities/team";

class TeamService {
  async getTeamById(teamId: string): Promise<Partial<Team>> {
    try {
      const response = await apiService.auth.get<Partial<Team>>(
        `/hackathon-service/api/v1/teams/${teamId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team by ID:", error);
      throw error;
    }
  }

  async getTeamsByUserAndHackathon(userId: string, hackathonId: string): Promise<Team[]> {
    try {
      const response = await apiService.auth.get<Team[]>(
        `/api/v1/teams/by-user-and-hackathon?userId=${userId}&hackathonId=${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching teams by userId and hackathonId:", error);
      throw error;
    }
  }
}

export const teamService = new TeamService();

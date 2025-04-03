// src/services/teamRoundJudge.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";

type TeamRoundJudgePayload = {
    teamRoundId: string;
    judgeId: string;
  };

class TeamRoundJudgeService {
  async getTeamRoundJudgesByTeamRoundId(
    teamRoundId: string
  ): Promise<Partial<TeamRoundJudge>[]> {
    try {
      const response = await apiService.auth.get<Partial<TeamRoundJudge>[]>(
        `/submission-service/api/v1/teamroundjudges/by-team-round/${teamRoundId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching TeamRoundJudges by teamRoundId:", error);
      throw error;
    }
  }

  async createTeamRoundJudge(data: TeamRoundJudgePayload): Promise<TeamRoundJudge> {
    try {
      const response = await apiService.auth.post<TeamRoundJudge>(
        "/submission-service/api/v1/teamroundjudges",
        data
      );
      return response;
    } catch (error) {
      console.error("Error creating TeamRoundJudge:", error);
      throw error;
    }
  }

  async updateTeamRoundJudge(id: string, data: TeamRoundJudgePayload): Promise<TeamRoundJudge> {
    try {
      const response = await apiService.auth.put<TeamRoundJudge>(
        `/submission-service/api/v1/teamroundjudges/${id}`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error updating TeamRoundJudge:", error);
      throw error;
    }
  }
}

export const teamRoundJudgeService = new TeamRoundJudgeService();

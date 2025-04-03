// src/services/teamRound.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRound } from "@/types/entities/teamRound";

class TeamRoundService {
  async getTeamRoundsByRoundId(roundId: string): Promise<Partial<TeamRound>[]> {
    try {
      const response = await apiService.auth.get<Partial<TeamRound>[]>(
        `/hackathon-service/api/v1/team-rounds?roundId=${roundId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team rounds by roundId:", error);
      throw error;
    }
  }

  async getTeamRoundsByJudgeAndRound(judgeId: string, roundId: string): Promise<TeamRound[]> {
    try {
      const response = await apiService.auth.post<TeamRound[]>(
        "/api/v1/team-rounds/filter-by-judge-and-round",
        {
          data: {
            judgeId: judgeId,
            roundId: roundId
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching teamRounds by judgeId and roundId:", error);
      throw error;
    }
  }
}

export const teamRoundService = new TeamRoundService();

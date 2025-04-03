// src/services/teamRound.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRound } from "@/types/entities/teamRound";
import { handleApiError } from "@/utils/errorHandler";

class TeamRoundService {
  async getTeamRoundsByRoundId(
    roundId: string
  ): Promise<{ data: TeamRound[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamRound[]>(
        `/hackathon-service/api/v1/team-rounds?roundId=${roundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team rounds");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TeamRound[]>(
        error,
        [],
        "Error fetching team rounds by roundId:"
      );
    }
  }

  async getTeamRoundsByJudgeAndRound(
    judgeId: string,
    roundId: string
  ): Promise<{ data: TeamRound[]; message?: string }> {
    try {
      const response = await apiService.auth.post<TeamRound[]>(
        "/api/v1/team-rounds/filter-by-judge-and-round",
        {
          data: {
            judgeId: judgeId,
            roundId: roundId,
          },
        }
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team rounds by judge and round");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TeamRound[]>(
        error,
        [],
        "Error fetching teamRounds by judgeId and roundId:"
      );
    }
  }
}

export const teamRoundService = new TeamRoundService();

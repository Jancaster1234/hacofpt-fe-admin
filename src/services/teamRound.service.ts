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
        "/hackathon-service/api/v1/team-rounds/filter-by-judge-and-round",
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

  async getTeamRoundsByRoundIdAndTeamId(
    roundId: string,
    teamId: string
  ): Promise<{ data: TeamRound; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamRound>(
        `/hackathon-service/api/v1/team-rounds?teamId=${teamId}&roundId=${roundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team rounds by round and team");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TeamRound>(
        error,
        {} as TeamRound,
        "Error fetching team rounds by roundId and teamId:"
      );
    }
  }

  async updateTeamRound(data: {
    id: string;
    teamId: string;
    roundId: string;
    status?: string;
    description?: string;
  }): Promise<{ data: TeamRound; message?: string }> {
    try {
      const response = await apiService.auth.put<TeamRound>(
        "/hackathon-service/api/v1/team-rounds",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update team round");
      }

      return {
        data: response.data,
        message: response.message || "Team round updated successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRound>(
        error,
        {} as TeamRound,
        "[TeamRound Service] Error updating team round:"
      );
    }
  }

  async updateBulkTeamRounds(
    data: Array<{
      id: string;
      teamId: string;
      roundId: string;
      status?: string;
      description?: string;
    }>
  ): Promise<{ data: TeamRound[]; message?: string }> {
    try {
      const response = await apiService.auth.put<TeamRound[]>(
        "/hackathon-service/api/v1/team-rounds/bulk-update",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update bulk team rounds"
        );
      }

      return {
        data: response.data,
        message: response.message || "Bulk team rounds updated successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRound[]>(
        error,
        [],
        "[TeamRound Service] Error updating bulk team rounds:"
      );
    }
  }
}

export const teamRoundService = new TeamRoundService();

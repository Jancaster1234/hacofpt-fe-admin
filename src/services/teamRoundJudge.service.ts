// src/services/teamRoundJudge.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { handleApiError } from "@/utils/errorHandler";

class TeamRoundJudgeService {
  async getTeamRoundJudgesByTeamRoundId(
    teamRoundId: string
  ): Promise<{ data: TeamRoundJudge[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamRoundJudge[]>(
        `/submission-service/api/v1/teamroundjudges/by-team-round/${teamRoundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team round judges");
      }

      return {
        data: response.data,
        message: response.message || "Team round judges retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRoundJudge[]>(
        error,
        [],
        "[TeamRoundJudge Service] Error fetching team round judges:"
      );
    }
  }

  async createTeamRoundJudge(data: {
    teamRoundId: string;
    judgeId: string;
  }): Promise<{ data: TeamRoundJudge; message?: string }> {
    try {
      const response = await apiService.auth.post<TeamRoundJudge>(
        "/submission-service/api/v1/teamroundjudges",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create team round judge"
        );
      }

      return {
        data: response.data,
        message: response.message || "Team round judge created successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRoundJudge>(
        error,
        {} as TeamRoundJudge,
        "[TeamRoundJudge Service] Error creating team round judge:"
      );
    }
  }

  async updateTeamRoundJudge(
    id: string,
    data: {
      teamRoundId: string;
      judgeId: string;
    }
  ): Promise<{ data: TeamRoundJudge; message?: string }> {
    try {
      const response = await apiService.auth.put<TeamRoundJudge>(
        `/submission-service/api/v1/teamroundjudges/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update team round judge"
        );
      }

      return {
        data: response.data,
        message: response.message || "Team round judge updated successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRoundJudge>(
        error,
        {} as TeamRoundJudge,
        "[TeamRoundJudge Service] Error updating team round judge:"
      );
    }
  }

  async deleteTeamRoundJudge(
    teamRoundId: string,
    judgeId: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/submission-service/api/v1/teamroundjudges/by-team-round-judge?teamRoundId=${teamRoundId}&judgeId=${judgeId}`
      );

      return {
        message: response.message || "Team round judge deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[TeamRoundJudge Service] Error deleting team round judge:"
      );
    }
  }
}

export const teamRoundJudgeService = new TeamRoundJudgeService();

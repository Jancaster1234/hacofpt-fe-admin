// src/services/judgeRound.service.ts
import { apiService } from "@/services/apiService_v0";
import { JudgeRound } from "@/types/entities/judgeRound";
import { handleApiError } from "@/utils/errorHandler";

class JudgeRoundService {
  async getJudgeRoundsByRoundId(
    roundId: string
  ): Promise<{ data: JudgeRound[]; message?: string }> {
    try {
      const response = await apiService.auth.get<JudgeRound[]>(
        `/submission-service/api/v1/judge-rounds/round/${roundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve judge rounds");
      }

      return {
        data: response.data,
        message: response.message || "Judge rounds retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<JudgeRound[]>(
        error,
        [],
        "[JudgeRound Service] Error fetching judge rounds by round ID:"
      );
    }
  }

  async createJudgeRound(data: {
    judgeId: string;
    roundId: string;
  }): Promise<{ data: JudgeRound; message?: string }> {
    try {
      const response = await apiService.auth.post<JudgeRound>(
        "/submission-service/api/v1/judge-rounds",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create judge round");
      }

      return {
        data: response.data,
        message: response.message || "Judge round created successfully",
      };
    } catch (error: any) {
      return handleApiError<JudgeRound>(
        error,
        {} as JudgeRound,
        "[JudgeRound Service] Error creating judge round:"
      );
    }
  }

  async updateJudgeRound(
    id: string,
    data: {
      judgeId: string;
      roundId: string;
    }
  ): Promise<{ data: JudgeRound; message?: string }> {
    try {
      const response = await apiService.auth.put<JudgeRound>(
        `/submission-service/api/v1/judge-rounds/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update judge round");
      }

      return {
        data: response.data,
        message: response.message || "Judge round updated successfully",
      };
    } catch (error: any) {
      return handleApiError<JudgeRound>(
        error,
        {} as JudgeRound,
        "[JudgeRound Service] Error updating judge round:"
      );
    }
  }

  async deleteJudgeRoundByJudgeAndRound(
    judgeId: string,
    roundId: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/submission-service/api/v1/judge-rounds/by-judge-round?judgeId=${judgeId}&roundId=${roundId}`
      );

      return {
        message: response.message || "Judge round deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[JudgeRound Service] Error deleting judge round:",
        error.message
      );
      throw error;
    }
  }
}

export const judgeRoundService = new JudgeRoundService();

// src/services/judgeRound.service.ts
import { apiService } from "@/services/apiService_v0";
import { JudgeRound } from "@/types/entities/judgeRound";

type JudgeRoundPayload = {
  judgeId: string;
  roundId: string;
};

class JudgeRoundService {
  async getJudgeRoundsByRoundId(
    roundId: string
  ): Promise<Partial<JudgeRound>[]> {
    try {
      const response = await apiService.auth.get<Partial<JudgeRound>[]>(
        `/submission-service/api/v1/judge-rounds/round/${roundId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching judge rounds by round ID:", error);
      throw error;
    }
  }

  async createJudgeRound(data: JudgeRoundPayload): Promise<JudgeRound> {
    try {
      const response = await apiService.auth.post<JudgeRound>(
        "/submission-service/api/v1/judge-rounds",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating JudgeRound:", error);
      throw error;
    }
  }

  async updateJudgeRound(
    id: string,
    data: JudgeRoundPayload
  ): Promise<JudgeRound> {
    try {
      const response = await apiService.auth.put<JudgeRound>(
        `/submission-service/api/v1/judge-rounds/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating JudgeRound:", error);
      throw error;
    }
  }

  async deleteJudgeRoundByJudgeAndRound(
    judgeId: string,
    roundId: string
  ): Promise<void> {
    try {
      await apiService.auth.delete(
        `/submission-service/api/v1/judge-rounds/by-judge-round?judgeId=${judgeId}&roundId=${roundId}`
      );
    } catch (error) {
      console.error("Error deleting JudgeRound:", error);
      throw error;
    }
  }
}

export const judgeRoundService = new JudgeRoundService();

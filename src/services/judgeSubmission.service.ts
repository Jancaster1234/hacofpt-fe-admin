// src/services/judgeSubmission.service.ts
import { apiService } from "@/services/apiService_v0";
import { JudgeSubmission } from "@/types/entities/judgeSubmission";

type JudgeSubmissionPayload = {
  judgeId: string;
  submissionId: string;
  score: number;
  note: string;
  judgeSubmissionDetails: {
    roundMarkCriterionId: string;
    score: number;
    note?: string;
  }[];
};

class JudgeSubmissionService {
  async createJudgeSubmission(
    data: JudgeSubmissionPayload
  ): Promise<JudgeSubmission> {
    try {
      const response = await apiService.auth.post<JudgeSubmission>(
        "/submission-service/api/v1/judge-submissions",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating JudgeSubmission:", error);
      throw error;
    }
  }

  async updateJudgeSubmission(
    id: string,
    data: JudgeSubmissionPayload
  ): Promise<JudgeSubmission> {
    try {
      const response = await apiService.auth.put<JudgeSubmission>(
        `/submission-service/api/v1/judge-submissions/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating JudgeSubmission:", error);
      throw error;
    }
  }
}

export const judgeSubmissionService = new JudgeSubmissionService();

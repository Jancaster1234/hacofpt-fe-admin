// src/services/judgeSubmission.service.ts
import { apiService } from "@/services/apiService_v0";
import { JudgeSubmission } from "@/types/entities/judgeSubmission";
import { handleApiError } from "@/utils/errorHandler";

class JudgeSubmissionService {
  async createJudgeSubmission(data: {
    judgeId: string;
    submissionId: string;
    score: number;
    note: string;
    judgeSubmissionDetails: {
      roundMarkCriterionId: string;
      score: number;
      note?: string;
    }[];
  }): Promise<{ data: JudgeSubmission; message?: string }> {
    try {
      const response = await apiService.auth.post<JudgeSubmission>(
        "/submission-service/api/v1/judge-submissions",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create judge submission");
      }

      return {
        data: response.data,
        message: response.message || "Judge submission created successfully",
      };
    } catch (error: any) {
      return handleApiError<JudgeSubmission>(
        error,
        {} as JudgeSubmission,
        "Error creating JudgeSubmission:"
      );
    }
  }

  async updateJudgeSubmission(
    id: string,
    data: {
      judgeId: string;
      submissionId: string;
      score: number;
      note: string;
      judgeSubmissionDetails: {
        roundMarkCriterionId: string;
        score: number;
        note?: string;
      }[];
    }
  ): Promise<{ data: JudgeSubmission; message?: string }> {
    try {
      const response = await apiService.auth.put<JudgeSubmission>(
        `/submission-service/api/v1/judge-submissions/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to update judge submission");
      }

      return {
        data: response.data,
        message: response.message || "Judge submission updated successfully",
      };
    } catch (error: any) {
      return handleApiError<JudgeSubmission>(
        error,
        {} as JudgeSubmission,
        "Error updating JudgeSubmission:"
      );
    }
  }
}

export const judgeSubmissionService = new JudgeSubmissionService();

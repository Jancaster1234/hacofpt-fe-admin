// src/services/submission.service.ts
import { apiService } from "@/services/apiService_v0";
import { Submission } from "@/types/entities/submission";
import { handleApiError } from "@/utils/errorHandler";
import { judgeSubmissionService } from "@/services/judgeSubmission.service";
class SubmissionService {
  async getSubmissionById(
    submissionId: string
  ): Promise<{ data: Submission | null; message?: string }> {
    try {
      const response = await apiService.auth.get<Submission>(
        `/submission-service/api/v1/submissions/${submissionId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve submission");
      }

      return {
        data: response.data,
        message: response.message || "Submission retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission | null>(
        error,
        null,
        "[Submission Service] Error fetching submission by id:"
      );
    }
  }

  async getSubmissionsByRoundAndCreator(
    roundId: string,
    createdByUsername: string
  ): Promise<{ data: Submission[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Submission[]>(
        `/submission-service/api/v1/submissions/by-round-created?roundId=${roundId}&createdByUsername=${createdByUsername}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve submissions");
      }

      return {
        data: response.data,
        message: response.message || "Submissions retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission[]>(
        error,
        [],
        "[Submission Service] Error fetching submissions by round and creator:"
      );
    }
  }

  async getSubmissionsByTeamAndRound(
    teamId: string,
    roundId: string
  ): Promise<{ data: Submission[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Submission[]>(
        `/submission-service/api/v1/submissions/by-team-round?teamId=${teamId}&roundId=${roundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve submissions");
      }

      return {
        data: response.data,
        message: response.message || "Submissions retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission[]>(
        error,
        [],
        "[Submission Service] Error fetching submissions by team and round:"
      );
    }
  }

  async createSubmissionWithFiles(
    files: File[],
    roundId: string,
    teamId: string,
    status: "DRAFT" | "SUBMITTED" | "REVIEWED"
  ): Promise<{ data: Submission; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", status);

      const response = await apiService.auth.post<Submission>(
        "/submission-service/api/v1/submissions",
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create submission");
      }

      return {
        data: response.data,
        message: response.message || "Submission created successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission>(
        error,
        {} as Submission,
        "[Submission Service] Error uploading submission:"
      );
    }
  }

  async updateSubmissionWithFiles(
    submissionId: string,
    files: File[],
    roundId: string,
    teamId: string,
    status: "DRAFT" | "SUBMITTED" | "REVIEWED"
  ): Promise<{ data: Submission; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", status);

      const response = await apiService.auth.put<Submission>(
        `/submission-service/api/v1/submissions/${submissionId}`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update submission");
      }

      return {
        data: response.data,
        message: response.message || "Submission updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission>(
        error,
        {} as Submission,
        "[Submission Service] Error updating submission:"
      );
    }
  }

  async saveJudgeSubmission(data: {
    submissionId: string;
    judgeId: string;
    criteriaScores: { [key: string]: number };
  }): Promise<{ data: any; message?: string }> {
    try {
      // Calculate total score
      const totalScore = Object.values(data.criteriaScores).reduce(
        (sum, score) => sum + score,
        0
      );

      // Format the data for the judgeSubmissionService
      const judgeSubmissionDetails = Object.entries(data.criteriaScores).map(
        ([criterionId, score]) => ({
          roundMarkCriterionId: criterionId,
          score,
          note: "",
        })
      );

      const formattedData = {
        judgeId: data.judgeId,
        submissionId: data.submissionId,
        score: totalScore,
        note: "",
        judgeSubmissionDetails,
      };

      // Get existing judge submissions for this submission
      const submissionResponse = await this.getSubmissionById(
        data.submissionId
      );
      const submission = submissionResponse.data;

      // Check if this judge already has a submission
      const existingJudgeSubmission = submission.judgeSubmissions?.find(
        (js) => js.judge?.id === data.judgeId
      );

      let response;

      // Update or create based on whether we have an existing submission
      if (existingJudgeSubmission?.id) {
        response = await judgeSubmissionService.updateJudgeSubmission(
          existingJudgeSubmission.id,
          formattedData
        );
      } else {
        response = await judgeSubmissionService.createJudgeSubmission(
          formattedData
        );
      }

      return response;
    } catch (error: any) {
      return handleApiError(
        error,
        {},
        "[Submission Service] Error saving judge submission:"
      );
    }
  }
}

export const submissionService = new SubmissionService();

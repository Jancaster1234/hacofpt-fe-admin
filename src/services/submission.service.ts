// src/services/submission.service.ts
import { apiService } from "@/services/apiService_v0";
import { Submission } from "@/types/entities/submission";
import { tokenService_v0 } from "@/services/token.service_v0";
import { handleApiError } from "@/utils/errorHandler";

class SubmissionService {
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
}

export const submissionService = new SubmissionService();

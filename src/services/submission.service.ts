// src/services/submission.service.ts
import { apiService } from "@/services/apiService_v0";
import { Submission } from "@/types/entities/submission";
import { tokenService_v0 } from "@/services/token.service_v0";

class SubmissionService {
  async getSubmissionsByRoundAndCreator(roundId: string, createdByUsername: string): Promise<Partial<Submission>[]> {
    try {
      const response = await apiService.auth.get<Partial<Submission>[]>(
        `/submission-service/api/v1/submissions/by-round-created?roundId=${roundId}&createdByUsername=${createdByUsername}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions by round and creator:", error);
      throw error;
    }
  }

  async getSubmissionsByTeamAndRound(teamId: string, roundId: string): Promise<Partial<Submission>[]> {
    try {
      const response = await apiService.auth.get<Partial<Submission>[]>(
        `/submission-service/api/v1/submissions/by-team-round?teamId=${teamId}&roundId=${roundId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions by team and round:", error);
      throw error;
    }
  }

  async createSubmissionWithFiles(
    files: File[],
    roundId: string,
    teamId: string,
    status: "DRAFT" | "SUBMITTED" | "REVIEWED"
  ): Promise<Submission> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", status);

      const response = await fetch("/submission-service/api/v1/submissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Upload failed: ${errMsg}`);
      }

      const data = (await response.json()) as Submission;
      return data;
    } catch (error) {
      console.error("Error uploading submission:", error);
      throw error;
    }
  }

  async updateSubmissionWithFiles(
    submissionId: string,
    files: File[],
    roundId: string,
    teamId: string,
    status: "DRAFT" | "SUBMITTED" | "REVIEWED"
  ): Promise<Submission> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", status);

      const response = await fetch(
        `/submission-service/api/v1/submissions/${submissionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Update failed: ${errMsg}`);
      }

      const data = (await response.json()) as Submission;
      return data;
    } catch (error) {
      console.error("Error updating submission:", error);
      throw error;
    }
  }
}

export const submissionService = new SubmissionService();

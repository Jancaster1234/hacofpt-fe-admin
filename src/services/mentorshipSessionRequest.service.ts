// src/services/mentorshipSessionRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { handleApiError } from "@/utils/errorHandler";

class MentorshipSessionRequestService {
  async createMentorshipSessionRequest(data: {
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
    evaluatedById?: string;
    evaluatedAt?: string;
  }): Promise<{ data: MentorshipSessionRequest; message?: string }> {
    try {
      const response = await apiService.auth.post<MentorshipSessionRequest>(
        "/hackathon-service/api/v1/mentors/sessions",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create mentorship session request"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Mentorship session request created successfully",
      };
    } catch (error: any) {
      return handleApiError<MentorshipSessionRequest>(
        error,
        {} as MentorshipSessionRequest,
        "[Mentorship Session Service] Error creating mentorship session:"
      );
    }
  }

  async updateMentorshipSessionRequest(data: {
    id?: string;
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
    evaluatedById?: string;
    evaluatedAt?: string;
  }): Promise<{ data: MentorshipSessionRequest; message?: string }> {
    try {
      const response = await apiService.auth.put<MentorshipSessionRequest>(
        `/hackathon-service/api/v1/mentorship/sessions`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update mentorship session request"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Mentorship session request updated successfully",
      };
    } catch (error: any) {
      return handleApiError<MentorshipSessionRequest>(
        error,
        {} as MentorshipSessionRequest,
        "[Mentorship Session Service] Error updating mentorship session:"
      );
    }
  }

  async getMentorshipSessionRequestsByMentorTeamId(
    mentorTeamId: string
  ): Promise<{ data: MentorshipSessionRequest[]; message?: string }> {
    try {
      const response = await apiService.auth.get<MentorshipSessionRequest[]>(
        `/hackathon-service/api/v1/mentorship/sessions/filter-by-mentor-team?mentorTeamId=${mentorTeamId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve mentorship session requests");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<MentorshipSessionRequest[]>(
        error,
        [],
        "[Mentorship Session Service] Error fetching mentorship sessions:"
      );
    }
  }

  async deleteMentorshipSessionRequest(
    id: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/mentorship/sessions/${id}`
      );

      return {
        message: response.message || "Successfully deleted mentorship session",
      };
    } catch (error: any) {
      console.error(
        "[Mentorship Session Service] Error deleting mentorship session:",
        error.message
      );
      throw error;
    }
  }
}

export const mentorshipSessionRequestService =
  new MentorshipSessionRequestService();

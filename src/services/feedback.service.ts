// src/services/feedback.service.ts
import { apiService } from "@/services/apiService_v0";
import { Feedback } from "@/types/entities/feedback";
import { handleApiError } from "@/utils/errorHandler";

class FeedbackService {
  async getAllFeedbacks(): Promise<{ data: Feedback[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        "/feedback-service/api/v1/feedbacks"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedbacks");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback[]>(
        error,
        [],
        "[Feedback Service] Error getting feedbacks:"
      );
    }
  }

  async getFeedbackById(
    id: string
  ): Promise<{ data: Feedback; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback>(
        `/feedback-service/api/v1/feedbacks/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve feedback");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback>(
        error,
        {} as Feedback,
        "[Feedback Service] Error getting feedback by ID:"
      );
    }
  }

  async getFeedbacksByTeamId(
    teamId: string
  ): Promise<{ data: Feedback[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        `/feedback-service/api/v1/feedbacks/by-team?teamId=${teamId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedbacks by team ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback[]>(
        error,
        [],
        "[Feedback Service] Error getting feedbacks by team ID:"
      );
    }
  }

  async getFeedbacksByHackathonId(
    hackathonId: string
  ): Promise<{ data: Feedback[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        `/feedback-service/api/v1/feedbacks/by-hackathon?hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedbacks by hackathon ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback[]>(
        error,
        [],
        "[Feedback Service] Error getting feedbacks by hackathon ID:"
      );
    }
  }

  async getFeedbacksByMentorId(
    mentorId: string
  ): Promise<{ data: Feedback[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        `/feedback-service/api/v1/feedbacks/by-mentor?mentorId=${mentorId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedbacks by mentor ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback[]>(
        error,
        [],
        "[Feedback Service] Error getting feedbacks by mentor ID:"
      );
    }
  }

  async getFeedbacksByCreatedByUserName(
    username: string
  ): Promise<{ data: Feedback[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        `/feedback-service/api/v1/feedbacks/by-creator?username=${encodeURIComponent(username)}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedbacks by creator username");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback[]>(
        error,
        [],
        "[Feedback Service] Error getting feedbacks by creator username:"
      );
    }
  }

  async createFeedback(data: {
    hackathonId?: string;
    mentorId?: string;
    teamId?: string;
  }): Promise<{ data: Feedback; message?: string }> {
    try {
      const response = await apiService.auth.post<Feedback>(
        "/feedback-service/api/v1/feedbacks",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create feedback");
      }

      return {
        data: response.data,
        message: response.message || "Feedback created successfully",
      };
    } catch (error: any) {
      return handleApiError<Feedback>(
        error,
        {} as Feedback,
        "[Feedback Service] Error creating feedback:"
      );
    }
  }

  async updateFeedback(
    id: string,
    data: {
      hackathonId?: string;
      mentorId?: string;
      teamId?: string;
    }
  ): Promise<{ data: Feedback; message?: string }> {
    try {
      const response = await apiService.auth.put<Feedback>(
        `/feedback-service/api/v1/feedbacks/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update feedback");
      }

      return {
        data: response.data,
        message: response.message || "Feedback updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Feedback>(
        error,
        {} as Feedback,
        "[Feedback Service] Error updating feedback:"
      );
    }
  }

  async deleteFeedback(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/feedback-service/api/v1/feedbacks/${id}`
      );

      return {
        message: response.message || "Feedback deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Feedback Service] Error deleting feedback:",
        error.message
      );
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService();

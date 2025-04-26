// src/services/feedback.service.ts
import { apiService } from "@/services/apiService_v0";
import { Feedback } from "@/types/entities/feedback";
import { handleApiError } from "@/utils/errorHandler";

class FeedbackService {
  async getAllFeedbacks(): Promise<{ data: Feedback[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        "/analytics-service/api/v1/feedbacks"
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

  async getFeedbackByMentorIdAndHackathonId(
    mentorId: string,
    hackathonId: string
  ): Promise<{ data: Feedback; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback[]>(
        `/analytics-service/api/v1/feedbacks/hackathon/${hackathonId}/mentor/${mentorId}`
      );

      if (!response || !response.data || response.data.length === 0) {
        throw new Error("No feedbacks found for given mentor and hackathon");
      }

      return {
        data: response.data[0], // first feedback object
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Feedback>(
        error,
        {} as Feedback,
        "[Feedback Service] Error getting feedback by mentor and hackathon ID:"
      );
    }
  }

  async getFeedbackById(
    id: string
  ): Promise<{ data: Feedback; message?: string }> {
    try {
      const response = await apiService.auth.get<Feedback>(
        `/analytics-service/api/v1/feedbacks/${id}`
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
        `/analytics-service/api/v1/feedbacks/by-team?teamId=${teamId}`
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
        `/analytics-service/api/v1/feedbacks/hackathon/${hackathonId}`
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
        `/analytics-service/api/v1/feedbacks/by-mentor?mentorId=${mentorId}`
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
        `/analytics-service/api/v1/feedbacks/by-creator/${encodeURIComponent(
          username
        )}`
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
        "/analytics-service/api/v1/feedbacks",
        { data: data }
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
        `/analytics-service/api/v1/feedbacks/${id}`,
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
        `/analytics-service/api/v1/feedbacks/${id}`
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

// src/services/feedbackDetail.service.ts
import { apiService } from "@/services/apiService_v0";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { handleApiError } from "@/utils/errorHandler";

class FeedbackDetailService {
  async getAllFeedbackDetails(): Promise<{
    data: FeedbackDetail[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<FeedbackDetail[]>(
        "/feedback-service/api/v1/feedback-details"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedback details");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail[]>(
        error,
        [],
        "[FeedbackDetail Service] Error getting feedback details:"
      );
    }
  }

  async getFeedbackDetailById(
    id: string
  ): Promise<{ data: FeedbackDetail; message?: string }> {
    try {
      const response = await apiService.auth.get<FeedbackDetail>(
        `/feedback-service/api/v1/feedback-details/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve feedback detail"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail>(
        error,
        {} as FeedbackDetail,
        "[FeedbackDetail Service] Error getting feedback detail by ID:"
      );
    }
  }

  async getFeedbackDetailsByFeedbackId(
    feedbackId: string
  ): Promise<{ data: FeedbackDetail[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FeedbackDetail[]>(
        `/feedback-service/api/v1/feedback-details/by-feedback?feedbackId=${feedbackId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve feedback details by feedback ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail[]>(
        error,
        [],
        "[FeedbackDetail Service] Error getting feedback details by feedback ID:"
      );
    }
  }

  async createFeedbackDetail(data: {
    feedbackId?: string;
    content: string;
    maxRating: number;
    rate: number;
    note?: string;
  }): Promise<{ data: FeedbackDetail; message?: string }> {
    try {
      const response = await apiService.auth.post<FeedbackDetail>(
        "/feedback-service/api/v1/feedback-details",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create feedback detail"
        );
      }

      return {
        data: response.data,
        message: response.message || "Feedback detail created successfully",
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail>(
        error,
        {} as FeedbackDetail,
        "[FeedbackDetail Service] Error creating feedback detail:"
      );
    }
  }

  async updateFeedbackDetail(
    id: string,
    data: {
      feedbackId?: string;
      content: string;
      maxRating: number;
      rate: number;
      note?: string;
    }
  ): Promise<{ data: FeedbackDetail; message?: string }> {
    try {
      const response = await apiService.auth.put<FeedbackDetail>(
        `/feedback-service/api/v1/feedback-details/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update feedback detail"
        );
      }

      return {
        data: response.data,
        message: response.message || "Feedback detail updated successfully",
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail>(
        error,
        {} as FeedbackDetail,
        "[FeedbackDetail Service] Error updating feedback detail:"
      );
    }
  }

  async deleteFeedbackDetail(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/feedback-service/api/v1/feedback-details/${id}`
      );

      return {
        message: response.message || "Feedback detail deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[FeedbackDetail Service] Error deleting feedback detail:",
        error.message
      );
      throw error;
    }
  }

  async bulkCreateFeedbackDetails(
    feedbackId: string,
    details: Array<{
      content: string;
      maxRating: number;
      rate: number;
      note?: string;
    }>
  ): Promise<{ data: FeedbackDetail[]; message?: string }> {
    try {
      const response = await apiService.auth.post<FeedbackDetail[]>(
        `/feedback-service/api/v1/feedback-details/bulk?feedbackId=${feedbackId}`,
        { details }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create bulk feedback details"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Bulk feedback details created successfully",
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail[]>(
        error,
        [],
        "[FeedbackDetail Service] Error creating bulk feedback details:"
      );
    }
  }

  async updateBulkFeedbackDetails(
    feedbackId: string,
    details: Array<{
      id?: string;
      content: string;
      maxRating: number;
      rate: number;
      note?: string;
    }>
  ): Promise<{ data: FeedbackDetail[]; message?: string }> {
    try {
      const response = await apiService.auth.put<FeedbackDetail[]>(
        `/feedback-service/api/v1/feedback-details/bulk?feedbackId=${feedbackId}`,
        { details }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update bulk feedback details"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Bulk feedback details updated successfully",
      };
    } catch (error: any) {
      return handleApiError<FeedbackDetail[]>(
        error,
        [],
        "[FeedbackDetail Service] Error updating bulk feedback details:"
      );
    }
  }
}

export const feedbackDetailService = new FeedbackDetailService();

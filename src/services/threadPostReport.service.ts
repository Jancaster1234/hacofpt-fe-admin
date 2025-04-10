// src/services/threadPostReport.service.ts
import { apiService } from "@/services/apiService_v0";
import { ThreadPostReport } from "@/types/entities/threadPostReport";
import { handleApiError } from "@/utils/errorHandler";

class ThreadPostReportService {
  async getAllThreadPostReports(): Promise<{
    data: ThreadPostReport[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ThreadPostReport[]>(
        "/communication-service/api/v1/thread-post-reports"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve thread post reports");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPostReport[]>(
        error,
        [],
        "[Thread Post Report Service] Error getting thread post reports:"
      );
    }
  }

  async getThreadPostReport(
    id: string
  ): Promise<{ data: ThreadPostReport; message?: string }> {
    try {
      const response = await apiService.auth.get<ThreadPostReport>(
        `/communication-service/api/v1/thread-post-reports/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve thread post report"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPostReport>(
        error,
        {} as ThreadPostReport,
        "[Thread Post Report Service] Error getting thread post report:"
      );
    }
  }

  async getReportsByThreadPostId(
    threadPostId: string
  ): Promise<{ data: ThreadPostReport[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ThreadPostReport[]>(
        `/communication-service/api/v1/thread-post-reports/thread-post/${threadPostId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve reports by thread post ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPostReport[]>(
        error,
        [],
        "[Thread Post Report Service] Error getting reports by thread post ID:"
      );
    }
  }

  async createThreadPostReport(data: {
    threadPostId: string;
    reason: string;
    status: "PENDING" | "REVIEWED" | "DISMISSED";
  }): Promise<{ data: ThreadPostReport; message?: string }> {
    try {
      const response = await apiService.auth.post<ThreadPostReport>(
        "/communication-service/api/v1/thread-post-reports",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create thread post report"
        );
      }

      return {
        data: response.data,
        message: response.message || "Thread post report created successfully",
      };
    } catch (error: any) {
      return handleApiError<ThreadPostReport>(
        error,
        {} as ThreadPostReport,
        "[Thread Post Report Service] Error creating thread post report:"
      );
    }
  }

  async updateThreadPostReport(
    id: string,
    data: {
      threadPostId: string;
      reason: string;
      status: "PENDING" | "REVIEWED" | "DISMISSED";
    }
  ): Promise<{ data: ThreadPostReport; message?: string }> {
    try {
      const response = await apiService.auth.put<ThreadPostReport>(
        `/communication-service/api/v1/thread-post-reports/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update thread post report"
        );
      }

      return {
        data: response.data,
        message: response.message || "Thread post report updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ThreadPostReport>(
        error,
        {} as ThreadPostReport,
        "[Thread Post Report Service] Error updating thread post report:"
      );
    }
  }

  async deleteThreadPostReport(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/thread-post-reports/${id}`
      );

      return {
        message: response.message || "Thread post report deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Thread Post Report Service] Error deleting thread post report:",
        error.message
      );
      throw error;
    }
  }
}

export const threadPostReportService = new ThreadPostReportService();

// src/services/threadPost.service.ts
import { apiService } from "@/services/apiService_v0";
import { ThreadPost } from "@/types/entities/threadPost";
import { handleApiError } from "@/utils/errorHandler";

class ThreadPostService {
  async getAllThreadPosts(): Promise<{ data: ThreadPost[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ThreadPost[]>(
        "/communication-service/api/v1/thread-posts"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve thread posts");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPost[]>(
        error,
        [],
        "[Thread Post Service] Error getting thread posts:"
      );
    }
  }

  async getThreadPost(
    id: string
  ): Promise<{ data: ThreadPost; message?: string }> {
    try {
      const response = await apiService.auth.get<ThreadPost>(
        `/communication-service/api/v1/thread-posts/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve thread post");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPost>(
        error,
        {} as ThreadPost,
        "[Thread Post Service] Error getting thread post:"
      );
    }
  }

  async createThreadPost(data: {
    forumThreadId: string;
    content: string;
    isDeleted: boolean;
  }): Promise<{ data: ThreadPost; message?: string }> {
    try {
      const response = await apiService.auth.post<ThreadPost>(
        "/communication-service/api/v1/thread-posts",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create thread post");
      }

      return {
        data: response.data,
        message: response.message || "Thread post created successfully",
      };
    } catch (error: any) {
      return handleApiError<ThreadPost>(
        error,
        {} as ThreadPost,
        "[Thread Post Service] Error creating thread post:"
      );
    }
  }

  async updateThreadPost(
    id: string,
    data: {
      forumThreadId: string;
      content: string;
      isDeleted: boolean;
    }
  ): Promise<{ data: ThreadPost; message?: string }> {
    try {
      const response = await apiService.auth.put<ThreadPost>(
        `/communication-service/api/v1/thread-posts/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update thread post");
      }

      return {
        data: response.data,
        message: response.message || "Thread post updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ThreadPost>(
        error,
        {} as ThreadPost,
        "[Thread Post Service] Error updating thread post:"
      );
    }
  }

  async deleteThreadPost(
    id: string
  ): Promise<{ data: ThreadPost; message?: string }> {
    try {
      const response = await apiService.auth.delete<ThreadPost>(
        `/communication-service/api/v1/thread-posts/${id}`
      );

      return {
        data: response.data,
        message: response.message || "Thread post deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Thread Post Service] Error deleting thread post:",
        error.message
      );
      throw error;
    }
  }
}

export const threadPostService = new ThreadPostService();

// src/services/taskComment.service.ts
import { apiService } from "@/services/apiService_v0";
import { TaskComment } from "@/types/entities/taskComment";
import { handleApiError } from "@/utils/errorHandler";

class TaskCommentService {
  // Create a new Task Comment
  async createTaskComment(data: {
    taskId: string;
    content: string;
  }): Promise<{ data: TaskComment; message?: string }> {
    try {
      const response = await apiService.auth.post<TaskComment>(
        "/communication-service/api/v1/task-comments",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create task comment");
      }

      return {
        data: response.data,
        message: response.message || "Task comment created successfully",
      };
    } catch (error: any) {
      return handleApiError<TaskComment>(
        error,
        {} as TaskComment,
        "[TaskComment Service] Error creating TaskComment:"
      );
    }
  }

  // Update an existing Task Comment
  async updateTaskComment(
    id: string,
    data: {
      taskId: string;
      content: string;
    }
  ): Promise<{ data: TaskComment; message?: string }> {
    try {
      const response = await apiService.auth.put<TaskComment>(
        `/communication-service/api/v1/task-comments/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update task comment");
      }

      return {
        data: response.data,
        message: response.message || "Task comment updated successfully",
      };
    } catch (error: any) {
      return handleApiError<TaskComment>(
        error,
        {} as TaskComment,
        "[TaskComment Service] Error updating TaskComment:"
      );
    }
  }

  // Delete a Task Comment by its ID
  async deleteTaskComment(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/task-comments/${id}`
      );

      return {
        message: response.message || "Task comment deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[TaskComment Service] Error deleting TaskComment:",
        error.message
      );
      throw error;
    }
  }

  // Get a specific Task Comment by its ID
  async getTaskComment(
    id: string
  ): Promise<{ data: TaskComment; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskComment>(
        `/communication-service/api/v1/task-comments/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task comment");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskComment>(
        error,
        {} as TaskComment,
        "[TaskComment Service] Error fetching TaskComment by ID:"
      );
    }
  }

  // Get all Task Comments
  async getAllTaskComments(): Promise<{
    data: TaskComment[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<TaskComment[]>(
        "/communication-service/api/v1/task-comments"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task comments");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskComment[]>(
        error,
        [],
        "[TaskComment Service] Error fetching all TaskComments:"
      );
    }
  }

  // Get Task Comments by Task ID
  async getTaskCommentsByTaskId(
    taskId: string
  ): Promise<{ data: TaskComment[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskComment[]>(
        `/communication-service/api/v1/task-comments/task/${taskId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task comments for task");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskComment[]>(
        error,
        [],
        "[TaskComment Service] Error fetching TaskComments by Task ID:"
      );
    }
  }
}

export const taskCommentService = new TaskCommentService();

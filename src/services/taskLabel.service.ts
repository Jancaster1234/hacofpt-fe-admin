// src/services/taskLabel.service.ts
import { apiService } from "@/services/apiService_v0";
import { TaskLabel } from "@/types/entities/taskLabel";
import { handleApiError } from "@/utils/errorHandler";

class TaskLabelService {
  // Create a new Task Label
  async createTaskLabel(data: {
    taskId: string;
    boardLabelId: string;
  }): Promise<{ data: TaskLabel; message?: string }> {
    try {
      const response = await apiService.auth.post<TaskLabel>(
        "/communication-service/api/v1/task-labels",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create task label");
      }

      return {
        data: response.data,
        message: response.message || "Task label created successfully",
      };
    } catch (error: any) {
      return handleApiError<TaskLabel>(
        error,
        {} as TaskLabel,
        "[TaskLabel Service] Error creating TaskLabel:"
      );
    }
  }

  // Update an existing Task Label
  async updateTaskLabel(
    id: string,
    data: {
      taskId: string;
      boardLabelId: string;
    }
  ): Promise<{ data: TaskLabel; message?: string }> {
    try {
      const response = await apiService.auth.put<TaskLabel>(
        `/communication-service/api/v1/task-labels/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update task label");
      }

      return {
        data: response.data,
        message: response.message || "Task label updated successfully",
      };
    } catch (error: any) {
      return handleApiError<TaskLabel>(
        error,
        {} as TaskLabel,
        "[TaskLabel Service] Error updating TaskLabel:"
      );
    }
  }

  // Delete a Task Label by its ID
  async deleteTaskLabel(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/task-labels/${id}`
      );

      return {
        message: response.message || "Task label deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[TaskLabel Service] Error deleting TaskLabel:",
        error.message
      );
      throw error;
    }
  }

  // Get a specific Task Label by its ID
  async getTaskLabel(
    id: string
  ): Promise<{ data: TaskLabel; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskLabel>(
        `/communication-service/api/v1/task-labels/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task label");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskLabel>(
        error,
        {} as TaskLabel,
        "[TaskLabel Service] Error fetching TaskLabel by ID:"
      );
    }
  }

  // Get Task Labels by Task ID
  async getTaskLabelsByTaskId(
    taskId: string
  ): Promise<{ data: TaskLabel[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskLabel[]>(
        `/communication-service/api/v1/task-labels/by-task/${taskId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task labels by task ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskLabel[]>(
        error,
        [],
        "[TaskLabel Service] Error fetching task labels by task ID:"
      );
    }
  }

  // Get all Task Labels
  async getAllTaskLabels(): Promise<{ data: TaskLabel[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskLabel[]>(
        "/communication-service/api/v1/task-labels"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task labels");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskLabel[]>(
        error,
        [],
        "[TaskLabel Service] Error fetching all TaskLabels:"
      );
    }
  }
}

export const taskLabelService = new TaskLabelService();

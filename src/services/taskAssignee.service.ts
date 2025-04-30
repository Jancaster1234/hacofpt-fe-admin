// src/services/taskAssignee.service.ts
import { apiService } from "@/services/apiService_v0";
import { TaskAssignee } from "@/types/entities/taskAssignee";
import { handleApiError } from "@/utils/errorHandler";

class TaskAssigneeService {
  // Create a new TaskAssignee
  async createTaskAssignee(data: {
    taskId: string;
    userId: string;
  }): Promise<{ data: TaskAssignee; message?: string }> {
    try {
      const response = await apiService.auth.post<TaskAssignee>(
        "/communication-service/api/v1/task-assignees",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create task assignee");
      }

      return {
        data: response.data,
        message: response.message || "Task assignee created successfully",
      };
    } catch (error: any) {
      return handleApiError<TaskAssignee>(
        error,
        {} as TaskAssignee,
        "[TaskAssignee Service] Error creating TaskAssignee:"
      );
    }
  }

  // Update an existing TaskAssignee
  async updateTaskAssignee(
    id: string,
    data: {
      taskId: string;
      userId: string;
    }
  ): Promise<{ data: TaskAssignee; message?: string }> {
    try {
      const response = await apiService.auth.put<TaskAssignee>(
        `/communication-service/api/v1/task-assignees/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update task assignee");
      }

      return {
        data: response.data,
        message: response.message || "Task assignee updated successfully",
      };
    } catch (error: any) {
      return handleApiError<TaskAssignee>(
        error,
        {} as TaskAssignee,
        "[TaskAssignee Service] Error updating TaskAssignee:"
      );
    }
  }

  // Delete a TaskAssignee by its ID
  async deleteTaskAssignee(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/task-assignees/${id}`
      );

      return {
        message: response.message || "Task assignee deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[TaskAssignee Service] Error deleting TaskAssignee:",
        error.message
      );
      throw error;
    }
  }

  // Get a specific TaskAssignee by its ID
  async getTaskAssignee(
    id: string
  ): Promise<{ data: TaskAssignee; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskAssignee>(
        `/communication-service/api/v1/task-assignees/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task assignee");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskAssignee>(
        error,
        {} as TaskAssignee,
        "[TaskAssignee Service] Error fetching TaskAssignee by ID:"
      );
    }
  }

  // Get all TaskAssignees
  async getAllTaskAssignees(): Promise<{
    data: TaskAssignee[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<TaskAssignee[]>(
        "/communication-service/api/v1/task-assignees"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task assignees");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskAssignee[]>(
        error,
        [],
        "[TaskAssignee Service] Error fetching all TaskAssignees:"
      );
    }
  }

  // Get TaskAssignees by Task ID
  async getTaskAssigneesByTaskId(
    taskId: string
  ): Promise<{ data: TaskAssignee[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TaskAssignee[]>(
        `/communication-service/api/v1/task-assignees/by-task/${taskId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task assignees for task");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TaskAssignee[]>(
        error,
        [],
        "[TaskAssignee Service] Error fetching TaskAssignees by Task ID:"
      );
    }
  }
}

export const taskAssigneeService = new TaskAssigneeService();

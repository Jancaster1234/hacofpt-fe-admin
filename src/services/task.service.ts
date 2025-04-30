// src/services/task.service.ts
import { apiService } from "@/services/apiService_v0";
import { Task } from "@/types/entities/task";
import { handleApiError } from "@/utils/errorHandler";
import { FileUrl } from "@/types/entities/fileUrl";
class TaskService {
  // Create a new Task
  async createTask(data: {
    title: string;
    description: string;
    position: number;
    boardListId: string;
    dueDate: string;
  }): Promise<{ data: Task; message?: string }> {
    try {
      const response = await apiService.auth.post<Task>(
        "/communication-service/api/v1/tasks",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create task");
      }

      return {
        data: response.data,
        message: response.message || "Task created successfully",
      };
    } catch (error: any) {
      return handleApiError<Task>(
        error,
        {} as Task,
        "[Task Service] Error creating Task:"
      );
    }
  }

  // Update an existing Task (used when update taskFiles)
  async updateTask(
    id: string,
    data: {
      title: string;
      description: string;
      boardListId: string;
      dueDate: string;
      fileUrls: string[];
    }
  ): Promise<{ data: Task; message?: string }> {
    try {
      const response = await apiService.auth.put<Task>(
        `/communication-service/api/v1/tasks/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update task");
      }

      return {
        data: response.data,
        message: response.message || "Task updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Task>(
        error,
        {} as Task,
        "[Task Service] Error updating Task:"
      );
    }
  }

  // Create Task Files (associate fileUrls with a task)
  async createTaskFiles(
    taskId: string,
    fileUrls: string[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.put<FileUrl[]>(
        `/communication-service/api/v1/tasks/update-files/${taskId}`,
        { data: { fileUrls } }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to attach files to task");
      }

      return {
        data: response.data.fileUrls,
        message: response.message || "Task files added successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[Task Service] Error creating task files:"
      );
    }
  }

  // Used when update task information (title, description, boardListId, dueDate)
  async updateTaskInformation(
    id: string,
    data: {
      title?: string;
      description?: string;
      boardListId: string;
      dueDate?: string;
    }
  ): Promise<{ data: Task; message?: string }> {
    try {
      const response = await apiService.auth.put<Task>(
        `/communication-service/api/v1/tasks/update-info/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update task");
      }

      return {
        data: response.data,
        message: response.message || "Task updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Task>(
        error,
        {} as Task,
        "[Task Service] Error updating Task:"
      );
    }
  }

  async getTasksByBoardListId(
    boardListId: string
  ): Promise<{ data: Task[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Task[]>(
        `/communication-service/api/v1/tasks/by-board-list/${boardListId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve tasks by board list ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Task[]>(
        error,
        [],
        "[Task Service] Error fetching tasks by board list ID:"
      );
    }
  }

  // Delete a Task by its ID
  async deleteTask(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/tasks/${id}`
      );

      return {
        message: response.message || "Task deleted successfully",
      };
    } catch (error: any) {
      console.error("[Task Service] Error deleting Task:", error.message);
      throw error;
    }
  }

  // Get a specific Task by its ID
  async getTask(id: string): Promise<{ data: Task; message?: string }> {
    try {
      const response = await apiService.auth.get<Task>(
        `/communication-service/api/v1/tasks/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve task");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Task>(
        error,
        {} as Task,
        "[Task Service] Error fetching Task by ID:"
      );
    }
  }

  // Get all Tasks
  async getAllTasks(): Promise<{ data: Task[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Task[]>(
        "/communication-service/api/v1/tasks"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve tasks");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Task[]>(
        error,
        [],
        "[Task Service] Error fetching all Tasks:"
      );
    }
  }

  // Bulk update Tasks
  async bulkUpdateTaskPositions(
    data: {
      id: string;
      boardListId: string;
      position: number;
    }[]
  ): Promise<{ data: Task[]; message?: string }> {
    try {
      const response = await apiService.auth.put<Task[]>(
        "/communication-service/api/v1/tasks/bulk-update",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to bulk update tasks");
      }

      return {
        data: response.data,
        message: response.message || "Tasks updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Task[]>(
        error,
        [],
        "[Task Service] Error bulk updating tasks:"
      );
    }
  }
}

export const taskService = new TaskService();

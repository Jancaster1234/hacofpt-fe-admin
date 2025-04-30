// src/services/boardLabel.service.ts
import { apiService } from "@/services/apiService_v0";
import { BoardLabel } from "@/types/entities/boardLabel";
import { handleApiError } from "@/utils/errorHandler";

class BoardLabelService {
  async getAllBoardLabels(): Promise<{ data: BoardLabel[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardLabel[]>(
        "/communication-service/api/v1/board-labels"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve board labels");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardLabel[]>(
        error,
        [],
        "[Board Label Service] Error getting board labels:"
      );
    }
  }

  async getBoardLabelById(
    id: string
  ): Promise<{ data: BoardLabel; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardLabel>(
        `/communication-service/api/v1/board-labels/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve board label");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardLabel>(
        error,
        {} as BoardLabel,
        "[Board Label Service] Error getting board label by ID:"
      );
    }
  }

  async getBoardLabelsByBoardId(
    boardId: string
  ): Promise<{ data: BoardLabel[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardLabel[]>(
        `/communication-service/api/v1/board-labels?boardId=${boardId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve board labels by board ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardLabel[]>(
        error,
        [],
        "[Board Label Service] Error getting board labels by board ID:"
      );
    }
  }

  async createBoardLabel(data: {
    name: string;
    color: string;
    boardId?: string;
  }): Promise<{ data: BoardLabel; message?: string }> {
    try {
      const response = await apiService.auth.post<BoardLabel>(
        "/communication-service/api/v1/board-labels",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create board label");
      }

      return {
        data: response.data,
        message: response.message || "Board label created successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardLabel>(
        error,
        {} as BoardLabel,
        "[Board Label Service] Error creating board label:"
      );
    }
  }

  async updateBoardLabel(
    id: string,
    data: {
      name: string;
      color: string;
      boardId?: string;
    }
  ): Promise<{ data: BoardLabel; message?: string }> {
    try {
      const response = await apiService.auth.put<BoardLabel>(
        `/communication-service/api/v1/board-labels/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update board label");
      }

      return {
        data: response.data,
        message: response.message || "Board label updated successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardLabel>(
        error,
        {} as BoardLabel,
        "[Board Label Service] Error updating board label:"
      );
    }
  }

  async deleteBoardLabel(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/board-labels/${id}`
      );

      return {
        message: response.message || "Board label deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Board Label Service] Error deleting board label:",
        error.message
      );
      throw error;
    }
  }
}

export const boardLabelService = new BoardLabelService();

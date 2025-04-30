// src/services/boardList.service.ts
import { apiService } from "@/services/apiService_v0";
import { BoardList } from "@/types/entities/boardList";
import { handleApiError } from "@/utils/errorHandler";

class BoardListService {
  async getAllBoardLists(): Promise<{ data: BoardList[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardList[]>(
        "/communication-service/api/v1/board-lists"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve board lists");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardList[]>(
        error,
        [],
        "[Board List Service] Error getting board lists:"
      );
    }
  }

  async getBoardListById(
    id: string
  ): Promise<{ data: BoardList; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardList>(
        `/communication-service/api/v1/board-lists/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve board list");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardList>(
        error,
        {} as BoardList,
        "[Board List Service] Error getting board list by ID:"
      );
    }
  }

  async getBoardListsByBoardId(
    boardId: string
  ): Promise<{ data: BoardList[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardList[]>(
        `/communication-service/api/v1/board-lists/by-board/${boardId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve board lists for the board ID");
      }

      return {
        data: response.data,
        message: response.message || "Board lists retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardList[]>(
        error,
        [],
        "[Board List Service] Error getting board lists by board ID:"
      );
    }
  }

  async createBoardList(data: {
    name: string;
    position: number;
    boardId: string;
  }): Promise<{ data: BoardList; message?: string }> {
    try {
      const response = await apiService.auth.post<BoardList>(
        "/communication-service/api/v1/board-lists",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create board list");
      }

      return {
        data: response.data,
        message: response.message || "Board list created successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardList>(
        error,
        {} as BoardList,
        "[Board List Service] Error creating board list:"
      );
    }
  }

  async updateBoardList(
    id: string,
    data: {
      name: string;
      position: number;
      boardId: string;
    }
  ): Promise<{ data: BoardList; message?: string }> {
    try {
      const response = await apiService.auth.put<BoardList>(
        `/communication-service/api/v1/board-lists/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update board list");
      }

      return {
        data: response.data,
        message: response.message || "Board list updated successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardList>(
        error,
        {} as BoardList,
        "[Board List Service] Error updating board list:"
      );
    }
  }

  async bulkUpdateBoardListPositions(
    data: {
      id: string;
      position: number;
    }[]
  ): Promise<{ data: BoardList[]; message?: string }> {
    try {
      const response = await apiService.auth.put<BoardList[]>(
        "/communication-service/api/v1/board-lists/bulk-update",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to bulk update board lists"
        );
      }

      return {
        data: response.data,
        message: response.message || "Board lists updated successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardList[]>(
        error,
        [],
        "[Board List Service] Error bulk updating board lists:"
      );
    }
  }

  async deleteBoardList(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/board-lists/${id}`
      );

      return {
        message: response.message || "Board list deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Board List Service] Error deleting board list:",
        error.message
      );
      throw error;
    }
  }
}

export const boardListService = new BoardListService();

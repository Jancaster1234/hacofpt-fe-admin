// src/services/boardUser.service.ts
import { apiService } from "@/services/apiService_v0";
import { BoardUser } from "@/types/entities/boardUser";
import { handleApiError } from "@/utils/errorHandler";

class BoardUserService {
  async getAllBoardUsers(): Promise<{ data: BoardUser[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardUser[]>(
        "/communication-service/api/v1/board-users"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve board users");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardUser[]>(
        error,
        [],
        "[Board User Service] Error getting board users:"
      );
    }
  }

  async getBoardUserById(
    id: string
  ): Promise<{ data: BoardUser; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardUser>(
        `/communication-service/api/v1/board-users/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve board user");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardUser>(
        error,
        {} as BoardUser,
        "[Board User Service] Error getting board user by ID:"
      );
    }
  }

  async getBoardUsersByBoardId(
    boardId: string
  ): Promise<{ data: BoardUser[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardUser[]>(
        `/communication-service/api/v1/board-users/by-board/${boardId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve board users by board ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardUser[]>(
        error,
        [],
        "[Board User Service] Error getting board users by board ID:"
      );
    }
  }

  async getBoardUsersByUserId(
    userId: string
  ): Promise<{ data: BoardUser[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BoardUser[]>(
        `/communication-service/api/v1/board-users/by-user/${userId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve board users by user ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BoardUser[]>(
        error,
        [],
        "[Board User Service] Error getting board users by user ID:"
      );
    }
  }

  async createBoardUser(data: {
    boardId: string;
    userId: string;
    role: "ADMIN" | "MEMBER";
    isDeleted: boolean;
    deletedById?: string;
  }): Promise<{ data: BoardUser; message?: string }> {
    try {
      const response = await apiService.auth.post<BoardUser>(
        "/communication-service/api/v1/board-users",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create board user");
      }

      return {
        data: response.data,
        message: response.message || "Board user created successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardUser>(
        error,
        {} as BoardUser,
        "[Board User Service] Error creating board user:"
      );
    }
  }

  async updateBoardUser(
    id: string,
    data: {
      boardId: string;
      userId: string;
      role: "ADMIN" | "MEMBER";
      isDeleted: boolean;
      deletedById?: string;
    }
  ): Promise<{ data: BoardUser; message?: string }> {
    try {
      const response = await apiService.auth.put<BoardUser>(
        `/communication-service/api/v1/board-users/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update board user");
      }

      return {
        data: response.data,
        message: response.message || "Board user updated successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardUser>(
        error,
        {} as BoardUser,
        "[Board User Service] Error updating board user:"
      );
    }
  }

  async undeleteBoardUser(
    id: string
  ): Promise<{ data: BoardUser; message?: string }> {
    try {
      const response = await apiService.auth.put<BoardUser>(
        `/communication-service/api/v1/board-users/undelete/${id}`,
        {}
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to undelete board user");
      }

      return {
        data: response.data,
        message: response.message || "Board user undeleted successfully",
      };
    } catch (error: any) {
      return handleApiError<BoardUser>(
        error,
        {} as BoardUser,
        "[Board User Service] Error undeleting board user:"
      );
    }
  }

  async deleteBoardUser(
    id: string
  ): Promise<{ data: BoardUser; message?: string }> {
    try {
      const response = await apiService.auth.delete<BoardUser>(
        `/communication-service/api/v1/board-users/${id}`
      );

      return {
        data: response.data,
        message: response.message || "Board user deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Board User Service] Error deleting board user:",
        error.message
      );
      throw error;
    }
  }
}

export const boardUserService = new BoardUserService();

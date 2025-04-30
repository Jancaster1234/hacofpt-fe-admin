// src/services/board.service.ts
import { apiService } from "@/services/apiService_v0";
import { Board } from "@/types/entities/board";
import { handleApiError } from "@/utils/errorHandler";

class BoardService {
  async getAllBoards(): Promise<{ data: Board[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Board[]>(
        "/communication-service/api/v1/boards"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve boards");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Board[]>(
        error,
        [],
        "[Board Service] Error getting boards:"
      );
    }
  }

  async getBoardById(id: string): Promise<{ data: Board; message?: string }> {
    try {
      const response = await apiService.auth.get<Board>(
        `/communication-service/api/v1/boards/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve board");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Board>(
        error,
        {} as Board,
        "[Board Service] Error getting board by ID:"
      );
    }
  }

  async getBoardsByTeamIdAndHackathonId(
    teamId: string,
    hackathonId: string
  ): Promise<{ data: Board[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Board[]>(
        `/communication-service/api/v1/boards/by-team-and-hackathon?teamId=${teamId}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error(
          "Failed to retrieve boards by team ID and hackathon ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Board[]>(
        error,
        [],
        "[Board Service] Error getting boards by team ID and hackathon ID:"
      );
    }
  }

  async getAdminBoard(): Promise<{ data: Board; message?: string }> {
    try {
      const response = await apiService.auth.get<Board[]>(
        "/communication-service/api/v1/boards/admin"
      );

      if (!response || !response.data || response.data.length === 0) {
        throw new Error("No admin boards found");
      }

      return {
        data: response.data[0],
        message: response.message || "Admin board retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Board>(
        error,
        {} as Board,
        "[Board Service] Error getting admin board:"
      );
    }
  }

  async getOperatingBoardByHackathonId(
    hackathonId: string
  ): Promise<{ data: Board; message?: string }> {
    try {
      const response = await apiService.auth.get<Board[]>(
        `/communication-service/api/v1/boards/hackathon-operating?hackathonId=${hackathonId}`
      );

      if (!response || !response.data || response.data.length === 0) {
        throw new Error("No operating board found for hackathon");
      }

      return {
        data: response.data[0],
        message: response.message || "Operating board retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Board>(
        error,
        {} as Board,
        "[Board Service] Error getting operating board by hackathon ID:"
      );
    }
  }

  async createBoard(data: {
    name: string;
    description?: string;
    teamId?: string;
    hackathonId?: string;
    ownerId?: string;
  }): Promise<{ data: Board; message?: string }> {
    try {
      const response = await apiService.auth.post<Board>(
        "/communication-service/api/v1/boards",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create board");
      }

      return {
        data: response.data,
        message: response.message || "Board created successfully",
      };
    } catch (error: any) {
      return handleApiError<Board>(
        error,
        {} as Board,
        "[Board Service] Error creating board:"
      );
    }
  }

  async updateBoard(
    id: string,
    data: {
      name: string;
      description?: string;
      teamId?: string;
      hackathonId?: string;
      ownerId?: string;
    }
  ): Promise<{ data: Board; message?: string }> {
    try {
      const response = await apiService.auth.put<Board>(
        `/communication-service/api/v1/boards/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update board");
      }

      return {
        data: response.data,
        message: response.message || "Board updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Board>(
        error,
        {} as Board,
        "[Board Service] Error updating board:"
      );
    }
  }

  async deleteBoard(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/boards/${id}`
      );

      return {
        message: response.message || "Board deleted successfully",
      };
    } catch (error: any) {
      console.error("[Board Service] Error deleting board:", error.message);
      throw error;
    }
  }
}

export const boardService = new BoardService();

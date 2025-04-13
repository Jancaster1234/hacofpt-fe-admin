// src/services/round.service.ts
import { apiService } from "@/services/apiService_v0";
import { Round } from "@/types/entities/round";
import { handleApiError } from "@/utils/errorHandler";

class RoundService {
  async createRound(data: {
    hackathonId: string;
    startTime: string;
    endTime: string;
    roundNumber: number;
    roundTitle: string;
    status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    roundLocations?: string[];
  }): Promise<{ data: Round; message?: string }> {
    try {
      const response = await apiService.auth.post<Round>(
        "/hackathon-service/api/v1/rounds",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create round");
      }

      return {
        data: response.data,
        message: response.message || "Round created successfully",
      };
    } catch (error: any) {
      return handleApiError<Round>(
        error,
        {} as Round,
        "[Round Service] Error creating round:"
      );
    }
  }

  async updateRound(data: {
    id?: string;
    hackathonId: string;
    startTime: string;
    endTime: string;
    roundNumber: number;
    roundTitle: string;
    status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    roundLocations?: string[];
  }): Promise<{ data: Round; message?: string }> {
    try {
      const response = await apiService.auth.put<Round>(
        `/hackathon-service/api/v1/rounds`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update round");
      }

      return {
        data: response.data,
        message: response.message || "Round updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Round>(
        error,
        {} as Round,
        "[Round Service] Error updating round:"
      );
    }
  }

  async getRoundsByHackathonId(
    hackathonId: string
  ): Promise<{ data: Round[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Round[]>(
        `/hackathon-service/api/v1/rounds?hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve rounds");
      }

      return {
        data: response.data,
        message: response.message || "Rounds retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Round[]>(
        error,
        [],
        "[Round Service] Error fetching rounds:"
      );
    }
  }

  async deleteRound(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/hackathon-service/api/v1/rounds/${id}`
      );

      return {
        message: response.message || "Round deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[Round Service] Error deleting round:"
      );
    }
  }
}

export const roundService = new RoundService();

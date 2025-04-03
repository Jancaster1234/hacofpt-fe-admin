// src/services/hackathonResult.service.ts
import { apiService } from "@/services/apiService_v0";
import { HackathonResult } from "@/types/entities/hackathonResult";
import { handleApiError } from "@/utils/errorHandler";

class HackathonResultService {
  async getHackathonResultsByHackathonId(
    hackathonId: string
  ): Promise<{ data: HackathonResult[]; message?: string }> {
    try {
      const response = await apiService.auth.get<HackathonResult[]>(
        `/hackathon-service/api/v1/hackathons/results/${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve hackathon results");
      }

      return {
        data: response.data,
        message: response.message || "Hackathon results retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<HackathonResult[]>(
        error,
        [],
        "[HackathonResult Service] Error fetching hackathon results:"
      );
    }
  }

  async createHackathonResult(data: {
    hackathonId: string;
    teamId: string;
    totalScore: number;
    placement: number;
    award?: string;
  }): Promise<{ data: HackathonResult; message?: string }> {
    try {
      const response = await apiService.auth.post<HackathonResult>(
        "/hackathon-service/api/v1/hackathons/results",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create hackathon result"
        );
      }

      return {
        data: response.data,
        message: response.message || "Hackathon result created successfully",
      };
    } catch (error: any) {
      return handleApiError<HackathonResult>(
        error,
        {} as HackathonResult,
        "[HackathonResult Service] Error creating hackathon result:"
      );
    }
  }

  async updateHackathonResult(data: {
    id?: string;
    hackathonId: string;
    teamId: string;
    totalScore: number;
    placement: number;
    award?: string;
  }): Promise<{ data: HackathonResult; message?: string }> {
    try {
      const response = await apiService.auth.put<HackathonResult>(
        "/hackathon-service/api/v1/hackathons/results",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update hackathon result"
        );
      }

      return {
        data: response.data,
        message: response.message || "Hackathon result updated successfully",
      };
    } catch (error: any) {
      return handleApiError<HackathonResult>(
        error,
        {} as HackathonResult,
        "[HackathonResult Service] Error updating hackathon result:"
      );
    }
  }

  async createBulkHackathonResults(
    data: Array<{
      hackathonId: string;
      teamId: string;
      totalScore: number;
      placement: number;
      award?: string;
    }>
  ): Promise<{ data: HackathonResult[]; message?: string }> {
    try {
      const response = await apiService.auth.post<HackathonResult[]>(
        "/hackathon-service/api/v1/hackathons/results/bulk-create",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create bulk hackathon results"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Bulk hackathon results created successfully",
      };
    } catch (error: any) {
      return handleApiError<HackathonResult[]>(
        error,
        [],
        "[HackathonResult Service] Error creating bulk hackathon results:"
      );
    }
  }

  async updateBulkHackathonResults(
    data: Array<{
      id?: string;
      hackathonId: string;
      teamId: string;
      totalScore: number;
      placement: number;
      award?: string;
    }>
  ): Promise<{ data: HackathonResult[]; message?: string }> {
    try {
      const response = await apiService.auth.put<HackathonResult[]>(
        "/hackathon-service/api/v1/hackathons/results/bulk-update",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update bulk hackathon results"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Bulk hackathon results updated successfully",
      };
    } catch (error: any) {
      return handleApiError<HackathonResult[]>(
        error,
        [],
        "[HackathonResult Service] Error updating bulk hackathon results:"
      );
    }
  }
}

export const hackathonResultService = new HackathonResultService();

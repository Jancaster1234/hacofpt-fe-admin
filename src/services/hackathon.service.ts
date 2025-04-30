// src/services/hackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { Hackathon } from "@/types/entities/hackathon";
import { handleApiError } from "@/utils/errorHandler";

class HackathonService {
  async getAllHackathons(): Promise<{ data: Hackathon[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Hackathon[]>(
        "/hackathon-service/api/v1/hackathons"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve hackathons");
      }

      return {
        data: response.data,
        message: response.message || "Hackathons retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Hackathon[]>(
        error,
        [],
        "[Hackathon Service] Error getting all hackathons:"
      );
    }
  }

  async getHackathonById(
    id: string
  ): Promise<{ data: Hackathon; message?: string }> {
    try {
      const response = await apiService.auth.get<Hackathon>(
        `/hackathon-service/api/v1/hackathons?id=${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve hackathon");
      }

      return {
        data: response.data,
        message: response.message || "Hackathon retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Hackathon>(
        error,
        {} as Hackathon,
        "[Hackathon Service] Error getting hackathon by ID:"
      );
    }
  }

  async createHackathon(
    data: Partial<Hackathon>
  ): Promise<{ data: Hackathon; message?: string }> {
    try {
      const response = await apiService.auth.post<Hackathon>(
        "/hackathon-service/api/v1/hackathons",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to create hackathon");
      }

      return {
        data: response.data,
        message: response.message || "Hackathon created successfully",
      };
    } catch (error: any) {
      return handleApiError<Hackathon>(
        error,
        {} as Hackathon,
        "[Hackathon Service] Error creating hackathon:"
      );
    }
  }

  async updateHackathon(
    data: Partial<Hackathon>
  ): Promise<{ data: Hackathon; message?: string }> {
    try {
      const response = await apiService.auth.put<Hackathon>(
        "/hackathon-service/api/v1/hackathons",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error("Failed to update hackathon");
      }

      return {
        data: response.data,
        message: response.message || "Hackathon updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Hackathon>(
        error,
        {} as Hackathon,
        "[Hackathon Service] Error updating hackathon:"
      );
    }
  }

  async deleteHackathon(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/hackathons/${id}`
      );

      return {
        message: response.message || "Hackathon deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Hackathon Service] Error deleting hackathon:",
        error.message
      );
      throw error;
    }
  }
}

export const hackathonService = new HackathonService();

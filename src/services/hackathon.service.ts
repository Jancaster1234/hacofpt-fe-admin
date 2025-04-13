// src/services/hackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { Hackathon } from "@/types/entities/hackathon";

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
        message: response.message,
      };
    } catch (error: any) {
      console.error(
        "[Hackathon Service] Error getting all hackathons:",
        error.message
      );
      // If the error is due to component unmount, don't rethrow
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return { data: [] as Hackathon[], message: "Request aborted" };
      }
      throw error;
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
        message: response.message,
      };
    } catch (error: any) {
      console.error(
        "[Hackathon Service] Error getting hackathon by ID:",
        error.message
      );
      // If the error is due to component unmount, don't rethrow
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return { data: {} as Hackathon, message: "Request aborted" };
      }
      throw error;
    }
  }

  async createHackathon(
    data: any
  ): Promise<{ data: Hackathon; message?: string }> {
    try {
      const response = await apiService.auth.post<Hackathon>(
        "/hackathon-service/api/v1/hackathons",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create hackathon");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      console.error(
        "[Hackathon Service] Error creating hackathon:",
        error.message
      );

      // Extract error message if available
      let errorMessage = "Failed to create hackathon";
      if (error.message && error.message.includes("Response:")) {
        try {
          const jsonMatch = error.message.match(/Response:(.+)/);
          if (jsonMatch) {
            const errorJson = JSON.parse(jsonMatch[1].trim());
            errorMessage = errorJson.message || errorMessage;
          }
        } catch (e) {
          // If parsing fails, use the original error message
        }
      }

      throw new Error(errorMessage);
    }
  }

  async updateHackathon(
    data: any
  ): Promise<{ data: Hackathon; message?: string }> {
    try {
      const response = await apiService.auth.put<Hackathon>(
        "/hackathon-service/api/v1/hackathons",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update hackathon");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      console.error(
        "[Hackathon Service] Error updating hackathon:",
        error.message
      );

      // Extract error message if available
      let errorMessage = "Failed to update hackathon";
      if (error.message && error.message.includes("Response:")) {
        try {
          const jsonMatch = error.message.match(/Response:(.+)/);
          if (jsonMatch) {
            const errorJson = JSON.parse(jsonMatch[1].trim());
            errorMessage = errorJson.message || errorMessage;
          }
        } catch (e) {
          // If parsing fails, use the original error message
        }
      }

      throw new Error(errorMessage);
    }
  }
}

export const hackathonService = new HackathonService();

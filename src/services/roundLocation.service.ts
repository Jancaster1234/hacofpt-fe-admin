// src/services/roundLocation.service.ts
import { apiService } from "@/services/apiService_v0";
import { RoundLocation } from "@/types/entities/roundLocation";
import { handleApiError } from "@/utils/errorHandler";

class RoundLocationService {
  async createRoundLocation(data: {
    roundId: string;
    locationId: string;
    type: "ONLINE" | "OFFLINE" | "HYBRID";
  }): Promise<{ data: RoundLocation; message?: string }> {
    try {
      const response = await apiService.auth.post<RoundLocation>(
        "hackathon-service/api/v1/round-locations",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create round location");
      }

      return {
        data: response.data,
        message: response.message || "Round location created successfully",
      };
    } catch (error: any) {
      return handleApiError<RoundLocation>(
        error,
        {} as RoundLocation,
        "[RoundLocation Service] Error creating round location:"
      );
    }
  }

  async updateRoundLocation(data: {
    id?: string;
    roundId: string;
    locationId: string;
    type: "ONLINE" | "OFFLINE" | "HYBRID";
  }): Promise<{ data: RoundLocation; message?: string }> {
    try {
      const response = await apiService.auth.put<RoundLocation>(
        `hackathon-service/api/v1/round-locations`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update round location");
      }

      return {
        data: response.data,
        message: response.message || "Round location updated successfully",
      };
    } catch (error: any) {
      return handleApiError<RoundLocation>(
        error,
        {} as RoundLocation,
        "[RoundLocation Service] Error updating round location:"
      );
    }
  }

  async deleteRoundLocation(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/hackathon-service/api/v1/rounds/locations/${id}`
      );

      return {
        message: response.message || "Round location deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[RoundLocation Service] Error deleting round location:"
      );
    }
  }
}

export const roundLocationService = new RoundLocationService();

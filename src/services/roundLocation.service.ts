// src/services/roundLocation.service.ts
import { apiService } from "@/services/apiService_v0";
import { RoundLocation } from "@/types/entities/roundLocation";

type RoundLocationPayload = {
  id?: string;
  roundId: string;
  locationId: string;
  type: "ONLINE" | "OFFLINE" | "HYBRID";
};

class RoundLocationService {
  async createRoundLocation(
    data: RoundLocationPayload
  ): Promise<RoundLocation> {
    try {
      const response = await apiService.auth.post<RoundLocation>(
        "hackathon-service/api/v1/round-locations",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating RoundLocation:", error);
      throw error;
    }
  }

  async updateRoundLocation(
    data: RoundLocationPayload
  ): Promise<RoundLocation> {
    try {
      const response = await apiService.auth.put<RoundLocation>(
        `hackathon-service/api/v1/round-locations`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating RoundLocation:", error);
      throw error;
    }
  }
}

export const roundLocationService = new RoundLocationService();

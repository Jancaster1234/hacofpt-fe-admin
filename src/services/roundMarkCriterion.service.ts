// src/services/roundMarkCriterion.service.ts
import { apiService } from "@/services/apiService_v0";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";

type RoundMarkCriterionPayload = {
  name: string;
  maxScore: number;
  note: string;
  roundId: string;
};

class RoundMarkCriterionService {
  async createRoundMarkCriterion(
    data: RoundMarkCriterionPayload
  ): Promise<RoundMarkCriterion> {
    try {
      const response = await apiService.auth.post<RoundMarkCriterion>(
        "/submission-service/api/v1/roundmarkcriteria",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating RoundMarkCriterion:", error);
      throw error;
    }
  }

  async updateRoundMarkCriterion(
    id: string,
    data: RoundMarkCriterionPayload
  ): Promise<RoundMarkCriterion> {
    try {
      const response = await apiService.auth.put<RoundMarkCriterion>(
        `/submission-service/api/v1/roundmarkcriteria/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating RoundMarkCriterion:", error);
      throw error;
    }
  }
}

export const roundMarkCriterionService = new RoundMarkCriterionService();
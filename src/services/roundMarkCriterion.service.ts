// src/services/roundMarkCriterion.service.ts
import { apiService } from "@/services/apiService_v0";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import { handleApiError } from "@/utils/errorHandler";

class RoundMarkCriterionService {
  async createRoundMarkCriterion(data: {
    name: string;
    maxScore: number;
    note: string;
    roundId: string;
  }): Promise<{ data: RoundMarkCriterion; message?: string }> {
    try {
      const response = await apiService.auth.post<RoundMarkCriterion>(
        "/submission-service/api/v1/roundmarkcriteria",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create round mark criterion"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Round mark criterion created successfully",
      };
    } catch (error: any) {
      return handleApiError<RoundMarkCriterion>(
        error,
        {} as RoundMarkCriterion,
        "[RoundMarkCriterion Service] Error creating round mark criterion:"
      );
    }
  }

  async updateRoundMarkCriterion(
    id: string,
    data: {
      name: string;
      maxScore: number;
      note: string;
      roundId: string;
    }
  ): Promise<{ data: RoundMarkCriterion; message?: string }> {
    try {
      const response = await apiService.auth.put<RoundMarkCriterion>(
        `/submission-service/api/v1/roundmarkcriteria/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update round mark criterion"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Round mark criterion updated successfully",
      };
    } catch (error: any) {
      return handleApiError<RoundMarkCriterion>(
        error,
        {} as RoundMarkCriterion,
        "[RoundMarkCriterion Service] Error updating round mark criterion:"
      );
    }
  }

  async deleteRoundMarkCriterion(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/submission-service/api/v1/roundmarkcriteria/${id}`
      );

      return {
        message:
          response.message || "Round mark criterion deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[RoundMarkCriterion Service] Error deleting round mark criterion:"
      );
    }
  }
}

export const roundMarkCriterionService = new RoundMarkCriterionService();

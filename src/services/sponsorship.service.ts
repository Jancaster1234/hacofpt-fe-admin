// src/services/sponsorship.service.ts
import { apiService } from "@/services/apiService_v0";
import { Sponsorship } from "@/types/entities/sponsorship";
import { handleApiError } from "@/utils/errorHandler";

class SponsorshipService {
  async getAllSponsorships(): Promise<{
    data: Sponsorship[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<Sponsorship[]>(
        "/hackathon-service/api/v1/sponsorships"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve sponsorships");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Sponsorship[]>(
        error,
        [],
        "[Sponsorship Service] Error getting sponsorships:"
      );
    }
  }

  async getSponsorshipById(
    id: string
  ): Promise<{ data: Sponsorship; message?: string }> {
    try {
      const response = await apiService.auth.get<Sponsorship>(
        `/hackathon-service/api/v1/sponsorships/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve sponsorship");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Sponsorship>(
        error,
        {} as Sponsorship,
        "[Sponsorship Service] Error getting sponsorship:"
      );
    }
  }

  async createSponsorship(data: {
    name: string;
    brand: string;
    content: string;
    money: number;
    timeFrom: string;
    timeTo: string;
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  }): Promise<{ data: Sponsorship; message?: string }> {
    try {
      const response = await apiService.auth.post<Sponsorship>(
        "/hackathon-service/api/v1/sponsorships",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create sponsorship");
      }

      return {
        data: response.data,
        message: response.message || "Sponsorship created successfully",
      };
    } catch (error: any) {
      return handleApiError<Sponsorship>(
        error,
        {} as Sponsorship,
        "[Sponsorship Service] Error creating sponsorship:"
      );
    }
  }

  async updateSponsorship(data: {
    id?: string;
    name: string;
    brand: string;
    content: string;
    money: number;
    timeFrom: string;
    timeTo: string;
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  }): Promise<{ data: Sponsorship; message?: string }> {
    try {
      const response = await apiService.auth.put<Sponsorship>(
        `/hackathon-service/api/v1/sponsorships`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update sponsorship");
      }

      return {
        data: response.data,
        message: response.message || "Sponsorship updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Sponsorship>(
        error,
        {} as Sponsorship,
        "[Sponsorship Service] Error updating sponsorship:"
      );
    }
  }

  async deleteSponsorship(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/sponsorships/${id}`
      );

      return {
        message: response.message || "Sponsorship deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Sponsorship Service] Error deleting sponsorship:",
        error.message
      );
      throw error;
    }
  }
}

export const sponsorshipService = new SponsorshipService();

// src/services/sponsorshipHackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import { handleApiError } from "@/utils/errorHandler";

class SponsorshipHackathonService {
  async createSponsorshipHackathon(data: {
    hackathonId: string;
    sponsorshipId: string;
    totalMoney: number;
  }): Promise<{ data: SponsorshipHackathon; message?: string }> {
    try {
      const response = await apiService.auth.post<SponsorshipHackathon>(
        "/hackathon-service/api/v1/sponsorships/hackathons",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create sponsorship hackathon"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Sponsorship hackathon created successfully",
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon>(
        error,
        {} as SponsorshipHackathon,
        "[Sponsorship Hackathon Service] Error creating sponsorship hackathon:"
      );
    }
  }

  async updateSponsorshipHackathon(data: {
    id?: string;
    hackathonId: string;
    sponsorshipId: string;
    totalMoney: number;
  }): Promise<{ data: SponsorshipHackathon; message?: string }> {
    try {
      const response = await apiService.auth.put<SponsorshipHackathon>(
        `/hackathon-service/api/v1/sponsorships/hackathons`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update sponsorship hackathon"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Sponsorship hackathon updated successfully",
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon>(
        error,
        {} as SponsorshipHackathon,
        "[Sponsorship Hackathon Service] Error updating sponsorship hackathon:"
      );
    }
  }
}

export const sponsorshipHackathonService = new SponsorshipHackathonService();

// src/services/sponsorship.service.ts
import { apiService } from "@/services/apiService_v0";
import { Sponsorship } from "@/types/entities/sponsorship";

type SponsorshipPayload = {
  id?: string;
  name: string;
  brand: string;
  content: string;
  money: number;
  timeFrom: string;
  timeTo: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};

class SponsorshipService {
  async createSponsorship(data: SponsorshipPayload): Promise<Sponsorship> {
    try {
      const response = await apiService.auth.post<Sponsorship>(
        "/hackathon-service/api/v1/sponsorships",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Sponsorship:", error);
      throw error;
    }
  }

  async updateSponsorship(data: SponsorshipPayload): Promise<Sponsorship> {
    try {
      const response = await apiService.auth.put<Sponsorship>(
        `/hackathon-service/api/v1/sponsorships`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Sponsorship:", error);
      throw error;
    }
  }
}

export const sponsorshipService = new SponsorshipService();

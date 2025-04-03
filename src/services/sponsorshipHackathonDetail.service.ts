// src/services/sponsorshipHackathonDetail.service.ts
import { apiService } from "@/services/apiService_v0";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";

type SponsorshipHackathonDetailPayload = {
  id?: string;
  sponsorshipHackathonId: string;
  moneySpent: number;
  content: string;
  status: "PLANNED" | "COMPLETED" | "CANCELLED";
  timeFrom: string;
  timeTo: string;
};

class SponsorshipHackathonDetailService {
  async createSponsorshipHackathonDetail(
    data: SponsorshipHackathonDetailPayload
  ): Promise<SponsorshipHackathonDetail> {
    try {
      const response = await apiService.auth.post<SponsorshipHackathonDetail>(
        "/hackathon-service/api/v1/sponsorships/details",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating SponsorshipHackathonDetail:", error);
      throw error;
    }
  }

  async updateSponsorshipHackathonDetail(
    data: SponsorshipHackathonDetailPayload
  ): Promise<SponsorshipHackathonDetail> {
    try {
      const response = await apiService.auth.put<SponsorshipHackathonDetail>(
        `/hackathon-service/api/v1/sponsorships/details`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating SponsorshipHackathonDetail:", error);
      throw error;
    }
  }
}

export const sponsorshipHackathonDetailService =
  new SponsorshipHackathonDetailService();

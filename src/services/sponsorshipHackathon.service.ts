// src/services/sponsorshipHackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";

type SponsorshipHackathonPayload = {
  id?: string;
  hackathonId: string;
  sponsorshipId: string;
  totalMoney: number;
};

class SponsorshipHackathonService {
  async createSponsorshipHackathon(data: SponsorshipHackathonPayload): Promise<SponsorshipHackathon> {
    try {
      const response = await apiService.auth.post<SponsorshipHackathon>(
        "/hackathon-service/api/v1/sponsorships/hackathons",  
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating SponsorshipHackathon:", error);
      throw error;
    }
  }

  async updateSponsorshipHackathon(data: SponsorshipHackathonPayload): Promise<SponsorshipHackathon> {
    try {
      const response = await apiService.auth.put<SponsorshipHackathon>(
        `/hackathon-service/api/v1/sponsorships/hackathons`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating SponsorshipHackathon:", error);
      throw error;
    }
  }
}

export const sponsorshipHackathonService = new SponsorshipHackathonService();

// src/services/hackathonResult.service.ts
import { apiService } from "@/services/apiService_v0";
import { HackathonResult } from "@/types/entities/hackathonResult";

class HackathonResultService {
    async getHackathonResultsByHackathonId(hackathonId: string): Promise<HackathonResult[]> {
        try {
          const response = await apiService.auth.get<HackathonResult[]>(
            `/api/v1/hackathons/results/${hackathonId}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching hackathon results by hackathonId:", error);
          throw error;
        }
      }
  }
  export const hackathonResultService = new HackathonResultService();

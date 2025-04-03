// src/services/mentorTeamLimit.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorTeamLimit } from "@/types/entities/mentorTeamLimit";

type MentorTeamLimitPayload = {
  id?: string;
  hackathonId: string;
  mentorId: string;
  teamId: string;
  maxTeams: number;
  maxMentors: number;
};

class MentorTeamLimitService {
  async createMentorTeamLimit(
    data: MentorTeamLimitPayload
  ): Promise<MentorTeamLimit> {
    try {
      const response = await apiService.auth.post<MentorTeamLimit>(
        "/hackathon-service/api/v1/mentor-team-limits",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating MentorTeamLimit:", error);
      throw error;
    }
  }

  async updateMentorTeamLimit(
    data: MentorTeamLimitPayload
  ): Promise<MentorTeamLimit> {
    try {
      const response = await apiService.auth.put<MentorTeamLimit>(
        `/hackathon-service/api/v1/mentor-team-limits`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating MentorTeamLimit:", error);
      throw error;
    }
  }
}

export const mentorTeamLimitService = new MentorTeamLimitService();

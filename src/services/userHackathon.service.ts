// src/services/userHackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { UserHackathon } from "@/types/entities/userHackathon";

type UserHackathonPayload = {
  userId: string;
  hackathonId: string;
  role: string;
};

class UserHackathonService {
  async getUserHackathonsByHackathonId(
    hackathonId: string
  ): Promise<UserHackathon[]> {
    try {
      const response = await apiService.auth.get<UserHackathon[]>(
        `/identity-service/api/v1/user-hackathons/hackathon/${hackathonId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching userHackathons by hackathonId:", error);
      throw error;
    }
  }

  async getUserHackathonsByRole(
    hackathonId: string,
    roles: string
  ): Promise<UserHackathon[]> {
    try {
      const response = await apiService.auth.get<UserHackathon[]>(
        `/identity-service/api/v1/user-hackathons/hackathon/${hackathonId}/roles?roles=${roles}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching userHackathons by role:", error);
      throw error;
    }
  }

  async createUserHackathon(
    data: UserHackathonPayload
  ): Promise<UserHackathon> {
    try {
      const response = await apiService.auth.post<UserHackathon>(
        "/identity-service/api/v1/user-hackathons",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating UserHackathon:", error);
      throw error;
    }
  }

  async updateUserHackathon(
    id: string,
    data: UserHackathonPayload
  ): Promise<UserHackathon> {
    try {
      const response = await apiService.auth.put<UserHackathon>(
        `/identity-service/api/v1/user-hackathons/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating UserHackathon:", error);
      throw error;
    }
  }
}

export const userHackathonService = new UserHackathonService();

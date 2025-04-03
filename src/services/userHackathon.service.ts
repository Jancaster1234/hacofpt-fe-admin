// src/services/userHackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { UserHackathon } from "@/types/entities/userHackathon";
import { handleApiError } from "@/utils/errorHandler";

class UserHackathonService {
  async getUserHackathonsByHackathonId(
    hackathonId: string
  ): Promise<{ data: UserHackathon[]; message?: string }> {
    try {
      const response = await apiService.auth.get<UserHackathon[]>(
        `/identity-service/api/v1/user-hackathons/hackathon/${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user hackathons");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<UserHackathon[]>(
        error,
        [],
        "Error fetching userHackathons by hackathonId:"
      );
    }
  }

  async getUserHackathonsByRole(
    hackathonId: string,
    roles: string
  ): Promise<{ data: UserHackathon[]; message?: string }> {
    try {
      const response = await apiService.auth.get<UserHackathon[]>(
        `/identity-service/api/v1/user-hackathons/hackathon/${hackathonId}/roles?roles=${roles}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user hackathons by role");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<UserHackathon[]>(
        error,
        [],
        "Error fetching userHackathons by role:"
      );
    }
  }

  async createUserHackathon(data: {
    userId: string;
    hackathonId: string;
    role: string;
  }): Promise<{ data: UserHackathon; message?: string }> {
    try {
      const response = await apiService.auth.post<UserHackathon>(
        "/identity-service/api/v1/user-hackathons",
        data
      );

      if (!response || !response.data) {
        throw new Error("Failed to create user hackathon");
      }

      return {
        data: response.data,
        message: response.message || "User hackathon created successfully",
      };
    } catch (error: any) {
      return handleApiError<UserHackathon>(
        error,
        {} as UserHackathon,
        "Error creating UserHackathon:"
      );
    }
  }

  async updateUserHackathon(
    id: string,
    data: {
      userId: string;
      hackathonId: string;
      role: string;
    }
  ): Promise<{ data: UserHackathon; message?: string }> {
    try {
      const response = await apiService.auth.put<UserHackathon>(
        `/identity-service/api/v1/user-hackathons/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error("Failed to update user hackathon");
      }

      return {
        data: response.data,
        message: response.message || "User hackathon updated successfully",
      };
    } catch (error: any) {
      return handleApiError<UserHackathon>(
        error,
        {} as UserHackathon,
        "Error updating UserHackathon:"
      );
    }
  }
}

export const userHackathonService = new UserHackathonService();

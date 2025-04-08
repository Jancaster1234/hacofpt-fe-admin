// src/services/teamRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRequest } from "@/types/entities/teamRequest";
import { handleApiError } from "@/utils/errorHandler";

class TeamRequestService {
  async getTeamRequestsByHackathonAndUser(
    hackathonId: string,
    memberId: string
  ): Promise<{ data: TeamRequest[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamRequest[]>(
        `/hackathon-service/api/v1/teams/requests/filter-by-member-and-hackathon?memberId=${memberId}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team requests");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TeamRequest[]>(
        error,
        [],
        "[Team Request Service] Error fetching team requests:"
      );
    }
  }

  async getTeamRequestsByUser(
    memberId: string
  ): Promise<{ data: TeamRequest[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamRequest[]>(
        `/hackathon-service/api/v1/teams/requests?memberId=${memberId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team requests");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TeamRequest[]>(
        error,
        [],
        "[Team Request Service] Error fetching team requests:"
      );
    }
  }

  async getTeamRequestsByHackathon(
    hackathonId: string
  ): Promise<{ data: TeamRequest[]; message?: string }> {
    try {
      const response = await apiService.auth.get<TeamRequest[]>(
        `/hackathon-service/api/v1/teams/requests?hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team requests");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<TeamRequest[]>(
        error,
        [],
        "[Team Request Service] Error fetching team requests:"
      );
    }
  }

  async createTeamRequest(data: {
    hackathonId: string;
    name: string;
    note: string;
    teamRequestMembers: {
      userId: string;
    }[];
  }): Promise<{ data: TeamRequest; message?: string }> {
    try {
      const response = await apiService.auth.post<TeamRequest>(
        "/hackathon-service/api/v1/teams/requests",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create team request");
      }

      return {
        data: response.data,
        message: response.message || "Team request created successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRequest>(
        error,
        {} as TeamRequest,
        "[Team Request Service] Error creating team request:"
      );
    }
  }

  async reviewTeamRequest(data: {
    requestId: string;
    status: "APPROVED" | "REJECTED";
    note: string;
  }): Promise<{ data: TeamRequest; message?: string }> {
    try {
      const response = await apiService.auth.post<TeamRequest>(
        "/hackathon-service/api/v1/teams/requests/review",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to review team request");
      }

      return {
        data: response.data,
        message: response.message || "Team request reviewed successfully",
      };
    } catch (error: any) {
      return handleApiError<TeamRequest>(
        error,
        {} as TeamRequest,
        "[Team Request Service] Error reviewing team request:"
      );
    }
  }

  async deleteTeamRequest(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/hackathon-service/api/v1/teams/requests/${id}`
      );

      return {
        message: response.message || "Successfully deleted team request",
      };
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error deleting team request:",
        error.message
      );
      throw error;
    }
  }
}

export const teamRequestService = new TeamRequestService();

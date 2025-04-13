// src/services/teamRequestMember.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRequestMember } from "@/types/entities/teamRequestMember";
import { handleApiError } from "@/utils/errorHandler";

class TeamRequestMemberService {
  async respondToTeamRequest(data: {
    requestId: string;
    userId: string;
    status: "APPROVED" | "REJECTED";
    note: string;
  }): Promise<{ data: TeamRequestMember; message?: string }> {
    try {
      const response = await apiService.auth.post<TeamRequestMember>(
        "/hackathon-service/api/v1/teams/requests/respond",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to respond to team request"
        );
      }

      return {
        data: response.data,
        message: response.message || "Successfully responded to team request",
      };
    } catch (error: any) {
      return handleApiError<TeamRequestMember>(
        error,
        {} as TeamRequestMember,
        "[Team Request Member Service] Error responding to team request:"
      );
    }
  }
}

export const teamRequestMemberService = new TeamRequestMemberService();

// src/services/sponsorshipHackathon.service.ts
import { apiService } from "@/services/apiService_v0";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import { handleApiError } from "@/utils/errorHandler";

class SponsorshipHackathonService {
  async getAllSponsorshipHackathons(): Promise<{
    data: SponsorshipHackathon[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathon[]>(
        "/hackathon-service/api/v1/sponsorships/hackathons"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve sponsorship hackathons");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon[]>(
        error,
        [],
        "[Sponsorship Hackathon Service] Error getting sponsorship hackathons:"
      );
    }
  }

  async getSponsorshipHackathonById(
    id: string
  ): Promise<{ data: SponsorshipHackathon; message?: string }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathon>(
        `/hackathon-service/api/v1/sponsorships/hackathons/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve sponsorship hackathon"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon>(
        error,
        {} as SponsorshipHackathon,
        "[Sponsorship Hackathon Service] Error getting sponsorship hackathon:"
      );
    }
  }

  async getSponsorshipHackathonsByHackathonId(
    hackathonId: string
  ): Promise<{ data: SponsorshipHackathon[]; message?: string }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathon[]>(
        `/hackathon-service/api/v1/sponsorships/hackathons/hackathon/${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message ||
            "Failed to retrieve sponsorship hackathons by hackathon id"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon[]>(
        error,
        [],
        "[Sponsorship Hackathon Service] Error getting sponsorship hackathons by hackathon id:"
      );
    }
  }

  async getSponsorshipHackathonsBySponsorshipId(
    sponsorshipId: string
  ): Promise<{ data: SponsorshipHackathon[]; message?: string }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathon[]>(
        `/hackathon-service/api/v1/sponsorships/hackathons/sponsorship/${sponsorshipId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message ||
            "Failed to retrieve sponsorship hackathons by sponsorship id"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon[]>(
        error,
        [],
        "[Sponsorship Hackathon Service] Error getting sponsorship hackathons by sponsorship id:"
      );
    }
  }

  async getSponsorshipHackathonByHackathonAndSponsorshipId(
    hackathonId: string,
    sponsorshipId: string
  ): Promise<{ data: SponsorshipHackathon; message?: string }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathon>(
        `/hackathon-service/api/v1/sponsorships/hackathons/hackathon/${hackathonId}/sponsorship/${sponsorshipId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message ||
            "Failed to retrieve sponsorship hackathon by hackathon and sponsorship ids"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathon>(
        error,
        {} as SponsorshipHackathon,
        "[Sponsorship Hackathon Service] Error getting sponsorship hackathon by hackathon and sponsorship ids:"
      );
    }
  }

  async createSponsorshipHackathon(data: {
    hackathonId: string;
    sponsorshipId: string;
    totalMoney: number;
  }): Promise<{ data: SponsorshipHackathon; message?: string }> {
    try {
      const response = await apiService.auth.post<SponsorshipHackathon>(
        "/hackathon-service/api/v1/sponsorships/hackathons",
        { data: data }
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
        { data: data }
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

  async deleteSponsorshipHackathon(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/sponsorships/hackathons/${id}`
      );

      return {
        message:
          response.message || "Sponsorship hackathon deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Sponsorship Hackathon Service] Error deleting sponsorship hackathon:",
        error.message
      );
      throw error;
    }
  }
}

export const sponsorshipHackathonService = new SponsorshipHackathonService();

// src/services/sponsorshipHackathonDetail.service.ts
import { apiService } from "@/services/apiService_v0";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import { handleApiError } from "@/utils/errorHandler";

class SponsorshipHackathonDetailService {
  async createSponsorshipHackathonDetail(data: {
    sponsorshipHackathonId: string;
    moneySpent: number;
    content: string;
    status: "PLANNED" | "COMPLETED" | "CANCELLED";
    timeFrom: string;
    timeTo: string;
    files?: File[];
  }): Promise<{ data: SponsorshipHackathonDetail; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("sponsorshipHackathonId", data.sponsorshipHackathonId);
      formData.append("moneySpent", String(data.moneySpent));
      formData.append("content", data.content);
      formData.append("status", data.status);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await apiService.auth.post<SponsorshipHackathonDetail>(
        "/hackathon-service/api/v1/sponsorships/details",
        formData
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create sponsorship hackathon detail"
        );
      }

      return {
        data: response.data,
        message:
          response.message ||
          "Sponsorship hackathon detail created successfully",
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathonDetail>(
        error,
        {} as SponsorshipHackathonDetail,
        "[Sponsorship Hackathon Detail Service] Error creating sponsorship hackathon detail:"
      );
    }
  }

  async updateSponsorshipHackathonDetail(
    id: string,
    data: {
      sponsorshipHackathonId: string;
      moneySpent: number;
      content: string;
      status: "PLANNED" | "COMPLETED" | "CANCELLED";
      timeFrom: string;
      timeTo: string;
      files?: File[];
    }
  ): Promise<{ data: SponsorshipHackathonDetail; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("sponsorshipHackathonId", data.sponsorshipHackathonId);
      formData.append("moneySpent", String(data.moneySpent));
      formData.append("content", data.content);
      formData.append("status", data.status);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await apiService.auth.put<SponsorshipHackathonDetail>(
        `/hackathon-service/api/v1/sponsorships/details/${id}`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update sponsorship hackathon detail"
        );
      }

      return {
        data: response.data,
        message:
          response.message ||
          "Sponsorship hackathon detail updated successfully",
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathonDetail>(
        error,
        {} as SponsorshipHackathonDetail,
        "[Sponsorship Hackathon Detail Service] Error updating sponsorship hackathon detail:"
      );
    }
  }
}

export const sponsorshipHackathonDetailService =
  new SponsorshipHackathonDetailService();

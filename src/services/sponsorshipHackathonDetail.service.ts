// src/services/sponsorshipHackathonDetail.service.ts
import { apiService } from "@/services/apiService_v0";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import { handleApiError } from "@/utils/errorHandler";
import { FileUrl } from "@/types/entities/fileUrl";

class SponsorshipHackathonDetailService {
  async getAllSponsorshipHackathonDetails(): Promise<{
    data: SponsorshipHackathonDetail[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathonDetail[]>(
        "/hackathon-service/api/v1/sponsorships/details"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve sponsorship hackathon details");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathonDetail[]>(
        error,
        [],
        "[Sponsorship Hackathon Detail Service] Error getting sponsorship hackathon details:"
      );
    }
  }

  async getSponsorshipHackathonDetailById(
    id: string
  ): Promise<{ data: SponsorshipHackathonDetail; message?: string }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathonDetail>(
        `/hackathon-service/api/v1/sponsorships/details/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve sponsorship hackathon detail"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathonDetail>(
        error,
        {} as SponsorshipHackathonDetail,
        "[Sponsorship Hackathon Detail Service] Error getting sponsorship hackathon detail:"
      );
    }
  }

  async getSponsorshipHackathonDetailsBySponsorshipHackathonId(
    sponsorshipHackathonId: string
  ): Promise<{ data: SponsorshipHackathonDetail[]; message?: string }> {
    try {
      const response = await apiService.auth.get<SponsorshipHackathonDetail[]>(
        `/hackathon-service/api/v1/sponsorships/details/by-sponsorship-hackathon/${sponsorshipHackathonId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message ||
            "Failed to retrieve sponsorship hackathon details by sponsorship hackathon id"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<SponsorshipHackathonDetail[]>(
        error,
        [],
        "[Sponsorship Hackathon Detail Service] Error getting sponsorship hackathon details by sponsorship hackathon id:"
      );
    }
  }

  async createSponsorshipHackathonDetail(data: {
    sponsorshipHackathonId: string;
    moneySpent: number;
    content: string;
    status: "PLANNED" | "COMPLETED" | "CANCELLED";
    timeFrom: string;
    timeTo: string;
  }): Promise<{ data: SponsorshipHackathonDetail; message?: string }> {
    try {
      const response = await apiService.auth.post<SponsorshipHackathonDetail>(
        "/hackathon-service/api/v1/sponsorships/details",
        { data: data }
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

  // Update information without files
  async updateSponsorshipHackathonDetailInformation(
    id: string,
    data: {
      sponsorshipHackathonId: string;
      moneySpent: number;
      content: string;
      status: "PLANNED" | "COMPLETED" | "CANCELLED";
      timeFrom: string;
      timeTo: string;
    }
  ): Promise<{ data: SponsorshipHackathonDetail; message?: string }> {
    try {
      const response = await apiService.auth.put<SponsorshipHackathonDetail>(
        `/hackathon-service/api/v1/sponsorships/details/update-info/${id}`,
        { data: data }
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

  // Create files for sponsorship hackathon detail
  async createSponsorshipHackathonDetailFiles(
    detailId: string,
    fileUrls: string[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.put<FileUrl[]>(
        `/hackathon-service/v1/sponsorships/details/update-files/${detailId}`,
        { data: fileUrls }
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message ||
            "Failed to attach files to sponsorship hackathon detail"
        );
      }

      return {
        data: response.data,
        message: response.message || "Files added successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[Sponsorship Hackathon Detail Service] Error creating detail files:"
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

  async deleteSponsorshipHackathonDetail(
    id: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/sponsorships/details/${id}`
      );

      return {
        message:
          response.message ||
          "Sponsorship hackathon detail deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Sponsorship Hackathon Detail Service] Error deleting sponsorship hackathon detail:",
        error.message
      );
      throw error;
    }
  }
}

export const sponsorshipHackathonDetailService =
  new SponsorshipHackathonDetailService();

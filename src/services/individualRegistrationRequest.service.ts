// src/services/individualRegistrationRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { handleApiError } from "@/utils/errorHandler";

class IndividualRegistrationRequestService {
  async createIndividualRegistrationRequest(data: {
    hackathonId: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedById?: string;
  }): Promise<{ data: IndividualRegistrationRequest; message?: string }> {
    try {
      const response =
        await apiService.auth.post<IndividualRegistrationRequest>(
          "/hackathon-service/api/v1/individuals",
          data
        );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create registration request"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Registration request created successfully",
      };
    } catch (error: any) {
      return handleApiError<IndividualRegistrationRequest>(
        error,
        {} as IndividualRegistrationRequest,
        "[Individual Registration Service] Error creating registration request:"
      );
    }
  }

  async updateIndividualRegistrationRequest(data: {
    id?: string;
    hackathonId: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedById?: string;
  }): Promise<{ data: IndividualRegistrationRequest; message?: string }> {
    try {
      const response = await apiService.auth.put<IndividualRegistrationRequest>(
        `/hackathon-service/api/v1/individuals`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update registration request"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "Registration request updated successfully",
      };
    } catch (error: any) {
      return handleApiError<IndividualRegistrationRequest>(
        error,
        {} as IndividualRegistrationRequest,
        "[Individual Registration Service] Error updating registration request:"
      );
    }
  }

  async getIndividualRegistrationRequestsByUserAndHackathon(
    createdByUsername: string,
    hackathonId: string
  ): Promise<{ data: IndividualRegistrationRequest[]; message?: string }> {
    try {
      const response = await apiService.auth.get<
        IndividualRegistrationRequest[]
      >(
        `/hackathon-service/api/v1/individuals/filter-by-username-and-hackathon?createdByUsername=${createdByUsername}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve registration requests");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<IndividualRegistrationRequest[]>(
        error,
        [],
        "[Individual Registration Service] Error fetching registration requests:"
      );
    }
  }

  async getIndividualRegistrationRequestsByUser(
    createdByUsername: string
  ): Promise<{ data: IndividualRegistrationRequest[]; message?: string }> {
    try {
      const response = await apiService.auth.get<
        IndividualRegistrationRequest[]
      >(
        `/hackathon-service/api/v1/individuals/filter-by-username?createdByUsername=${createdByUsername}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve registration requests");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<IndividualRegistrationRequest[]>(
        error,
        [],
        "[Individual Registration Service] Error fetching registration requests:"
      );
    }
  }

  async deleteIndividualRegistration(
    id: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/individuals/${id}`
      );

      return {
        message: response.message || "Successfully deleted registration",
      };
    } catch (error: any) {
      console.error(
        "[Individual Registration Service] Error deleting registration:",
        error.message
      );
      throw error;
    }
  }
}

export const individualRegistrationRequestService =
  new IndividualRegistrationRequestService();

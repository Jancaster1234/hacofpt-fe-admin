// src/services/location.service.ts
import { apiService } from "@/services/apiService_v0";
import { Location } from "@/types/entities/location";
import { handleApiError } from "@/utils/errorHandler";

class LocationService {
  async getAllLocations(): Promise<{ data: Location[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Location[]>(
        "/hackathon-service/api/v1/locations"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve locations");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Location[]>(
        error,
        [],
        "[Location Service] Error getting locations:"
      );
    }
  }

  async createLocation(data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }): Promise<{ data: Location; message?: string }> {
    try {
      const response = await apiService.auth.post<Location>(
        "/hackathon-service/api/v1/locations",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create location");
      }

      return {
        data: response.data,
        message: response.message || "Location created successfully",
      };
    } catch (error: any) {
      return handleApiError<Location>(
        error,
        {} as Location,
        "[Location Service] Error creating location:"
      );
    }
  }

  async updateLocation(data: {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }): Promise<{ data: Location; message?: string }> {
    try {
      const response = await apiService.auth.put<Location>(
        `/hackathon-service/api/v1/locations`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update location");
      }

      return {
        data: response.data,
        message: response.message || "Location updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Location>(
        error,
        {} as Location,
        "[Location Service] Error updating location:"
      );
    }
  }

  async deleteLocation(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/locations/${id}`
      );

      return {
        message: response.message || "Location deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Location Service] Error deleting location:",
        error.message
      );
      throw error;
    }
  }
}

export const locationService = new LocationService();

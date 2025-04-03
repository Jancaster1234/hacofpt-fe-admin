// src/services/location.service.ts
import { apiService } from "@/services/apiService_v0";
import { Location } from "@/types/entities/location";

type LocationPayload = {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

class LocationService {
  async getAllLocations(): Promise<Partial<Location>[]> {
    try {
      const response = await apiService.auth.get<Partial<Location>[]>(
        "/hackathon-service/api/v1/locations"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  }

  async createLocation(data: LocationPayload): Promise<Location> {
    try {
      const response = await apiService.auth.post<Location>(
        "/hackathon-service/api/v1/locations",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Location:", error);
      throw error;
    }
  }

  async updateLocation(data: LocationPayload): Promise<Location> {
    try {
      const response = await apiService.auth.put<Location>(
        `/hackathon-service/api/v1/locations`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Location:", error);
      throw error;
    }
  }
}

export const locationService = new LocationService();

// src/services/device.service.ts
import { apiService } from "@/services/apiService_v0";
import { Device } from "@/types/entities/device";
import { handleApiError } from "@/utils/errorHandler";

class DeviceService {
  async createDevice(data: {
    hackathonId: string;
    roundId: string;
    roundLocationId: string;
    name: string;
    description?: string;
    status: "AVAILABLE" | "IN_USE" | "DAMAGED" | "LOST" | "RETIRED" | "PENDING";
    files: File[];
  }): Promise<{ data: Device; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("hackathonId", data.hackathonId);
      formData.append("roundId", data.roundId);
      formData.append("roundLocationId", data.roundLocationId);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<Device>(
        "/identity-service/api/v1/devices",
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create device");
      }

      return {
        data: response.data,
        message: response.message || "Device created successfully",
      };
    } catch (error: any) {
      return handleApiError<Device>(
        error,
        {} as Device,
        "[Device Service] Error creating device:"
      );
    }
  }

  async updateDevice(
    id: string,
    data: {
      hackathonId: string;
      roundId: string;
      roundLocationId: string;
      name: string;
      description?: string;
      status:
        | "AVAILABLE"
        | "IN_USE"
        | "DAMAGED"
        | "LOST"
        | "RETIRED"
        | "PENDING";
      files: File[];
    }
  ): Promise<{ data: Device; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("hackathonId", data.hackathonId);
      formData.append("roundId", data.roundId);
      formData.append("roundLocationId", data.roundLocationId);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.put<Device>(
        `/identity-service/api/v1/devices/${id}`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update device");
      }

      return {
        data: response.data,
        message: response.message || "Device updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Device>(
        error,
        {} as Device,
        "[Device Service] Error updating device:"
      );
    }
  }
}

export const deviceService = new DeviceService();

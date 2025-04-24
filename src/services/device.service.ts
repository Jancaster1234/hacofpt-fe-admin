// src/services/device.service.ts
import { apiService } from "@/services/apiService_v0";
import { Device } from "@/types/entities/device";
import { handleApiError } from "@/utils/errorHandler";
import { FileUrl } from "@/types/entities/fileUrl";

class DeviceService {
  async createDevice(data: {
    hackathonId: string;
    roundId?: string;
    roundLocationId?: string;
    name: string;
    description?: string;
    status?:
      | "AVAILABLE"
      | "IN_USE"
      | "DAMAGED"
      | "LOST"
      | "RETIRED"
      | "PENDING";
    quantity?: number;
    files?: File[];
  }): Promise<{ data: Device; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("hackathonId", data.hackathonId);
      formData.append("roundId", data.roundId);
      formData.append("roundLocationId", data.roundLocationId);
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("status", data.status);
      formData.append("quantity", String(data.quantity));

      data.files?.forEach((file) => {
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
      roundId?: string;
      roundLocationId?: string;
      name: string;
      description?: string;
      status?:
        | "AVAILABLE"
        | "IN_USE"
        | "DAMAGED"
        | "LOST"
        | "RETIRED"
        | "PENDING";
      quantity?: number;
      files?: File[];
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
      formData.append("quantity", String(data.quantity));

      data.files?.forEach((file) => {
        formData.append("files", file);
      });
      console.log("FormData", formData);
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

  async createDeviceFiles(
    deviceId: string,
    files: File[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<FileUrl[]>(
        `/identity-service/api/v1/devices/${deviceId}/files`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to add files to device");
      }

      return {
        data: response.data,
        message: response.message || "Device files added successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[Device Service] Error adding files to device:"
      );
    }
  }

  async getDevicesByHackathonId(
    hackathonId: string
  ): Promise<{ data: Device[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Device[]>(
        `/identity-service/api/v1/devices/hackathon/${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve devices");
      }

      return {
        data: response.data,
        message: response.message || "Devices retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Device[]>(
        error,
        [],
        "[Device Service] Error fetching devices by hackathon ID:"
      );
    }
  }

  async getDevicesByRoundId(
    roundId: string
  ): Promise<{ data: Device[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Device[]>(
        `/identity-service/api/v1/devices/round/${roundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve devices");
      }

      return {
        data: response.data,
        message: response.message || "Devices retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Device[]>(
        error,
        [],
        "[Device Service] Error fetching devices by round ID:"
      );
    }
  }

  async getDevicesByRoundLocationId(
    roundLocationId: string
  ): Promise<{ data: Device[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Device[]>(
        `/identity-service/api/v1/devices/round-location/${roundLocationId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve devices");
      }

      return {
        data: response.data,
        message: response.message || "Devices retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Device[]>(
        error,
        [],
        "[Device Service] Error fetching devices by round location ID:"
      );
    }
  }

  async getDeviceById(id: string): Promise<{ data: Device; message?: string }> {
    try {
      const response = await apiService.auth.get<Device>(
        `/identity-service/api/v1/devices/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve device");
      }

      return {
        data: response.data,
        message: response.message || "Device retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Device>(
        error,
        {} as Device,
        "[Device Service] Error fetching device by ID:"
      );
    }
  }

  async deleteDevice(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/identity-service/api/v1/devices/${id}`
      );

      return {
        message: response.message || "Device deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[Device Service] Error deleting device:"
      );
    }
  }
}

export const deviceService = new DeviceService();

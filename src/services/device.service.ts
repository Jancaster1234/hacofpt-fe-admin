// src/services/device.service.ts
import { Device } from "@/types/entities/device";
import { tokenService_v0 } from "@/services/token.service_v0";

type DevicePayload = {
  hackathonId: string;
  roundId: string;
  roundLocationId: string;
  name: string;
  description?: string;
  status: "AVAILABLE" | "IN_USE" | "DAMAGED" | "LOST" | "RETIRED" | "PENDING";
  files: File[];
};

class DeviceService {
  async createDevice(data: DevicePayload): Promise<Device> {
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

      const response = await fetch("/identity-service/api/v1/devices", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create device: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating device:", error);
      throw error;
    }
  }

  async updateDevice(id: string, data: DevicePayload): Promise<Device> {
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

      const response = await fetch(`/identity-service/api/v1/devices/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update device: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  }
}

export const deviceService = new DeviceService();

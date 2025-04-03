// src/services/userDevice.service.ts
import { UserDevice } from "@/types/entities/userDevice";
import { tokenService_v0 } from "@/services/token.service_v0";

type UserDevicePayload = {
  userId: string;
  deviceId: string;
  timeFrom: string;
  timeTo: string;
  status: "ASSIGNED" | "RETURNED" | "LOST" | "DAMAGED";
  files: File[];
};

class UserDeviceService {
  async createUserDevice(data: UserDevicePayload): Promise<UserDevice> {
    try {
      const formData = new FormData();

      formData.append("userId", data.userId);
      formData.append("deviceId", data.deviceId);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/identity-service/api/v1/user-devices", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Create failed: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse as UserDevice;
    } catch (error) {
      console.error("Error creating UserDevice:", error);
      throw error;
    }
  }

  async updateUserDevice(id: string, data: UserDevicePayload): Promise<UserDevice> {
    try {
      const formData = new FormData();

      formData.append("userId", data.userId);
      formData.append("deviceId", data.deviceId);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);
      formData.append("status", data.status);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/identity-service/api/v1/user-devices/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Update failed: ${errMsg}`);
      }

      const dataResponse = await response.json();
      return dataResponse as UserDevice;
    } catch (error) {
      console.error("Error updating UserDevice:", error);
      throw error;
    }
  }
}

export const userDeviceService = new UserDeviceService();

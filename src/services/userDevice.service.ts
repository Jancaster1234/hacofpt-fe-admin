// src/services/userDevice.service.ts
import { apiService } from "@/services/apiService_v0";
import { UserDevice } from "@/types/entities/userDevice";
import { handleApiError } from "@/utils/errorHandler";

class UserDeviceService {
  async createUserDevice(data: {
    userId: string;
    deviceId: string;
    timeFrom: string;
    timeTo: string;
    status: "ASSIGNED" | "RETURNED" | "LOST" | "DAMAGED";
    files: File[];
  }): Promise<{ data: UserDevice; message?: string }> {
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

      const response = await apiService.auth.post<UserDevice>(
        "/identity-service/api/v1/user-devices",
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create user device");
      }

      return {
        data: response.data,
        message: response.message || "User device created successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDevice>(
        error,
        {} as UserDevice,
        "[UserDevice Service] Error creating user device:"
      );
    }
  }

  async updateUserDevice(
    id: string,
    data: {
      userId: string;
      deviceId: string;
      timeFrom: string;
      timeTo: string;
      status: "ASSIGNED" | "RETURNED" | "LOST" | "DAMAGED";
      files: File[];
    }
  ): Promise<{ data: UserDevice; message?: string }> {
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

      const response = await apiService.auth.put<UserDevice>(
        `/identity-service/api/v1/user-devices/${id}`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update user device");
      }

      return {
        data: response.data,
        message: response.message || "User device updated successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDevice>(
        error,
        {} as UserDevice,
        "[UserDevice Service] Error updating user device:"
      );
    }
  }
}

export const userDeviceService = new UserDeviceService();

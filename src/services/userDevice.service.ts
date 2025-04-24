// src/services/userDevice.service.ts
import { apiService } from "@/services/apiService_v0";
import { UserDevice } from "@/types/entities/userDevice";
import { handleApiError } from "@/utils/errorHandler";
import { FileUrl } from "@/types/entities/fileUrl";

class UserDeviceService {
  async createUserDevice(data: {
    userId: string;
    deviceId: string;
    timeFrom: string;
    timeTo: string;
    status: "ASSIGNED" | "RETURNED" | "LOST" | "DAMAGED";
    files?: File[];
  }): Promise<{ data: UserDevice; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("userId", data.userId);
      formData.append("deviceId", data.deviceId);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);
      formData.append("status", data.status);

      data.files?.forEach((file) => {
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
      files?: File[];
    }
  ): Promise<{ data: UserDevice; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("userId", data.userId);
      formData.append("deviceId", data.deviceId);
      formData.append("timeFrom", data.timeFrom);
      formData.append("timeTo", data.timeTo);
      formData.append("status", data.status);

      data.files?.forEach((file) => {
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

  async createUserDeviceFiles(
    userDeviceId: string,
    files: File[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<FileUrl[]>(
        `/identity-service/api/v1/user-devices/${userDeviceId}/files`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to add files to user device"
        );
      }

      return {
        data: response.data,
        message: response.message || "User device files added successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[UserDevice Service] Error adding files to user device:"
      );
    }
  }

  async getUserDeviceById(
    id: string
  ): Promise<{ data: UserDevice; message?: string }> {
    try {
      const response = await apiService.auth.get<UserDevice>(
        `/identity-service/api/v1/user-devices/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user device");
      }

      return {
        data: response.data,
        message: response.message || "User device retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDevice>(
        error,
        {} as UserDevice,
        "[UserDevice Service] Error fetching user device by ID:"
      );
    }
  }

  async getUserDevicesByDeviceId(
    deviceId: string
  ): Promise<{ data: UserDevice[]; message?: string }> {
    try {
      const response = await apiService.auth.get<UserDevice[]>(
        `/identity-service/api/v1/user-devices/device/${deviceId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user devices");
      }

      return {
        data: response.data,
        message: response.message || "User devices retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDevice[]>(
        error,
        [],
        "[UserDevice Service] Error fetching user devices by device ID:"
      );
    }
  }

  async getUserDevicesByUserId(
    userId: string
  ): Promise<{ data: UserDevice[]; message?: string }> {
    try {
      const response = await apiService.auth.get<UserDevice[]>(
        `/identity-service/api/v1/user-devices?userId=${userId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user devices");
      }

      return {
        data: response.data,
        message: response.message || "User devices retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDevice[]>(
        error,
        [],
        "[UserDevice Service] Error fetching user devices by user ID:"
      );
    }
  }

  async getUserDevicesByDeviceIdAndUserId(
    deviceId: string,
    userId: string
  ): Promise<{ data: UserDevice[]; message?: string }> {
    try {
      const response = await apiService.auth.get<UserDevice[]>(
        `/identity-service/api/v1/user-devices?deviceId=${deviceId}&userId=${userId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user devices");
      }

      return {
        data: response.data,
        message: response.message || "User devices retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDevice[]>(
        error,
        [],
        "[UserDevice Service] Error fetching user devices by device ID and user ID:"
      );
    }
  }

  async deleteUserDevice(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/identity-service/api/v1/user-devices/${id}`
      );

      return {
        message: response.message || "User device deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[UserDevice Service] Error deleting user device:"
      );
    }
  }
}

export const userDeviceService = new UserDeviceService();

// src/services/userDeviceTrack.service.ts
import { apiService } from "@/services/apiService_v0";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import { handleApiError } from "@/utils/errorHandler";

class UserDeviceTrackService {
  async createUserDeviceTrack(data: {
    userDeviceId: string;
    deviceQualityStatus:
      | "EXCELLENT"
      | "GOOD"
      | "FAIR"
      | "DAMAGED"
      | "NEEDS_REPAIR"
      | "REPAIRING"
      | "REPAIRED"
      | "LOST";
    note?: string;
    files: File[];
  }): Promise<{ data: UserDeviceTrack; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("userDeviceId", data.userDeviceId);
      formData.append("deviceQualityStatus", data.deviceQualityStatus);
      if (data.note) formData.append("note", data.note);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<UserDeviceTrack>(
        "/identity-service/api/v1/user-device-tracks",
        formData
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create user device track"
        );
      }

      return {
        data: response.data,
        message: response.message || "User device track created successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDeviceTrack>(
        error,
        {} as UserDeviceTrack,
        "[UserDeviceTrack Service] Error creating user device track:"
      );
    }
  }

  async updateUserDeviceTrack(
    id: string,
    data: {
      userDeviceId: string;
      deviceQualityStatus:
        | "EXCELLENT"
        | "GOOD"
        | "FAIR"
        | "DAMAGED"
        | "NEEDS_REPAIR"
        | "REPAIRING"
        | "REPAIRED"
        | "LOST";
      note?: string;
      files: File[];
    }
  ): Promise<{ data: UserDeviceTrack; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("userDeviceId", data.userDeviceId);
      formData.append("deviceQualityStatus", data.deviceQualityStatus);
      if (data.note) formData.append("note", data.note);

      data.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.put<UserDeviceTrack>(
        `/identity-service/api/v1/user-device-tracks/${id}`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update user device track"
        );
      }

      return {
        data: response.data,
        message: response.message || "User device track updated successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDeviceTrack>(
        error,
        {} as UserDeviceTrack,
        "[UserDeviceTrack Service] Error updating user device track:"
      );
    }
  }
}

export const userDeviceTrackService = new UserDeviceTrackService();

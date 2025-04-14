// src/services/userDeviceTrack.service.ts
import { apiService } from "@/services/apiService_v0";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import { handleApiError } from "@/utils/errorHandler";
import { FileUrl } from "@/types/entities/fileUrl";

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
  }): Promise<{ data: UserDeviceTrack; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("userDeviceId", data.userDeviceId);
      formData.append("deviceQualityStatus", data.deviceQualityStatus);
      if (data.note) formData.append("note", data.note);

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
    }
  ): Promise<{ data: UserDeviceTrack; message?: string }> {
    try {
      const formData = new FormData();

      formData.append("userDeviceId", data.userDeviceId);
      formData.append("deviceQualityStatus", data.deviceQualityStatus);
      if (data.note) formData.append("note", data.note);

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

  async createUserDeviceTrackFiles(
    trackId: string,
    files: File[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<FileUrl[]>(
        `/identity-service/api/v1/user-device-tracks/${trackId}/files`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to add files to user device track"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "User device track files added successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[UserDeviceTrack Service] Error adding files to user device track:"
      );
    }
  }

  // Get all user device tracks
  async getAllUserDeviceTracks(): Promise<{
    data: UserDeviceTrack[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<UserDeviceTrack[]>(
        "/identity-service/api/v1/user-device-tracks"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user device tracks");
      }

      return {
        data: response.data,
        message:
          response.message || "User device tracks retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDeviceTrack[]>(
        error,
        [],
        "[UserDeviceTrack Service] Error fetching user device tracks:"
      );
    }
  }

  // Get user device track by ID
  async getUserDeviceTrackById(
    id: string
  ): Promise<{ data: UserDeviceTrack; message?: string }> {
    try {
      const response = await apiService.auth.get<UserDeviceTrack>(
        `/identity-service/api/v1/user-device-tracks/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user device track");
      }

      return {
        data: response.data,
        message: response.message || "User device track retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDeviceTrack>(
        error,
        {} as UserDeviceTrack,
        "[UserDeviceTrack Service] Error fetching user device track by ID:"
      );
    }
  }

  // Delete user device track by ID
  async deleteUserDeviceTrack(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/identity-service/api/v1/user-device-tracks/${id}`
      );

      return {
        message: response.message || "User device track deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[UserDeviceTrack Service] Error deleting user device track:",
        error.message
      );
      throw error;
    }
  }

  // Get user device tracks by userDeviceId
  async getUserDeviceTracksByUserDeviceId(
    userDeviceId: string
  ): Promise<{ data: UserDeviceTrack[]; message?: string }> {
    try {
      const response = await apiService.auth.get<UserDeviceTrack[]>(
        `/identity-service/api/v1/user-device-tracks?userDeviceId=${userDeviceId}`
      );

      if (!response || !response.data) {
        throw new Error(
          "Failed to retrieve user device tracks by user device ID"
        );
      }

      return {
        data: response.data,
        message:
          response.message || "User device tracks retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<UserDeviceTrack[]>(
        error,
        [],
        "[UserDeviceTrack Service] Error fetching user device tracks by user device ID:"
      );
    }
  }
}

export const userDeviceTrackService = new UserDeviceTrackService();

// src/services/fileUrl.service.ts
import { apiService } from "@/services/apiService_v0";
import { FileUrl } from "@/types/entities/fileUrl";
import { handleApiError } from "@/utils/errorHandler";

class FileUrlService {
  async uploadFile(file: File): Promise<{ data: FileUrl; message?: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiService.auth.post<FileUrl>(
        "/hackathon-service/api/v1/upload/image",
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to upload file");
      }

      return {
        data: response.data,
        message: response.message || "File uploaded successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl>(
        error,
        {} as FileUrl,
        "[File URL Service] Error uploading file:"
      );
    }
  }

  async uploadMultipleFiles(
    files: File[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<FileUrl[]>(
        "/hackathon-service/api/v1/files/upload",
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to upload files");
      }

      return {
        data: response.data,
        message: response.message || "Files uploaded successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error uploading multiple files:"
      );
    }
  }

  async uploadDeviceFiles(
    deviceId: string,
    files: File[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const formData = new FormData();
      formData.append("deviceId", deviceId);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<FileUrl[]>(
        `/hackathon-service/api/v1/files/upload`,
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to upload files");
      }

      return {
        data: response.data,
        message: response.message || "Files uploaded successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error uploading device files:"
      );
    }
  }

  async uploadMultipleFilesCommunication(
    files: File[]
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.auth.post<FileUrl[]>(
        "/communication-service/api/v1/files/upload",
        formData
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to upload files");
      }

      return {
        data: response.data,
        message: response.message || "Files uploaded successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error uploading multiple files to communication service:"
      );
    }
  }

  async getFileUrlsByDeviceId(
    deviceId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/identity-service/api/v1/devices/${deviceId}/file-urls`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by device ID:"
      );
    }
  }

  async getFileUrlsByUserDeviceId(
    userDeviceId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/identity-service/api/v1/user-devices/${userDeviceId}/file-urls`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by user device ID:"
      );
    }
  }

  async getFileUrlsByUserDeviceTrackId(
    userDeviceTrackId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/identity-service/api/v1/user-device-tracks/${userDeviceTrackId}/file-urls`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by user device track ID:"
      );
    }
  }

  async getFileUrlsBySponsorshipHackathonDetailId(
    sponsorshipHackathonDetailId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/hackathon-service/api/v1/sponsorships/${sponsorshipHackathonDetailId}/file-urls`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by sponsorship hackathon detail ID:"
      );
    }
  }

  async getFileUrlsByScheduleEventId(
    scheduleEventId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/communication-service/api/v1/schedule-events/${scheduleEventId}/file-urls`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by schedule event ID:"
      );
    }
  }

  async getFileUrlsByTaskId(
    taskId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/communication-service/api/v1/tasks/${taskId}/file-urls`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by task ID:"
      );
    }
  }

  async getFileUrlsByMessageId(
    messageId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/communication-service/api/v1/files?messageId=${messageId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by message ID:"
      );
    }
  }

  async getFileUrlsBySubmissionId(
    submissionId: string
  ): Promise<{ data: FileUrl[]; message?: string }> {
    try {
      const response = await apiService.auth.get<FileUrl[]>(
        `/hackathon-service/api/v1/files?submissionId=${submissionId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve file URLs");
      }

      return {
        data: response.data,
        message: response.message || "File URLs retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<FileUrl[]>(
        error,
        [],
        "[File URL Service] Error fetching file URLs by submission ID:"
      );
    }
  }

  async deleteFileUrl(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/communication-service/api/v1/file-urls/${id}`
      );

      return {
        message: response.message || "File URL deleted successfully",
      };
    } catch (error: any) {
      return handleApiError<void>(
        error,
        undefined,
        "[File URL Service] Error deleting file URL:"
      );
    }
  }
}

export const fileUrlService = new FileUrlService();

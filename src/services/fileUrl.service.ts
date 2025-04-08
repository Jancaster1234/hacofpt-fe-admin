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
        "/hackathon-service/api/v1/upload/multiple",
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
}

export const fileUrlService = new FileUrlService();

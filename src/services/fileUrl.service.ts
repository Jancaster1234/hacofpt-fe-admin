import { FileUrl } from "@/types/entities/fileUrl";
import { tokenService_v0 } from "@/services/token.service_v0";
import { handleApiError } from "@/utils/errorHandler";

class FileUrlService {
  async uploadFile(file: File): Promise<{ data: FileUrl; message?: string }> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/hackathon-service/api/v1/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!responseData || !responseData.data) {
        throw new Error(responseData?.message || "Failed to upload file");
      }

      return {
        data: responseData.data,
        message: responseData.message || "File uploaded successfully",
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
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "/hackathon-service/api/v1/upload/multiple",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!responseData || !responseData.data) {
        throw new Error(responseData?.message || "Failed to upload files");
      }

      return {
        data: responseData.data,
        message: responseData.message || "Files uploaded successfully",
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
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "/communication-service/api/v1/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!responseData || !responseData.data) {
        throw new Error(responseData?.message || "Failed to upload files");
      }

      return {
        data: responseData.data,
        message: responseData.message || "Files uploaded successfully",
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

// src/services/role.service.ts
import { apiService } from "@/services/apiService_v0";
import { Role } from "@/types/entities/role";
import { handleApiError } from "@/utils/errorHandler";

class RoleService {
  async getAllRoles(): Promise<{ data: Role[]; message?: string }> {
    try {
      // Add abortPrevious: false to prevent this request from being canceled
      // when other requests are made
      const response = await apiService.auth.get<Role[]>(
        "/identity-service/api/v1/roles",
        undefined,
        30000, // Extend timeout to 30 seconds
        false // Don't abort previous requests with the same endpoint
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve roles");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      console.error("Role service error:", error);
      return handleApiError<Role[]>(error, [], "Error fetching all roles:");
    }
  }
}

export const roleService = new RoleService();

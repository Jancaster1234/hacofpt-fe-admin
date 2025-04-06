// src/services/role.service.ts
import { apiService } from "@/services/apiService_v0";
import { Role } from "@/types/entities/role";
import { handleApiError } from "@/utils/errorHandler";

class RoleService {
  async getAllRoles(): Promise<{ data: Role[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Role[]>(
        "/identity-service/api/v1/roles"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve roles");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Role[]>(error, [], "Error fetching all roles:");
    }
  }
}

export const roleService = new RoleService();

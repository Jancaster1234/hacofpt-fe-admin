// src/services/role.service.ts
import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";
import { Role } from "@/types/entities/role";

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
      return handleApiError<Role[]>(error, [], "[Role Service] Get All Error:");
    }
  }

  async getRoleById(id: string): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.get<Role>(
        `/identity-service/api/v1/roles/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Role not found");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Error getting role by ID:"
      );
    }
  }

  async getRoleFromToken(): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.get<Role>(
        "/identity-service/api/v1/roles/role-from-token"
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve role from token"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Error getting role from token:"
      );
    }
  }

  async createRole(data: {
    name: string;
    description?: string;
    permissions?: string[]; //list permission id
  }): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.post<Role>(
        "/identity-service/api/v1/roles",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create role");
      }

      return {
        data: response.data,
        message: response.message || "Role created successfully",
      };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Error creating role:"
      );
    }
  }

  async updateRole(data: {
    id: string;
    description?: string;
    permissions?: string[]; //list permission id
  }): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.put<Role>(
        `/identity-service/api/v1/roles/${data.id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update role");
      }

      return {
        data: response.data,
        message: response.message || "Role updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Error updating role:"
      );
    }
  }

  async deleteRole(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/identity-service/api/v1/roles/${id}`
      );

      return {
        message: response.message || "Role deleted successfully",
      };
    } catch (error: any) {
      console.error("[Role Service] Error deleting role:", error.message);
      throw error;
    }
  }
}

export const roleService = new RoleService();

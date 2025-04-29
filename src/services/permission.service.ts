// src/services/permission.service.ts
import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";
import { Permission } from "@/types/entities/permission";

class PermissionService {
  async getAllPermissions(): Promise<{ data: Permission[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Permission[]>(
        "/identity-service/api/v1/permissions"
      );

      if (!response || !response.data) {
        throw new Error("No permissions found");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Permission[]>(
        error,
        [],
        "[Permission Service] Error getting permissions:"
      );
    }
  }

  async getPermissionById(
    id: string
  ): Promise<{ data: Permission; message?: string }> {
    try {
      const response = await apiService.auth.get<Permission>(
        `/identity-service/api/v1/permissions/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Permission not found");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<Permission>(
        error,
        {} as Permission,
        "[Permission Service] Error getting permission by ID:"
      );
    }
  }

  async createPermission(data: {
    name: string;
    apiPath?: string;
    method?: string;
    module?: string;
  }): Promise<{ data: Permission; message?: string }> {
    try {
      const response = await apiService.auth.post<Permission>(
        "/identity-service/api/v1/permissions",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create permission");
      }

      return {
        data: response.data,
        message: response.message || "Permission created successfully",
      };
    } catch (error: any) {
      return handleApiError<Permission>(
        error,
        {} as Permission,
        "[Permission Service] Error creating permission:"
      );
    }
  }

  async updatePermission(data: {
    id: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;
  }): Promise<{ data: Permission; message?: string }> {
    try {
      const response = await apiService.auth.put<Permission>(
        `/identity-service/api/v1/permissions/${data.id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update permission");
      }

      return {
        data: response.data,
        message: response.message || "Permission updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Permission>(
        error,
        {} as Permission,
        "[Permission Service] Error updating permission:"
      );
    }
  }

  async deletePermission(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/identity-service/api/v1/permissions/${id}`
      );

      return {
        message: response.message || "Permission deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Permission Service] Error deleting permission:",
        error.message
      );
      throw error;
    }
  }

  async deletePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/identity-service/api/v1/permissions/${roleId}/permissions/${permissionId}`
      );

      return {
        message:
          response.message || "Permission removed from role successfully",
      };
    } catch (error: any) {
      console.error(
        "[Permission Service] Error removing permission from role:",
        error.message
      );
      throw error;
    }
  }
}

export const permissionService = new PermissionService();

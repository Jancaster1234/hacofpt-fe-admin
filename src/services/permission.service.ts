import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";
import { Permission } from "@/types/entities/permission";

class PermissionService {
  async getAll(): Promise<{ data: Permission[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Permission[]>(
        "/identity-service/api/v1/permissions"
      );
      if (!response?.data) throw new Error("No permissions found");
      return { data: response.data, message: response.message };
    } catch (error: any) {
      return handleApiError<Permission[]>(
        error,
        [],
        "[Permission Service] Get All Error:"
      );
    }
  }

  async getById(id: number): Promise<{ data: Permission; message?: string }> {
    try {
      const response = await apiService.auth.get<Permission>(
        `/identity-service/api/v1/permissions/${id}`
      );
      if (!response?.data) throw new Error("Permission not found");
      return { data: response.data, message: response.message };
    } catch (error: any) {
      return handleApiError<Permission>(
        error,
        {} as Permission,
        "[Permission Service] Get By ID Error:"
      );
    }
  }

  async create(data: {
    name: string;
    apiPath?: string;
    method?: string;
    module?: string;
  }): Promise<{ data: Permission; message?: string }> {
    try {
      const response = await apiService.auth.post<Permission>(
        "/identity-service/api/v1/permissions",
        { data }
      );
      if (!response?.data) throw new Error("Failed to create permission");
      return {
        data: response.data,
        message: response.message || "Permission created successfully",
      };
    } catch (error: any) {
      return handleApiError<Permission>(
        error,
        {} as Permission,
        "[Permission Service] Create Error:"
      );
    }
  }

  async update(
    id: number,
    data: {
      name?: string;
      apiPath?: string;
      method?: string;
      module?: string;
    }
  ): Promise<{ data: Permission; message?: string }> {
    try {
      const response = await apiService.auth.put<Permission>(
        `/identity-service/api/v1/permissions/${id}`,
        data
      );
      if (!response?.data) throw new Error("Failed to update permission");
      return {
        data: response.data,
        message: response.message || "Permission updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Permission>(
        error,
        {} as Permission,
        "[Permission Service] Update Error:"
      );
    }
  }

  async delete(id: number): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/identity-service/api/v1/permissions/${id}`
      );
      return { message: response.message || "Permission deleted successfully" };
    } catch (error: any) {
      console.error("[Permission Service] Delete Error:", error.message);
      throw error;
    }
  }

  async deleteFromRole(
    roleId: number,
    permissionId: number
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
        "[Permission Service] Delete From Role Error:",
        error.message
      );
      throw error;
    }
  }
}

export const permissionService = new PermissionService();

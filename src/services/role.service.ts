import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";
import { Role } from "@/types/entities/role";

class RoleService {
  async getAll(): Promise<{ data: Role[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Role[]>(
        "/identity-service/api/v1/roles"
      );
      if (!response?.data) throw new Error("No roles found");
      return { data: response.data, message: response.message };
    } catch (error: any) {
      return handleApiError<Role[]>(error, [], "[Role Service] Get All Error:");
    }
  }

  async getById(id: number): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.get<Role>(
        `/identity-service/api/v1/roles/${id}`
      );
      if (!response?.data) throw new Error("Role not found");
      return { data: response.data, message: response.message };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Get By ID Error:"
      );
    }
  }

  async getFromToken(): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.get<Role>(
        "/identity-service/api/v1/roles/role-from-token"
      );
      if (!response?.data)
        throw new Error("Failed to retrieve role from token");
      return { data: response.data, message: response.message };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Get From Token Error:"
      );
    }
  }

  async create(data: {
    name: string;
    description?: string;
  }): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.post<Role>(
        "/identity-service/api/v1/roles",
        { data }
      );
      if (!response?.data) throw new Error("Failed to create role");
      return {
        data: response.data,
        message: response.message || "Role created successfully",
      };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Create Error:"
      );
    }
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
    }
  ): Promise<{ data: Role; message?: string }> {
    try {
      const response = await apiService.auth.put<Role>(
        `/identity-service/api/v1/roles/${id}`,
        data
      );
      if (!response?.data) throw new Error("Failed to update role");
      return {
        data: response.data,
        message: response.message || "Role updated successfully",
      };
    } catch (error: any) {
      return handleApiError<Role>(
        error,
        {} as Role,
        "[Role Service] Update Error:"
      );
    }
  }

  async delete(id: number): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/identity-service/api/v1/roles/${id}`
      );
      return { message: response.message || "Role deleted successfully" };
    } catch (error: any) {
      console.error("[Role Service] Delete Error:", error.message);
      throw error;
    }
  }
}

export const roleService = new RoleService();

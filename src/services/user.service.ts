// src/services/user.service.ts
import { apiService } from "@/services/apiService_v0";
import { User } from "@/types/entities/user";
import { handleApiError } from "@/utils/errorHandler";

class UserService {
  async getUserById(userId: string): Promise<{ data: User; message?: string }> {
    try {
      const response = await apiService.auth.get<User>(
        `/identity-service/api/v1/users/${userId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User>(
        error,
        {} as User,
        "Error fetching user by ID:"
      );
    }
  }

  async getAllUsers(): Promise<{ data: User[]; message?: string }> {
    try {
      const response = await apiService.auth.get<User[]>(
        "/identity-service/api/v1/users"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve users");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User[]>(error, [], "Error fetching all users:");
    }
  }

  async getUsersByRoles(): Promise<{ data: User[]; message?: string }> {
    try {
      const response = await apiService.auth.get<User[]>(
        "/identity-service/api/v1/users/users-by-roles"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve users by roles");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User[]>(
        error,
        [],
        "Error fetching users by roles:"
      );
    }
  }

  async getTeamMembers(): Promise<{ data: User[]; message?: string }> {
    try {
      const response = await apiService.auth.get<User[]>(
        "/identity-service/api/v1/users/team-members"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team members");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User[]>(error, [], "Error fetching team members:");
    }
  }

  async getUserByUsername(
    username: string
  ): Promise<{ data: User; message?: string }> {
    try {
      const response = await apiService.auth.get<User>(
        `/identity-service/api/v1/users/username/${username}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user by username");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User>(
        error,
        {} as User,
        "Error fetching user by username:"
      );
    }
  }

  async getUsersByCreatedUserName(
    createdUserName: string
  ): Promise<{ data: User[]; message?: string }> {
    try {
      const response = await apiService.auth.get<User[]>(
        `/identity-service/api/v1/users/users-by-created-by/${createdUserName}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve users by created username");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User[]>(
        error,
        [],
        "Error fetching users by createdUserName:"
      );
    }
  }

  async getCurrentUser(): Promise<{ data: User; message?: string }> {
    try {
      const response = await apiService.auth.get<User>(
        `/identity-service/api/v1/users/my-info`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve current user info");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User>(
        error,
        {} as User,
        "Error fetching current user info:"
      );
    }
  }

  async createUser(data: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    userRoles: {
      roleId: string;
    }[];
  }): Promise<{ data: User; message?: string }> {
    try {
      const response = await apiService.auth.post<User>(
        "/identity-service/api/v1/users",
        data
      );

      if (!response || !response.data) {
        throw new Error("Failed to create user");
      }

      return {
        data: response.data,
        message: response.message || "User created successfully",
      };
    } catch (error: any) {
      return handleApiError<User>(error, {} as User, "Error creating user:");
    }
  }

  async updateUser(
    userId: string,
    data: {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      userRoles: {
        roleId: string;
      }[];
    }
  ): Promise<{ data: User; message?: string }> {
    try {
      const response = await apiService.auth.put<User>(
        `/identity-service/api/v1/users/${userId}`,
        data
      );

      if (!response || !response.data) {
        throw new Error("Failed to update user");
      }

      return {
        data: response.data,
        message: response.message || "User updated successfully",
      };
    } catch (error: any) {
      return handleApiError<User>(error, {} as User, "Error updating user:");
    }
  }
}

export const userService = new UserService();

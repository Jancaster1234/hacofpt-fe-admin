// src/services/user.service.ts
import { apiService } from "@/services/apiService_v0";
import { User } from "@/types/entities/user";

type UserPayload = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  userRoles: {
    roleId: string;
  }[];
};

class UserService {
  async getUserById(userId: string): Promise<Partial<User>> {
    try {
      const response = await apiService.auth.get<Partial<User>>(
        `/identity-service/api/v1/users/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    try {
      const response = await apiService.auth.get<Partial<User>[]>(
        "/identity-service/api/v1/users"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  async getUsersByRoles(): Promise<Partial<User>[]> {
    try {
      const response = await apiService.auth.get<Partial<User>[]>(
        "/identity-service/api/v1/users/users-by-roles"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users by roles:", error);
      throw error;
    }
  }

  async getTeamMembers(): Promise<Partial<User>[]> {
    try {
      const response = await apiService.auth.get<Partial<User>[]>(
        "/identity-service/api/v1/users/team-members"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<Partial<User>> {
    try {
      const response = await apiService.auth.get<Partial<User>>(
        `/identity-service/api/v1/users/username/${username}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async getUsersByCreatedUserName(
    createdUserName: string
  ): Promise<Partial<User>[]> {
    try {
      const response = await apiService.auth.get<Partial<User>[]>(
        `/identity-service/api/v1/users/users-by-created-by/${createdUserName}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users by createdUserName:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.auth.get<User>(
        `/identity-service/api/v1/users/my-info`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current user info:", error);
      throw error;
    }
  }

  async createUser(data: UserPayload): Promise<User> {
    try {
      const response = await apiService.auth.post<User>(
        "/identity-service/api/v1/users",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(userId: string, data: UserPayload): Promise<User> {
    try {
      const response = await apiService.auth.put<User>(
        `/identity-service/api/v1/users/${userId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

export const userService = new UserService();

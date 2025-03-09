// src/services/auth.service.ts
import { apiService } from "@/services/apiService";
import { User } from "@/types/entities/users";

interface LoginResponse {
  accessToken: string;
}

class AuthService {
  async getUser(): Promise<User> {
    return apiService.auth.get<User>("/auth/me");
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiService.public.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.auth.post("/auth/logout", {});
    } catch (error) {
      console.warn("Logout request failed:", error);
    }
  }
}

export const authService = new AuthService();

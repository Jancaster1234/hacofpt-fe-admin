// src/services/auth.service_v0.ts
import { apiService } from "@/services/apiService_v0";
import { User } from "@/types/entities/user";
interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string };
}

class AuthService_v0 {
  async getUser(): Promise<User> {
    return apiService.auth.get<User>("/auth/me_v0");
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return await apiService.public.post<AuthResponse>("/auth/login_v0", {
      email,
      password,
    });
  }

  async refreshToken(accessToken: string): Promise<string | null> {
    try {
      const response = await apiService.public.post<{ accessToken: string }>(
        "/auth/refresh_v0",
        {
          accessToken,
        }
      );
      return response.accessToken;
    } catch {
      return null;
    }
  }

  async logout(accessToken: string): Promise<void> {
    await apiService.auth.post("/auth/logout_v0", { accessToken });
  }
}

export const authService_v0 = new AuthService_v0();

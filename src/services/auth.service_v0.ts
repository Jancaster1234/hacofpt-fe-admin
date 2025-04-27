// src/services/auth.service_v0.ts
import { apiService } from "@/services/apiService_v0";
import { ApiResponse } from "@/services/apiService_v0";
import { User } from "@/types/entities/user";
import { handleApiError } from "@/utils/errorHandler";

interface AuthResponseData {
  token: string;
  authenticated: boolean;
}

class AuthService_v0 {
  /**
   * Get current user information
   * @returns User information and message
   */
  async getUser(): Promise<{ data: User; message?: string }> {
    try {
      const response = await apiService.auth.get<User>(
        "/identity-service/api/v1/users/my-info"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve user information");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<User>(
        error,
        {} as User,
        "[Auth Service] Error getting user info:"
      );
    }
  }

  /**
   * Login user
   * @param username
   * @param password
   * @returns Authentication response with token and message
   */
  async login(
    username: string,
    password: string
  ): Promise<{
    data: { token: string; authenticated: boolean };
    message?: string;
  }> {
    try {
      const response = await apiService.public.post<AuthResponseData>(
        "/identity-service/api/v1/auth/token",
        { username, password }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Login failed");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<{ token: string; authenticated: boolean }>(
        error,
        { token: "", authenticated: false },
        "[Auth Service] Login error:"
      );
    }
  }

  /**
   * Logout user
   * @param token Current user token
   * @returns Message from the logout response
   */
  async logout(token: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.post(
        "/identity-service/api/v1/auth/logout",
        { token },
        undefined,
        5000, // shorter timeout
        false // don't abort previous requests
      );

      // Clear all in-flight requests when logging out
      apiService.cancelAllRequests("User logged out");

      console.log("[Auth Service] User successfully logged out");
      return { message: response.message || "Successfully logged out" };
    } catch (error: any) {
      console.error("[Auth Service] Logout error:", error.message);
      console.log(
        "[Auth Service] Continuing with client-side logout despite API error"
      );
      return { message: "Client-side logout completed with API error" };
    }
  }

  /**
   * Check if user is authenticated (token exists and not expired)
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    // Placeholder: Add real validation later
    const token = localStorage.getItem("accessToken");
    return !!token;
  }
}

export const authService_v0 = new AuthService_v0();

// src/services/auth.service_v0.ts
import { apiService } from "@/services/apiService_v0";
import { ApiResponse } from "@/services/apiService_v0"; // Import the updated interface
import { User } from "@/types/entities/user";

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
      console.error("[Auth Service] Error getting user info:", error.message);
      // If the error is due to component unmount, don't rethrow
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return { data: {} as User, message: "Request aborted" };
      }
      throw error;
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
        {
          username,
          password,
        }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Login failed");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      console.error("[Auth Service] Login error:", error.message);

      // Extract error message if available
      let errorMessage = "Login failed";
      if (error.message && error.message.includes("Response:")) {
        try {
          const jsonMatch = error.message.match(/Response:(.+)/);
          if (jsonMatch) {
            const errorJson = JSON.parse(jsonMatch[1].trim());
            errorMessage = errorJson.message || errorMessage;
          }
        } catch (e) {
          // If parsing fails, use the original error message
        }
      }

      throw new Error(errorMessage);
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
        5000, // Use shorter timeout for logout
        false // Don't abort previous requests
      );

      // Clear all in-flight requests when logging out
      apiService.cancelAllRequests("User logged out");

      console.log("[Auth Service] User successfully logged out");
      return { message: response.message || "Successfully logged out" };
    } catch (error: any) {
      console.error("[Auth Service] Logout error:", error.message);
      // Even if logout fails, we consider the user logged out on the client side
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
    // This is a placeholder - you'd need to implement actual token validation logic
    const token = localStorage.getItem("accessToken");
    return !!token; // Simple check if token exists
  }
}

export const authService_v0 = new AuthService_v0();

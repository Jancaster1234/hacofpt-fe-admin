// src/services/token.service.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
import { useAuthStore } from "@/store/authStore";

class TokenService {
  async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        useAuthStore.getState().setAuth({ accessToken: data.accessToken });
        console.warn("Access token successfully refreshed.");
        return data.accessToken;
      } else {
        console.warn("Token refresh failed. User must re-login.");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }
}

export const tokenService = new TokenService();

// src/services/token.service_v0.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

class TokenService_v0 {
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  setAccessToken(token: string | null): void {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  async refreshToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh_v0`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.accessToken);
        console.warn("Access token successfully refreshed (v0).");
        return data.accessToken;
      } else {
        console.warn("Token refresh failed (v0). User must re-login.");
        this.setAccessToken(null);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token (v0):", error);
      return null;
    }
  }
}

export const tokenService_v0 = new TokenService_v0();

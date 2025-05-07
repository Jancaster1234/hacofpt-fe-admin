// src/services/token.service_v0.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

class TokenService_v0 {
  private refreshPromise: Promise<string | null> | null = null;

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

  /**
   * Refreshes the access token, using a singleton promise to prevent multiple concurrent refresh attempts
   */
  async refreshToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    // If there's already a refresh in progress, return that promise instead of creating a new request
    if (this.refreshPromise) {
      console.log(
        "[Token] Using existing refresh promise to prevent duplicate requests"
      );
      return this.refreshPromise;
    }

    // Create the refresh promise
    this.refreshPromise = (async () => {
      try {
        console.log("[Token] Starting token refresh...");
        const response = await fetch(
          `${API_BASE_URL}/identity-service/api/v1/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: accessToken }),
            // Add a reasonable timeout
            signal: AbortSignal.timeout(10000), // 10 seconds timeout
          }
        );

        console.log("[Token] Refresh response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          if (data?.data?.token) {
            this.setAccessToken(data.data.token);
            console.log("[Token] Access token successfully refreshed");
            return data.data.token;
          } else {
            console.warn("[Token] Refresh response missing token in data");
            this.setAccessToken(null);
            return null;
          }
        } else {
          // Handle specific error codes
          if (response.status === 400) {
            console.warn("[Token] Invalid refresh token (400 Bad Request)");
          } else if (response.status === 401) {
            console.warn("[Token] Expired refresh token (401 Unauthorized)");
          } else {
            console.warn(
              `[Token] Refresh failed with status: ${response.status}`
            );
          }

          // Log response body for debugging
          try {
            const errorBody = await response.text();
            console.error("[Token] Refresh error response:", errorBody);
          } catch (e) {
            // Ignore error reading body
          }

          this.setAccessToken(null);
          return null;
        }
      } catch (error) {
        console.error("[Token] Error during token refresh:", error);
        this.setAccessToken(null);
        return null;
      } finally {
        // Reset the promise after a small delay to prevent immediate retries
        setTimeout(() => {
          this.refreshPromise = null;
        }, 1000);
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Clear all auth state when logging out
   */
  clearAuth(): void {
    this.setAccessToken(null);
    this.refreshPromise = null;
    // Clear any other auth-related storage if needed
  }
}

export const tokenService_v0 = new TokenService_v0();

// src/hooks/useAuth.ts
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { useEffect } from "react";

export function useAuth() {
  const { user, accessToken, loading, setAuth } = useAuthStore();

  useEffect(() => {
    if (loading) {
      checkUser();
    }
  }, [loading]);

  const login = async (email: string, password: string) => {
    setAuth({ loading: true });
    try {
      const response = await authService.login(email, password);
      setAuth({ accessToken: response.accessToken });
      const user = await authService.getUser();
      setAuth({ user });
    } catch (error) {
      console.error("Login failed:", error);
      setAuth({ user: null, accessToken: null });
    } finally {
      setAuth({ loading: false });
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuth({ user: null, accessToken: null });
  };

  const checkUser = async () => {
    setAuth({ loading: true });
    try {
      const user = await authService.getUser();
      setAuth({ user });
    } catch (error) {
      setAuth({ user: null, accessToken: null });
    } finally {
      setAuth({ loading: false });
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const newToken = await tokenService.refreshToken();
    if (newToken) {
      setAuth({ accessToken: newToken });
    }
    return newToken;
  };

  return {
    user,
    accessToken,
    loading,
    login,
    logout,
    checkUser,
    refreshAccessToken,
  };
}

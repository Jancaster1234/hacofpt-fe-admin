// src/hooks/useAuth_v0.ts
import { useAuthStore } from "@/store/authStore";
import { authService_v0 } from "@/services/auth.service_v0";

export function useAuth() {
  const {
    user,
    loading,
    message,
    messageType,
    setAuth,
    setMessage,
    clearMessage,
  } = useAuthStore();

  const login = async (username: string, password: string) => {
    setAuth({ loading: true });
    clearMessage(); // Clear any previous messages

    try {
      const { data: response, message: apiMessage } =
        await authService_v0.login(username, password);
      console.log("🔹 Login response:", response);
      console.log("🔹 API message:", apiMessage);

      if (!response.token) {
        console.error("❌ No accessToken received from login response");
        throw new Error("No accessToken received");
      }

      console.log("🔹 Storing accessToken in localStorage:", response.token);
      localStorage.setItem("accessToken", response.token);

      const { data: userData, message: userMessage } =
        await authService_v0.getUser();
      console.log("🔹 User data after login:", userData);
      console.log("🔹 User API message:", userMessage);

      // Store user data and display success message
      setAuth({ user: userData });
      setMessage(apiMessage || "Successfully logged in", "success");

      return { success: true, message: apiMessage };
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      localStorage.removeItem("accessToken");
      setAuth({ user: null });

      // Set error message in the store
      setMessage(error.message || "Login failed", "error");

      return { success: false, message: error.message };
    } finally {
      setAuth({ loading: false });
    }
  };

  const logout = async () => {
    clearMessage(); // Clear any previous messages
    setAuth({ loading: true });

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const { message: apiMessage } =
          await authService_v0.logout(accessToken);
        console.log("🔹 Logout message:", apiMessage);
        setMessage(apiMessage || "Successfully logged out", "success");
        return { success: true, message: apiMessage };
      }

      setMessage("You have been logged out", "info");
      return { success: true, message: "Logged out successfully" };
    } catch (error: any) {
      console.error("❌ Logout failed:", error);
      setMessage(error.message || "Logout encountered an error", "error");
      return { success: false, message: error.message };
    } finally {
      localStorage.removeItem("accessToken");
      setAuth({ user: null, loading: false });
    }
  };

  const checkUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("❌ No accessToken, skipping checkUser");
      setAuth({ user: null, loading: false });
      return { success: false, message: "No access token found" };
    }

    setAuth({ loading: true });
    try {
      console.log("🔹 Fetching user with accessToken:", accessToken);
      const { data: userData, message: apiMessage } =
        await authService_v0.getUser();
      console.log("🔹 Fetched user:", userData);
      console.log("🔹 API message:", apiMessage);

      setAuth({ user: userData, loading: false });

      // Only set message if there's something noteworthy
      if (apiMessage) {
        setMessage(apiMessage, "info");
      }

      return { success: true, message: apiMessage };
    } catch (error: any) {
      console.error("❌ Failed to fetch user:", error);
      localStorage.removeItem("accessToken");
      setAuth({ user: null, loading: false });

      // Only set error message on actual errors, not on session expiration
      if (!error.message.includes("component unmounted")) {
        setMessage(
          error.message || "Failed to retrieve user information",
          "error"
        );
      }

      return { success: false, message: error.message };
    }
  };

  // Add a function to directly work with messages
  const displayMessage = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setMessage(message, type);
  };

  return {
    user,
    loading,
    message,
    messageType,
    login,
    logout,
    checkUser,
    displayMessage,
    clearMessage,
  };
}

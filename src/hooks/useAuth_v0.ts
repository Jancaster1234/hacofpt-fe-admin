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
      // console.log("🔹 Login response:", response);
      // console.log("🔹 API message:", apiMessage);

      if (!response.token) {
        // console.error("❌ No accessToken received from login response");
        throw new Error("No accessToken received");
      }

      // Temporarily store token to fetch user data
      // console.log("🔹 Temporarily storing accessToken to check user data");
      localStorage.setItem("accessToken", response.token);

      const { data: userData, message: userMessage } =
        await authService_v0.getUser();
      // console.log("🔹 User data after login:", userData);
      // console.log("🔹 User API message:", userMessage);

      // Check if user has authorized roles
      const authorizedRoles = ["ORGANIZER", "JUDGE", "MENTOR", "DEMO", "ADMIN"];
      const userRoles = userData.userRoles?.map((ur) => ur.role?.name) || [];
      const hasAuthorizedRole = userRoles.some((role) =>
        authorizedRoles.includes(role)
      );

      if (!hasAuthorizedRole) {
        // console.error("❌ User doesn't have required authorization");
        localStorage.removeItem("accessToken");
        throw new Error(
          "You don't have the required authorization to access this application"
        );
      }

      // User has proper role, keep the token in localStorage
      // console.log(
      //   "🔹 User has authorized role, storing accessToken:",
      //   response.token
      // );

      // Store user data and display success message
      setAuth({ user: userData });
      setMessage(apiMessage || "Successfully logged in", "success");

      return { success: true, message: apiMessage };
    } catch (error: any) {
      // console.error("❌ Login failed:", error);
      localStorage.removeItem("accessToken");
      setAuth({ user: null });

      // Set error message in the store
      setMessage(error.message || "Login failed", "error");

      // Rethrow the error to be caught by the caller
      throw error;
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
        // console.log("🔹 Logout message:", apiMessage);
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

  const checkUser = async (skipIfNoToken = true) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && skipIfNoToken) {
      // console.warn("❌ No accessToken, skipping checkUser");
      setAuth({ user: null, loading: false });
      return { success: false, message: "No access token found" };
    }

    setAuth({ loading: true });
    try {
      // console.log("🔹 Fetching user with accessToken:", accessToken);
      const { data: userData, message: apiMessage } =
        await authService_v0.getUser();
      // console.log("🔹 Fetched user:", userData);
      // console.log("🔹 API message:", apiMessage);

      // Check if userData is empty object or actually has properties
      if (userData && Object.keys(userData).length > 0) {
        // Verify user still has authorized role
        const authorizedRoles = [
          "ORGANIZER",
          "JUDGE",
          "MENTOR",
          "DEMO",
          "ADMIN",
        ];
        const userRoles = userData.userRoles?.map((ur) => ur.role?.name) || [];
        const hasAuthorizedRole = userRoles.some((role) =>
          authorizedRoles.includes(role)
        );

        if (!hasAuthorizedRole) {
          // console.error("❌ User no longer has required authorization");
          localStorage.removeItem("accessToken");
          setAuth({ user: null, loading: false });
          setMessage(
            "You don't have the required authorization to access this application",
            "error"
          );
          return { success: false, message: "Unauthorized user role" };
        }

        setAuth({ user: userData, loading: false });
      } else {
        // If we get an empty object (which happens with aborted requests), don't update user
        // This prevents treating an empty user object as authenticated but without roles
        setAuth({ loading: false });
        return { success: false, message: "Empty user data received" };
      }

      // Only set message if there's something noteworthy
      if (apiMessage) {
        setMessage(apiMessage, "info");
      }

      return { success: true, message: apiMessage };
    } catch (error: any) {
      // console.error("❌ Failed to fetch user:", error);

      // Only remove accessToken for authentication errors (401 Unauthorized, 403 Forbidden)
      // Don't remove for network errors or other temporary issues
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.message?.includes("unauthorized") ||
        error.message?.includes("forbidden") ||
        error.message?.includes("invalid token")
      ) {
        // console.warn("🔹 Authentication error detected, removing token");
        localStorage.removeItem("accessToken");
      } else {
        // console.warn("🔹 Non-authentication error, preserving token for retry");
      }

      setAuth({ user: null, loading: false });

      // Only set error message on actual errors, not on session expiration
      if (!error.message?.includes("component unmounted")) {
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

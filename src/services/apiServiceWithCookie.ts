// src/services/apiServiceWithCookie.ts
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface ApiResponse<T> {
  data: T;
  error?: string;
}

const controllers = new Map<string, AbortController>();

/**
 * Generic function to handle API requests.
 */
async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  endpoint: string,
  payload?: Record<string, any>,
  customHeaders: HeadersInit = {},
  includeCredentials: boolean = false, // Flag to control credentials
  timeoutMs: number = 5000, // Default timeout, can be overridden
  retry: boolean = true
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // Add request cancellation
  if (controllers.has(endpoint)) {
    controllers.get(endpoint)?.abort();
  }
  const controller = new AbortController();
  controllers.set(endpoint, controller);

  const options: RequestInit = {
    method,
    headers,
    credentials: includeCredentials ? "include" : "omit", // Uses credentials only for auth requests
    signal: controller.signal,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  // Set timeout
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeout); // Clear timeout when response is received

    if (includeCredentials && response.status === 401 && retry) {
      console.warn(
        `Token expired on ${method} ${endpoint}. Attempting refresh...`
      );
      // Use authStore's refreshToken which includes attempt tracking
      const refreshed = await useAuthStore.getState().refreshToken();
      if (refreshed) {
        return request<T>(
          method,
          endpoint,
          payload,
          customHeaders,
          true,
          timeoutMs,
          false
        );
      }
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP Error ${response.status} on ${method} ${endpoint}`
      );
    }

    return data.data;
  } catch (error: any) {
    handleGlobalError(error, method, endpoint);
    throw error;
  } finally {
    controllers.delete(endpoint); // Cleanup
  }
}

/**
 * Centralized global error handler
 */
function handleGlobalError(error: any, method: string, endpoint: string) {
  console.error(`API Error in ${method} ${endpoint}:`, error);

  if (error.message.includes("Failed to fetch")) {
    alert("Network error! Please check your internet connection.");
  } else if (error.message.includes("401")) {
    alert("Session expired. Refresh token failed. Please log in again.");
  } else if (error.message.includes("Request timed out")) {
    alert("Request timed out. Please try again.");
  }
}

/**
 * API service with separate authenticated & public requests.
 */
export const apiService = {
  auth: {
    get: <T>(endpoint: string, headers?: HeadersInit, timeoutMs?: number) =>
      request<T>("GET", endpoint, undefined, headers, true, timeoutMs),
    post: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number
    ) => request<T>("POST", endpoint, payload, headers, true, timeoutMs),
    patch: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number
    ) => request<T>("PATCH", endpoint, payload, headers, true, timeoutMs),
    delete: <T>(endpoint: string, headers?: HeadersInit, timeoutMs?: number) =>
      request<T>("DELETE", endpoint, undefined, headers, true, timeoutMs),
  },
  public: {
    get: <T>(endpoint: string, headers?: HeadersInit, timeoutMs?: number) =>
      request<T>("GET", endpoint, undefined, headers, false, timeoutMs),
    post: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number
    ) => request<T>("POST", endpoint, payload, headers, false, timeoutMs),
    patch: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number
    ) => request<T>("PATCH", endpoint, payload, headers, false, timeoutMs),
    delete: <T>(endpoint: string, headers?: HeadersInit, timeoutMs?: number) =>
      request<T>("DELETE", endpoint, undefined, headers, false, timeoutMs),
  },
  cancelRequest: (endpoint: string) => {
    if (controllers.has(endpoint)) {
      controllers.get(endpoint)?.abort();
      controllers.delete(endpoint);
    }
  },
};

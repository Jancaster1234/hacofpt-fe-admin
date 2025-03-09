// src/services/apiService_v0.ts

import { tokenService_v0 } from "@/services/token.service_v0";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

const controllers = new Map<string, AbortController>();

/**
 * Generic function to handle API requests.
 */
async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  endpoint: string,
  payload?: Record<string, any>,
  customHeaders: HeadersInit = {},
  useAuthHeader: boolean = false, // Toggle for Authorization header
  timeoutMs: number = 5000, // Default timeout
  retry: boolean = true
): Promise<T> {
  const accessToken = tokenService_v0.getAccessToken();
  console.log("🔹 accessToken in apiService:", accessToken);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (useAuthHeader && accessToken) {
    Object.assign(headers, { Authorization: `Bearer ${accessToken}` });
  }

  console.log("🔹 Final headers in request:", headers); // <== ADD THIS

  // Add request cancellation
  if (controllers.has(endpoint)) {
    controllers.get(endpoint)?.abort();
    console.log(`[API] Aborting previous request to: ${endpoint}`);
  }
  const controller = new AbortController();
  controllers.set(endpoint, controller);

  const options: RequestInit = {
    method,
    headers,
    signal: controller.signal,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  console.log(`[API] ${method} ${endpoint} - Initiating request`, {
    payload,
    headers,
  });

  // Set timeout
  const timeout = setTimeout(() => {
    console.warn(`[API] Request timeout: ${method} ${endpoint}`);
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeout); // Clear timeout when response is received

    console.log(`[API] ${method} ${endpoint} - Response received`, {
      status: response.status,
    });

    if (useAuthHeader && response.status === 401 && retry) {
      await new Promise((res) => setTimeout(res, 500));
      console.warn(
        `[API] Token expired on ${method} ${endpoint}. Attempting refresh...`
      );

      const newToken = await tokenService_v0.refreshToken();

      if (newToken) {
        console.log(`[API] Retrying ${method} ${endpoint} with new token`);
        return request<T>(
          method,
          endpoint,
          payload,
          customHeaders,
          true,
          timeoutMs,
          false
        );
      } else {
        console.warn("Token refresh failed. User must log in again.");
        throw new Error("Unauthorized - Token refresh failed.");
      }
    }

    const data: T = await response.json();

    if (!response.ok) {
      console.error(
        `[API] ${method} ${endpoint} - HTTP Error ${response.status}`
      );

      throw new Error(
        `Request to ${method} ${endpoint} failed with status ${
          response.status
        }. Response body: ${JSON.stringify(data)}`
      );
    }

    console.log(`[API] ${method} ${endpoint} - Success`, data);
    return data;
  } catch (error: any) {
    console.error(`[API] ${method} ${endpoint} - Error`, error);
    handleGlobalError(error, method, endpoint);
    throw error;
  } finally {
    controllers.delete(endpoint); // Cleanup
    console.log(`[API] ${method} ${endpoint} - Request cleanup`);
  }
}

/**
 * Centralized global error handler
 */
function handleGlobalError(error: any, method: string, endpoint: string) {
  console.error(`[API] Error in ${method} ${endpoint}:`, error.message);

  if (error.message.includes("Failed to fetch")) {
    alert("Network error! Please check your internet connection.");
  } else if (error.message.includes("401")) {
    alert("Session expired. Refresh token failed. Please log in again.");
  } else if (error.message.includes("Request timed out")) {
    alert("Request timed out. Please try again.");
  }
}

/**
 * API service with categorized requests.
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

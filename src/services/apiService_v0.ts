// src/services/apiService_v0.ts
import { tokenService_v0 } from "@/services/token.service_v0";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

const controllers = new Map<string, AbortController>();

// Update the ApiResponse interface to be used as the return type
export interface ApiResponse<T> {
  status?: number;
  message?: string;
  data?: T;
}

/**
 * Generic function to handle API requests.
 */
async function request<T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  payload?: Record<string, any>,
  customHeaders: HeadersInit = {},
  useAuthHeader: boolean = false,
  timeoutMs: number = 10000,
  retry: boolean = true,
  abortPrevious: boolean = true
): Promise<ApiResponse<T>> {
  // Modified return type
  const accessToken = tokenService_v0.getAccessToken();
  console.log(
    "🔹 accessToken in apiService:",
    accessToken ? "Present" : "Not present"
  );
  const headers: HeadersInit = {
    ...customHeaders,
  };

  // If payload is FormData, remove Content-Type so browser sets it automatically
  const isFormData = payload instanceof FormData;
  if (!isFormData) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (useAuthHeader && accessToken) {
    Object.assign(headers, { Authorization: `Bearer ${accessToken}` });
  }

  // Add request cancellation
  const requestKey = `${method}-${endpoint}`;
  if (abortPrevious && controllers.has(requestKey)) {
    controllers.get(requestKey)?.abort();
    console.log(`[API] Aborting previous request to: ${endpoint}`);
  }

  const controller = new AbortController();
  controllers.set(requestKey, controller);

  const options: RequestInit = {
    method,
    headers,
    signal: controller.signal,
  };

  if (payload && !isFormData) {
    options.body = JSON.stringify(payload);
  } else if (isFormData) {
    options.body = payload as FormData;
  }

  console.log(`[API] ${method} ${endpoint} - Initiating request`, {
    payload: isFormData ? "FormData" : payload,
  });

  // Set timeout
  const timeoutId = setTimeout(() => {
    if (controllers.has(requestKey)) {
      console.warn(`[API] Request timeout: ${method} ${endpoint}`);
      controller.abort("Request timed out after " + timeoutMs + "ms");
    }
  }, timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId); // Clear timeout when response is received

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
          false,
          abortPrevious
        );
      } else {
        console.warn("[API] Token refresh failed. User must log in again.");
        throw new Error("Unauthorized - Token refresh failed.");
      }
    }

    // Handle non-JSON responses (like empty responses)
    let data: ApiResponse<any> = {};
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();

      // Log API message if it exists
      if (data && typeof data === "object" && "message" in data) {
        console.log(
          `[API] ${method} ${endpoint} - Message from server: "${data.message}"`
        );
      } else {
        console.log(
          `[API] ${method} ${endpoint} - No message field in response`
        );
      }
    } else {
      console.log(`[API] ${method} ${endpoint} - Response is not JSON`);
      // For non-JSON responses, create a default response object
      const text = await response.text();
      data = {
        status: response.status,
        data: text,
        message: response.statusText || `Status: ${response.status}`,
      };
    }

    if (!response.ok) {
      console.error(
        `[API] ${method} ${endpoint} - HTTP Error ${response.status}`
      );

      throw new Error(
        `Request to ${method} ${endpoint} failed with status ${
          response.status
        }. Response: ${JSON.stringify(data)}`
      );
    }

    console.log(`[API] ${method} ${endpoint} - Success`, data);
    return data; // Return the entire response object
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Distinguish between aborted requests and other errors
    if (error.name === "AbortError") {
      const reason = error.message || "No reason provided";
      console.warn(`[API] ${method} ${endpoint} - Request aborted: ${reason}`);

      // Only rethrow if not aborted due to component unmount
      if (reason.includes("component unmounted")) {
        console.log(
          `[API] ${method} ${endpoint} - Ignoring abort due to component unmount`
        );
        return {
          data: {} as T,
          message: "Request aborted: component unmounted",
        }; // Include message
      }
    } else {
      console.error(`[API] ${method} ${endpoint} - Error: ${error.message}`);
    }

    handleGlobalError(error, method, endpoint);
    throw error;
  } finally {
    controllers.delete(requestKey); // Cleanup
    console.log(`[API] ${method} ${endpoint} - Request cleanup`);
  }
}

/**
 * Centralized global error handler
 */
function handleGlobalError(error: any, method: string, endpoint: string) {
  if (error.name === "AbortError") {
    // Handle abort errors differently
    const reason = error.message || "Unknown reason";
    console.warn(
      `[API] Request to ${method} ${endpoint} was aborted: ${reason}`
    );
    // Don't show alert for aborted requests as they're often intentional
    return;
  }

  console.error(`[API] Error in ${method} ${endpoint}: ${error.message}`);

  // Extract any message from the error if it exists
  let errorMessage = error.message;
  try {
    // Check if the error message contains a JSON string
    const matches = error.message.match(/Response:(.+)/);
    if (matches && matches[1]) {
      const errorJson = JSON.parse(matches[1].trim());
      if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    }
  } catch (e) {
    // If parsing fails, use the original error message
  }

  if (error.message.includes("Failed to fetch")) {
    console.error("Network error! Please check your internet connection.");
  } else if (error.message.includes("401")) {
    console.error(
      "Session expired. Refresh token failed. Please log in again."
    );
  } else if (error.message.includes("Request timed out")) {
    console.error("Request timed out. Please try again.");
  }
}

/**
 * API service with categorized requests.
 */
export const apiService = {
  auth: {
    get: <T>(
      endpoint: string,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "GET",
        endpoint,
        undefined,
        headers,
        true,
        timeoutMs,
        true,
        abortPrevious
      ),
    post: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "POST",
        endpoint,
        payload,
        headers,
        true,
        timeoutMs,
        true,
        abortPrevious
      ),
    patch: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "PATCH",
        endpoint,
        payload,
        headers,
        true,
        timeoutMs,
        true,
        abortPrevious
      ),
    put: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "PUT",
        endpoint,
        payload,
        headers,
        true,
        timeoutMs,
        true,
        abortPrevious
      ),
    delete: <T>(
      endpoint: string,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "DELETE",
        endpoint,
        undefined,
        headers,
        true,
        timeoutMs,
        true,
        abortPrevious
      ),
  },
  public: {
    get: <T>(
      endpoint: string,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "GET",
        endpoint,
        undefined,
        headers,
        false,
        timeoutMs,
        true,
        abortPrevious
      ),
    post: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "POST",
        endpoint,
        payload,
        headers,
        false,
        timeoutMs,
        true,
        abortPrevious
      ),
    patch: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "PATCH",
        endpoint,
        payload,
        headers,
        false,
        timeoutMs,
        true,
        abortPrevious
      ),
    put: <T>(
      endpoint: string,
      payload: Record<string, any>,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "PUT",
        endpoint,
        payload,
        headers,
        false,
        timeoutMs,
        true,
        abortPrevious
      ),
    delete: <T>(
      endpoint: string,
      headers?: HeadersInit,
      timeoutMs?: number,
      abortPrevious: boolean = true
    ) =>
      request<T>(
        "DELETE",
        endpoint,
        undefined,
        headers,
        false,
        timeoutMs,
        true,
        abortPrevious
      ),
  },
  cancelRequest: (endpoint: string, method: string = "GET") => {
    const requestKey = `${method}-${endpoint}`;
    if (controllers.has(requestKey)) {
      controllers.get(requestKey)?.abort("Manually canceled");
      controllers.delete(requestKey);
      console.log(`[API] Manually canceled request to ${method} ${endpoint}`);
    }
  },
  // Helper to cancel all in-flight requests (useful for page transitions)
  cancelAllRequests: (reason: string = "Component unmounted") => {
    controllers.forEach((controller, key) => {
      controller.abort(reason);
      console.log(`[API] Canceled request: ${key} - Reason: ${reason}`);
    });
    controllers.clear();
  },
};

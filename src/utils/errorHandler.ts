// src/utils/errorHandler.ts
export function handleGlobalError(
  error: any,
  method: string,
  endpoint: string
) {
  console.error(`API Error in ${method} ${endpoint}:`, error);

  if (error.message.includes("Failed to fetch")) {
    alert("Network error! Please check your internet connection.");
  } else if (error.message.includes("401")) {
    alert("Session expired. Refresh token failed. Please log in again.");
  } else if (error.message.includes("Request timed out")) {
    alert("Request timed out. Please try again.");
  } else {
    alert(error.message || "An unexpected error occurred.");
  }
}

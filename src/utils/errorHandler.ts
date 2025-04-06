// src/utils/errorHandler.ts
export const handleApiError = <T>(
  error: any,
  defaultValue: T,
  errorMessage?: string
): { data: T; aborted: boolean; message?: string } => {
  // Check if the error is due to an AbortSignal
  if (error?.name === "AbortError") {
    // Don't show error for any aborted requests
    return {
      data: defaultValue,
      aborted: true,
      message: "Request aborted",
    };
  }
  // Log the error
  console.error(errorMessage || "API Error:", error?.message);

  // Extract error message if available
  let message = "An error occurred";
  if (error?.message && error?.message.includes("Response:")) {
    try {
      const jsonMatch = error.message.match(/Response:(.+)/);
      if (jsonMatch) {
        const errorJson = JSON.parse(jsonMatch[1].trim());
        message = errorJson.message || message;
      }
    } catch (e) {
      // If parsing fails, use the original error message
      message = error.message || message;
    }
  } else {
    message = error?.message || message;
  }

  // Rethrow the error with the extracted message
  throw new Error(message);
};

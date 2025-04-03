// src/utils/errorHandler.ts
export const handleApiError = <T>(
  error: any,
  defaultValue: T,
  errorMessage?: string
): { data: T; aborted: boolean; message?: string } => {
  // Log the error
  console.error(errorMessage || "API Error:", error?.message);

  // Check if the error is due to component unmount
  if (
    error?.name === "AbortError" &&
    error?.message?.includes("component unmounted")
  ) {
    return {
      data: defaultValue,
      aborted: true,
      message: "Request aborted",
    };
  }

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

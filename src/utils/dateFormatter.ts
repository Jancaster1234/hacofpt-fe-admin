// src/utils/dateFormatter.ts
export const formatDate = (date: string | Date | number): string => {
  if (!date) {
    return "";
  }

  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  // Format: Month Day, Year (e.g., "Apr 8, 2025")
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return dateObj.toLocaleDateString("en-US", options);
};

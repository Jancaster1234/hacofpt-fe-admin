// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_utils/formatters.tsx

/**
 * Format a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Format a date string to a localized date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Format a date string to a localized date and time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

/**
 * Get status color class based on device status
 */
export const getStatusColorClass = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    ASSIGNED: "text-blue-600",
    RETURNED: "text-green-600",
    LOST: "text-red-600",
    DAMAGED: "text-orange-600",
    AVAILABLE: "text-green-600",
    IN_USE: "text-blue-600",
    RETIRED: "text-gray-600",
    PENDING: "text-yellow-600",
  };

  return colorMap[status] || "text-gray-600";
};

/**
 * Get quality status color class
 */
export const getQualityStatusColorClass = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    EXCELLENT: "text-green-600",
    GOOD: "text-blue-600",
    FAIR: "text-yellow-600",
    POOR: "text-orange-600",
    DAMAGED: "text-red-600",
    NEEDS_REPAIR: "text-red-600",
    REPAIRING: "text-purple-600",
    REPAIRED: "text-indigo-600",
    LOST: "text-gray-600",
  };

  return colorMap[status] || "text-gray-600";
};

/**
 * Render a status badge with the appropriate color
 */
export const getStatusBadgeClass = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    // DeviceStatus
    AVAILABLE: "bg-green-100 text-green-800",
    IN_USE: "bg-blue-100 text-blue-800",
    DAMAGED: "bg-red-100 text-red-800",
    LOST: "bg-red-100 text-red-800",
    RETIRED: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",

    // UserDeviceStatus
    ASSIGNED: "bg-blue-100 text-blue-800",
    RETURNED: "bg-green-100 text-green-800",

    // DeviceQualityStatus
    EXCELLENT: "bg-green-100 text-green-800",
    GOOD: "bg-blue-100 text-blue-800",
    FAIR: "bg-yellow-100 text-yellow-800",
    POOR: "bg-orange-100 text-orange-800",
    NEEDS_REPAIR: "bg-red-100 text-red-800",
    REPAIRING: "bg-purple-100 text-purple-800",
    REPAIRED: "bg-indigo-100 text-indigo-800",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get the appropriate file icon based on file type
 */
export const getFileIcon = (fileType: string): JSX.Element => {
  if (fileType.startsWith("image/")) {
    return <span className="text-blue-500">🖼️</span>;
  } else if (fileType.includes("pdf")) {
    return <span className="text-red-500">📄</span>;
  } else if (fileType.includes("word") || fileType.includes("document")) {
    return <span className="text-indigo-500">📝</span>;
  } else if (fileType.includes("excel") || fileType.includes("spreadsheet")) {
    return <span className="text-green-500">📊</span>;
  } else if (fileType.includes("video")) {
    return <span className="text-purple-500">🎥</span>;
  } else if (fileType.includes("audio")) {
    return <span className="text-yellow-500">🔊</span>;
  } else {
    return <span className="text-gray-500">📎</span>;
  }
};

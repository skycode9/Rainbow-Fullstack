// Use env variable which changes based on environment
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8080/api";
};

// Get the backend base URL (without /api)
export const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
};

// Convert relative image path to full URL
export const getImageUrl = (relativePath: string) => {
  if (!relativePath) return "";

  // If already a full URL, return as is
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://")
  ) {
    return relativePath;
  }

  // Otherwise, construct full URL
  return `${getBackendUrl()}${relativePath}`;
};

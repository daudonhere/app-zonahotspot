export const getFullApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  // Ensure we don't have double slashes if base ends with / and endpoint starts with /
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  return `${cleanBase}/${cleanEndpoint}`;
};

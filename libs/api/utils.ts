export const getFullApiUrl = (endpoint: string): string => {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const cleanBase = baseUrl.replace(/\/+$/, "");
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    return `${cleanBase}/${cleanEndpoint}`;
  }
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  return `/api-proxy/${cleanEndpoint}`;
};

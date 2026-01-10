import { authStore } from "@/stores/authStore";
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}
/**
 * Enhanced fetch wrapper that handles:
 * 1. Authorization header injection
 * 2. Automatic token refresh on 401
 * 3. Request retries
 */
export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    const token = authStore.accessToken;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };
  try {
    let response = await fetch(url, {
      ...options,
      headers: getHeaders(),
    });
    if (response.status === 401) {
      const refreshed = await authStore.refreshToken();
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          headers: getHeaders(), 
        });
      } else {
        throw new Error("Session expired");
      }
    }
    const clone = response.clone();
    try {
      const data = await clone.json();
      if (data.code === 401) {
        const refreshed = await authStore.refreshToken();
        if (refreshed) {
          return fetch(url, {
            ...options,
            headers: getHeaders(),
          });
        } else {
          throw new Error("Session expired");
        }
      }
    } catch {
    }
    return response;
  } catch (error) {
    throw error;
  }
}

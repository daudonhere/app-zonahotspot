import { useState, useEffect } from 'react';
import { AUTH_ENDPOINTS } from '@/libs/api/endpoints';
import { getFullApiUrl } from '@/libs/api/utils';

// Global state variables
let _isAuthenticated = false;
let _accessToken: string | null = null;
const listeners: Array<() => void> = [];

// Helper functions for cookie management
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days?: number): void => {
  if (typeof document === 'undefined') return;

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

// Initialize from cookies
if (typeof window !== 'undefined') {
  const token = getCookie('accessToken');
  if (token) {
    _isAuthenticated = true;
    _accessToken = token;
  }
}

const authStore = {
  init() {
    // Already handled during declaration
  },

  login(accessToken: string) {
    _isAuthenticated = true;
    _accessToken = accessToken;
    if (typeof document !== 'undefined') {
      setCookie('accessToken', accessToken);
    }
    this.notifyListeners();
  },

  async logout() {
    _isAuthenticated = false;
    _accessToken = null;
    if (typeof document !== 'undefined') {
      deleteCookie('accessToken');
    }
    this.notifyListeners();
  },

  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  notifyListeners() {
    listeners.forEach(listener => listener());
  },

  get isAuthenticated() {
    return _isAuthenticated;
  },

  get accessToken() {
    return _accessToken;
  },

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(getFullApiUrl(AUTH_ENDPOINTS.REFRESH), {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result?.data?.accessToken) {
          this.login(data.result.data.accessToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  },
};

authStore.init();

export { authStore };

export function useAuth() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Initialize auth state from cookies when the hook is first used
    if (typeof window !== 'undefined') {
      const token = getCookie('accessToken');
      if (token && !_isAuthenticated) {
        _isAuthenticated = true;
        _accessToken = token;
      }
    }

    const unsubscribe = authStore.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  return {
    isAuthenticated: authStore.isAuthenticated,
    accessToken: authStore.accessToken,
    login: authStore.login,
    logout: authStore.logout,
    refreshToken: authStore.refreshToken,
  };
}

import { useRouter } from 'next/navigation';

export function useProtectedRoute() {
  const { isAuthenticated, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAuthAndRedirect = () => {
      const path = window.location.pathname;

      const isPublicRoute =
        path.startsWith('/auth') ||
        path.startsWith('/error') ||
        path === '/offline';

      const isUserAuthenticated = isAuthenticated && accessToken;

      if (!isPublicRoute && !isUserAuthenticated) {
        const attemptRefresh = async () => {
          const refreshed = await authStore.refreshToken();
          if (!refreshed) {
            router.replace('/auth');
          }
        };

        attemptRefresh();
      }
    };

    const timer = setTimeout(checkAuthAndRedirect, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, accessToken, router]);
}
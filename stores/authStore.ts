import { useState, useEffect } from 'react';
import { AUTH_ENDPOINTS } from '@/libs/api/endpoints';
import { getFullApiUrl } from '@/libs/api/utils';
let _isAuthenticated = false;
let _accessToken: string | null = null;
let _user: any | null = null;
let _refreshPromise: Promise<boolean> | null = null;
const listeners: Array<() => void> = [];
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
if (typeof window !== 'undefined') {
  const token = getCookie('accessToken');
  const storedUser = localStorage.getItem('user_data');
  if (token) {
    _isAuthenticated = true;
    _accessToken = token;
    if (storedUser) {
      try {
        _user = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user data", e);
      }
    }
  }
}
const authStore = {
  init() {
  },
  login(accessToken: string, user?: any) {
    _isAuthenticated = true;
    _accessToken = accessToken;
    if (user) {
      _user = user;
      if (typeof window !== 'undefined') {
         localStorage.setItem('user_data', JSON.stringify(user));
      }
    }
    if (typeof document !== 'undefined') {
      setCookie('accessToken', accessToken);
    }
    this.notifyListeners();
  },
  async logout() {
    _isAuthenticated = false;
    _accessToken = null;
    _user = null;
    if (typeof window !== 'undefined') {
       localStorage.removeItem('user_data');
    }
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
  get user() {
    return _user;
  },
  async refreshToken(): Promise<boolean> {
    if (_refreshPromise) {
      return _refreshPromise;
    }
    _refreshPromise = (async () => {
      try {
        const response = await fetch(getFullApiUrl(AUTH_ENDPOINTS.REFRESH), {
          method: 'POST',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const newAccessToken = data.result?.accessToken || data.result?.data?.accessToken || data.accessToken;
          const userData = data.result?.user || data.result?.data?.user;
          if (newAccessToken) {
            this.login(newAccessToken, userData);
            return true;
          }
        }
        await this.logout();
        return false;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
      } finally {
        _refreshPromise = null;
      }
    })();
    return _refreshPromise;
  },
};
authStore.init();
export { authStore };
export function useAuth() {
  const [, forceUpdate] = useState({});
  useEffect(() => {
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
    user: authStore.user,
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
const authStore = {
  _isAuthenticated: false,
  _accessToken: null as string | null,

  init() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this._isAuthenticated = true;
        this._accessToken = token;
      }
    }
  },

  login(accessToken: string) {
    this._isAuthenticated = true;
    this._accessToken = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
  },

  logout() {
    this._isAuthenticated = false;
    this._accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  get isAuthenticated() {
    return this._isAuthenticated;
  },

  get accessToken() {
    return this._accessToken;
  },
};

authStore.init();

export { authStore };

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useProtectedRoute() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;

    const isPublicRoute =
      path.startsWith('/auth') ||
      path.startsWith('/error') ||
      path === '/offline';

    const isUserAuthenticated = authStore.isAuthenticated && authStore.accessToken;

    if (!isPublicRoute && !isUserAuthenticated) {
      router.push('/auth');
    }
  }, [authStore.isAuthenticated, authStore.accessToken, router]);
}
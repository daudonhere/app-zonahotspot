'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/authStore';

export function useRedirectIfAuthenticated() {
  const { isAuthenticated, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check immediately when the component mounts
    const checkAuthAndRedirect = () => {
      const isUserAuthenticated = isAuthenticated && accessToken;

      if (isUserAuthenticated) {
        router.replace('/');
      }
    };

    const timer = setTimeout(checkAuthAndRedirect, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, accessToken, router]);
}
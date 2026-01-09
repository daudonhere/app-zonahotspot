'use client';

import { useProtectedRoute } from '@/stores/authStore';
import { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  useProtectedRoute();

  return <>{children}</>;
}
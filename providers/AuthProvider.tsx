/**
 * Auth Provider
 * Qualidade: Premium AAA
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    // Hidratar store com dados salvos
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

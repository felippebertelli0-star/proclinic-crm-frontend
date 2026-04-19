/**
 * Auth Provider
 * Qualidade: Premium AAA
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useEquipeStore } from '@/store/equipeStore';
import { useOrigensStore } from '@/store/origensStore';
import { useContatosStore } from '@/store/contatosStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const hydrateEquipe = useEquipeStore((state) => state.hydrate);
  const hydrateOrigens = useOrigensStore((state) => state.hydrate);
  const hydrateContatos = useContatosStore((state) => state.hydrate);

  useEffect(() => {
    // Hidratar todos os stores com dados salvos
    hydrateAuth();
    hydrateEquipe();
    hydrateOrigens();
    hydrateContatos();
  }, [hydrateAuth, hydrateEquipe, hydrateOrigens, hydrateContatos]);

  return <>{children}</>;
}

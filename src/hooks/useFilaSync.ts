/**
 * Hook: useFilaSync
 * Sincroniza automaticamente as filas com dados de conversas
 * Polling a cada 30 segundos para manter métricas atualizadas
 * Qualidade: Premium AAA
 */

import { useEffect } from 'react';
import { useFilasStore } from '@/store/filasStore';

interface Conversa {
  id: string;
  filaId?: string;
  abertoEm?: string;
  ultimaMsgEm?: string;
}

/**
 * Hook que sincroniza filas com conversas em tempo real
 * Deve ser chamado no componente principal de Filas
 *
 * Exemplo de uso:
 * ```tsx
 * export default function FilasPage() {
 *   useFilaSync([conversas]);
 *   // ... resto do componente
 * }
 * ```
 *
 * @param conversas - Array de conversas a sincronizar (podem vir do store ou API)
 * @param intervalMs - Intervalo de polling em ms (padrão: 30000 = 30s)
 */
export const useFilaSync = (conversas: Conversa[] = [], intervalMs: number = 30000) => {
  useEffect(() => {
    if (!conversas || conversas.length === 0) {
      console.warn('[useFilaSync] Nenhuma conversa fornecida para sincronização');
      return;
    }

    // Sincronização inicial
    console.log('[useFilaSync] ✓ Sincronizando filas com conversas');
    const { sincronizarTodasAsFilas } = useFilasStore.getState();
    sincronizarTodasAsFilas(conversas);

    // Sincronização periódica (polling)
    const interval = setInterval(() => {
      const { sincronizarTodasAsFilas } = useFilasStore.getState();
      sincronizarTodasAsFilas(conversas);
      console.log('[useFilaSync] ✓ Sincronização periódica completada');
    }, intervalMs);

    // Cleanup: remover intervalo ao desmontar
    return () => {
      console.log('[useFilaSync] Limpando intervalo de sincronização');
      clearInterval(interval);
    };
  }, [conversas, intervalMs]);
};

export default useFilaSync;

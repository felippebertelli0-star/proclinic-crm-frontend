/**
 * Hook: useEquipeSync
 * Sincroniza dados de conversas e pipeline com equipeStore
 * Calcula métricas em tempo real: TMR, tickets, pipeline stats
 */

import { useEffect } from 'react';
import { useEquipeStore } from '@/store/equipeStore';

export function useEquipeSync(conversas: any[] = [], opportunities: any[] = []) {
  const syncMembros = useEquipeStore((state) => state.syncMembros);

  useEffect(() => {
    console.log('[EQUIPE_SYNC] Iniciando sincronização de equipe');

    // Sincronizar imediatamente ao montar
    syncMembros(conversas, opportunities);

    // Sincronizar a cada 30 segundos
    const interval = setInterval(() => {
      console.log('[EQUIPE_SYNC] Atualizando métricas de equipe');
      syncMembros(conversas, opportunities);
    }, 30000);

    return () => {
      clearInterval(interval);
      console.log('[EQUIPE_SYNC] Hook desmontado, sincronização parada');
    };
  }, [conversas, opportunities, syncMembros]);
}

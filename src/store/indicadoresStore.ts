/**
 * Store de Indicadores Operacionais
 *
 * Persiste APENAS o campo "Investimento em Tráfego" por dia — todos os demais
 * indicadores são derivados em tempo real dos stores existentes (contatos,
 * pipeline, conversas) via hook `useIndicadoresCompute`.
 *
 * Persistência: localStorage via chave `proclinic_indicadores_trafego`.
 */

import { create } from 'zustand';

interface IndicadoresStore {
  /** Mapa de data ISO (`yyyy-mm-dd`) → investimento em tráfego (reais). */
  investTrafego: Record<string, number>;
  setInvestTrafego: (date: string, valor: number) => void;
  clearDia: (date: string) => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'proclinic_indicadores_trafego';

export const useIndicadoresStore = create<IndicadoresStore>((set, get) => ({
  investTrafego: {},

  setInvestTrafego: (date, valor) => {
    const next = { ...get().investTrafego };
    if (valor > 0) next[date] = valor;
    else delete next[date];
    set({ investTrafego: next });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error('Erro ao persistir indicadoresStore:', err);
    }
  },

  clearDia: (date) => {
    const next = { ...get().investTrafego };
    delete next[date];
    set({ investTrafego: next });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error('Erro ao persistir indicadoresStore:', err);
    }
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) set({ investTrafego: JSON.parse(raw) });
    } catch (err) {
      console.error('Erro ao hidratar indicadoresStore:', err);
    }
  },
}));

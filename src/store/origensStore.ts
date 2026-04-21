/**
 * Store de Origens - Gerenciamento global de origens de contatos
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';

interface OrigensStore {
  origens: string[];
  setOrigens: (origens: string[]) => void;
  addOrigem: (origem: string) => void;
  removeOrigem: (origem: string) => void;
  getOrigens: () => string[];
  hydrate: () => void;
}

// Dados iniciais padrão
const ORIGENS_INICIAIS = ['Tráfego Pago', 'Orgânico', 'Indicação', 'Direto'];

const STORAGE_KEY = 'proclinic_origens';

export const useOrigensStore = create<OrigensStore>((set, get) => ({
  origens: ORIGENS_INICIAIS,

  setOrigens: (origens: string[]) => {
    set({ origens });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(origens));
  },

  addOrigem: (origem: string) => {
    const origens = get().origens;
    if (!origens.includes(origem)) {
      const novasOrigens = [...origens, origem];
      set({ origens: novasOrigens });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novasOrigens));
    }
  },

  removeOrigem: (origem: string) => {
    const origens = get().origens.filter(o => o !== origem);
    set({ origens });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(origens));
  },

  getOrigens: () => get().origens,

  hydrate: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ origens: JSON.parse(stored) });
      } else {
        set({ origens: ORIGENS_INICIAIS });
      }
    } catch (error) {
      console.error('Erro ao hidratar origensStore:', error);
      set({ origens: ORIGENS_INICIAIS });
    }
  },
}));

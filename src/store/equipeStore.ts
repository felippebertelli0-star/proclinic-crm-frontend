/**
 * Store de Equipe - Gerenciamento global de membros
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';

export interface Membro {
  id: number;
  nome: string;
  cargo: string;
  status: 'Online' | 'Offline' | 'Ausente';
  tickets: number;
  conversas: number;
  tmr: string;
  avatarColor: string;
}

interface EquipeStore {
  membros: Membro[];
  setMembros: (membros: Membro[]) => void;
  addMembro: (membro: Membro) => void;
  removeMembro: (id: number) => void;
  updateMembro: (id: number, membro: Partial<Membro>) => void;
  getMembros: () => Membro[];
  hydrate: () => void;
}

// Dados iniciais padrão
const MEMBROS_INICIAIS: Membro[] = [
  { id: 1, nome: 'Hávila Rodrigues', cargo: 'Gerente', status: 'Online', tickets: 87, conversas: 45, tmr: '5 min', avatarColor: '#e91e63' },
  { id: 2, nome: 'Camilly Nunes', cargo: 'Atendente', status: 'Online', tickets: 34, conversas: 22, tmr: '6 min', avatarColor: '#9c27b0' },
  { id: 3, nome: 'Fernando Silva', cargo: 'Atendente', status: 'Offline', tickets: 12, conversas: 8, tmr: '8 min', avatarColor: '#3f51b5' },
  { id: 4, nome: 'Luana Costa', cargo: 'Suporte', status: 'Ausente', tickets: 5, conversas: 3, tmr: '10 min', avatarColor: '#00bcd4' },
];

const STORAGE_KEY = 'proclinic_equipe';

export const useEquipeStore = create<EquipeStore>((set, get) => ({
  membros: MEMBROS_INICIAIS,

  setMembros: (membros: Membro[]) => {
    set({ membros });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(membros));
  },

  addMembro: (membro: Membro) => {
    const membros = [...get().membros, membro];
    set({ membros });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(membros));
  },

  removeMembro: (id: number) => {
    const membros = get().membros.filter(m => m.id !== id);
    set({ membros });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(membros));
  },

  updateMembro: (id: number, updates: Partial<Membro>) => {
    const membros = get().membros.map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    set({ membros });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(membros));
  },

  getMembros: () => get().membros,

  hydrate: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ membros: JSON.parse(stored) });
      } else {
        set({ membros: MEMBROS_INICIAIS });
      }
    } catch (error) {
      console.error('Erro ao hidratar equipeStore:', error);
      set({ membros: MEMBROS_INICIAIS });
    }
  },
}));

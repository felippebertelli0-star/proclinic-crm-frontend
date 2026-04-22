/**
 * Store de Equipe - Gerenciamento global de membros
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';

export interface Membro {
  id: number;
  nome: string;
  cargo: string;
  email?: string;
  status: 'Online' | 'Offline' | 'Ausente';
  tickets: number;
  conversas: number;
  tmr: string;
  avatarColor: string;
  pipelineStats?: {
    negociacao: number;
    agendou: number;
    convertido: number;
    naoAgendou: number;
  };
}

interface EquipeStore {
  membros: Membro[];
  setMembros: (membros: Membro[]) => void;
  addMembro: (membro: Membro) => void;
  removeMembro: (id: number) => void;
  updateMembro: (id: number, membro: Partial<Membro>) => void;
  getMembros: () => Membro[];
  hydrate: () => void;
  syncMembros: (conversas: any[], opportunities: any[]) => void;
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

  syncMembros: (conversas: any[] = [], opportunities: any[] = []) => {
    const calcularTMR = (conversasDoMembro: any[]): number => {
      if (conversasDoMembro.length === 0) return 0;

      try {
        const tempos = conversasDoMembro
          .filter((c: any) => c.abertoEm && c.ultimaMsgEm)
          .map((c: any) => {
            const abertoMs = new Date(c.abertoEm).getTime();
            const ultimaMs = new Date(c.ultimaMsgEm).getTime();
            return (ultimaMs - abertoMs) / (1000 * 60); // Minutos
          });

        if (tempos.length === 0) return 0;
        return Math.round(tempos.reduce((a: number, b: number) => a + b, 0) / tempos.length);
      } catch (error) {
        console.warn('[EQUIPE_STORE] Erro ao calcular TMR:', error);
        return 0;
      }
    };

    const membros = get().membros.map((membro) => {
      const minhasConversas = conversas.filter(
        (c: any) => c.agente === membro.nome || c.agente === membro.id
      );
      const meusPipeline = opportunities.filter(
        (o: any) => o.agente === membro.nome
      );

      return {
        ...membro,
        tickets: minhasConversas.length,
        tmr: `${calcularTMR(minhasConversas)} min`,
        pipelineStats: {
          negociacao: meusPipeline.filter((o: any) => o.stage === 'negociacao').length,
          agendou: meusPipeline.filter((o: any) => o.stage === 'agendou').length,
          convertido: meusPipeline.filter((o: any) => o.stage === 'convertido').length,
          naoAgendou: meusPipeline.filter((o: any) => o.stage === 'nao_agendou').length,
        }
      };
    });

    set({ membros });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(membros));
  },
}));

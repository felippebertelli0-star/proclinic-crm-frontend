/**
 * Store de Contatos - Gerenciamento global de contatos
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';

export interface Contato {
  id: number;
  nome: string;
  whatsapp: string;
  email: string;
  ultimaInteracao: string;
  status: string;
  badge: string;
  badgeColor: string;
  avatarColor: string;
}

interface ContatosStore {
  contatos: Contato[];
  setContatos: (contatos: Contato[]) => void;
  addContato: (contato: Contato) => void;
  removeContato: (id: number) => void;
  updateContato: (id: number, contato: Partial<Contato>) => void;
  getContatos: () => Contato[];
  contatoExiste: (nome: string, email?: string) => boolean;
  hydrate: () => void;
}

// Dados iniciais padrão
const CONTATOS_INICIAIS: Contato[] = [
  { id: 1, nome: 'Ida Santos', whatsapp: '(11) 99999-0001', email: 'ida@email.com', ultimaInteracao: '2026-04-18 10:30', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#e91e63' },
  { id: 2, nome: 'Daniele Mantovani', whatsapp: '(11) 99999-0002', email: 'daniele@email.com', ultimaInteracao: '2026-04-16 15:45', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#9c27b0' },
  { id: 3, nome: 'Maria Rosa', whatsapp: '(11) 99999-0003', email: 'maria@email.com', ultimaInteracao: '2026-04-15 09:20', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#673ab7' },
  { id: 4, nome: 'Laura Ferreira', whatsapp: '(11) 99999-0004', email: 'laura@email.com', ultimaInteracao: '2026-04-14 14:10', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#3f51b5' },
  { id: 5, nome: 'Patricia Lima', whatsapp: '(11) 99999-0005', email: 'patricia@email.com', ultimaInteracao: '2026-04-13 11:55', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#2196f3' },
  { id: 6, nome: 'Ana Beatriz', whatsapp: '(11) 99999-0006', email: 'ana@email.com', ultimaInteracao: '2026-04-12 16:30', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#00bcd4' },
  { id: 7, nome: 'Larissa Alcântara', whatsapp: '(11) 99999-0007', email: 'larissa@email.com', ultimaInteracao: '2026-04-11 13:15', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#009688' },
  { id: 8, nome: 'Carlota Mendes', whatsapp: '(11) 99999-0008', email: 'carlota@email.com', ultimaInteracao: '2026-04-10 10:45', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#4caf50' },
];

const STORAGE_KEY = 'proclinic_contatos';

export const useContatosStore = create<ContatosStore>((set, get) => ({
  contatos: CONTATOS_INICIAIS,

  setContatos: (contatos: Contato[]) => {
    set({ contatos });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contatos));
  },

  addContato: (contato: Contato) => {
    const contatos = [contato, ...get().contatos];
    set({ contatos });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contatos));
  },

  removeContato: (id: number) => {
    const contatos = get().contatos.filter(c => c.id !== id);
    set({ contatos });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contatos));
  },

  updateContato: (id: number, updates: Partial<Contato>) => {
    const contatos = get().contatos.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ contatos });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contatos));
  },

  getContatos: () => get().contatos,

  contatoExiste: (nome: string, email?: string) => {
    const contatos = get().contatos;
    return contatos.some(c =>
      c.nome.toLowerCase() === nome.toLowerCase() ||
      (email && c.email.toLowerCase() === email.toLowerCase())
    );
  },

  hydrate: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ contatos: JSON.parse(stored) });
      } else {
        set({ contatos: CONTATOS_INICIAIS });
      }
    } catch (error) {
      console.error('Erro ao hidratar contatosStore:', error);
      set({ contatos: CONTATOS_INICIAIS });
    }
  },
}));

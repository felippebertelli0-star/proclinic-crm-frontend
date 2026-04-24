/**
 * Store de Sistemas (Clínicas/Tenants) — Multi-tenant
 * Qualidade: Premium AAA
 *
 * Fonte única de verdade das clínicas. Reutilizado pelo master admin
 * (sistemas, jarvis) para selecionar tenant ativo, e pela clínica para
 * resolver o próprio sistemaId.
 */

import { create } from 'zustand';

export type PlanoId = 'starter' | 'pro' | 'enterprise';
export type StatusClinicaId = 'ativo' | 'trial' | 'suspenso';

export interface Clinica {
  id: string;
  nome: string;
  slug: string;
  plano: PlanoId;
  status: StatusClinicaId;
  usuarios: number;
  mrr: number;
  criadaEm: string;
}

const STORAGE_KEY = 'proclinic_sistemas';

const CLINICAS_INICIAIS: Clinica[] = [
  {
    id: '1',
    nome: 'Clínica Andressa Estética',
    slug: 'andressa',
    plano: 'pro',
    status: 'ativo',
    usuarios: 12,
    mrr: 697,
    criadaEm: '12 mar 2026',
  },
  {
    id: '2',
    nome: 'Odonto Premium SP',
    slug: 'odontopremium',
    plano: 'enterprise',
    status: 'ativo',
    usuarios: 34,
    mrr: 1997,
    criadaEm: '02 fev 2026',
  },
  {
    id: '3',
    nome: 'Dermato Vida Plena',
    slug: 'vidaplena',
    plano: 'pro',
    status: 'trial',
    usuarios: 5,
    mrr: 0,
    criadaEm: '18 abr 2026',
  },
];

interface SistemasStore {
  clinicas: Clinica[];
  hydrated: boolean;

  hydrate: () => void;
  addClinica: (clinica: Clinica) => void;
  updateClinica: (id: string, partial: Partial<Clinica>) => void;
  removeClinica: (id: string) => void;
  getById: (id: string) => Clinica | undefined;
  getBySlug: (slug: string) => Clinica | undefined;
}

function saveToStorage(clinicas: Clinica[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clinicas));
  } catch (err) {
    console.error('Erro ao salvar sistemasStore:', err);
  }
}

export const useSistemasStore = create<SistemasStore>((set, get) => ({
  clinicas: CLINICAS_INICIAIS,
  hydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Clinica[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ clinicas: parsed, hydrated: true });
          return;
        }
      }
      set({ hydrated: true });
    } catch (err) {
      console.error('Erro ao hidratar sistemasStore:', err);
      set({ hydrated: true });
    }
  },

  addClinica: (clinica) => {
    const next = [...get().clinicas, clinica];
    set({ clinicas: next });
    saveToStorage(next);
  },

  updateClinica: (id, partial) => {
    const next = get().clinicas.map((c) => (c.id === id ? { ...c, ...partial } : c));
    set({ clinicas: next });
    saveToStorage(next);
  },

  removeClinica: (id) => {
    const next = get().clinicas.filter((c) => c.id !== id);
    set({ clinicas: next });
    saveToStorage(next);
  },

  getById: (id) => get().clinicas.find((c) => c.id === id),
  getBySlug: (slug) => get().clinicas.find((c) => c.slug === slug),
}));

export const PLANO_CONFIG: Record<PlanoId, { label: string; color: string; bg: string; border: string }> = {
  starter: {
    label: 'Starter',
    color: '#8ea3b5',
    bg: 'rgba(142,163,181,0.10)',
    border: 'rgba(142,163,181,0.25)',
  },
  pro: {
    label: 'Pro',
    color: '#c9943a',
    bg: 'rgba(201,148,58,0.12)',
    border: 'rgba(201,148,58,0.30)',
  },
  enterprise: {
    label: 'Enterprise',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.30)',
  },
};

export const STATUS_CONFIG: Record<StatusClinicaId, { label: string; color: string; bg: string }> = {
  ativo: { label: 'Ativo', color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' },
  trial: { label: 'Trial', color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
  suspenso: { label: 'Suspenso', color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
};

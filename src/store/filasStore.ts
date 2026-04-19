/**
 * Store de Filas - Gerenciamento de filas dinâmicas
 * Busca filas da API e mantém estado global
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Fila {
  id: string;
  nome: string;
  descricao?: string;
  prioridade: number;
  ativa: boolean;
  cor: string;
  sistemaId?: string;
}

interface FilasState {
  filas: Fila[];
  loading: boolean;
  error: string | null;

  // Actions
  setFilas: (filas: Fila[]) => void;
  addFila: (fila: Fila) => void;
  updateFila: (id: string, fila: Partial<Fila>) => void;
  deleteFila: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchFilas: (sistemaId: string) => Promise<void>;
  hydrate: () => void;
}

const STORAGE_KEY = 'proclinic_filas';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useFilasStore = create<FilasState>()(
  persist(
    (set, get) => ({
      filas: [],
      loading: false,
      error: null,

      setFilas: (filas: Fila[]) => {
        set({ filas, error: null });
      },

      addFila: (fila: Fila) => {
        const filas = [...get().filas, fila];
        set({ filas });
      },

      updateFila: (id: string, updates: Partial<Fila>) => {
        const filas = get().filas.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        );
        set({ filas });
      },

      deleteFila: (id: string) => {
        const filas = get().filas.filter((f) => f.id !== id);
        set({ filas });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      fetchFilas: async (sistemaId: string) => {
        try {
          set({ loading: true, error: null });

          const response = await fetch(
            `${API_BASE}/sistemas/${sistemaId}/filas`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Erro ao buscar filas: ${response.statusText}`);
          }

          const data = await response.json();
          const filasData = Array.isArray(data) ? data : data.filas || [];

          set({
            filas: filasData.map((f: any) => ({
              id: f.id,
              nome: f.nome,
              descricao: f.descricao,
              prioridade: f.prioridade || 0,
              ativa: f.ativa !== false,
              cor: f.cor || '#132636',
              sistemaId: sistemaId,
            })),
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          console.error('Erro ao buscar filas:', errorMessage);
          set({
            loading: false,
            error: errorMessage,
          });
        }
      },

      hydrate: () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            set({
              filas: parsed.state?.filas || [],
            });
          }
        } catch (error) {
          console.error('Erro ao hidratar filasStore:', error);
        }
      },
    }),
    {
      name: 'filas-store',
      version: 1,
    }
  )
);

/**
 * Store de Filas - Gerenciamento de filas dinâmicas com métricas
 * Busca filas da API, sincroniza com conversas, calcula TMR e SLA
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Fila {
  id: string;
  nome: string;
  descricao?: string;
  status: 'ativa' | 'pausada';
  cor: string;

  // Membros e configuração
  agenteIds: string[];

  // Métricas calculadas dinamicamente
  totalTickets: number;
  tmr: number;
  slaPercentual: number;

  // Dados originais (fallback/compatibilidade)
  prioridade?: number;
  ativa?: boolean;
  sistemaId?: string;
  ultimaAtualizacao: string;
}

interface Conversa {
  id: string;
  filaId?: string;
  abertoEm?: string;
  ultimaMsgEm?: string;
}

interface FilasState {
  filas: Fila[];
  loading: boolean;
  error: string | null;

  // Actions CRUD
  setFilas: (filas: Fila[]) => void;
  addFila: (fila: Fila) => void;
  updateFila: (id: string, fila: Partial<Fila>) => void;
  deleteFila: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Cálculos de métricas
  calcularMetricasFila: (filaId: string, conversas: Conversa[]) => void;
  sincronizarTodasAsFilas: (conversas: Conversa[]) => void;

  // Fetch
  fetchFilas: (sistemaId: string) => Promise<void>;
  hydrate: () => void;
}

const STORAGE_KEY = 'proclinic_filas';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper: Calcular tempo de resposta em minutos
const calcularTempoResposta = (conversa: Conversa): number | null => {
  if (!conversa.ultimaMsgEm || !conversa.abertoEm) return null;

  try {
    const abertoEm = new Date(conversa.abertoEm);
    const ultimaMsgEm = new Date(conversa.ultimaMsgEm);
    const diffMs = ultimaMsgEm.getTime() - abertoEm.getTime();

    return Math.round(diffMs / (1000 * 60)); // Converter para minutos
  } catch {
    return null;
  }
};

// Helper: Verificar se conversa está dentro do SLA (24 horas)
const verificarSLA = (conversa: Conversa): boolean => {
  const SLA_HORAS = 24;
  const tempoResposta = calcularTempoResposta(conversa);

  if (tempoResposta === null) return true; // Sem dados = no SLA

  return tempoResposta <= SLA_HORAS * 60;
};

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

      // Calcular métricas de uma fila baseado em conversas
      calcularMetricasFila: (filaId: string, conversas: Conversa[]) => {
        const conversasDaFila = conversas.filter((c) => c.filaId === filaId);

        if (conversasDaFila.length === 0) {
          // Fila vazia: valores padrão
          get().updateFila(filaId, {
            totalTickets: 0,
            tmr: 0,
            slaPercentual: 100,
          });
          return;
        }

        // Calcular TMR (Tempo Médio de Resposta)
        const temposResposta = conversasDaFila
          .map((c) => calcularTempoResposta(c))
          .filter((t) => t !== null) as number[];

        const tmr =
          temposResposta.length > 0
            ? Math.round(
                temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length
              )
            : 0;

        // Calcular SLA
        const conversasNoSLA = conversasDaFila.filter((c) => verificarSLA(c)).length;
        const slaPercentual = Math.round(
          (conversasNoSLA / conversasDaFila.length) * 100
        );

        // Atualizar fila
        get().updateFila(filaId, {
          totalTickets: conversasDaFila.length,
          tmr,
          slaPercentual,
          ultimaAtualizacao: new Date().toISOString(),
        });
      },

      // Sincronizar TODAS as filas com conversas
      sincronizarTodasAsFilas: (conversas: Conversa[]) => {
        const filasIds = new Set(
          conversas
            .map((c) => c.filaId)
            .filter((id) => id !== undefined) as string[]
        );

        filasIds.forEach((filaId) => {
          get().calcularMetricasFila(filaId, conversas);
        });
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
              status: f.status || (f.ativa !== false ? 'ativa' : 'pausada'),
              cor: f.cor || '#c9943a',
              agenteIds: f.agenteIds || [],
              totalTickets: f.totalTickets || 0,
              tmr: f.tmr || 0,
              slaPercentual: f.slaPercentual || 100,
              ultimaAtualizacao: f.ultimaAtualizacao || new Date().toISOString(),
              prioridade: f.prioridade || 0,
              sistemaId: sistemaId,
            })),
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          console.error('[FILAS_STORE] Erro ao buscar filas:', errorMessage);
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
          console.error('[FILAS_STORE] Erro ao hidratar:', error);
        }
      },
    }),
    {
      name: 'filas-store',
      version: 1,
    }
  )
);

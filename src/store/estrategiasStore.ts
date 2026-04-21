/**
 * Estratégias Store - Zustand
 *
 * Estado centralizado para gerenciar estratégias extraídas
 * Sincroniza automaticamente com API backend
 *
 * Features:
 * - CRUD completo (Create, Read, Update, Delete)
 * - Persistência em backend
 * - Cache local com Zustand
 * - Sincronização automática
 * - Tratamento de erros
 */

import { create } from 'zustand';

export interface Estrategia {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  ativa: boolean;
  dataCriacao: string;
  totalExecutions: number;
  taxaSucesso: number;
  criadoPor: string;
  mes?: string;
}

interface EstrategiasState {
  estrategias: Estrategia[];
  carregando: boolean;
  erro: string | null;

  // Actions
  carregarEstrategias: () => Promise<void>;
  adicionarEstrategias: (novasEstrategias: Estrategia[]) => Promise<void>;
  deletarEstrategia: (id: number) => Promise<void>;
  atualizarEstrategia: (id: number, dados: Partial<Estrategia>) => Promise<void>;
  limparErro: () => void;
}

export const useEstrategiasStore = create<EstrategiasState>((set) => ({
  estrategias: [],
  carregando: false,
  erro: null,

  // Carregar estratégias do backend
  carregarEstrategias: async () => {
    set({ carregando: true, erro: null });
    try {
      console.log('[ESTRATEGIAS_STORE] Carregando estratégias do backend...');
      const response = await fetch('/api/estrategias', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar estratégias: ${response.status}`);
      }

      const dados = await response.json();
      console.log('[ESTRATEGIAS_STORE] ✓ Estratégias carregadas:', dados.estrategias?.length);

      set({
        estrategias: dados.estrategias || [],
        carregando: false,
      });
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[ESTRATEGIAS_STORE] ✗ Erro ao carregar:', mensagem);
      set({
        erro: mensagem,
        carregando: false,
      });
    }
  },

  // Adicionar novas estratégias (salva no backend)
  adicionarEstrategias: async (novasEstrategias: Estrategia[]) => {
    set({ carregando: true, erro: null });
    try {
      console.log('[ESTRATEGIAS_STORE] Salvando', novasEstrategias.length, 'estratégias...');

      const response = await fetch('/api/estrategias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estrategias: novasEstrategias }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar estratégias: ${response.status}`);
      }

      // Recarregar estratégias após salvar
      await useEstrategiasStore.getState().carregarEstrategias();
      console.log('[ESTRATEGIAS_STORE] ✓ Estratégias salvas com sucesso');
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[ESTRATEGIAS_STORE] ✗ Erro ao salvar:', mensagem);
      set({
        erro: mensagem,
        carregando: false,
      });
    }
  },

  // Deletar uma estratégia
  deletarEstrategia: async (id: number) => {
    set({ carregando: true, erro: null });
    try {
      console.log('[ESTRATEGIAS_STORE] Deletando estratégia:', id);

      const response = await fetch(`/api/estrategias/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar: ${response.status}`);
      }

      // Recarregar após deletar
      await useEstrategiasStore.getState().carregarEstrategias();
      console.log('[ESTRATEGIAS_STORE] ✓ Estratégia deletada');
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[ESTRATEGIAS_STORE] ✗ Erro ao deletar:', mensagem);
      set({
        erro: mensagem,
        carregando: false,
      });
    }
  },

  // Atualizar uma estratégia
  atualizarEstrategia: async (id: number, dados: Partial<Estrategia>) => {
    set({ carregando: true, erro: null });
    try {
      console.log('[ESTRATEGIAS_STORE] Atualizando estratégia:', id);

      const response = await fetch(`/api/estrategias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar: ${response.status}`);
      }

      // Recarregar após atualizar
      await useEstrategiasStore.getState().carregarEstrategias();
      console.log('[ESTRATEGIAS_STORE] ✓ Estratégia atualizada');
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[ESTRATEGIAS_STORE] ✗ Erro ao atualizar:', mensagem);
      set({
        erro: mensagem,
        carregando: false,
      });
    }
  },

  // Limpar erro
  limparErro: () => set({ erro: null }),
}));

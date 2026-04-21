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
}

interface EstrategiasState {
  estrategias: Estrategia[];
  carregando: boolean;
  erro: string | null;
  carregarEstrategias: () => Promise<void>;
  adicionarEstrategias: (novas: Estrategia[]) => Promise<void>;
  deletarEstrategia: (id: number) => Promise<void>;
  atualizarEstrategia: (id: number, dados: Partial<Estrategia>) => Promise<void>;
  limparErro: () => void;
}

export const useEstrategiasStore = create<EstrategiasState>((set, get) => ({
  estrategias: [],
  carregando: false,
  erro: null,

  carregarEstrategias: async () => {
    set({ carregando: true, erro: null });
    try {
      console.log('[STORE] Carregando estratégias do backend...');
      const response = await fetch('/api/estrategias', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar: ${response.status}`);
      }

      const dados = await response.json();
      console.log(`[STORE] ✓ ${dados.estrategias?.length || 0} estratégias carregadas`);

      set({
        estrategias: dados.estrategias || [],
        carregando: false,
      });
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error(`[STORE] ✗ Erro ao carregar: ${mensagem}`);
      set({ erro: mensagem, carregando: false });
    }
  },

  adicionarEstrategias: async (novas: Estrategia[]) => {
    set({ carregando: true, erro: null });
    try {
      console.log(`[STORE] Adicionando ${novas.length} estratégias...`);
      const response = await fetch('/api/estrategias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estrategias: novas }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar: ${response.status}`);
      }

      console.log('[STORE] ✓ Estratégias adicionadas com sucesso');
      await get().carregarEstrategias();
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error(`[STORE] ✗ Erro ao adicionar: ${mensagem}`);
      set({ erro: mensagem, carregando: false });
      throw erro;
    }
  },

  deletarEstrategia: async (id: number) => {
    set({ carregando: true, erro: null });
    try {
      console.log(`[STORE] Deletando estratégia ${id}...`);
      const response = await fetch(`/api/estrategias/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar: ${response.status}`);
      }

      console.log('[STORE] ✓ Estratégia deletada com sucesso');
      await get().carregarEstrategias();
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error(`[STORE] ✗ Erro ao deletar: ${mensagem}`);
      set({ erro: mensagem, carregando: false });
      throw erro;
    }
  },

  atualizarEstrategia: async (id: number, dados: Partial<Estrategia>) => {
    set({ carregando: true, erro: null });
    try {
      console.log(`[STORE] Atualizando estratégia ${id}...`);
      const response = await fetch(`/api/estrategias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar: ${response.status}`);
      }

      console.log('[STORE] ✓ Estratégia atualizada com sucesso');
      await get().carregarEstrategias();
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error(`[STORE] ✗ Erro ao atualizar: ${mensagem}`);
      set({ erro: mensagem, carregando: false });
      throw erro;
    }
  },

  limparErro: () => set({ erro: null }),
}));

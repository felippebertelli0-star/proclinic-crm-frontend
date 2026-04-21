/**
 * Zustand Store para Kanban
 * State management centralizado e persistido
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KanbanState, KanbanCard, KanbanColuna } from '@/types/kanban';

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      colunas: [],
      expandedColumns: {
        comercial: true,
        secretaria: true,
        ia: true,
        suporte: true,
        agendando: true,
      },
      filterAgente: 'Todos',
      filterPrioridade: 'Todas',
      selectedMembro: null,
      modalEspiarVisivel: false,
      conversaSelecionada: null,
      loading: false,
      error: null,

      setColunas: (colunas) => set({ colunas }),

      toggleColuna: (colId) =>
        set((state) => ({
          expandedColumns: {
            ...state.expandedColumns,
            [colId]: !state.expandedColumns[colId],
          },
        })),

      setFilterAgente: (agente) => set({ filterAgente: agente }),

      setFilterPrioridade: (prioridade) => set({ filterPrioridade: prioridade }),

      setSelectedMembro: (membro) => set({ selectedMembro: membro }),

      setModalEspiarVisivel: (visivel) => set({ modalEspiarVisivel: visivel }),

      setConversaSelecionada: (card) => set({ conversaSelecionada: card }),

      moveCard: (cardId, colunaOrigem, colunaDestino, novaPos) =>
        set((state) => {
          const novasColunas = state.colunas.map((col) => ({ ...col }));
          const colOrigem = novasColunas.find((c) => c.id === colunaOrigem);
          const colDestino = novasColunas.find((c) => c.id === colunaDestino);

          if (!colOrigem || !colDestino) return state;

          const cardIndex = colOrigem.cards.findIndex((c) => c.id === cardId);
          if (cardIndex === -1) return state;

          const [card] = colOrigem.cards.splice(cardIndex, 1);
          colDestino.cards.splice(novaPos, 0, card);

          return { colunas: novasColunas };
        }),

      adicionarCard: (colunaId, card) =>
        set((state) => {
          const novasColunas = state.colunas.map((col) =>
            col.id === colunaId
              ? { ...col, cards: [card, ...col.cards] }
              : col
          );
          return { colunas: novasColunas };
        }),

      removerCard: (cardId, colunaId) =>
        set((state) => {
          const novasColunas = state.colunas.map((col) =>
            col.id === colunaId
              ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
              : col
          );
          return { colunas: novasColunas };
        }),
    }),
    {
      name: 'kanban-store',
      version: 1,
    }
  )
);

/**
 * Pipeline Store - Gerenciamento de estado das oportunidades
 * Zustand store com persistência e cálculos automáticos
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Opportunity {
  id: number;
  nome: string;
  valor: number;
  agente: string;
  tipo: string;
  origem: string;
}

export interface Stage {
  id: string;
  titulo: string;
  cor: string;
  opportunities: Opportunity[];
}

interface PipelineState {
  estagios: Stage[];
  moveCard: (cardId: number, sourceStageId: string, destStageId: string, position: number) => void;
  deleteOpportunity: (stageId: string, opportunityId: number) => void;
  updateOpportunity: (stageId: string, opportunityId: number, data: Partial<Opportunity>) => void;
  addOpportunity: (stageId: string, opportunity: Omit<Opportunity, 'id'>) => void;
  getStageTotal: (stageId: string) => number;
  getStageCount: (stageId: string) => number;
}

const initialEstagios: Stage[] = [
  {
    id: 'novo_lead',
    titulo: 'Novo Lead',
    cor: '#9b59b6',
    opportunities: [
      { id: 1, nome: 'João Silva', valor: 500, agente: 'Hávila', tipo: 'Limpeza Dentária', origem: 'Instagram' },
      { id: 2, nome: 'Maria Santos', valor: 800, agente: 'Camilly', tipo: 'Tratamento Estético', origem: 'Tráfego Pago' },
      { id: 3, nome: 'Pedro Costa', valor: 1200, agente: 'Fernando', tipo: 'Implante Dentário', origem: 'Indicação' },
    ],
  },
  {
    id: 'negociacao',
    titulo: 'Em Negociação',
    cor: '#f1c40f',
    opportunities: [
      { id: 4, nome: 'Ana Paula', valor: 1500, agente: 'Hávila', tipo: 'Clareamento', origem: 'Google' },
      { id: 5, nome: 'Carlos Mendes', valor: 2000, agente: 'Camilly', tipo: 'Tratamento Estético', origem: 'Tráfego Pago' },
    ],
  },
  {
    id: 'agendou',
    titulo: 'Agendou',
    cor: '#3498db',
    opportunities: [
      { id: 6, nome: 'Lucia Ferreira', valor: 1800, agente: 'Hávila', tipo: 'Aparelho Ortodôntico', origem: 'Indicação' },
      { id: 7, nome: 'Roberto Cunha', valor: 1200, agente: 'Fernando', tipo: 'Restauração', origem: 'Tráfego Pago' },
    ],
  },
  {
    id: 'convertido',
    titulo: 'Convertido',
    cor: '#2ecc71',
    opportunities: [
      { id: 8, nome: 'Patricia Lima', valor: 2500, agente: 'Camilly', tipo: 'Implante Dentário', origem: 'Google' },
      { id: 9, nome: 'Daniel Alves', valor: 1700, agente: 'Hávila', tipo: 'Tratamento Estético', origem: 'Indicação' },
    ],
  },
  {
    id: 'nao_agendou',
    titulo: 'Não Agendou',
    cor: '#e74c3c',
    opportunities: [
      { id: 10, nome: 'Gabriela Silva', valor: 900, agente: 'Fernando', tipo: 'Consulta', origem: 'Tráfego Pago' },
      { id: 11, nome: 'Helena Costa', valor: 600, agente: 'Camilly', tipo: 'Limpeza Dentária', origem: 'Instagram' },
    ],
  },
];

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
  estagios: initialEstagios,

  moveCard: (cardId, sourceStageId, destStageId, position) => {
    set((state) => {
      const newEstagios = state.estagios.map((stage) => ({
        ...stage,
        opportunities: [...stage.opportunities],
      }));

      // Encontrar o card na stage de origem
      const sourceStage = newEstagios.find((s) => s.id === sourceStageId);
      const destStage = newEstagios.find((s) => s.id === destStageId);

      if (!sourceStage || !destStage) return state;

      const cardIndex = sourceStage.opportunities.findIndex((opp) => opp.id === cardId);
      if (cardIndex === -1) return state;

      // Remover card da stage de origem
      const [card] = sourceStage.opportunities.splice(cardIndex, 1);

      // Adicionar card na stage de destino
      destStage.opportunities.splice(position, 0, card);

      return { estagios: newEstagios };
    });
  },

  deleteOpportunity: (stageId, opportunityId) => {
    set((state) => {
      return {
        estagios: state.estagios.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                opportunities: stage.opportunities.filter((opp) => opp.id !== opportunityId),
              }
            : stage
        ),
      };
    });
  },

  updateOpportunity: (stageId, opportunityId, data) => {
    set((state) => {
      return {
        estagios: state.estagios.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                opportunities: stage.opportunities.map((opp) =>
                  opp.id === opportunityId ? { ...opp, ...data } : opp
                ),
              }
            : stage
        ),
      };
    });
  },

  addOpportunity: (stageId, opportunity) => {
    set((state) => {
      const maxId = Math.max(...state.estagios.flatMap(s => s.opportunities.map(o => o.id)), 0);
      const newId = maxId + 1;

      return {
        estagios: state.estagios.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                opportunities: [...stage.opportunities, { ...opportunity, id: newId }],
              }
            : stage
        ),
      };
    });
  },

  getStageTotal: (stageId) => {
    const state = get();
    const stage = state.estagios.find((s) => s.id === stageId);
    if (!stage) return 0;
    return stage.opportunities.reduce((sum, opp) => sum + opp.valor, 0);
  },

  getStageCount: (stageId) => {
    const state = get();
    const stage = state.estagios.find((s) => s.id === stageId);
    if (!stage) return 0;
    return stage.opportunities.length;
  },
    }),
    {
      name: 'pipeline-store',
    }
  )
);

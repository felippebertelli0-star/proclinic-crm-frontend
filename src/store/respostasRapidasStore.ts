/**
 * Respostas Rápidas Store - Gerenciamento de estado
 * Zustand store com persistência em localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RespostaRapida {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  gatilho: string; // Texto que ativa a resposta automática
  usos: number;
  criadoPor: string;
  dataModificacao: Date;
  dataCriacao: Date;
}

interface RespostasRapidasState {
  respostas: RespostaRapida[];
  addResposta: (resposta: Omit<RespostaRapida, 'id' | 'usos' | 'dataCriacao' | 'dataModificacao'>) => void;
  updateResposta: (id: string, dados: Partial<RespostaRapida>) => void;
  deleteResposta: (id: string) => void;
  getResposta: (id: string) => RespostaRapida | undefined;
  incrementarUsos: (id: string) => void;
  buscarPorGatilho: (texto: string) => RespostaRapida | undefined;
  listar: () => RespostaRapida[];
}

// Dados padrão
const RESPOSTAS_INICIAIS: RespostaRapida[] = [
  {
    id: 'resp-1',
    titulo: 'Boas-vindas',
    conteudo: 'Olá! Bem-vindo ao atendimento da Clínica ProClinic. Como posso ajudá-lo?',
    categoria: 'Saudação',
    gatilho: 'olá',
    usos: 45,
    criadoPor: 'Admin',
    dataCriacao: new Date('2026-04-01'),
    dataModificacao: new Date('2026-04-15'),
  },
  {
    id: 'resp-2',
    titulo: 'Horário de atendimento',
    conteudo: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Sábados das 9h às 13h.',
    categoria: 'Informação',
    gatilho: 'horário',
    usos: 78,
    criadoPor: 'Admin',
    dataCriacao: new Date('2026-04-01'),
    dataModificacao: new Date('2026-04-10'),
  },
  {
    id: 'resp-3',
    titulo: 'Agendamento',
    conteudo: 'Para agendar uma consulta, você pode clicar no botão "Agendar" ou ligar para (11) 98765-4321.',
    categoria: 'Procedimento',
    gatilho: 'agendar',
    usos: 92,
    criadoPor: 'Admin',
    dataCriacao: new Date('2026-04-02'),
    dataModificacao: new Date('2026-04-18'),
  },
  {
    id: 'resp-4',
    titulo: 'Valores de procedimentos',
    conteudo: 'Os valores variam conforme o tipo de procedimento. Entre em contato para orçamento específico.',
    categoria: 'Financeiro',
    gatilho: 'preço',
    usos: 34,
    criadoPor: 'Admin',
    dataCriacao: new Date('2026-04-03'),
    dataModificacao: new Date('2026-04-12'),
  },
  {
    id: 'resp-5',
    titulo: 'Convenios',
    conteudo: 'Aceitamos os principais convênios. Qual é seu convênio?',
    categoria: 'Financeiro',
    gatilho: 'convênio',
    usos: 56,
    criadoPor: 'Admin',
    dataCriacao: new Date('2026-04-04'),
    dataModificacao: new Date('2026-04-16'),
  },
];

export const useRespostasRapidasStore = create<RespostasRapidasState>()(
  persist(
    (set, get) => ({
      respostas: RESPOSTAS_INICIAIS,

      addResposta: (resposta) => {
        const id = `resp-${Date.now()}`;
        const agora = new Date();
        set((state) => ({
          respostas: [
            ...state.respostas,
            {
              ...resposta,
              id,
              usos: 0,
              dataCriacao: agora,
              dataModificacao: agora,
            },
          ],
        }));
      },

      updateResposta: (id, dados) => {
        set((state) => ({
          respostas: state.respostas.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...dados,
                  dataModificacao: new Date(),
                }
              : r
          ),
        }));
      },

      deleteResposta: (id) => {
        set((state) => ({
          respostas: state.respostas.filter((r) => r.id !== id),
        }));
      },

      getResposta: (id) => {
        return get().respostas.find((r) => r.id === id);
      },

      incrementarUsos: (id) => {
        set((state) => ({
          respostas: state.respostas.map((r) =>
            r.id === id ? { ...r, usos: r.usos + 1 } : r
          ),
        }));
      },

      buscarPorGatilho: (texto) => {
        const textoBuscado = texto.toLowerCase();
        return get().respostas.find((r) =>
          r.gatilho.toLowerCase().includes(textoBuscado) ||
          textoBuscado.includes(r.gatilho.toLowerCase())
        );
      },

      listar: () => get().respostas,
    }),
    {
      name: 'respostas-rapidas-store',
    }
  )
);

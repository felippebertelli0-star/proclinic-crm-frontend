/**
 * Tipos para o sistema Kanban
 * Premium AAA - Type-safe
 */

export type PrioridadeType = 'Alta' | 'Média' | 'Baixa';
export type OrigemType = 'Tráfego Pago' | 'Orgânico' | 'Indicação' | 'Direto';

export interface KanbanCard {
  id: string;
  nome: string;
  agente: string;
  prioridade: PrioridadeType;
  origem: OrigemType;
  tempo: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface KanbanColuna {
  id: string;
  titulo: string;
  cor: string;
  cards: KanbanCard[];
}

export interface Membro {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

export interface KanbanState {
  colunas: KanbanColuna[];
  expandedColumns: Record<string, boolean>;
  filterAgente: string;
  filterPrioridade: PrioridadeType | 'Todas';
  selectedMembro: string | null;
  modalEspiarVisivel: boolean;
  conversaSelecionada: KanbanCard | null;
  loading: boolean;
  error: string | null;

  // Actions
  setColunas: (colunas: KanbanColuna[]) => void;
  toggleColuna: (colId: string) => void;
  setFilterAgente: (agente: string) => void;
  setFilterPrioridade: (prioridade: PrioridadeType | 'Todas') => void;
  setSelectedMembro: (membro: string | null) => void;
  setModalEspiarVisivel: (visivel: boolean) => void;
  setConversaSelecionada: (card: KanbanCard | null) => void;
  moveCard: (cardId: string, colunaOrigem: string, colunaDestino: string, novaPos: number) => void;
  adicionarCard: (colunaId: string, card: KanbanCard) => void;
  removerCard: (cardId: string, colunaId: string) => void;
}

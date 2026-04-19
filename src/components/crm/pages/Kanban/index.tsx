/**
 * Kanban - Componente Principal
 * Sistema completo de Kanban com drag-and-drop, filtros de membros e modal
 * Premium AAA - Production Ready
 * Filas Dinâmicas - Baseado em sistema de filas (queues)
 */

'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useKanbanStore } from '@/store/kanbanStore';
import { useEquipeStore } from '@/store/equipeStore';
import { useFilasStore } from '@/store/filasStore';
import { KanbanCard as IKanbanCard, KanbanColuna } from '@/types/kanban';
import KanbanSummary from './KanbanSummary';
import KanbanMemberFilter from './KanbanMemberFilter';
import KanbanColumn from './KanbanColumn';
import KanbanModal from './KanbanModal';
import styles from './index.module.css';

// Mock data temporário (em produção, vir da API via filasStore)
// Este mock será substituído por dados reais da API
const MOCK_COLUNAS_TEMP: KanbanColuna[] = [
  {
    id: 'comercial',
    titulo: 'Comercial',
    cor: '#c9943a',
    cards: [
      {
        id: '1',
        nome: 'Ida Santos',
        agente: 'Hávila Rodrigues',
        prioridade: 'Alta',
        origem: 'Tráfego Pago',
        tempo: '2h 15m',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
      {
        id: '2',
        nome: 'Laura Ferreira',
        agente: 'Camilly Nunes',
        prioridade: 'Média',
        origem: 'Orgânico',
        tempo: '1h 30m',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ],
  },
  {
    id: 'secretaria',
    titulo: 'Secretária',
    cor: '#3498db',
    cards: [
      {
        id: '6',
        nome: 'Daniele Mantovani',
        agente: 'Camilly Nunes',
        prioridade: 'Média',
        origem: 'Tráfego Pago',
        tempo: '1h 45m',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ],
  },
  {
    id: 'ia',
    titulo: 'IA',
    cor: '#9b59b6',
    cards: [
      {
        id: '11',
        nome: 'Ana Beatriz',
        agente: 'Luana Costa',
        prioridade: 'Média',
        origem: 'Orgânico',
        tempo: '1h 10m',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ],
  },
  {
    id: 'suporte',
    titulo: 'Suporte',
    cor: '#2ecc71',
    cards: [
      {
        id: '14',
        nome: 'Carlota Mendes',
        agente: 'Camilly Nunes',
        prioridade: 'Média',
        origem: 'Tráfego Pago',
        tempo: '2h 5m',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ],
  },
  {
    id: 'agendando',
    titulo: 'Agendando',
    cor: '#f39c12',
    cards: [
      {
        id: '16',
        nome: 'Ana Paula',
        agente: 'Fernando Silva',
        prioridade: 'Média',
        origem: 'Indicação',
        tempo: '1h 25m',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    ],
  },
];

export function Kanban() {
  const {
    colunas,
    selectedMembro,
    modalEspiarVisivel,
    conversaSelecionada,
    setColunas,
    setSelectedMembro,
    setModalEspiarVisivel,
    setConversaSelecionada,
    moveCard,
    adicionarCard,
  } = useKanbanStore();

  const membros = useEquipeStore((state) => state.membros);
  const { filas } = useFilasStore();

  // Inicializar dados com mock (em produção, carregará de API)
  useEffect(() => {
    if (colunas.length === 0) {
      setColunas(MOCK_COLUNAS_TEMP);
    }
  }, [colunas.length, setColunas]);

  // Drag and Drop Handler
  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveCard(draggableId, source.droppableId, destination.droppableId, destination.index);
  }, [moveCard]);

  // Handlers
  const handleEspiarCard = useCallback((card: IKanbanCard) => {
    setConversaSelecionada(card);
    setModalEspiarVisivel(true);
  }, [setConversaSelecionada, setModalEspiarVisivel]);

  const handleAbrirCard = useCallback((card: IKanbanCard) => {
    // Em produção: navegar para página de conversa
    console.log('Abrindo conversa:', card.id, card.nome);
  }, []);

  const handleAdicionarCard = useCallback((colunaId: string) => {
    // Em produção: abrir modal de criação de card
    console.log('Adicionar card em:', colunaId);
  }, []);

  const handleFecharModal = useCallback(() => {
    setModalEspiarVisivel(false);
    setConversaSelecionada(null);
  }, [setModalEspiarVisivel, setConversaSelecionada]);

  // Handler para selecionar membro
  const handleSelectMembro = useCallback((membro: string | null) => {
    setSelectedMembro(membro);
  }, [setSelectedMembro]);

  return (
    <div className={styles.container}>
      {/* Summary */}
      <KanbanSummary colunas={colunas} />

      {/* Member Filter */}
      <KanbanMemberFilter
        membros={membros}
        selectedMembro={selectedMembro}
        onSelectMembro={handleSelectMembro}
      />

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {colunas.map((coluna) => (
            <KanbanColumn
              key={coluna.id}
              coluna={coluna}
              selectedMembro={selectedMembro}
              onEspiar={handleEspiarCard}
              onAbrir={handleAbrirCard}
              onAdicionarCard={handleAdicionarCard}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      <KanbanModal
        card={conversaSelecionada}
        visivel={modalEspiarVisivel}
        onFechar={handleFecharModal}
        onAbrir={handleAbrirCard}
      />
    </div>
  );
}

export default Kanban;

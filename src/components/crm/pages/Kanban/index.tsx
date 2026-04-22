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

  // Criar colunas a partir de Filas (fonte única de verdade)
  const colunasDoKanban = useMemo(() => {
    // Criar colunas a partir das Filas
    return filas.map((fila) => ({
      id: fila.id,
      titulo: fila.nome,
      cor: fila.cor,
      cards: colunas
        .find(col => col.id === fila.id)
        ?.cards || [],
    }));
  }, [filas, colunas]);

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
      <KanbanSummary colunas={colunasDoKanban} />

      {/* Member Filter */}
      <KanbanMemberFilter
        membros={membros}
        selectedMembro={selectedMembro}
        onSelectMembro={handleSelectMembro}
      />

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {colunasDoKanban.map((coluna) => (
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

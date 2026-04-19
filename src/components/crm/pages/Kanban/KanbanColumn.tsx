/**
 * KanbanColumn - Coluna Individual do Kanban
 * Com drag-and-drop, expand/collapse e agentes
 */

'use client';

import { memo, useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { useKanbanStore } from '@/store/kanbanStore';
import { useEquipeStore } from '@/store/equipeStore';
import { KanbanColuna, KanbanCard as IKanbanCard, Membro } from '@/types/kanban';
import { LayoutGrid, Plus, Minus } from 'lucide-react';
import KanbanCardComponent from './KanbanCard';
import styles from './KanbanColumn.module.css';

interface Props {
  coluna: KanbanColuna;
  filterAgente: string;
  filterPrioridade: string;
  selectedMembro: string | null;
  onEspiar: (card: IKanbanCard) => void;
  onAbrir: (card: IKanbanCard) => void;
  onAdicionarCard: (colunaId: string) => void;
}

const KanbanColumnComponent = memo(({
  coluna,
  filterAgente,
  filterPrioridade,
  selectedMembro,
  onEspiar,
  onAbrir,
  onAdicionarCard,
}: Props) => {
  const { expandedColumns, toggleColuna } = useKanbanStore();
  const membros = useEquipeStore((state) => state.membros);
  const isExpanded = expandedColumns[coluna.id] ?? true;

  // Memoized filter para performance
  const cardsFiltrados = useMemo(() => {
    return coluna.cards.filter((card) => {
      const matchAgente = filterAgente === 'Todos' || card.agente === filterAgente;
      const matchPrioridade = filterPrioridade === 'Todas' || card.prioridade === filterPrioridade;
      const matchMembro = selectedMembro === null || card.agente === selectedMembro;
      return matchAgente && matchPrioridade && matchMembro;
    });
  }, [coluna.cards, filterAgente, filterPrioridade, selectedMembro]);

  const handleToggleColuna = () => {
    toggleColuna(coluna.id);
  };

  return (
    <div className={styles.column} style={{ background: '#132636' }}>
      {/* Header */}
      <div
        className={styles.header}
        style={{
          borderTopColor: coluna.cor,
        }}
      >
        <div className={styles.titleSection}>
          <LayoutGrid size={14} style={{ color: coluna.cor, flexShrink: 0 }} aria-hidden="true" />
          <span className={styles.title}>{coluna.titulo}</span>
          <span
            className={styles.badge}
            style={{ color: coluna.cor, borderColor: `${coluna.cor}40` }}
            aria-label={`${cardsFiltrados.length} cards`}
          >
            {cardsFiltrados.length}
          </span>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.btnAction}
            style={{
              borderColor: `${coluna.cor}50`,
              color: coluna.cor,
            }}
            onClick={() => onAdicionarCard(coluna.id)}
            title="Adicionar novo card"
            aria-label={`Adicionar novo card em ${coluna.titulo}`}
          >
            <Plus size={14} aria-hidden="true" />
          </button>

          <button
            className={styles.btnAction}
            style={{
              borderColor: `${coluna.cor}50`,
              color: coluna.cor,
            }}
            onClick={handleToggleColuna}
            title={isExpanded ? 'Recolher coluna' : 'Expandir coluna'}
            aria-label={isExpanded ? `Recolher ${coluna.titulo}` : `Expandir ${coluna.titulo}`}
          >
            {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      {/* Conteúdo - Cards ou Agents */}
      {isExpanded ? (
        <Droppable droppableId={coluna.id} type="CARD">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`${styles.content} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
            >
              {cardsFiltrados.length > 0 ? (
                cardsFiltrados.map((card, index) => (
                  <KanbanCardComponent
                    key={card.id}
                    card={card}
                    index={index}
                    colunaId={coluna.id}
                    corColuna={coluna.cor}
                    onEspiar={onEspiar}
                    onAbrir={onAbrir}
                  />
                ))
              ) : (
                <div className={styles.empty}>Nenhum card</div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        // Collapsed State - Mostrar Agents
        <div className={styles.collapsedContent}>
          <div className={styles.agentLabel}>EQUIPE:</div>
          <div className={styles.agentChips}>
            {membros.map((membro) => (
              <button
                key={membro.id}
                className={styles.agentChip}
                style={{
                  borderColor: coluna.cor,
                  color: coluna.cor,
                }}
                title={membro.nome}
              >
                {membro.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botão Adicionar (apenas quando expandido) */}
      {isExpanded && (
        <div className={styles.footer} style={{ borderTopColor: '#1e3d54' }}>
          <button
            className={styles.btnAdd}
            onClick={() => onAdicionarCard(coluna.id)}
            style={{ color: coluna.cor }}
            title="Adicionar novo card"
            aria-label={`Adicionar novo card em ${coluna.titulo}`}
          >
            + Adicionar card
          </button>
        </div>
      )}
    </div>
  );
});

KanbanColumnComponent.displayName = 'KanbanColumn';

export default KanbanColumnComponent;

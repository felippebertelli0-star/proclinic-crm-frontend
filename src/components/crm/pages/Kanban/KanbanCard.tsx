/**
 * KanbanCard - Componente de Card Individual
 * Premium AAA - Otimizado para performance
 */

'use client';

import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { KanbanCard as IKanbanCard } from '@/types/kanban';
import { MessageSquare, Eye, Zap, User } from 'lucide-react';
import styles from './KanbanCard.module.css';

interface Props {
  card: IKanbanCard;
  index: number;
  colunaId: string;
  corColuna: string;
  onEspiar: (card: IKanbanCard) => void;
  onAbrir: (card: IKanbanCard) => void;
}

const KanbanCardComponent = memo(({
  card,
  index,
  colunaId,
  corColuna,
  onEspiar,
  onAbrir,
}: Props) => {
  const prioridadeConfig = {
    Alta: { cor: '#ff6b6b', label: 'RETORNO' },
    Média: { cor: '#ffa940', label: 'ACOMP.' },
    Baixa: { cor: '#52c41a', label: 'AGENDADO' },
  };

  const config = prioridadeConfig[card.prioridade];
  const initiais = card.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
          style={{
            ...provided.draggableProps.style,
            borderLeftColor: corColuna,
          }}
        >
          {/* Avatar + Nome */}
          <div className={styles.header}>
            <div
              className={styles.avatar}
              style={{
                background: `linear-gradient(135deg, ${corColuna} 0%, ${corColuna}dd 100%)`,
              }}
              title={card.nome}
            >
              {initiais}
            </div>

            <div className={styles.nomeSection}>
              <div className={styles.nome} title={card.nome}>
                {card.nome}
              </div>

              <div className={styles.metadata}>
                {card.agente && (
                  <div className={styles.metaItem} title={card.agente}>
                    <User size={9} />
                    <span>{card.agente}</span>
                  </div>
                )}

                {card.origem && (
                  <div className={styles.metaItem} title={card.origem}>
                    <Zap size={9} />
                    <span>{card.origem}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Indicator */}
            <div
              className={styles.statusIndicator}
              style={{ background: config.cor, boxShadow: `0 0 4px ${config.cor}60` }}
              title={`Prioridade: ${card.prioridade}`}
              aria-label={`Prioridade ${card.prioridade}`}
            />
          </div>

          {/* Badge Prioridade */}
          <div className={styles.badge} style={{ borderColor: config.cor, color: config.cor }}>
            {config.label}
          </div>

          {/* Divisor */}
          <div
            className={styles.divider}
            style={{ background: `linear-gradient(90deg, ${corColuna}30, transparent, ${corColuna}30)` }}
          />

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.btnAbrir}
              style={{ borderColor: `${corColuna}80`, color: corColuna }}
              onClick={() => onAbrir(card)}
              title="Abrir conversa completa"
              aria-label={`Abrir conversa de ${card.nome}`}
            >
              <MessageSquare size={10} />
              Abrir
            </button>

            <button
              className={styles.btnEspiar}
              onClick={() => onEspiar(card)}
              title="Visualizar preview"
              aria-label={`Visualizar preview de ${card.nome}`}
            >
              <Eye size={12} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
});

KanbanCardComponent.displayName = 'KanbanCard';

export default KanbanCardComponent;

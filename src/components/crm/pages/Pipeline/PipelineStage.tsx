/**
 * PipelineStage - Coluna do Funil de Vendas
 * Com suporte a drag-and-drop (Droppable)
 */

'use client';

import { memo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Users, Handshake, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Opportunity } from '@/store/pipelineStore';
import PipelineCard from './PipelineCard';
import styles from './PipelineStage.module.css';

interface Props {
  stageId: string;
  title: string;
  color: string;
  opportunities: Opportunity[];
  count: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'Novo Lead': <Users size={16} />,
  'Em Negociação': <Handshake size={16} />,
  'Agendou': <Calendar size={16} />,
  'Convertido': <CheckCircle size={16} />,
  'Não Agendou': <XCircle size={16} />,
};

const PipelineStageComponent = memo(({ stageId, title, color, opportunities, count }: Props) => {
  const totalValor = opportunities.reduce((sum, opp) => sum + opp.valor, 0);

  return (
    <div className={styles.coluna}>
      {/* HEADER */}
      <div className={styles.header} style={{ borderTopColor: color }}>
        <div className={styles.headerContent}>
          <div className={styles.titleGroup}>
            <div className={styles.iconWrapper} style={{ color }}>
              {iconMap[title] || <Users size={16} />}
            </div>
            <span className={styles.titulo}>{title}</span>
            <span className={styles.count}>{count}</span>
          </div>
          <div className={styles.valor} style={{ color }}>
            R$ {totalValor.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* DROPPABLE AREA PARA CARDS */}
      <Droppable droppableId={stageId} type="PIPELINE_CARD">
        {(provided, snapshot) => (
          <div
            className={styles.cardsContainer}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver ? `${color}15` : 'transparent',
              transition: 'background-color 0.2s ease-out',
            }}
          >
            {opportunities.map((opportunity, index) => (
              <PipelineCard
                key={opportunity.id}
                stageId={stageId}
                opportunity={opportunity}
                stagColor={color}
                index={index}
              />
            ))}

            {provided.placeholder}

            {opportunities.length === 0 && (
              <div className={styles.empty}>
                <div className={styles.emptyText}>Nenhuma oportunidade</div>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* BOTÃO ADICIONAR */}
      <div className={styles.footer}>
        <button
          className={styles.btnAdicionar}
          style={{ borderColor: `${color}80`, color: color }}
          title={`Adicionar oportunidade em ${title}`}
          aria-label={`Adicionar nova oportunidade em ${title}`}
        >
          + Adicionar
        </button>
      </div>
    </div>
  );
});

PipelineStageComponent.displayName = 'PipelineStage';

export default PipelineStageComponent;

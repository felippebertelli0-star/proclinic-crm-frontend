/**
 * Página Pipeline CRM - CRM ProClinic
 * Funil de vendas interativo com drag-and-drop
 */

'use client';

import { useState } from 'react';
import { TrendingUp, CheckCircle, Percent, DollarSign } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { usePipelineStore } from '@/store/pipelineStore';
import PipelineStage from './Pipeline/PipelineStage';
import PipelineSummary from './Pipeline/PipelineSummary';
import PipelineCreateOpportunityModal from './Pipeline/PipelineCreateOpportunityModal';
import styles from './Pipeline.module.css';

export function Pipeline() {
  const { estagios, moveCard } = usePipelineStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Calcular totais a partir do store
  const totalValor = estagios.reduce((acc, est) =>
    acc + est.opportunities.reduce((sum, opp) => sum + opp.valor, 0), 0
  );
  const totalOportunidades = estagios.reduce((acc, est) => acc + est.opportunities.length, 0);
  const convertidas = estagios.find(s => s.id === 'convertido')?.opportunities.length || 0;
  const taxaConversao = totalOportunidades > 0 ? ((convertidas / totalOportunidades) * 100).toFixed(1) : 0;
  const ticketMedio = totalOportunidades > 0 ? (totalValor / totalOportunidades).toFixed(0) : 0;

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Se não tem destino, mantém no lugar
    if (!destination) return;

    // Se dropped no mesmo lugar, não faz nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const cardId = parseInt(draggableId);
    moveCard(cardId, source.droppableId, destination.droppableId, destination.index);
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Pipeline de Oportunidades</h1>
          <p className={styles.headerInfo}>
            Clínica Dra. Andressa Barbarotti · {totalOportunidades} oportunidades · R$ {(totalValor / 1000).toFixed(1)}k no funil
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnVista}>Vista</button>
          <button
            className={styles.btnNovaOportunidade}
            onClick={() => setCreateModalOpen(true)}
          >
            + Nova Oportunidade
          </button>
        </div>
      </div>

      {/* RESUMO CARDS */}
      <div className={styles.summaryGrid}>
        {[
          { label: `R$ ${(totalValor / 1000).toFixed(1)}k`, value: 'Total no Funil', color: '#c9943a', icon: <TrendingUp size={18} /> },
          { label: convertidas, value: 'Convertidas', color: '#2ecc71', icon: <CheckCircle size={18} /> },
          { label: `${taxaConversao}%`, value: 'Taxa de Conversão', color: '#3498db', icon: <Percent size={18} /> },
          { label: `R$ ${ticketMedio}`, value: 'Ticket Médio', color: '#f39c12', icon: <DollarSign size={18} /> },
        ].map((card, idx) => (
          <div key={idx} className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryIcon} style={{ color: card.color }}>
                {card.icon}
              </div>
              <div className={styles.summaryValue} style={{ color: card.color }}>
                {card.label}
              </div>
            </div>
            <div className={styles.summaryLabel}>{card.value}</div>
          </div>
        ))}</div>

      {/* RESUMO VISUAL DAS SESSÕES */}
      <PipelineSummary />

      {/* PIPELINE KANBAN COM DRAG-AND-DROP */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.pipelineGrid}>
          {estagios.map((estagio) => (
            <PipelineStage
              key={estagio.id}
              stageId={estagio.id}
              title={estagio.titulo}
              color={estagio.cor}
              opportunities={estagio.opportunities}
              count={estagio.opportunities.length}
            />
          ))}
        </div>
      </DragDropContext>

      {/* MODAL DE CRIAR OPORTUNIDADE */}
      {createModalOpen && (
        <PipelineCreateOpportunityModal
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

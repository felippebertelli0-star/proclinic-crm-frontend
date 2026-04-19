/**
 * PipelineStage - Coluna do Funil de Vendas
 * Premium AAA - Otimizado para performance
 */

'use client';

import { memo } from 'react';
import PipelineCard from './PipelineCard';
import styles from './PipelineStage.module.css';

interface Opportunity {
  id: number;
  nome: string;
  valor: number;
  agente: string;
}

interface Props {
  title: string;
  color: string;
  opportunities: Opportunity[];
  count: number;
}

const PipelineStageComponent = memo(({ title, color, opportunities, count }: Props) => {
  return (
    <div className={styles.coluna} style={{ borderLeftColor: color }}>
      {/* HEADER */}
      <div className={styles.header} style={{ background: color }}>
        <span className={styles.titulo}>{title}</span>
        <span className={styles.count}>({count})</span>
      </div>

      {/* OPORTUNIDADES */}
      <div className={styles.cardsContainer}>
        {opportunities.map((opportunity) => (
          <PipelineCard key={opportunity.id} opportunity={opportunity} stagColor={color} />
        ))}

        {opportunities.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyText}>Nenhuma oportunidade</div>
          </div>
        )}
      </div>

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

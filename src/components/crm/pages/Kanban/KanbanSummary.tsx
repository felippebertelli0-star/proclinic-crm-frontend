/**
 * KanbanSummary - Cards de Resumo
 * Estatísticas do Kanban
 */

'use client';

import { memo, useMemo } from 'react';
import { KanbanColuna } from '@/types/kanban';
import styles from './KanbanSummary.module.css';

interface Props {
  colunas: KanbanColuna[];
}

const KanbanSummaryComponent = memo(({ colunas }: Props) => {
  const stats = useMemo(() => {
    const totalCards = colunas.reduce((acc, col) => acc + col.cards.length, 0);
    const naoLidos = colunas.reduce(
      (acc, col) => acc + col.cards.filter((c) => c.prioridade === 'Alta').length,
      0
    );
    const agendados = colunas.reduce(
      (acc, col) => acc + col.cards.filter((c) => c.prioridade === 'Baixa').length,
      0
    );
    const aProcessar = colunas.reduce(
      (acc, col) => acc + col.cards.filter((c) => c.prioridade === 'Média').length,
      0
    );

    return [
      { label: 'Total de Cards', value: totalCards, color: '#c9943a' },
      { label: 'Alta Prioridade', value: naoLidos, color: '#ff6b6b' },
      { label: 'Baixa Prioridade', value: agendados, color: '#52c41a' },
      { label: 'A Processar', value: aProcessar, color: '#ffa940' },
    ];
  }, [colunas]);

  return (
    <div className={styles.container}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={styles.card}
          style={{ borderColor: `${stat.color}30` }}
          role="status"
          aria-label={`${stat.label}: ${stat.value}`}
        >
          <div className={styles.label}>{stat.label}</div>
          <div className={styles.value} style={{ color: stat.color }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
});

KanbanSummaryComponent.displayName = 'KanbanSummary';

export default KanbanSummaryComponent;

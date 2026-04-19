/**
 * PipelineCard - Card Individual de Oportunidade
 * Premium AAA - Otimizado para performance
 */

'use client';

import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import styles from './PipelineCard.module.css';

interface Opportunity {
  id: number;
  nome: string;
  valor: number;
  agente: string;
}

interface Props {
  opportunity: Opportunity;
  stagColor: string;
}

const PipelineCardComponent = memo(({ opportunity, stagColor }: Props) => {
  const initials = opportunity.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <div
      className={styles.card}
      style={{
        borderLeftColor: stagColor,
      }}
    >
      {/* Avatar + Nome */}
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={{
            background: `linear-gradient(135deg, ${stagColor} 0%, ${stagColor}dd 100%)`,
          }}
          title={opportunity.nome}
        >
          {initials}
        </div>

        <div className={styles.nomeSection}>
          <div className={styles.nome} title={opportunity.nome}>
            {opportunity.nome}
          </div>

          <div className={styles.metadata}>
            {opportunity.agente && (
              <div className={styles.metaItem} title={opportunity.agente}>
                <span>{opportunity.agente}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={styles.statusIndicator}
          style={{ background: stagColor, boxShadow: `0 0 4px ${stagColor}60` }}
          title={`Estágio`}
          aria-label={`Estágio indicador`}
        />
      </div>

      {/* Divisor */}
      <div
        className={styles.divider}
        style={{ background: `linear-gradient(90deg, ${stagColor}30, transparent, ${stagColor}30)` }}
      />

      {/* Valor */}
      <div className={styles.valorSection}>
        <TrendingUp size={12} style={{ color: stagColor }} />
        <div className={styles.valor} style={{ color: stagColor }}>
          R$ {opportunity.valor.toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  );
});

PipelineCardComponent.displayName = 'PipelineCard';

export default PipelineCardComponent;

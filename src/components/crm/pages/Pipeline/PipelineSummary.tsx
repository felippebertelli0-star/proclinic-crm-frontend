/**
 * PipelineSummary - Resumo Visual das Sessões
 * Premium AAA - Interativo e atualizado em tempo real
 */

'use client';

import { memo } from 'react';
import { Users, Handshake, Calendar, CheckCircle, XCircle } from 'lucide-react';
import styles from './PipelineSummary.module.css';

interface Opportunity {
  id: number;
  nome: string;
  valor: number;
  agente: string;
}

interface Stage {
  id: string;
  title: string;
  color: string;
  opportunities: Opportunity[];
}

interface Props {
  stages: Stage[];
}

const iconMap: Record<string, React.ReactNode> = {
  'Novo Lead': <Users size={14} />,
  'Em Negociação': <Handshake size={14} />,
  'Agendou': <Calendar size={14} />,
  'Convertido': <CheckCircle size={14} />,
  'Não Agendou': <XCircle size={14} />,
};

const PipelineSummaryComponent = memo(({ stages }: Props) => {
  const totalOpportunidades = stages.reduce((sum, stage) => sum + stage.opportunities.length, 0);

  return (
    <div className={styles.container}>
      {stages.map((stage) => {
        const percentual = totalOpportunidades > 0
          ? ((stage.opportunities.length / totalOpportunidades) * 100).toFixed(0)
          : 0;

        return (
          <div
            key={stage.id}
            className={styles.card}
            style={{ borderLeftColor: stage.color }}
          >
            <div className={styles.header}>
              <div className={styles.iconWrapper} style={{ color: stage.color }}>
                {iconMap[stage.title] || <Users size={14} />}
              </div>
              <span className={styles.title}>{stage.title}</span>
            </div>

            <div className={styles.content}>
              <div className={styles.count}>{stage.opportunities.length}</div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${percentual}%`,
                    backgroundColor: stage.color,
                    boxShadow: `0 0 8px ${stage.color}60`
                  }}
                />
              </div>
              <div className={styles.percentualText} style={{ color: stage.color }}>
                {percentual}% do total
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

PipelineSummaryComponent.displayName = 'PipelineSummary';

export default PipelineSummaryComponent;

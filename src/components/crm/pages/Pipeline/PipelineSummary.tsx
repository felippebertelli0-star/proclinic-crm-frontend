/**
 * PipelineSummary - Resumo Visual das Sessões
 * Conectado ao store para atualizar em tempo real
 */

'use client';

import { memo } from 'react';
import { Users, Handshake, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { usePipelineStore } from '@/store/pipelineStore';
import styles from './PipelineSummary.module.css';

const iconMap: Record<string, React.ReactNode> = {
  'Novo Lead': <Users size={14} />,
  'Em Negociação': <Handshake size={14} />,
  'Agendou': <Calendar size={14} />,
  'Convertido': <CheckCircle size={14} />,
  'Não Agendou': <XCircle size={14} />,
};

const PipelineSummaryComponent = memo(() => {
  const { estagios, getStageTotal } = usePipelineStore();

  const totalOpportunidades = estagios.reduce((sum, stage) => sum + stage.opportunities.length, 0);

  return (
    <div className={styles.container}>
      {estagios.map((stage) => {
        const percentual = totalOpportunidades > 0
          ? ((stage.opportunities.length / totalOpportunidades) * 100).toFixed(0)
          : 0;

        return (
          <div
            key={stage.id}
            className={styles.card}
            style={{
              borderLeftColor: stage.cor,
              backgroundColor: `${stage.cor}26`,
              borderColor: `${stage.cor}40`,
            }}
          >
            <div className={styles.header}>
              <div className={styles.iconWrapper} style={{ color: stage.cor }}>
                {iconMap[stage.titulo] || <Users size={14} />}
              </div>
              <span className={styles.title}>{stage.titulo}</span>
            </div>

            <div className={styles.content}>
              <div className={styles.count}>{stage.opportunities.length}</div>
              <div className={styles.progressRow}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${percentual}%`,
                      backgroundColor: stage.cor,
                      boxShadow: `0 0 8px ${stage.cor}60`
                    }}
                  />
                </div>
                <div className={styles.percentualText} style={{ color: stage.cor }}>
                  {percentual}%
                </div>
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

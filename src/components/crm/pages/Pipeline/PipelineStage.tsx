/**
 * PipelineStage - Coluna do Funil de Vendas
 * Premium AAA - Otimizado para performance
 */

'use client';

import { memo } from 'react';
import { Users, Handshake, Calendar, CheckCircle, XCircle } from 'lucide-react';
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

const iconMap: Record<string, React.ReactNode> = {
  'Novo Lead': <Users size={16} />,
  'Em Negociação': <Handshake size={16} />,
  'Agendou': <Calendar size={16} />,
  'Convertido': <CheckCircle size={16} />,
  'Não Agendou': <XCircle size={16} />,
};

const PipelineStageComponent = memo(({ title, color, opportunities, count }: Props) => {
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

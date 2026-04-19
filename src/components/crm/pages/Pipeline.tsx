/**
 * Página Pipeline CRM - CRM ProClinic
 * 100% Fiel ao protótipo - Sales funnel com 5 estágios
 */

'use client';

import { useState } from 'react';
import { TrendingUp, CheckCircle, Percent, DollarSign } from 'lucide-react';
import PipelineStage from './Pipeline/PipelineStage';
import PipelineSummary from './Pipeline/PipelineSummary';
import styles from './Pipeline.module.css';

export function Pipeline() {
  const [viewMode, setViewMode] = useState('kanban');

  // Mock data de oportunidades por estágio
  const estagios = [
    {
      id: 'novo_lead',
      titulo: 'Novo Lead',
      cor: '#3498db',
      opportunities: [
        { id: 1, nome: 'João Silva', valor: 500, agente: 'Hávila' },
        { id: 2, nome: 'Maria Santos', valor: 800, agente: 'Camilly' },
        { id: 3, nome: 'Pedro Costa', valor: 1200, agente: 'Fernando' },
      ],
    },
    {
      id: 'negociacao',
      titulo: 'Em Negociação',
      cor: '#f39c12',
      opportunities: [
        { id: 4, nome: 'Ana Paula', valor: 1500, agente: 'Hávila' },
        { id: 5, nome: 'Carlos Mendes', valor: 2000, agente: 'Camilly' },
      ],
    },
    {
      id: 'agendou',
      titulo: 'Agendou',
      cor: '#2ecc71',
      opportunities: [
        { id: 6, nome: 'Lucia Ferreira', valor: 1800, agente: 'Hávila' },
        { id: 7, nome: 'Roberto Cunha', valor: 1200, agente: 'Fernando' },
      ],
    },
    {
      id: 'convertido',
      titulo: 'Convertido',
      cor: '#27ae60',
      opportunities: [
        { id: 8, nome: 'Patricia Lima', valor: 2500, agente: 'Camilly' },
        { id: 9, nome: 'Daniel Alves', valor: 1700, agente: 'Hávila' },
      ],
    },
    {
      id: 'nao_agendou',
      titulo: 'Não Agendou',
      cor: '#e74c3c',
      opportunities: [
        { id: 10, nome: 'Gabriela Silva', valor: 900, agente: 'Fernando' },
        { id: 11, nome: 'Helena Costa', valor: 600, agente: 'Camilly' },
      ],
    },
  ];

  // Calcular totais
  const totalValor = estagios.reduce((acc, est) =>
    acc + est.opportunities.reduce((sum, opp) => sum + opp.valor, 0), 0
  );
  const totalOportunidades = estagios.reduce((acc, est) => acc + est.opportunities.length, 0);
  const convertidas = estagios[3].opportunities.length;
  const taxaConversao = ((convertidas / totalOportunidades) * 100).toFixed(1);
  const ticketMedio = (totalValor / totalOportunidades).toFixed(0);

  return (
    <div className={styles.container}>
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
            </div>
            <div className={styles.summaryValue} style={{ color: card.color }}>
              {card.label}
            </div>
            <div className={styles.summaryLabel}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* RESUMO VISUAL DAS SESSÕES */}
      <PipelineSummary
        stages={estagios.map((est) => ({
          id: est.id,
          title: est.titulo,
          color: est.cor,
          opportunities: est.opportunities,
        }))}
      />

      {/* AÇÕES */}
      <div className={styles.actionsBar}>
        <button className={styles.btnNovaOportunidade}>
          + Nova Oportunidade
        </button>

        <button className={styles.btnVista}>
          Vista
        </button>
      </div>

      {/* PIPELINE KANBAN */}
      <div className={styles.pipelineGrid}>
        {estagios.map((estagio) => (
          <PipelineStage
            key={estagio.id}
            title={estagio.titulo}
            color={estagio.cor}
            opportunities={estagio.opportunities}
            count={estagio.opportunities.length}
          />
        ))}
      </div>
    </div>
  );
}

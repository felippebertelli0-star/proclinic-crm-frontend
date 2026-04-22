/**
 * Página: Filas
 * Gerenciar filas de atendimento com cards Premium AAA
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { Users, Clock } from 'lucide-react';
import styles from '@/components/crm/pages/Calendario.module.css';

interface Fila {
  id: number;
  nome: string;
  descricao: string;
  status: 'ativa' | 'pausada';
  totalAtendimentos: number;
  atendimentosCompletos: number;
  tempoMedio: number;
  agentesAtivos: number;
  ultimaAtualizacao: string;
}

const filasData: Fila[] = [
  {
    id: 1,
    nome: 'Fila Principal',
    descricao: 'Atendimento geral de pacientes',
    status: 'ativa',
    totalAtendimentos: 45,
    atendimentosCompletos: 38,
    tempoMedio: 15,
    agentesAtivos: 3,
    ultimaAtualizacao: '2026-04-22T10:30:00'
  },
  {
    id: 2,
    nome: 'Fila Emergência',
    descricao: 'Atendimento prioritário',
    status: 'ativa',
    totalAtendimentos: 12,
    atendimentosCompletos: 10,
    tempoMedio: 8,
    agentesAtivos: 2,
    ultimaAtualizacao: '2026-04-22T11:15:00'
  },
  {
    id: 3,
    nome: 'Fila Agendamentos',
    descricao: 'Confirmação de consultas',
    status: 'ativa',
    totalAtendimentos: 28,
    atendimentosCompletos: 25,
    tempoMedio: 5,
    agentesAtivos: 1,
    ultimaAtualizacao: '2026-04-22T09:45:00'
  },
  {
    id: 4,
    nome: 'Fila Suporte',
    descricao: 'Dúvidas e problemas gerais',
    status: 'pausada',
    totalAtendimentos: 18,
    atendimentosCompletos: 15,
    tempoMedio: 12,
    agentesAtivos: 0,
    ultimaAtualizacao: '2026-04-22T08:20:00'
  },
  {
    id: 5,
    nome: 'Fila Cobranças',
    descricao: 'Atendimento de pagamentos',
    status: 'ativa',
    totalAtendimentos: 22,
    atendimentosCompletos: 20,
    tempoMedio: 10,
    agentesAtivos: 2,
    ultimaAtualizacao: '2026-04-22T11:00:00'
  },
  {
    id: 6,
    nome: 'Fila Follow-up',
    descricao: 'Acompanhamento pós-atendimento',
    status: 'ativa',
    totalAtendimentos: 35,
    atendimentosCompletos: 32,
    tempoMedio: 7,
    agentesAtivos: 2,
    ultimaAtualizacao: '2026-04-22T10:50:00'
  },
];

export default function FilasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // Cálculos de estatísticas
  const filaStats = useMemo(() => {
    return {
      total: filasData.length,
      ativas: filasData.filter((f) => f.status === 'ativa').length,
      totalAtendimentos: filasData.reduce((sum, f) => sum + f.totalAtendimentos, 0),
      tempoMedioGeral:
        Math.round(
          filasData.reduce((sum, f) => sum + f.tempoMedio, 0) / filasData.length,
        ) || 0,
    };
  }, []);

  const filasFiltradas = useMemo(() => {
    let resultado = filasData;
    if (searchTerm) {
      resultado = resultado.filter((f) =>
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      resultado = resultado.filter((f) => f.status === statusFilter);
    }
    return resultado;
  }, [searchTerm, statusFilter]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Filas de Atendimento</h1>
          <p className={styles.subtitle}>Gerenciar filas e distribuição de pacientes</p>

          {/* Filtros de Status */}
          <div className={styles.botoesContainer}>
            <button
              onClick={() => handleStatusFilter('')}
              className={`${styles.botaoMes} ${!statusFilter ? styles.active : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => handleStatusFilter('ativa')}
              className={`${styles.botaoMes} ${statusFilter === 'ativa' ? styles.active : ''}`}
            >
              Ativas
            </button>
            <button
              onClick={() => handleStatusFilter('pausada')}
              className={`${styles.botaoMes} ${statusFilter === 'pausada' ? styles.active : ''}`}
            >
              Pausadas
            </button>
          </div>
        </div>
        <button className={styles.btnNova}>
          <Users size={16} style={{ marginRight: '6px' }} />
          Nova Fila
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Filas</span>
          <span className={styles.statValue}>{filaStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Filas Ativas</span>
          <span className={styles.statValue}>{filaStats.ativas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Atendimentos</span>
          <span className={styles.statValue}>{filaStats.totalAtendimentos}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Tempo Médio (min)</span>
          <span className={styles.statValue}>{filaStats.tempoMedioGeral}</span>
        </div>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nome da fila..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Grid de Filas */}
      {filasFiltradas.length > 0 ? (
        <div className={styles.gridCards}>
          {filasFiltradas.map((fila) => {
            const percentualCompleto = Math.round(
              (fila.atendimentosCompletos / fila.totalAtendimentos) * 100,
            );

            return (
              <div key={fila.id} className={styles.estrategiaCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{fila.nome}</h3>
                  <span className={styles.cardType}>{fila.status === 'ativa' ? '🟢 Ativa' : '⭕ Pausada'}</span>
                </div>

                <p className={styles.cardDescription}>{fila.descricao}</p>

                <div className={styles.cardStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Atendimentos</span>
                    <span className={styles.statItemValue}>{fila.totalAtendimentos}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Completos</span>
                    <span className={styles.statItemValue}>{fila.atendimentosCompletos}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Tempo Médio</span>
                    <span className={styles.statItemValue}>{fila.tempoMedio}min</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Agentes</span>
                    <span className={styles.statItemValue}>{fila.agentesAtivos}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(201, 148, 58, 0.1)' }}>
                  <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '4px' }}>
                    Taxa de Conclusão: {percentualCompleto}%
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#0d1f2d', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentualCompleto}%`,
                        height: '100%',
                        background: '#c9943a',
                        transition: 'width 0.2s ease-out'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>Nenhuma fila encontrada</p>
          <p className={styles.emptySubtitle}>Crie sua primeira fila de atendimento</p>
        </div>
      )}
    </div>
  );
}

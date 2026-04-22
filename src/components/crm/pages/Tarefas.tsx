/**
 * Página: Tarefas
 * Gerenciar tarefas com cards Premium AAA
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import styles from './Calendario.module.css';

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em andamento' | 'concluido';
  percentualConclusao: number;
  dataVencimento: string;
}

const tarefasDados: Tarefa[] = [
  {
    id: 1,
    titulo: 'Implementar Dashboard',
    descricao: 'Criar nova tela de análise de dados',
    responsavel: 'João Silva',
    prioridade: 'alta',
    status: 'em andamento',
    percentualConclusao: 65,
    dataVencimento: '2026-04-25'
  },
  {
    id: 2,
    titulo: 'Revisar Código PR #42',
    descricao: 'Code review da feature de autenticação',
    responsavel: 'Helena Gomes',
    prioridade: 'media',
    status: 'pendente',
    percentualConclusao: 0,
    dataVencimento: '2026-04-23'
  },
  {
    id: 3,
    titulo: 'Preparar Apresentação Q2',
    descricao: 'Slides para reunião de stakeholders',
    responsavel: 'Ana Costa',
    prioridade: 'alta',
    status: 'em andamento',
    percentualConclusao: 40,
    dataVencimento: '2026-04-24'
  },
  {
    id: 4,
    titulo: 'Testar Fluxo de Pagamento',
    descricao: 'QA completo da integração com Stripe',
    responsavel: 'Carlos Mendes',
    prioridade: 'alta',
    status: 'concluido',
    percentualConclusao: 100,
    dataVencimento: '2026-04-22'
  },
  {
    id: 5,
    titulo: 'Atualizar Documentação API',
    descricao: 'Documentação dos novos endpoints',
    responsavel: 'Fernanda Lima',
    prioridade: 'media',
    status: 'pendente',
    percentualConclusao: 20,
    dataVencimento: '2026-04-28'
  },
  {
    id: 6,
    titulo: 'Reunião com Cliente X',
    descricao: 'Apresentação de prototipo',
    responsavel: 'João Silva',
    prioridade: 'alta',
    status: 'concluido',
    percentualConclusao: 100,
    dataVencimento: '2026-04-20'
  },
  {
    id: 7,
    titulo: 'Otimizar Performance',
    descricao: 'Melhorar tempo de carregamento das páginas',
    responsavel: 'Carlos Mendes',
    prioridade: 'media',
    status: 'em andamento',
    percentualConclusao: 30,
    dataVencimento: '2026-04-30'
  },
  {
    id: 8,
    titulo: 'Backup de Dados',
    descricao: 'Backup semanal dos banco de dados',
    responsavel: 'Admin',
    prioridade: 'baixa',
    status: 'concluido',
    percentualConclusao: 100,
    dataVencimento: '2026-04-22'
  },
];

export function Tarefas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handlePrioridadeFilter = (value: string) => {
    setPrioridadeFilter(value);
  };

  // Cálculos de estatísticas
  const taskStats = useMemo(() => {
    return {
      total: tarefasDados.length,
      pendente: tarefasDados.filter((t) => t.status === 'pendente').length,
      emAndamento: tarefasDados.filter((t) => t.status === 'em andamento').length,
      concluido: tarefasDados.filter((t) => t.status === 'concluido').length,
    };
  }, []);

  const tarefasFiltradas = useMemo(() => {
    let resultado = tarefasDados;
    if (searchTerm) {
      resultado = resultado.filter((t) =>
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      resultado = resultado.filter((t) => t.status === statusFilter);
    }
    if (prioridadeFilter) {
      resultado = resultado.filter((t) => t.prioridade === prioridadeFilter);
    }
    return resultado;
  }, [searchTerm, statusFilter, prioridadeFilter]);

  const getStatusEmoji = (status: string) => {
    switch(status) {
      case 'pendente': return '⭕';
      case 'em andamento': return '🔄';
      case 'concluido': return '✅';
      default: return '📋';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch(prioridade) {
      case 'alta': return '#ef4444';
      case 'media': return '#f97316';
      case 'baixa': return '#22c55e';
      default: return '#c9943a';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Tarefas</h1>
          <p className={styles.subtitle}>Gerenciar tarefas e atividades da equipe</p>

          {/* Filtros de Status */}
          <div className={styles.botoesContainer}>
            <button
              onClick={() => handleStatusFilter('')}
              className={`${styles.botaoMes} ${!statusFilter ? styles.active : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => handleStatusFilter('pendente')}
              className={`${styles.botaoMes} ${statusFilter === 'pendente' ? styles.active : ''}`}
            >
              Pendentes
            </button>
            <button
              onClick={() => handleStatusFilter('em andamento')}
              className={`${styles.botaoMes} ${statusFilter === 'em andamento' ? styles.active : ''}`}
            >
              Em Andamento
            </button>
            <button
              onClick={() => handleStatusFilter('concluido')}
              className={`${styles.botaoMes} ${statusFilter === 'concluido' ? styles.active : ''}`}
            >
              Concluídas
            </button>
          </div>
        </div>
        <button className={styles.btnNova}>
          ✓ Nova Tarefa
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Tarefas</span>
          <span className={styles.statValue}>{taskStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pendentes</span>
          <span className={styles.statValue}>{taskStats.pendente}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Em Andamento</span>
          <span className={styles.statValue}>{taskStats.emAndamento}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Concluídas</span>
          <span className={styles.statValue}>{taskStats.concluido}</span>
        </div>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Filtros de Prioridade */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handlePrioridadeFilter('')}
          className={`${styles.botaoMes} ${!prioridadeFilter ? styles.active : ''}`}
        >
          Todas as Prioridades
        </button>
        {['alta', 'media', 'baixa'].map((prioridade) => (
          <button
            key={prioridade}
            onClick={() => handlePrioridadeFilter(prioridade)}
            className={`${styles.botaoMes} ${prioridadeFilter === prioridade ? styles.active : ''}`}
          >
            {prioridade.charAt(0).toUpperCase() + prioridade.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid de Tarefas */}
      {tarefasFiltradas.length > 0 ? (
        <div className={styles.gridCards}>
          {tarefasFiltradas.map((tarefa) => (
            <div key={tarefa.id} className={styles.estrategiaCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{tarefa.titulo}</h3>
                <span className={styles.cardType} style={{ background: `rgba(${
                  tarefa.prioridade === 'alta' ? '239, 68, 68' :
                  tarefa.prioridade === 'media' ? '249, 115, 22' :
                  '34, 197, 94'
                }, 0.15)`, color: getPrioridadeColor(tarefa.prioridade) }}>
                  {tarefa.prioridade === 'alta' ? '🔴' : tarefa.prioridade === 'media' ? '🟠' : '🟢'} {tarefa.prioridade}
                </span>
              </div>

              <p className={styles.cardDescription}>{tarefa.descricao}</p>

              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Status</span>
                  <span className={styles.statItemValue}>{getStatusEmoji(tarefa.status)} {tarefa.status.toUpperCase()}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Responsável</span>
                  <span className={styles.statItemValue}>{tarefa.responsavel}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Vencimento</span>
                  <span className={styles.statItemValue} style={{ fontSize: '11px' }}>
                    {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Progresso</span>
                  <span className={styles.statItemValue}>{tarefa.percentualConclusao}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(201, 148, 58, 0.1)' }}>
                <div style={{ width: '100%', height: '4px', background: '#0d1f2d', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${tarefa.percentualConclusao}%`,
                      height: '100%',
                      background: '#c9943a',
                      transition: 'width 0.2s ease-out'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✓</div>
          <p className={styles.emptyTitle}>Nenhuma tarefa encontrada</p>
          <p className={styles.emptySubtitle}>Você está em dia com suas tarefas!</p>
        </div>
      )}
    </div>
  );
}

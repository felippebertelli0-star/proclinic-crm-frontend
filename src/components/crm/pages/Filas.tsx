/**
 * Página: Filas
 * Gerenciar filas de atendimento com cards Premium AAA
 * Sincronização em tempo real com métricas dinâmicas
 * Qualidade: ULTRA MEGA PREMIUM AAA
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  Trash2,
  Search,
  Inbox,
  Activity,
  Ticket,
  Timer,
  Gauge,
  Settings2,
  Users,
  Plus,
  Pause,
} from 'lucide-react';
import styles from './Filas.module.css';
import { useFilasStore } from '@/store/filasStore';
import { CreateFilaModal } from './Filas/CreateFilaModal';
import { useFilaSync } from '@/hooks/useFilaSync';

// Mock de conversas para sincronização
const CONVERSAS_MOCK = [
  {
    id: '1',
    filaId: 'fila_1',
    abertoEm: '2026-04-22T10:00:00',
    ultimaMsgEm: '2026-04-22T10:30:00',
  },
  {
    id: '2',
    filaId: 'fila_1',
    abertoEm: '2026-04-22T09:30:00',
    ultimaMsgEm: '2026-04-22T10:15:00',
  },
  {
    id: '3',
    filaId: 'fila_2',
    abertoEm: '2026-04-22T10:15:00',
    ultimaMsgEm: '2026-04-22T10:22:00',
  },
];

// Mock de membros da equipe
const MEMBROS_MOCK = [
  { id: 'agente_1', nome: 'João Silva', avatarColor: '#3498db', status: 'online' as const },
  { id: 'agente_2', nome: 'Maria Santos', avatarColor: '#e91e63', status: 'online' as const },
  { id: 'agente_3', nome: 'Carlos Mendes', avatarColor: '#2ecc71', status: 'offline' as const },
  { id: 'agente_4', nome: 'Ana Costa', avatarColor: '#f39c12', status: 'online' as const },
  { id: 'agente_5', nome: 'Fernanda Lima', avatarColor: '#9c27b0', status: 'online' as const },
];

// Mock de filas iniciais
const FILAS_INICIAIS = [
  {
    id: 'fila_1',
    nome: 'Fila Principal',
    descricao: 'Atendimento geral de pacientes',
    status: 'ativa' as const,
    cor: '#c9943a',
    agenteIds: ['agente_1', 'agente_2'],
    totalTickets: 2,
    tmr: 22,
    slaPercentual: 100,
    ultimaAtualizacao: new Date().toISOString(),
  },
  {
    id: 'fila_2',
    nome: 'Fila Emergência',
    descricao: 'Atendimento prioritário',
    status: 'ativa' as const,
    cor: '#e91e63',
    agenteIds: ['agente_3', 'agente_4'],
    totalTickets: 1,
    tmr: 7,
    slaPercentual: 100,
    ultimaAtualizacao: new Date().toISOString(),
  },
  {
    id: 'fila_3',
    nome: 'Fila Agendamentos',
    descricao: 'Confirmação de consultas',
    status: 'ativa' as const,
    cor: '#2ecc71',
    agenteIds: ['agente_5'],
    totalTickets: 0,
    tmr: 0,
    slaPercentual: 100,
    ultimaAtualizacao: new Date().toISOString(),
  },
  {
    id: 'fila_4',
    nome: 'Fila Suporte',
    descricao: 'Dúvidas e problemas gerais',
    status: 'pausada' as const,
    cor: '#9c27b0',
    agenteIds: [],
    totalTickets: 0,
    tmr: 0,
    slaPercentual: 100,
    ultimaAtualizacao: new Date().toISOString(),
  },
  {
    id: 'fila_5',
    nome: 'teste',
    descricao: '',
    status: 'ativa' as const,
    cor: '#1abc9c',
    agenteIds: ['agente_1'],
    totalTickets: 0,
    tmr: 0,
    slaPercentual: 100,
    ultimaAtualizacao: new Date().toISOString(),
  },
];

export function Filas() {
  const { filas, setFilas, addFila, deleteFila } = useFilasStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativas' | 'pausadas'>('todos');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [carregandoModal, setCarregandoModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filaParaDeletar, setFilaParaDeletar] = useState<string | null>(null);

  // Inicializar filas se estiverem vazias
  useEffect(() => {
    if (filas.length === 0) {
      console.log('[FILAS] ✓ Inicializando filas com mock data');
      setFilas(FILAS_INICIAIS);
    }
  }, [filas.length, setFilas]);

  // Sincronizar filas com conversas (real-time)
  useFilaSync(CONVERSAS_MOCK, 30000);

  // Handler: Criar nova fila
  const handleCreateFila = useCallback(
    async (novaFilaData: {
      nome: string;
      descricao?: string;
      cor: string;
      agenteIds: string[];
      status: 'ativa' | 'pausada';
    }) => {
      setCarregandoModal(true);

      try {
        console.log('[FILAS] ✓ Criando nova fila:', novaFilaData.nome);

        const novaFila = {
          id: `fila_${Date.now()}`,
          ...novaFilaData,
          totalTickets: 0,
          tmr: 0,
          slaPercentual: 100,
          ultimaAtualizacao: new Date().toISOString(),
        };

        addFila(novaFila);

        console.log('[FILAS] ✓ Fila criada com sucesso');
      } catch (erro) {
        const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
        console.error('[FILAS] ✗ Erro ao criar fila:', mensagem);
        throw erro;
      } finally {
        setCarregandoModal(false);
      }
    },
    [addFila]
  );

  // Filtrar filas
  const filasFiltradas = useMemo(() => {
    return filas.filter((fila) => {
      if (statusFilter === 'ativas' && fila.status !== 'ativa') return false;
      if (statusFilter === 'pausadas' && fila.status !== 'pausada') return false;

      if (
        searchTerm &&
        !fila.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !fila.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [filas, statusFilter, searchTerm]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    return {
      total: filas.length,
      ativas: filas.filter((f) => f.status === 'ativa').length,
      pausadas: filas.filter((f) => f.status === 'pausada').length,
      totalTickets: filas.reduce((sum, f) => sum + f.totalTickets, 0),
      tmrMedio: filas.length > 0 ? Math.round(filas.reduce((sum, f) => sum + f.tmr, 0) / filas.length) : 0,
      slaMedio: filas.length > 0 ? Math.round(filas.reduce((sum, f) => sum + f.slaPercentual, 0) / filas.length) : 0,
    };
  }, [filas]);

  // Obter membros da fila
  const getMembrosOfFila = useCallback(
    (filaId: string) => {
      const fila = filas.find((f) => f.id === filaId);
      if (!fila) return [];
      return MEMBROS_MOCK.filter((m) => fila.agenteIds.includes(m.id));
    },
    [filas]
  );

  // Handler: Abrir modal de exclusão
  const handleAbrirDeleteModal = useCallback((filaId: string) => {
    setFilaParaDeletar(filaId);
    setDeleteModalOpen(true);
  }, []);

  // Handler: Confirmar exclusão
  const handleConfirmarDelete = useCallback(() => {
    if (filaParaDeletar) {
      console.log('[FILAS] ✓ Deletando fila:', filaParaDeletar);
      deleteFila(filaParaDeletar);
      setDeleteModalOpen(false);
      setFilaParaDeletar(null);
      console.log('[FILAS] ✓ Fila deletada com sucesso');
    }
  }, [filaParaDeletar, deleteFila]);

  // Handler: Cancelar exclusão
  const handleCancelarDelete = useCallback(() => {
    setDeleteModalOpen(false);
    setFilaParaDeletar(null);
  }, []);

  // Mouse tracker for card radial glow
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const slaColorClass = (sla: number) =>
    sla >= 80 ? styles.metricValueGreen : sla >= 60 ? styles.metricValueOrange : styles.metricValueRed;

  return (
    <div className={styles.container}>
      {/* HEADER HERO */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} /> Atendimento · Distribuição Inteligente
          </span>
          <h1 className={styles.title}>Filas de Atendimento</h1>
          <p className={styles.subtitle}>
            <strong>{stats.total}</strong> filas · <strong>{stats.ativas}</strong> ativas · <strong>{stats.totalTickets}</strong> tickets em espera
          </p>

          <div className={styles.filterGroup}>
            <button
              onClick={() => setStatusFilter('todos')}
              className={`${styles.filterBtn} ${statusFilter === 'todos' ? styles.filterBtnActive : ''}`}
            >
              Todos ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('ativas')}
              className={`${styles.filterBtn} ${statusFilter === 'ativas' ? styles.filterBtnActive : ''}`}
            >
              Ativas ({stats.ativas})
            </button>
            <button
              onClick={() => setStatusFilter('pausadas')}
              className={`${styles.filterBtn} ${statusFilter === 'pausadas' ? styles.filterBtnActive : ''}`}
            >
              Pausadas ({stats.pausadas})
            </button>
          </div>
        </div>

        <button onClick={() => setCreateModalOpen(true)} className={styles.btnNova}>
          <Plus size={16} strokeWidth={2.6} />
          Nova Fila
        </button>
      </div>

      {/* STATS GRID */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><Inbox size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBody}>
            <span className={styles.statLabel}>Total de Filas</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><Activity size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBody}>
            <span className={styles.statLabel}>Ativas</span>
            <span className={styles.statValue}>{stats.ativas}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><Ticket size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBody}>
            <span className={styles.statLabel}>Tickets na Fila</span>
            <span className={styles.statValue}>{stats.totalTickets}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><Timer size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBody}>
            <span className={styles.statLabel}>TMR Médio</span>
            <span className={styles.statValue}>{stats.tmrMedio}min</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><Gauge size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBody}>
            <span className={styles.statLabel}>SLA Médio</span>
            <span className={styles.statValue}>{stats.slaMedio}%</span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <Search size={16} className={styles.searchIcon} strokeWidth={2.2} />
      </div>

      {/* GRID DE FILAS */}
      {filasFiltradas.length > 0 ? (
        <div className={styles.grid}>
          {filasFiltradas.map((fila) => {
            const membros = getMembrosOfFila(fila.id);

            return (
              <div
                key={fila.id}
                className={styles.card}
                onMouseMove={handleCardMove}
                style={{ ['--fila-color' as string]: fila.cor } as React.CSSProperties}
              >
                <button
                  onClick={() => handleAbrirDeleteModal(fila.id)}
                  className={styles.deleteBtn}
                  title="Deletar fila"
                  aria-label={`Deletar fila ${fila.nome}`}
                >
                  <Trash2 size={14} strokeWidth={2.3} />
                </button>

                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <div className={styles.cardTitleRow}>
                      <h3 className={styles.cardTitle}>{fila.nome}</h3>
                      <span className={`${styles.statusBadge} ${fila.status === 'ativa' ? styles.statusAtiva : styles.statusPausada}`}>
                        <span
                          className={styles.statusDot}
                          style={{
                            background: fila.status === 'ativa' ? '#2ecc71' : '#f39c12',
                            boxShadow: `0 0 6px ${fila.status === 'ativa' ? '#2ecc71' : '#f39c12'}`,
                          }}
                        />
                        {fila.status === 'ativa' ? 'Ativa' : 'Pausada'}
                      </span>
                    </div>
                    {fila.descricao && <p className={styles.cardDescription}>{fila.descricao}</p>}
                  </div>

                  <div className={styles.ticketPill}>
                    <span className={styles.ticketValue}>{fila.totalTickets}</span>
                    <span className={styles.ticketLabel}>Tickets</span>
                  </div>
                </div>

                <div className={styles.metricsRow}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricLabel}>⏱ Tempo de Resposta</span>
                    <span className={`${styles.metricValue} ${styles.metricValueTmr}`}>
                      {fila.tmr} min
                    </span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={styles.metricLabel}>📊 SLA</span>
                    <span className={`${styles.metricValue} ${slaColorClass(fila.slaPercentual)}`}>
                      {fila.slaPercentual}%
                    </span>
                  </div>
                </div>

                <div className={styles.slaWrap}>
                  <div className={styles.slaLabel}>
                    <span>Performance SLA</span>
                    <strong>{fila.slaPercentual}%</strong>
                  </div>
                  <div className={styles.slaTrack}>
                    <div className={styles.slaFill} style={{ width: `${fila.slaPercentual}%` }} />
                  </div>
                </div>

                {membros.length > 0 && (
                  <div className={styles.membros}>
                    {membros.map((m) => (
                      <span
                        key={m.id}
                        className={styles.membroBadge}
                        style={{ ['--membro-color' as string]: m.avatarColor } as React.CSSProperties}
                      >
                        <span className={styles.membroAvatar} style={{ background: m.avatarColor }}>
                          {m.nome[0]}
                        </span>
                        {m.nome.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.actions}>
                  <button className={styles.btnPrimary}>
                    <Settings2 size={13} strokeWidth={2.4} />
                    Config
                  </button>
                  <button className={styles.btnSecondary}>
                    <Users size={13} strokeWidth={2.4} />
                    Membros
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>Nenhuma fila encontrada</p>
          <p className={styles.emptySubtitle}>
            {searchTerm ? 'Tente ajustar seus filtros' : 'Crie sua primeira fila de atendimento'}
          </p>
        </div>
      )}

      {/* Modal: Criar Fila */}
      <CreateFilaModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateFila}
        membros={MEMBROS_MOCK}
        carregando={carregandoModal}
      />

      {/* Modal: Confirmar Exclusão */}
      {deleteModalOpen && (
        <>
          <div onClick={handleCancelarDelete} className={styles.modalBackdrop} />
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>
                <AlertCircle size={22} strokeWidth={2.3} />
              </span>
              <h2 id="delete-title" className={styles.modalTitle}>Confirmar Exclusão</h2>
            </div>

            <p className={styles.modalText}>
              Tem certeza que deseja excluir a fila{' '}
              <strong>"{filas.find((f) => f.id === filaParaDeletar)?.nome}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className={styles.modalActions}>
              <button onClick={handleCancelarDelete} className={styles.btnCancel}>
                Cancelar
              </button>
              <button onClick={handleConfirmarDelete} className={styles.btnDanger}>
                <Trash2 size={14} strokeWidth={2.4} />
                Sim, Excluir
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Filas;

/**
 * Página: Filas
 * Gerenciar filas de atendimento com cards Premium AAA
 * Sincronização em tempo real com métricas dinâmicas
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Clock, AlertCircle, Trash2 } from 'lucide-react';
import styles from './Calendario.module.css';
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
      // Filtro status
      if (statusFilter === 'ativas' && fila.status !== 'ativa') return false;
      if (statusFilter === 'pausadas' && fila.status !== 'pausada') return false;

      // Filtro busca
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
              onClick={() => setStatusFilter('todos')}
              className={`${styles.botaoMes} ${statusFilter === 'todos' ? styles.active : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('ativas')}
              className={`${styles.botaoMes} ${statusFilter === 'ativas' ? styles.active : ''}`}
            >
              Ativas
            </button>
            <button
              onClick={() => setStatusFilter('pausadas')}
              className={`${styles.botaoMes} ${statusFilter === 'pausadas' ? styles.active : ''}`}
            >
              Pausadas
            </button>
          </div>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className={styles.btnNova}
          style={{ cursor: 'pointer' }}
        >
          🔌 Nova Fila
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Filas</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Ativas</span>
          <span className={styles.statValue}>{stats.ativas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Tickets na Fila</span>
          <span className={styles.statValue}>{stats.totalTickets}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>TMR Médio</span>
          <span className={styles.statValue}>{stats.tmrMedio}min</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>SLA Médio</span>
          <span className={styles.statValue}>{stats.slaMedio}%</span>
        </div>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Grid de Filas */}
      {filasFiltradas.length > 0 ? (
        <div className={styles.gridCards}>
          {filasFiltradas.map((fila) => {
            const membros = getMembrosOfFila(fila.id);

            return (
              <div
                key={fila.id}
                className={styles.estrategiaCard}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#132636',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  padding: '14px',
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 24px ${fila.cor}40`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  // Mostrar ícone delete ao passar mouse
                  const deleteBtn = e.currentTarget.querySelector('button[title="Deletar fila"]') as HTMLButtonElement;
                  if (deleteBtn) deleteBtn.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  // Esconder ícone delete ao sair o mouse
                  const deleteBtn = e.currentTarget.querySelector('button[title="Deletar fila"]') as HTMLButtonElement;
                  if (deleteBtn) deleteBtn.style.opacity = '0';
                }}
              >
                {/* Header: Título + Status + Tickets */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}>{fila.nome}</h3>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 600,
                            background: fila.status === 'ativa' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                            color: fila.status === 'ativa' ? '#2ecc71' : '#ffc107',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {fila.status === 'ativa' ? '🟢 Ativa' : '⭕ Pausada'}
                        </span>
                      </div>
                      {/* Botão Delete - Inicialmente invisível, aparece no hover */}
                      <button
                        onClick={() => handleAbrirDeleteModal(fila.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#ef4444',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                        title="Deletar fila"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className={styles.cardDescription} style={{ margin: 0, marginBottom: '4px' }}>{fila.descricao}</p>
                    {membros.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: membros[0].avatarColor, fontSize: '12px' }}>
                        <span style={{ fontSize: '14px' }}>👤</span>
                        {membros.map((m, idx) => (
                          <span key={m.id}>{m.nome.split(' ')[0]}{idx < membros.length - 1 ? ', ' : ''}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '8px', whiteSpace: 'nowrap' }}>
                    <div style={{ color: fila.cor, fontSize: '18px', fontWeight: 700, lineHeight: '1' }}>
                      {fila.totalTickets}
                    </div>
                    <div style={{ color: '#7a96aa', fontSize: '8px', textTransform: 'uppercase' }}>
                      tickets
                    </div>
                  </div>
                </div>

                {/* TMR + SLA Cards */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  {/* TMR Card */}
                  <div style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: `1px solid ${fila.cor}20`,
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#7a96aa', fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Tempo Resposta
                    </span>
                    <span style={{ color: fila.cor, fontWeight: 700, fontSize: '16px' }}>
                      {fila.tmr} min
                    </span>
                  </div>

                  {/* SLA Card */}
                  <div style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: `1px solid ${fila.slaPercentual >= 80 ? '#2ecc71' : fila.slaPercentual >= 60 ? '#f39c12' : '#ef4444'}20`,
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#7a96aa', fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      SLA
                    </span>
                    <span style={{
                      color: fila.slaPercentual >= 80 ? '#2ecc71' : fila.slaPercentual >= 60 ? '#f39c12' : '#ef4444',
                      fontWeight: 700,
                      fontSize: '16px',
                    }}>
                      {fila.slaPercentual}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: '#0d1f2d', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${fila.slaPercentual}%`,
                      height: '100%',
                      background: fila.cor,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Membros Badges */}
                {membros.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {membros.map((m) => (
                      <span
                        key={m.id}
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: `${m.avatarColor}20`,
                          color: m.avatarColor,
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: `1px solid ${m.avatarColor}50`,
                        }}
                      >
                        {m.nome.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                )}

                {/* Botões de Ação */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '0',
                  }}
                  className="button-group"
                >
                  <button
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      border: `1px solid ${fila.cor}70`,
                      color: fila.cor,
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${fila.cor}20`;
                      e.currentTarget.style.borderColor = fila.cor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = `${fila.cor}70`;
                    }}
                  >
                    ⚙️ Config
                  </button>
                  <button
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1px solid #7a96aa70',
                      color: '#7a96aa',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(122, 150, 170, 0.15)';
                      e.currentTarget.style.borderColor = '#7a96aa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = '#7a96aa70';
                    }}
                  >
                    👥 Membros
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
          {/* Backdrop */}
          <div
            onClick={handleCancelarDelete}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#132636',
              border: '1px solid rgba(201, 148, 58, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              zIndex: 50,
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Header com ícone de alerta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertCircle size={24} color="#ef4444" />
              <h2 style={{ margin: 0, color: '#e8edf2', fontSize: '18px', fontWeight: 700 }}>
                Confirmar Exclusão
              </h2>
            </div>

            {/* Mensagem */}
            <p style={{ color: '#7a96aa', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir a fila <strong style={{ color: '#e8edf2' }}>"{filas.find(f => f.id === filaParaDeletar)?.nome}"</strong>? Esta ação não pode ser desfeita.
            </p>

            {/* Botões */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleCancelarDelete}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid #7a96aa70',
                  color: '#7a96aa',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(122, 150, 170, 0.15)';
                  e.currentTarget.style.borderColor = '#7a96aa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#7a96aa70';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarDelete}
                style={{
                  padding: '10px 16px',
                  background: '#ef4444',
                  border: '1px solid #ef4444',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
              >
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

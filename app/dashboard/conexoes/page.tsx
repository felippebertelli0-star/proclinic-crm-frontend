/**
 * Página: Conexões
 * Gerenciar integrações com serviços terceirizados - Premium AAA
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import styles from '@/components/crm/pages/Calendario.module.css';

interface Conexao {
  id: number;
  nome: string;
  descricao: string;
  status: 'conectado' | 'desconectado';
  chaveAPI: string;
  usuarioConfiguracao: string;
  ultimaSincronizacao: string;
  erros: string | null;
}

const conexoesDados: Conexao[] = [
  {
    id: 1,
    nome: 'WhatsApp Business',
    descricao: 'Integração para envio de mensagens via WhatsApp',
    status: 'conectado',
    chaveAPI: 'whatsapp_key_8f9d2c...',
    usuarioConfiguracao: 'Admin',
    ultimaSincronizacao: '2026-04-22T11:15:00',
    erros: null
  },
  {
    id: 2,
    nome: 'Google Calendar',
    descricao: 'Sincronização de calendários e agendamentos',
    status: 'conectado',
    chaveAPI: 'google_calendar_key_a1b2c...',
    usuarioConfiguracao: 'Admin',
    ultimaSincronizacao: '2026-04-22T10:30:00',
    erros: null
  },
  {
    id: 3,
    nome: 'Stripe Pagamentos',
    descricao: 'Gateway de pagamentos online',
    status: 'conectado',
    chaveAPI: 'stripe_key_pk_live_51...',
    usuarioConfiguracao: 'Financeiro',
    ultimaSincronizacao: '2026-04-22T11:00:00',
    erros: null
  },
  {
    id: 4,
    nome: 'Mailchimp',
    descricao: 'Gerenciamento de campanhas de email',
    status: 'desconectado',
    chaveAPI: 'mailchimp_key_3d4e5f...',
    usuarioConfiguracao: 'Marketing',
    ultimaSincronizacao: '2026-04-21T15:45:00',
    erros: 'Chave API expirada'
  },
  {
    id: 5,
    nome: 'Slack',
    descricao: 'Notificações em tempo real para a equipe',
    status: 'conectado',
    chaveAPI: 'slack_webhook_xoxb_12...',
    usuarioConfiguracao: 'Admin',
    ultimaSincronizacao: '2026-04-22T11:10:00',
    erros: null
  },
  {
    id: 6,
    nome: 'Google Drive',
    descricao: 'Armazenamento en nuvem de documentos',
    status: 'conectado',
    chaveAPI: 'google_drive_key_9z8x...',
    usuarioConfiguracao: 'Admin',
    ultimaSincronizacao: '2026-04-22T10:50:00',
    erros: null
  },
];

export default function ConexoesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // Cálculos de estatísticas
  const conexaoStats = useMemo(() => {
    return {
      total: conexoesDados.length,
      conectadas: conexoesDados.filter((c) => c.status === 'conectado').length,
      desconectadas: conexoesDados.filter((c) => c.status === 'desconectado').length,
      comErros: conexoesDados.filter((c) => c.erros !== null).length,
    };
  }, []);

  const conexoesFiltradas = useMemo(() => {
    let resultado = conexoesDados;
    if (searchTerm) {
      resultado = resultado.filter((c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      resultado = resultado.filter((c) => c.status === statusFilter);
    }
    return resultado;
  }, [searchTerm, statusFilter]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Conexões</h1>
          <p className={styles.subtitle}>Gerenciar integrações com serviços terceirizados</p>

          {/* Filtros de Status */}
          <div className={styles.botoesContainer}>
            <button
              onClick={() => handleStatusFilter('')}
              className={`${styles.botaoMes} ${!statusFilter ? styles.active : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => handleStatusFilter('conectado')}
              className={`${styles.botaoMes} ${statusFilter === 'conectado' ? styles.active : ''}`}
            >
              Conectados
            </button>
            <button
              onClick={() => handleStatusFilter('desconectado')}
              className={`${styles.botaoMes} ${statusFilter === 'desconectado' ? styles.active : ''}`}
            >
              Desconectados
            </button>
          </div>
        </div>
        <button className={styles.btnNova}>
          🔌 Nova Conexão
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Conexões</span>
          <span className={styles.statValue}>{conexaoStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Conectadas</span>
          <span className={styles.statValue}>{conexaoStats.conectadas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Desconectadas</span>
          <span className={styles.statValue}>{conexaoStats.desconectadas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Com Erros</span>
          <span className={styles.statValue}>{conexaoStats.comErros}</span>
        </div>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Grid de Conexões */}
      {conexoesFiltradas.length > 0 ? (
        <div className={styles.gridCards}>
          {conexoesFiltradas.map((conexao) => (
            <div key={conexao.id} className={styles.estrategiaCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{conexao.nome}</h3>
                <span className={styles.cardType}>{conexao.status === 'conectado' ? '✅ Conectado' : '⚠️ Desconectado'}</span>
              </div>

              <p className={styles.cardDescription}>{conexao.descricao}</p>

              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Chave API</span>
                  <span className={styles.statItemValue} style={{ fontSize: '11px', color: '#7a96aa', wordBreak: 'break-all' }}>
                    {conexao.chaveAPI}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Configurado por</span>
                  <span className={styles.statItemValue}>{conexao.usuarioConfiguracao}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Última Sincronização</span>
                  <span className={styles.statItemValue} style={{ fontSize: '11px' }}>
                    {new Date(conexao.ultimaSincronizacao).toLocaleDateString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {conexao.erros && (
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Status do Erro</span>
                    <span className={styles.statItemValue} style={{ color: '#ef4444', fontSize: '11px' }}>
                      {conexao.erros}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔌</div>
          <p className={styles.emptyTitle}>Nenhuma conexão encontrada</p>
          <p className={styles.emptySubtitle}>Configure sua primeira integração</p>
        </div>
      )}
    </div>
  );
}

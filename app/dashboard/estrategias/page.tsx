/**
 * Página: Estratégias
 * Gerenciar estratégias de automação com IA
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { mockEstrategias, filtrarEstrategias, paginar } from '@/lib/mockData';
import styles from '@/components/crm/pages/Estrategias.module.css';
import EstrategiasModal from '@/components/crm/pages/EstrategiasModal';

const ITEMS_PER_PAGE = 10;

const MESES = [
  { valor: 'janeiro', label: 'Jan' },
  { valor: 'fevereiro', label: 'Fev' },
  { valor: 'marco', label: 'Mar' },
  { valor: 'abril', label: 'Abr' },
  { valor: 'maio', label: 'Mai' },
  { valor: 'junho', label: 'Jun' },
  { valor: 'julho', label: 'Jul' },
  { valor: 'agosto', label: 'Ago' },
  { valor: 'setembro', label: 'Set' },
  { valor: 'outubro', label: 'Out' },
  { valor: 'novembro', label: 'Nov' },
  { valor: 'dezembro', label: 'Dez' },
];

export default function EstrategiasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [mesSelecionado, setMesSelecionado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Função para extrair mês da data (sem timezone issue)
  const obterMesDaData = (dataCriacao: string): string => {
    // Parsear data manualmente para evitar timezone issue
    // dataCriacao formato: "YYYY-MM-DD"
    const [ano, mes, dia] = dataCriacao.split('-').map(Number);
    const meses = [
      'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    // mes vem como 1-12, array como 0-11, então precisa de -1
    return meses[mes - 1];
  };

  // Cálculos de estatísticas
  const estrategiaStats = useMemo(() => {
    let todas = filtrarEstrategias(''); // Carrega dinamicamente do localStorage
    
    // Aplicar filtro de mês nas estatísticas também
    if (mesSelecionado) {
      todas = todas.filter((est) => obterMesDaData(est.dataCriacao) === mesSelecionado);
    }
    
    return {
      total: todas.length,
      ativas: todas.filter((e) => e.ativa).length,
      inativas: todas.filter((e) => !e.ativa).length,
      totalExecutions: todas.reduce((sum, e) => sum + e.totalExecutions, 0),
    };
  }, [searchTerm, tipoFilter, mesSelecionado]);

  const estrategiasFiltradas = useMemo(() => {
    let resultado = filtrarEstrategias(searchTerm, tipoFilter || undefined);
    
    // Aplicar filtro de mês se selecionado
    if (mesSelecionado) {
      resultado = resultado.filter((est) => obterMesDaData(est.dataCriacao) === mesSelecionado);
    }
    
    return resultado;
  }, [searchTerm, tipoFilter, mesSelecionado]);

  const { items: estrategiasPaginadas, total: totalEstrategias } = useMemo(() => {
    return paginar(estrategiasFiltradas, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [estrategiasFiltradas, currentPage]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Estratégias de Automação</h1>
          <p className={styles.subtitle}>Organize e otimize suas estratégias de comunicação</p>
          
          {/* Botões de Meses */}
          <div className={styles.botoesContainer}>
            <button
              onClick={() => setMesSelecionado('')}
              className={`${styles.botaoMes} ${mesSelecionado === '' ? styles.active : ''}`}
            >
              Todos
            </button>
            {MESES.map((mes) => (
              <button
                key={mes.valor}
                onClick={() => setMesSelecionado(mes.valor)}
                className={`${styles.botaoMes} ${mesSelecionado === mes.valor ? styles.active : ''}`}
              >
                {mes.label}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.btnNova} onClick={() => setModalAberto(true)}>
          + Nova Estratégia
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Estratégias</span>
          <span className={styles.statValue}>{estrategiaStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Estratégias Ativas</span>
          <span className={styles.statValue}>{estrategiaStats.ativas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Estratégias Inativas</span>
          <span className={styles.statValue}>{estrategiaStats.inativas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Execuções Totais</span>
          <span className={styles.statValue}>{estrategiaStats.totalExecutions}</span>
        </div>
      </div>

      {/* Busca e Filtro */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          className={styles.filterButton}
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
        >
          <option value="">Tipo</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      {/* Grid de Estratégias */}
      {estrategiasPaginadas.length > 0 ? (
        <div className={styles.gridCards}>
          {estrategiasPaginadas.map((est) => (
            <div key={est.id} className={styles.estrategiaCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{est.nome}</h3>
                <span className={styles.cardType}>{est.tipo}</span>
              </div>

              <p className={styles.cardDescription}>{est.descricao}</p>

              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${est.ativa ? styles.ativa : styles.inativa}`}>
                    {est.ativa ? '🟢 Ativa' : '⭕ Inativa'}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Taxa de Sucesso</span>
                  <span className={styles.statItemValue}>{est.taxaSucesso}%</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Execuções</span>
                  <span className={styles.statItemValue}>{est.totalExecutions}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Criada em</span>
                  <span className={styles.statItemValue}>{est.dataCriacao}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyTitle}>Nenhuma estratégia encontrada</p>
          <p className={styles.emptySubtitle}>Crie uma nova estratégia para começar</p>
        </div>
      )}

      {/* Modal de Nova Estratégia */}
      <EstrategiasModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
      />
    </div>
  );
}

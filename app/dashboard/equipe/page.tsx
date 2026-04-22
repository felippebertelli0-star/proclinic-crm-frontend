/**
 * Página: Equipe
 * Gerenciar membros da equipe com cards Premium AAA
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import styles from '@/components/crm/pages/Calendario.module.css';

interface Membro {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  horasTrabalhadas: number;
}

const membrosDados: Membro[] = [
  {
    id: 1,
    nome: 'Dr. João Silva',
    cargo: 'Dentista',
    departamento: 'Consultório',
    email: 'joao@clinica.com',
    telefone: '(11) 99999-0001',
    status: 'ativo',
    horasTrabalhadas: 160
  },
  {
    id: 2,
    nome: 'Dra. Helena Gomes',
    cargo: 'Dentista',
    departamento: 'Consultório',
    email: 'helena@clinica.com',
    telefone: '(11) 99999-0002',
    status: 'ativo',
    horasTrabalhadas: 155
  },
  {
    id: 3,
    nome: 'Ana Costa',
    cargo: 'Recepcionista',
    departamento: 'Recepção',
    email: 'ana@clinica.com',
    telefone: '(11) 99999-0003',
    status: 'ativo',
    horasTrabalhadas: 160
  },
  {
    id: 4,
    nome: 'Carlos Mendes',
    cargo: 'Técnico em Saúde',
    departamento: 'Consultório',
    email: 'carlos@clinica.com',
    telefone: '(11) 99999-0004',
    status: 'ativo',
    horasTrabalhadas: 160
  },
  {
    id: 5,
    nome: 'Fernanda Lima',
    cargo: 'Secretária',
    departamento: 'Administrativo',
    email: 'fernanda@clinica.com',
    telefone: '(11) 99999-0005',
    status: 'ativo',
    horasTrabalhadas: 160
  },
  {
    id: 6,
    nome: 'Dr. Roberto Santos',
    cargo: 'Dentista',
    departamento: 'Consultório',
    email: 'roberto@clinica.com',
    telefone: '(11) 99999-0006',
    status: 'inativo',
    horasTrabalhadas: 0
  },
];

export default function EquipePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDepartamentoFilter = (value: string) => {
    setDepartamentoFilter(value);
  };

  // Cálculos de estatísticas
  const equipeStats = useMemo(() => {
    return {
      total: membrosDados.length,
      ativos: membrosDados.filter((e) => e.status === 'ativo').length,
      inativos: membrosDados.filter((e) => e.status === 'inativo').length,
      horasMedio: Math.round(membrosDados.filter(e => e.status === 'ativo').reduce((sum, e) => sum + e.horasTrabalhadas, 0) / membrosDados.filter(e => e.status === 'ativo').length),
    };
  }, []);

  const membrosFiltrados = useMemo(() => {
    let resultado = membrosDados;
    if (searchTerm) {
      resultado = resultado.filter((m) =>
        m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cargo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (departamentoFilter) {
      resultado = resultado.filter((m) => m.departamento === departamentoFilter);
    }
    return resultado;
  }, [searchTerm, departamentoFilter]);

  // Departamentos únicos para filtro
  const departamentos = Array.from(new Set(membrosDados.map((m) => m.departamento)));

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Equipe</h1>
          <p className={styles.subtitle}>Gerenciar membros da equipe e departamentos</p>

          {/* Filtros de Departamento */}
          <div className={styles.botoesContainer}>
            <button
              onClick={() => handleDepartamentoFilter('')}
              className={`${styles.botaoMes} ${!departamentoFilter ? styles.active : ''}`}
            >
              Todos
            </button>
            {departamentos.map((dept) => (
              <button
                key={dept}
                onClick={() => handleDepartamentoFilter(dept)}
                className={`${styles.botaoMes} ${departamentoFilter === dept ? styles.active : ''}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.btnNova}>
          👤 Novo Membro
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Membros</span>
          <span className={styles.statValue}>{equipeStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Membros Ativos</span>
          <span className={styles.statValue}>{equipeStats.ativos}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Membros Inativos</span>
          <span className={styles.statValue}>{equipeStats.inativos}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Horas Médias/Mês</span>
          <span className={styles.statValue}>{equipeStats.horasMedio}h</span>
        </div>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nome, email ou cargo..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Grid de Membros */}
      {membrosFiltrados.length > 0 ? (
        <div className={styles.gridCards}>
          {membrosFiltrados.map((membro) => (
            <div key={membro.id} className={styles.estrategiaCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{membro.nome}</h3>
                <span className={styles.cardType}>{membro.status === 'ativo' ? '🟢 Ativo' : '⭕ Inativo'}</span>
              </div>

              <p className={styles.cardDescription}>{membro.cargo} • {membro.departamento}</p>

              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Email</span>
                  <span className={styles.statItemValue} style={{ fontSize: '11px', color: '#7a96aa' }}>
                    {membro.email}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Telefone</span>
                  <span className={styles.statItemValue} style={{ fontSize: '11px', color: '#7a96aa' }}>
                    {membro.telefone}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Departamento</span>
                  <span className={styles.statItemValue}>{membro.departamento}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Horas/Mês</span>
                  <span className={styles.statItemValue}>{membro.horasTrabalhadas}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <p className={styles.emptyTitle}>Nenhum membro encontrado</p>
          <p className={styles.emptySubtitle}>Adicione membros à sua equipe</p>
        </div>
      )}
    </div>
  );
}

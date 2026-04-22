'use client';

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import styles from '@/components/crm/pages/Calendario.module.css';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  duracao: number;
  local?: string;
  participantes: string[];
  tipo: 'consulta' | 'reuniao' | 'lembrete' | 'outro';
}

const eventosData: Evento[] = [
  { id: '1', titulo: 'Consulta - Maria Silva', descricao: 'Check-up geral', data: '2026-04-17', hora: '09:00', duracao: 60, local: 'Sala 1', participantes: ['Dr. João'], tipo: 'consulta' },
  { id: '2', titulo: 'Reunião de Equipe', descricao: 'Planejamento semanal', data: '2026-04-17', hora: '14:00', duracao: 60, local: 'Sala de Conferência', participantes: ['Ana', 'Carlos', 'Bruno'], tipo: 'reuniao' },
  { id: '3', titulo: 'Consulta - João Santos', descricao: 'Avaliação pré-operatória', data: '2026-04-18', hora: '10:30', duracao: 45, local: 'Sala 2', participantes: ['Dra. Helena'], tipo: 'consulta' },
  { id: '4', titulo: 'Follow-up - Pedro Costa', descricao: 'Acompanhamento pós-cirurgia', data: '2026-04-18', hora: '15:00', duracao: 30, local: 'Sala 1', participantes: ['Dr. Bruno'], tipo: 'lembrete' },
  { id: '5', titulo: 'Consulta - Helena Gomes', descricao: 'Rotina', data: '2026-04-19', hora: '11:00', duracao: 50, local: 'Sala 3', participantes: ['Dra. Fernanda'], tipo: 'consulta' },
  { id: '6', titulo: 'Consulta - Ana Costa', descricao: 'Limpeza + Clareamento', data: '2026-04-20', hora: '14:30', duracao: 90, local: 'Sala 2', participantes: ['Dra. Paula'], tipo: 'consulta' },
  { id: '7', titulo: 'Reunião com Fornecedor', descricao: 'Discussão de novos materiais', data: '2026-04-21', hora: '10:00', duracao: 60, local: 'Sala de Conferência', participantes: ['Gerente', 'Fornecedor'], tipo: 'reuniao' },
  { id: '8', titulo: 'Consulta - Carlos Silva', descricao: 'Implante dentário', data: '2026-04-22', hora: '09:00', duracao: 120, local: 'Sala 3', participantes: ['Dr. Roberto'], tipo: 'consulta' },
];

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    consulta: 'Consulta',
    reuniao: 'Reunião',
    lembrete: 'Lembrete',
    outro: 'Outro'
  };
  return labels[tipo] || tipo;
};

const getTipoIcon = (tipo: string) => {
  switch(tipo) {
    case 'consulta': return '👨‍⚕️';
    case 'reuniao': return '👥';
    case 'lembrete': return '⏰';
    default: return '📋';
  }
};

export default function CalendarioPage() {
  const [eventos] = useState<Evento[]>(eventosData);
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const eventosFiltrados = filtroTipo
    ? eventos.filter(e => e.tipo === filtroTipo)
    : eventos;

  const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
    const dataA = new Date(`${a.data}T${a.hora}`);
    const dataB = new Date(`${b.data}T${b.hora}`);
    return dataA.getTime() - dataB.getTime();
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Calendário</h1>
          <p className={styles.subtitle}>Gerencie consultas e compromissos</p>

          {/* Filtros de Tipo */}
          <div className={styles.botoesContainer}>
            <button
              onClick={() => setFiltroTipo('')}
              className={`${styles.botaoMes} ${!filtroTipo ? styles.active : ''}`}
            >
              Todos
            </button>
            {['consulta', 'reuniao', 'lembrete'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`${styles.botaoMes} ${filtroTipo === tipo ? styles.active : ''}`}
              >
                {getTipoLabel(tipo)}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.btnNova}>
          <Calendar size={16} style={{ marginRight: '6px' }} />
          Novo Evento
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de Eventos</span>
          <span className={styles.statValue}>{eventos.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Consultas Agendadas</span>
          <span className={styles.statValue}>{eventos.filter(e => e.tipo === 'consulta').length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Reuniões</span>
          <span className={styles.statValue}>{eventos.filter(e => e.tipo === 'reuniao').length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Lembretes</span>
          <span className={styles.statValue}>{eventos.filter(e => e.tipo === 'lembrete').length}</span>
        </div>
      </div>

      {/* Grid de Eventos */}
      {eventosOrdenados.length > 0 ? (
        <div className={styles.gridCards}>
          {eventosOrdenados.map((evento) => (
            <div key={evento.id} className={styles.estrategiaCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{evento.titulo}</h3>
                <span className={styles.cardType}>{getTipoLabel(evento.tipo)}</span>
              </div>

              <p className={styles.cardDescription}>{evento.descricao}</p>

              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Data & Hora</span>
                  <span className={styles.statItemValue}>{evento.data} {evento.hora}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Duração</span>
                  <span className={styles.statItemValue}>{evento.duracao}min</span>
                </div>
                {evento.local && (
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Local</span>
                    <span className={styles.statItemValue}>{evento.local}</span>
                  </div>
                )}
                {evento.participantes.length > 0 && (
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Participantes</span>
                    <span className={styles.statItemValue}>{evento.participantes.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyTitle}>Nenhum evento encontrado</p>
          <p className={styles.emptySubtitle}>Agende seu primeiro evento</p>
        </div>
      )}
    </div>
  );
}

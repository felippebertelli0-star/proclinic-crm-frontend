/**
 * Página Calendário - CRM ProClinic
 * Padrão ULTRA MEGA PREMIUM AAA
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarCheck,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  X,
  CalendarDays,
} from 'lucide-react';
import styles from './Agenda.module.css';

interface Agendamento {
  id: number;
  hora: string;
  paciente: string;
  tipo: 'Consulta' | 'Retorno' | 'Procedimento' | 'Avaliação';
  status: 'Confirmado' | 'Pendente';
  cor: string;
}

type AgendaMap = Record<number, Agendamento[]>;

// Paleta de cores de pacientes (ciclo de cores premium)
const PALETTE = [
  '#e91e63', // pink
  '#9b59b6', // purple
  '#2ecc71', // green
  '#e74c3c', // red
  '#3498db', // blue
  '#f39c12', // amber
  '#1abc9c', // teal
  '#e67e22', // orange
];

// Mock expandido: 18 agendamentos distribuídos em Abril 2026
const AGENDAMENTOS_ABRIL: AgendaMap = {
  1: [{ id: 1, hora: '10:00', paciente: 'Ida Santos', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[0] }],
  3: [{ id: 2, hora: '09:30', paciente: 'Maria Rosa', tipo: 'Retorno', status: 'Confirmado', cor: PALETTE[1] }],
  5: [
    { id: 3, hora: '11:00', paciente: 'Laura Ferreira', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[2] },
    { id: 4, hora: '15:00', paciente: 'Roberta Lima', tipo: 'Avaliação', status: 'Pendente', cor: PALETTE[3] },
  ],
  8: [{ id: 5, hora: '14:30', paciente: 'Patricia Lima', tipo: 'Procedimento', status: 'Confirmado', cor: PALETTE[4] }],
  9: [{ id: 6, hora: '10:30', paciente: 'Ana Beatriz', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[5] }],
  10: [{ id: 7, hora: '16:00', paciente: 'Carlos Mendes', tipo: 'Retorno', status: 'Pendente', cor: PALETTE[6] }],
  13: [
    { id: 8, hora: '09:00', paciente: 'Gabriela Silva', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[7] },
    { id: 9, hora: '13:30', paciente: 'Fernanda Costa', tipo: 'Avaliação', status: 'Confirmado', cor: PALETTE[0] },
  ],
  15: [{ id: 10, hora: '11:30', paciente: 'Fernando Gomes', tipo: 'Procedimento', status: 'Confirmado', cor: PALETTE[1] }],
  17: [{ id: 11, hora: '10:00', paciente: 'Lucia Ferreira', tipo: 'Consulta', status: 'Pendente', cor: PALETTE[2] }],
  20: [{ id: 12, hora: '14:00', paciente: 'Daniel Alves', tipo: 'Retorno', status: 'Confirmado', cor: PALETTE[3] }],
  22: [
    { id: 13, hora: '08:30', paciente: 'Beatriz Ramos', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[4] },
    { id: 14, hora: '15:30', paciente: 'Rodrigo Vaz', tipo: 'Procedimento', status: 'Pendente', cor: PALETTE[5] },
  ],
  24: [{ id: 15, hora: '11:00', paciente: 'Marcela Pires', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[6] }],
  27: [{ id: 16, hora: '09:30', paciente: 'Julio Tavares', tipo: 'Avaliação', status: 'Confirmado', cor: PALETTE[7] }],
  29: [
    { id: 17, hora: '10:30', paciente: 'Camila Barros', tipo: 'Consulta', status: 'Confirmado', cor: PALETTE[0] },
    { id: 18, hora: '14:30', paciente: 'Paulo Henrique', tipo: 'Retorno', status: 'Pendente', cor: PALETTE[1] },
  ],
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Grade padrão de horários da clínica (08:00 → 18:00, intervalos de 30min)
const SLOTS_PADRAO: string[] = (() => {
  const list: string[] = [];
  for (let h = 8; h <= 18; h++) {
    list.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== 18) list.push(`${String(h).padStart(2, '0')}:30`);
  }
  return list;
})();

export function Calendario() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Mapa de agendamentos do mês atual (apenas Abril/2026 povoado; outros meses ficam vazios)
  const agendaDoMes: AgendaMap = useMemo(() => {
    if (currentMonth === 3 && currentYear === 2026) return AGENDAMENTOS_ABRIL;
    return {};
  }, [currentMonth, currentYear]);

  const stats = useMemo(() => {
    const flat = Object.values(agendaDoMes).flat();
    const total = flat.length;
    const confirmados = flat.filter((a) => a.status === 'Confirmado').length;
    const pendentes = flat.filter((a) => a.status === 'Pendente').length;

    let esteSemana = 0;
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
      const dayToday = today.getDate();
      const startOfWeek = dayToday - today.getDay();
      const endOfWeek = startOfWeek + 6;
      esteSemana = flat.filter((a) => {
        const diaStr = Object.keys(agendaDoMes).find((d) =>
          agendaDoMes[Number(d)].some((x) => x.id === a.id)
        );
        const dia = diaStr ? Number(diaStr) : -1;
        return dia >= startOfWeek && dia <= endOfWeek;
      }).length;
    } else {
      esteSemana = Object.keys(agendaDoMes)
        .map(Number)
        .filter((d) => d <= 7)
        .reduce((s, d) => s + agendaDoMes[d].length, 0);
    }

    return { total, confirmados, pendentes, esteSemana };
  }, [agendaDoMes, currentMonth, currentYear, today]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // Mouse tracking para radial glow
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleOpenDay = (day: number) => setSelectedDay(day);
  const handleCloseModal = useCallback(() => setSelectedDay(null), []);

  // ESC para fechar
  useEffect(() => {
    if (selectedDay === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedDay, handleCloseModal]);

  const STAT_CARDS = [
    { label: 'Total do Mês', value: stats.total, color: '#3498db', Icon: CalendarIcon },
    { label: 'Esta Semana', value: stats.esteSemana, color: '#f39c12', Icon: Clock },
    { label: 'Confirmados', value: stats.confirmados, color: '#2ecc71', Icon: CalendarCheck },
    { label: 'Pendentes', value: stats.pendentes, color: '#e74c3c', Icon: AlertCircle },
  ];

  // Dados do dia selecionado
  const selectedAgendamentos: Agendamento[] =
    selectedDay !== null ? agendaDoMes[selectedDay] || [] : [];
  const horariosOcupados = new Set(selectedAgendamentos.map((a) => a.hora));
  const selectedDate =
    selectedDay !== null ? new Date(currentYear, currentMonth, selectedDay) : null;
  const selectedDateLabel = selectedDate
    ? `${DIAS_SEMANA[selectedDate.getDay()]}, ${selectedDay} de ${MESES[currentMonth]} de ${currentYear}`
    : '';

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Agenda · Sincronização em Tempo Real
          </span>
          <h1 className={styles.title}>Calendário de Agendamentos</h1>
          <p className={styles.subtitle}>
            <strong>{MESES[currentMonth]} {currentYear}</strong> · <strong>{stats.total}</strong> agendamentos · <strong>{stats.confirmados}</strong> confirmados
          </p>
        </div>

        <div className={styles.heroActions}>
          <button className={styles.btnSync} type="button">
            <RefreshCw size={14} strokeWidth={2.6} className={styles.spinIcon} />
            Sincronizar Agenda
          </button>
          <button className={styles.btnGhost} type="button" onClick={handlePrevMonth}>
            <ChevronLeft size={14} strokeWidth={2.6} />
            Anterior
          </button>
          <button className={styles.btnGhost} type="button" onClick={handleNextMonth}>
            Próximo
            <ChevronRight size={14} strokeWidth={2.6} />
          </button>
          <button className={styles.btnPrimary} type="button">
            <Plus size={14} strokeWidth={2.8} />
            Agendamento
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((s, i) => (
          <div
            key={s.label}
            className={styles.statCard}
            onMouseMove={handleMove}
            style={{
              ['--stat-color' as string]: s.color,
              animationDelay: `${i * 0.05}s`,
            } as React.CSSProperties}
          >
            <span className={styles.statIcon}>
              <s.Icon size={20} strokeWidth={2.4} />
            </span>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className={styles.calendar}>
        {/* Week header */}
        <div className={styles.weekHeader}>
          {DIAS_SEMANA.map((dia, i) => (
            <div
              key={dia}
              className={`${styles.weekHeaderCell} ${i === 0 || i === 6 ? styles.weekendCell : ''}`}
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className={styles.daysGrid}>
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className={styles.dayCellEmpty} />;
            }
            const events = agendaDoMes[day] || [];
            const dow = (firstDayOfMonth + day - 1) % 7;
            const isWeekend = dow === 0 || dow === 6;
            const todayFlag = isToday(day);
            const cellClasses = [
              styles.dayCell,
              todayFlag ? styles.dayCellToday : '',
              isWeekend && !todayFlag ? styles.dayCellWeekend : '',
            ]
              .filter(Boolean)
              .join(' ');

            const MAX_VISIBLE = 3;
            const visible = events.slice(0, MAX_VISIBLE);
            const overflow = events.length - MAX_VISIBLE;

            return (
              <div
                key={day}
                className={cellClasses}
                onMouseMove={handleMove}
                onClick={() => handleOpenDay(day)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDay(day);
                  }
                }}
              >
                <span className={styles.dayNumber}>{day}</span>
                {events.length > 0 && (
                  <div className={styles.events}>
                    {visible.map((ev) => (
                      <div
                        key={ev.id}
                        className={styles.event}
                        title={`${ev.hora} · ${ev.paciente} · ${ev.tipo}`}
                        style={{ ['--ev-color' as string]: ev.cor } as React.CSSProperties}
                      >
                        <span className={styles.eventTime}>{ev.hora}</span>
                        {ev.paciente}
                      </div>
                    ))}
                    {overflow > 0 && (
                      <span className={styles.eventMore}>+{overflow} mais</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#2ecc71' }} />
            Consulta
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#3498db' }} />
            Retorno
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#e91e63' }} />
            Procedimento
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#f39c12' }} />
            Avaliação
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: 'linear-gradient(135deg, #c9943a, #a87a28)' }} />
            Hoje
          </span>
        </div>
      </div>

      {/* DAY MODAL */}
      {selectedDay !== null && (
        <>
          <div className={styles.modalBackdrop} onClick={handleCloseModal} />
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agenda-modal-title"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <span className={styles.modalEyebrow}>
                  <CalendarDays size={11} strokeWidth={2.6} />
                  Agenda do Dia
                </span>
                <h2 id="agenda-modal-title" className={styles.modalTitle}>
                  {selectedDay} de {MESES[currentMonth]}
                </h2>
                <span className={styles.modalSubtitle}>{selectedDateLabel}</span>
              </div>
              <button
                className={styles.modalClose}
                type="button"
                onClick={handleCloseModal}
                aria-label="Fechar"
              >
                <X size={16} strokeWidth={2.6} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Agendamentos */}
              <div className={styles.modalSection}>
                <span className={styles.modalSectionTitle}>
                  <CalendarCheck size={12} strokeWidth={2.6} style={{ color: '#2ecc71' }} />
                  Agendamentos · <strong>{selectedAgendamentos.length}</strong>
                </span>
                {selectedAgendamentos.length === 0 ? (
                  <div className={styles.apptEmpty}>
                    Nenhum agendamento para este dia
                  </div>
                ) : (
                  <div className={styles.apptList}>
                    {selectedAgendamentos
                      .slice()
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((ag) => (
                        <div
                          key={ag.id}
                          className={styles.apptItem}
                          style={{ ['--appt-color' as string]: ag.cor } as React.CSSProperties}
                        >
                          <span className={styles.apptTime}>{ag.hora}</span>
                          <div className={styles.apptInfo}>
                            <span className={styles.apptName}>{ag.paciente}</span>
                            <span className={styles.apptTipo}>{ag.tipo}</span>
                          </div>
                          <span
                            className={`${styles.apptStatus} ${
                              ag.status === 'Confirmado'
                                ? styles.statusConfirmed
                                : styles.statusPending
                            }`}
                          >
                            <span
                              className={`${styles.statusDot} ${
                                ag.status === 'Confirmado'
                                  ? styles.statusConfirmed
                                  : styles.statusPending
                              }`}
                            />
                            {ag.status}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Horários disponíveis */}
              <div className={styles.modalSection}>
                <span className={styles.modalSectionTitle}>
                  <Clock size={12} strokeWidth={2.6} style={{ color: '#c9943a' }} />
                  Grade de Horários · <strong>{SLOTS_PADRAO.length - horariosOcupados.size}</strong> livres
                </span>
                <div className={styles.slotsGrid}>
                  {SLOTS_PADRAO.map((slot) => {
                    const ocupado = horariosOcupados.has(slot);
                    return (
                      <span
                        key={slot}
                        className={`${styles.slot} ${
                          ocupado ? styles.slotOccupied : styles.slotFree
                        }`}
                        title={ocupado ? 'Horário ocupado' : 'Disponível'}
                      >
                        {slot}
                      </span>
                    );
                  })}
                </div>
                <div className={styles.slotLegend}>
                  <span>
                    <span
                      className={styles.slotLegendDot}
                      style={{ background: '#2ecc71', boxShadow: '0 0 6px #2ecc71' }}
                    />
                    Disponível
                  </span>
                  <span>
                    <span
                      className={styles.slotLegendDot}
                      style={{ background: '#c9943a', boxShadow: '0 0 6px #c9943a' }}
                    />
                    Ocupado
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalBtnGhost}
                onClick={handleCloseModal}
              >
                Fechar
              </button>
              <button type="button" className={styles.modalBtnPrimary}>
                <Plus size={14} strokeWidth={2.8} />
                Novo Agendamento
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

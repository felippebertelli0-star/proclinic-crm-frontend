/**
 * Página Calendário - CRM ProClinic
 * 100% Fiel ao protótipo - Calendar com agendamentos
 */

'use client';

import { useState } from 'react';

export function Calendario() {
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [currentYear, setCurrentYear] = useState(2026);

  // Mock data de agendamentos por dia
  const agendamentos = {
    1: [{ id: 1, hora: '10:00', paciente: 'Ida Santos', tipo: 'Consulta' }],
    5: [{ id: 2, hora: '14:30', paciente: 'Maria Rosa', tipo: 'Retorno' }],
    8: [{ id: 3, hora: '09:00', paciente: 'Laura Ferreira', tipo: 'Consulta' }],
    10: [{ id: 4, hora: '15:00', paciente: 'Patricia Lima', tipo: 'Procedimento' }],
    12: [{ id: 5, hora: '11:00', paciente: 'Ana Beatriz', tipo: 'Consulta' }],
    15: [{ id: 6, hora: '13:30', paciente: 'Carlos Mendes', tipo: 'Retorno' }],
    17: [{ id: 7, hora: '10:30', paciente: 'Gabriela Silva', tipo: 'Consulta' }],
    20: [{ id: 8, hora: '14:00', paciente: 'Fernando Gomes', tipo: 'Procedimento' }],
    22: [{ id: 9, hora: '11:30', paciente: 'Lucia Ferreira', tipo: 'Consulta' }],
    25: [{ id: 10, hora: '16:00', paciente: 'Daniel Alves', tipo: 'Retorno' }],
  };

  // Calcular estatísticas
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalAgendamentos = Object.values(agendamentos).flat().length;
  const confirmadas = Math.ceil(totalAgendamentos * 0.7);
  const pendentes = totalAgendamentos - confirmadas;
  const semanais = Math.ceil(totalAgendamentos / 4);

  const mesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

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

  const generateCalendarDays = () => {
    const days = [];
    // Empty days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div
      style={{
        padding: '24px',
        background: '#0d1f2d',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* RESUMO CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: totalAgendamentos, value: 'Total do Mês', color: '#c9943a' },
          { label: semanais, value: 'Esta Semana', color: '#3498db' },
          { label: confirmadas, value: 'Confirmadas', color: '#2ecc71' },
          { label: pendentes, value: 'Pendentes', color: '#f39c12' },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: '#7a96aa',
                marginBottom: '8px',
                fontWeight: 600,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* HEADER E AÇÕES */}
      <div
        style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'none',
              border: 'none',
              color: '#c9943a',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, minWidth: '200px', textAlign: 'center' }}>
            {mesNomes[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={handleNextMonth}
            style={{
              background: 'none',
              border: 'none',
              color: '#c9943a',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            →
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#c9943a',
              color: '#0d1f2d',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#d9a344')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#c9943a')}
          >
            🔄 Sincronizar
          </button>

          <button
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#c9943a',
              color: '#0d1f2d',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#d9a344')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#c9943a')}
          >
            + Agendamento
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div
        style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '20px',
          overflow: 'hidden',
        }}
      >
        {/* DIAS DA SEMANA */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          {diasSemana.map((dia) => (
            <div
              key={dia}
              style={{
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#7a96aa',
                textTransform: 'uppercase',
                paddingBottom: '8px',
                borderBottom: '1px solid #1e3d54',
              }}
            >
              {dia}
            </div>
          ))}
        </div>

        {/* DIAS DO MÊS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
          }}
        >
          {calendarDays.map((day, idx) =>
            day === null ? (
              <div key={`empty-${idx}`} />
            ) : (
              <div
                key={day}
                style={{
                  minHeight: '120px',
                  background: '#0d1f2d',
                  border: '1px solid #1e3d54',
                  borderRadius: '8px',
                  padding: '8px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c9943a';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(201, 148, 58, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e3d54';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Número do dia */}
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#e8edf2',
                    marginBottom: '6px',
                  }}
                >
                  {day}
                </div>

                {/* Agendamentos do dia */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(agendamentos[day as keyof typeof agendamentos] || []).map((agend) => (
                    <div
                      key={agend.id}
                      style={{
                        fontSize: '10px',
                        background: 'rgba(201, 148, 58, 0.2)',
                        color: '#c9943a',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {agend.hora}
                    </div>
                  ))}
                </div>

                {/* Indicador de eventos */}
                {agendamentos[day as keyof typeof agendamentos] && agendamentos[day as keyof typeof agendamentos].length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#c9943a',
                    }}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

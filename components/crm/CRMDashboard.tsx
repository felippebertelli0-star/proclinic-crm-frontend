/**
 * Dashboard CRM - ProClinic
 * Fiel ao protótipo localhost:3456/dashboard
 * Qualidade: Premium AAA
 */

'use client';

import { useState } from 'react';

export function DashboardContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('Hoje');
  const [startDate, setStartDate] = useState('2026-04-17');
  const [endDate, setEndDate] = useState('2026-04-17');

  // Mock Data
  const stats = {
    atendendo: 366,
    aguardando: 20,
    fechados: 26,
    leads: 47,
    recebidas: '2.2k',
    enviadas: '2.5k',
    tickets: 141,
    agendamento: 0,
    fechamento: 0,
    comparecimento: 0,
    followups: 0,
    reativados: 0,
    primeiraResposta: '13 min',
    tempoResposta: '12.9 min',
    tempoResolucao: '0.1h',
    faturamento: 'R$ 0',
  };

  return (
    <div style={{
      background: '#0d1f2d',
      color: '#e8edf2',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* FILTER BAR */}
      <div style={{
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#7a96aa',
          marginRight: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          📅 Período:
        </div>

        {['Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 30 dias', 'Este mês'].map((period) => (
          <div
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: selectedPeriod === period ? '1px solid #c9943a' : '1px solid transparent',
              background: selectedPeriod === period ? 'rgba(201, 148, 58, 0.1)' : 'transparent',
              color: selectedPeriod === period ? '#c9943a' : '#7a96aa',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: selectedPeriod === period ? 600 : 500,
              transition: 'all 0.2s',
            }}
          >
            {period}
          </div>
        ))}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: 'auto',
        }}>
          <div style={{ fontSize: '12px', color: '#7a96aa' }}>De</div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: '7px 12px',
              background: '#1a3347',
              border: '1px solid #1e3d54',
              borderRadius: '8px',
              color: '#e8edf2',
              fontSize: '12px',
              outline: 'none',
            }}
          />
          <div style={{ fontSize: '12px', color: '#7a96aa' }}>Até</div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: '7px 12px',
              background: '#1a3347',
              border: '1px solid #1e3d54',
              borderRadius: '8px',
              color: '#e8edf2',
              fontSize: '12px',
              outline: 'none',
            }}
          />
          <button
            style={{
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #c9943a, #e8b86d, #c9943a)',
              border: 'none',
              borderRadius: '8px',
              color: '#0d1f2d',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* STATUS CARDS */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#e8edf2',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
        }}>
          Status em Tempo Real
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}>
          {/* Card 1: Atendendo */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{ fontSize: '28px' }}>🟢</div>
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '4px' }}>Atendendo</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc71' }}>{stats.atendendo}</div>
              <div style={{ fontSize: '11px', color: '#7a96aa' }}>tickets em atendimento ativo</div>
            </div>
          </div>

          {/* Card 2: Aguardando */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{ fontSize: '28px' }}>⏳</div>
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '4px' }}>Aguardando</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#f39c12' }}>{stats.aguardando}</div>
              <div style={{ fontSize: '11px', color: '#7a96aa' }}>tickets pendentes</div>
            </div>
          </div>

          {/* Card 3: Fechados */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{ fontSize: '28px' }}>✅</div>
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '4px' }}>Fechados no Período</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#3498db' }}>{stats.fechados}</div>
              <div style={{ fontSize: '11px', color: '#7a96aa' }}>tickets finalizados</div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY CARDS */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#e8edf2',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
        }}>
          Atividade do Dia
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}>
          {/* Leads Card */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#c9943a20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
            }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '4px' }}>Novos Leads Chegaram</div>
              <div style={{ fontSize: '30px', fontWeight: 700, color: '#c9943a' }}>{stats.leads}</div>
              <div style={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>↑ no período selecionado</div>
            </div>
          </div>

          {/* Messages Received Card */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#3498db20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
            }}>
              📥
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '4px' }}>Mensagens Recebidas</div>
              <div style={{ fontSize: '30px', fontWeight: 700, color: '#3498db' }}>{stats.recebidas}</div>
              <div style={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>↑ WhatsApp + Instagram</div>
            </div>
          </div>

          {/* Messages Sent Card */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#2ecc7120',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
            }}>
              📤
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '4px' }}>Mensagens Enviadas</div>
              <div style={{ fontSize: '30px', fontWeight: 700, color: '#2ecc71' }}>{stats.enviadas}</div>
              <div style={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>↑ Pela equipe</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#e8edf2',
          marginBottom: '16px',
          letterSpacing: '-0.5px',
        }}>
          Indicadores de Performance
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}>
          {[
            {
              label: 'Total de Tickets',
              value: stats.tickets,
              unit: '',
              color: '#c9943a',
              barWidth: 70,
              subtext: 'Criados no período',
            },
            {
              label: '% de Agendamento',
              value: stats.agendamento,
              unit: '%',
              color: '#c9943a',
              barWidth: 0,
              subtext: 'leads → agendados',
            },
            {
              label: '% de Fechamento',
              value: stats.fechamento,
              unit: '%',
              color: '#2ecc71',
              barWidth: 0,
              subtext: 'compareceram → fecharam',
            },
            {
              label: '% de Comparecimento',
              value: stats.comparecimento,
              unit: '%',
              color: '#f39c12',
              barWidth: 0,
              subtext: 'agendados → compareceram',
            },
            {
              label: 'Follow-ups Realizados',
              value: stats.followups,
              unit: '',
              color: '#c9943a',
              barWidth: 0,
              subtext: 'no período',
            },
            {
              label: 'Pacientes Reativados',
              value: stats.reativados,
              unit: '',
              color: '#3498db',
              barWidth: 0,
              subtext: 'no período',
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <div style={{
                fontSize: '12px',
                color: '#7a96aa',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                {kpi.label}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: kpi.color,
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}>
                {kpi.value}
                <span style={{ fontSize: '14px', marginLeft: '2px' }}>{kpi.unit}</span>
              </div>
              <div style={{
                height: '4px',
                background: '#1a3347',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div
                  style={{
                    height: '100%',
                    width: `${kpi.barWidth}%`,
                    background: kpi.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{
                fontSize: '11px',
                color: '#7a96aa',
              }}>
                {kpi.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#7a96aa',
        paddingTop: '20px',
        borderTop: '1px solid #1e3d54',
      }}>
        ProClinic — Inteligência Comercial · v1.0
      </div>
    </div>
  );
}

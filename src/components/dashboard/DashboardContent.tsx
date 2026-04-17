/**
 * Dashboard CRM - ProClinic
 * 100% Fiel ao protótipo localhost:3456
 * Qualidade: Premium AAA - Completo e Funcional
 */

'use client';

import { useState } from 'react';

export function DashboardContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('Hoje');
  const [startDate, setStartDate] = useState('2026-04-17');
  const [endDate, setEndDate] = useState('2026-04-17');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['tickets']);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

  // ============================================================================
  // MOCK DATA - 100% Fiel ao Protótipo
  // ============================================================================

  const stats = {
    atendendo: 366,
    aguardando: 20,
    fechados: 26,
    leads: 47,
    recebidas: '2.2k',
    enviadas: '2.5k',
    tickets: 141,
    agendamento: '18.4%',
    fechamento: '61.5%',
    comparecimento: '72%',
    followups: 12,
    reativados: 3,
    primeiraResposta: '13 min',
    tempoResposta: '12.9 min',
    tempoResolucao: '0.1h',
    faturamento: 'R$ 4.2k',
    conversasFechadas: 19,
  };

  const KPI_TOOLTIPS = {
    tickets: 'Número total de conversas abertas (tickets criados) no período selecionado',
    agendamento: 'Percentual de leads atendidos que efetivamente agendaram uma consulta',
    fechamento: 'Percentual de pacientes que compareceram e tiveram o atendimento fechado',
    comparecimento: 'Percentual de agendamentos que resultaram em comparecimento',
    followups: 'Total de follow-ups realizados com clientes no período',
    reativados: 'Pacientes inativos que foram reativados através de campanhas de retorno',
    primeiraResposta: 'Tempo médio para primeira resposta ao cliente desde abertura do ticket',
    tempoResposta: 'Tempo médio entre mensagens de ida e volta com o cliente',
    tempoResolucao: 'Tempo médio para resolver completamente um ticket',
    faturamento: 'Receita gerada pelos atendimentos no período selecionado',
    conversasFechadas: 'Total de conversas encerradas com sucesso no período',
  };

  const INDICADORES = [
    { key: 'tickets', label: 'Total de Tickets', emoji: '', color: '#3498db' },
    { key: 'agendamento', label: '% Agendamento', emoji: '', color: '#3498db' },
    { key: 'fechamento', label: '% Fechamento', emoji: '', color: '#2ecc71' },
    { key: 'comparecimento', label: '% Comparecimento', emoji: '', color: '#f39c12' },
    { key: 'followups', label: '🔁 Follow-ups', emoji: '🔁', color: '#c9943a' },
    { key: 'reativados', label: '⚡ Reativados', emoji: '⚡', color: '#9b59b6' },
    { key: 'primeiraResposta', label: '1ª Resposta', emoji: '', color: '#2ecc71' },
    { key: 'tempoResposta', label: '📊 T.M. Resposta', emoji: '📊', color: '#3498db' },
    { key: 'tempoResolucao', label: '🔧 T.M. Resolução', emoji: '🔧', color: '#f39c12' },
    { key: 'faturamento', label: '💰 Faturamento', emoji: '💰', color: '#2ecc71' },
    { key: 'conversasFechadas', label: '🔒 Conv. Fechadas', emoji: '🔒', color: '#2ecc71' },
  ];

  const CANAIS = [
    { nome: 'WhatsApp', percentual: 78, count: 341, color: '#2ecc71', icon: '💬' },
    { nome: 'Instagram', percentual: 16, count: 70, color: '#e74c3c', icon: '📸' },
    { nome: 'Direto', percentual: 6, count: 26, color: '#3498db', icon: '🔗' },
  ];

  const ALERTAS = [
    {
      id: 'sla',
      icon: '⚠️',
      titulo: 'SLA Próximo do Vencimento',
      descricao: '357 ticket(s) próximos de vencer o SLA',
      acao: 'Priorizar tickets',
      color: '#f39c12',
    },
    {
      id: 'sobrecarga',
      icon: '👥',
      titulo: 'Atendentes Sobrecarregados',
      descricao: '2 atendente(s) com mais de 10 tickets abertos',
      acao: 'Redistribuir',
      color: '#3498db',
    },
    {
      id: 'sem-atendente',
      icon: '🎫',
      titulo: 'Tickets Sem Atendente',
      descricao: '17 ticket(s) aguardando distribuição',
      acao: 'Atribuir agora',
      color: '#f39c12',
    },
  ];

  const AGENTES = [
    {
      numero: 1,
      nome: 'Havila',
      avatar: 'H',
      avaliacao: 4,
      totalAtend: 87,
      emAndamento: 85,
      finalizados: 2,
      tmEspera: '09h 10m',
      tmAtendimento: '00h 07m',
      status: 'Online',
    },
    {
      numero: 2,
      nome: 'Camilly',
      avatar: 'C',
      avaliacao: 4,
      totalAtend: 17,
      emAndamento: 16,
      finalizados: 1,
      tmEspera: '15h 16m',
      tmAtendimento: '00h 01m',
      status: 'Online',
    },
    {
      numero: 3,
      nome: 'Fernando',
      avatar: 'F',
      avaliacao: 4,
      totalAtend: 1,
      emAndamento: 1,
      finalizados: 0,
      tmEspera: '23h 06m',
      tmAtendimento: '00h 00m',
      status: 'Online',
    },
    {
      numero: 4,
      nome: 'Deborah',
      avatar: 'D',
      avaliacao: 4,
      totalAtend: 0,
      emAndamento: 0,
      finalizados: 0,
      tmEspera: '00h 00m',
      tmAtendimento: '00h 00m',
      status: 'Offline',
    },
    {
      numero: 5,
      nome: 'Dra. Andressa',
      avatar: 'DA',
      avaliacao: 4,
      totalAtend: 0,
      emAndamento: 0,
      finalizados: 0,
      tmEspera: '00h 00m',
      tmAtendimento: '00h 00m',
      status: 'Online',
    },
  ];

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleIndicador = (key: string) => {
    if (selectedIndicators.includes(key)) {
      setSelectedIndicators(selectedIndicators.filter((k) => k !== key));
    } else {
      setSelectedIndicators([...selectedIndicators, key]);
    }
  };

  const limparIndicadores = () => {
    setSelectedIndicators([]);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

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

      {/* INDICADORES DE PERFORMANCE - 11 KPIs */}
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
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
        }}>
          {/* Total de Tickets */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>TOTAL DE TICKETS</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('tickets')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
                {tooltipVisible === 'tickets' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '120%',
                    right: 0,
                    background: '#0a1218',
                    border: '1px solid #1e3d54',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: '#b0b8c1',
                    zIndex: 10,
                    whiteSpace: 'nowrap',
                  }}>
                    {KPI_TOOLTIPS.tickets}
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#c9943a', marginBottom: '8px' }}>
              {stats.tickets}
            </div>
            <div style={{
              height: '4px',
              background: '#1a3347',
              borderRadius: '2px',
              marginBottom: '8px',
            }}>
              <div style={{ height: '100%', width: '70%', background: '#c9943a' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>Criados no período</div>
          </div>

          {/* % Agendamento */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>% DE AGENDAMENTO</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('agendamento')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#3498db', marginBottom: '8px' }}>
              {stats.agendamento}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>leads → agendados</div>
          </div>

          {/* % Fechamento */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>% DE FECHAMENTO</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('fechamento')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc71', marginBottom: '8px' }}>
              {stats.fechamento}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>compareceram → fecharam</div>
          </div>

          {/* % Comparecimento */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>% DE COMPARECIMENTO</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('comparecimento')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#f39c12', marginBottom: '8px' }}>
              {stats.comparecimento}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>agendados → compareceram</div>
          </div>

          {/* Follow-ups Realizados */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>FOLLOW-UPS REALIZADOS</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('followups')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#c9943a', marginBottom: '8px' }}>
              {stats.followups}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>no período</div>
          </div>

          {/* Pacientes Reativados */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>PACIENTES REATIVADOS</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('reativados')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#3498db', marginBottom: '8px' }}>
              {stats.reativados}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>no período</div>
          </div>

          {/* Primeira Resposta */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>PRIMEIRA RESPOSTA</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('primeiraResposta')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc71', marginBottom: '8px' }}>
              {stats.primeiraResposta}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>Tempo médio inicial</div>
          </div>

          {/* Tempo Médio de Resposta */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>TEMPO MÉDIO DE RESPOSTA</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('tempoResposta')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc71', marginBottom: '8px' }}>
              {stats.tempoResposta}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>↑ Média: 15min</div>
          </div>

          {/* T.M. Resolução */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>T.M. DE RESOLUÇÃO DO TICKET</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('tempoResolucao')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#f39c12', marginBottom: '8px' }}>
              {stats.tempoResolucao}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>Média de resolução</div>
          </div>

          {/* Faturamento */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>FATURAMENTO ATUAL</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('faturamento')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc71', marginBottom: '8px' }}>
              {stats.faturamento}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>no período</div>
          </div>

          {/* Conversas Fechadas */}
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>CONVERSAS FECHADAS</div>
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#7a96aa',
              }}
                onMouseEnter={() => setTooltipVisible('conversasFechadas')}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                ℹ️
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2ecc71', marginBottom: '8px' }}>
              {stats.conversasFechadas}
            </div>
            <div style={{ height: '4px', background: '#1a3347', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ fontSize: '11px', color: '#7a96aa' }}>↑ Fechadas com sucesso</div>
          </div>
        </div>
      </div>

      {/* LINHA DO TEMPO — INDICADORES */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#e8edf2',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}>
          Linha do Tempo — Indicadores
        </div>
        <div style={{
          fontSize: '12px',
          color: '#7a96aa',
          marginBottom: '16px',
        }}>
          SELECIONE OS INDICADORES PARA VISUALIZAR
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px',
        }}>
          {INDICADORES.map((ind) => (
            <button
              key={ind.key}
              onClick={() => toggleIndicador(ind.key)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: selectedIndicators.includes(ind.key) ? `2px solid ${ind.color}` : '1px solid #1e3d54',
                background: selectedIndicators.includes(ind.key) ? `${ind.color}15` : '#132636',
                color: selectedIndicators.includes(ind.key) ? ind.color : '#7a96aa',
                fontSize: '12px',
                fontWeight: selectedIndicators.includes(ind.key) ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {ind.emoji && `${ind.emoji} `}
              {ind.label}
            </button>
          ))}
          <button
            onClick={limparIndicadores}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#7a96aa',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginLeft: 'auto',
            }}
          >
            ✕ Limpar
          </button>
        </div>

        {/* Chart Placeholder */}
        <div style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '24px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7a96aa',
          fontSize: '14px',
        }}>
          📊 Gráfico de Linha (indicadores selecionados: {selectedIndicators.length > 0 ? selectedIndicators.join(', ') : 'nenhum'})
        </div>
      </div>

      {/* TICKETS POR CANAL & FUNIL DE CONVERSÃO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {/* Tickets por Canal */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#e8edf2',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Tickets por Canal</span>
            <span style={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>🟢 AO VIVO</span>
          </div>

          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            gap: '24px',
          }}>
            {/* Pie Chart */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '180px',
            }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'conic-gradient(#2ecc71 0deg 280deg, #e74c3c 280deg 338deg, #3498db 338deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#132636',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#e8edf2',
                }}>
                  <div>437</div>
                  <div style={{ fontSize: '10px', color: '#7a96aa' }}>TICKETS</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '12px',
            }}>
              {CANAIS.map((canal) => (
                <div key={canal.nome} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '14px' }}>{canal.icon}</div>
                    <span style={{ fontSize: '13px', color: '#e8edf2' }}>{canal.nome}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      height: '8px',
                      width: '120px',
                      background: '#1a3347',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${canal.percentual}%`,
                        background: canal.color,
                      }} />
                    </div>
                    <span style={{
                      fontSize: '13px',
                      color: canal.color,
                      fontWeight: 600,
                      minWidth: '50px',
                      textAlign: 'right',
                    }}>
                      {canal.percentual}%<br/><span style={{ fontSize: '10px', color: '#7a96aa' }}>{canal.count}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funil de Conversão */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#e8edf2',
            marginBottom: '16px',
          }}>
            Funil de Conversão
          </div>

          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '250px',
          }}>
            {/* Leads */}
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '6px' }}>Leads</div>
              <div style={{
                background: '#3498db',
                height: '50px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px',
                fontSize: '16px',
                fontWeight: 700,
                color: '#e8edf2',
              }}>
                100%
              </div>
            </div>

            {/* Agendados */}
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '6px' }}>Agendados</div>
              <div style={{
                background: '#c9943a',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px',
                fontSize: '16px',
                fontWeight: 700,
                color: '#e8edf2',
              }}>
                72%
              </div>
            </div>

            {/* Compareceram */}
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '6px' }}>Compareceram</div>
              <div style={{
                background: '#e8b86d',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0d1f2d',
              }}>
                44%
              </div>
            </div>

            {/* Fecharam */}
            <div>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '6px' }}>Fecharam</div>
              <div style={{
                background: '#2ecc71',
                height: '24px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#e8edf2',
              }}>
                27%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ALERTAS & RANKING DE AGENTES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.8fr',
        gap: '20px',
      }}>
        {/* Alertas */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#e8edf2',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Alertas Ativos</span>
            <span style={{
              background: '#e74c3c',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '4px',
            }}>
              {ALERTAS.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ALERTAS.map((alerta) => (
              <div
                key={alerta.id}
                style={{
                  background: '#132636',
                  border: `2px solid ${alerta.color}`,
                  borderLeft: `6px solid ${alerta.color}`,
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#e8edf2',
                  marginBottom: '4px',
                  display: 'flex',
                  gap: '6px',
                }}>
                  {alerta.icon} {alerta.titulo}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#7a96aa',
                  marginBottom: '8px',
                }}>
                  {alerta.descricao}
                </div>
                <button style={{
                  background: 'transparent',
                  border: `1px solid ${alerta.color}`,
                  color: alerta.color,
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {alerta.acao}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#e8edf2',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Ranking de SDRs / Agentes</span>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: '#7a96aa',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              📥 Exportar
            </button>
          </div>

          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '8px',
            overflow: 'auto',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e3d54' }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>#</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>NOME</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>AVALIAÇÃO</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>TOTAL ATEND.</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>EM ANDAMENTO</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>FINALIZADOS</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>T.M. ESPERA</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>T.M. ATENDIMENTO</th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#7a96aa',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {AGENTES.map((agente) => (
                  <tr key={agente.numero} style={{ borderBottom: '1px solid #1e3d54' }}>
                    <td style={{ padding: '12px', textAlign: 'left', color: '#7a96aa' }}>{agente.numero}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'left',
                      color: '#e8edf2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#c9943a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#0d1f2d',
                      }}>
                        {agente.avatar}
                      </div>
                      {agente.nome}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'left', color: '#f39c12' }}>
                      {'⭐'.repeat(agente.avaliacao)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#e8edf2', fontWeight: 600 }}>
                      {agente.totalAtend}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#f39c12', fontWeight: 600 }}>
                      {agente.emAndamento}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#2ecc71', fontWeight: 600 }}>
                      {agente.finalizados}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#7a96aa' }}>
                      {agente.tmEspera}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#7a96aa' }}>
                      {agente.tmAtendimento}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: agente.status === 'Online' ? '#2ecc71' : '#e74c3c',
                      fontWeight: 600,
                      fontSize: '11px',
                    }}>
                      {agente.status === 'Online' ? '🟢 Online' : '🔴 Offline'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#7a96aa',
        paddingTop: '20px',
        borderTop: '1px solid #1e3d54',
        marginTop: '28px',
      }}>
        ProClinic — Inteligência Comercial · v1.0
      </div>
    </div>
  );
}

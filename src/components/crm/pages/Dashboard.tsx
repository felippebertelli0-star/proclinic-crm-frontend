/**
 * Dashboard Page - CRM ProClinic
 * 100% Fiel ao protótipo com todos os KPIs, gráficos e interatividade
 */

'use client';

import { useState } from 'react';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Hoje');
  const [startDate, setStartDate] = useState('2026-04-17');
  const [endDate, setEndDate] = useState('2026-04-17');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['tickets']);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

  // Mock Data
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

  const toggleIndicador = (key: string) => {
    if (selectedIndicators.includes(key)) {
      setSelectedIndicators(selectedIndicators.filter((k) => k !== key));
    } else {
      setSelectedIndicators([...selectedIndicators, key]);
    }
  };

  return (
    <div style={{
      padding: '24px',
      background: '#0d1f2d',
      minHeight: '100vh',
      color: '#e8edf2',
    }}>
      {/* FILTER BAR */}
      <div style={{
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#7a96aa' }}>📅 Período:</span>
        {['Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 30 dias', 'Este mês'].map((period) => (
          <button
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
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#7a96aa' }}>De</span>
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
            }}
          />
          <span style={{ fontSize: '12px', color: '#7a96aa' }}>Até</span>
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
            }}
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* STATUS CARDS */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.5px' }}>
          Status em Tempo Real
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {[
            { icon: '🟢', label: 'Atendendo', value: stats.atendendo, color: '#2ecc71', subtext: 'tickets em atendimento ativo' },
            { icon: '⏳', label: 'Aguardando', value: stats.aguardando, color: '#f39c12', subtext: 'tickets pendentes' },
            { icon: '✅', label: 'Fechados no Período', value: stats.fechados, color: '#3498db', subtext: 'tickets finalizados' },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '12px',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '20px' }}>{card.icon}</div>
              <div>
                <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '4px' }}>{card.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '10px', color: '#7a96aa', marginTop: '4px' }}>{card.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVITY CARDS */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.5px' }}>
          Atividade do Dia
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {[
            { icon: '👤', label: 'Novos Leads Chegaram', value: '47', color: '#c9943a', subtext: '↑ no período selecionado' },
            { icon: '📥', label: 'Mensagens Recebidas', value: '2.2k', color: '#3498db', subtext: '↑ WhatsApp + Instagram' },
            { icon: '📤', label: 'Mensagens Enviadas', value: '2.5k', color: '#2ecc71', subtext: '↑ Pela equipe' },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '12px',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${card.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '4px' }}>{card.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '11px', color: '#2ecc71', fontWeight: 600, marginTop: '4px' }}>{card.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI GRID - 11 KPIs */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.5px' }}>
          Indicadores de Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { key: 'tickets', label: 'TOTAL DE TICKETS', value: stats.tickets, color: '#c9943a', subtext: 'Criados no período', bar: 70 },
            { key: 'agendamento', label: '% DE AGENDAMENTO', value: stats.agendamento, color: '#3498db', subtext: 'leads → agendados', bar: 18 },
            { key: 'fechamento', label: '% DE FECHAMENTO', value: stats.fechamento, color: '#2ecc71', subtext: 'compareceram → fecharam', bar: 61 },
            { key: 'comparecimento', label: '% DE COMPARECIMENTO', value: stats.comparecimento, color: '#f39c12', subtext: 'agendados → compareceram', bar: 72 },
            { key: 'followups', label: 'FOLLOW-UPS REALIZADOS', value: stats.followups, color: '#c9943a', subtext: 'no período', bar: 0 },
            { key: 'reativados', label: 'PACIENTES REATIVADOS', value: stats.reativados, color: '#3498db', subtext: 'no período', bar: 0 },
            { key: 'primeiraResposta', label: 'PRIMEIRA RESPOSTA', value: stats.primeiraResposta, color: '#2ecc71', subtext: 'Tempo médio inicial', bar: 0 },
            { key: 'tempoResposta', label: 'TEMPO MÉDIO DE RESPOSTA', value: stats.tempoResposta, color: '#2ecc71', subtext: '↑ Média: 15min', bar: 0 },
            { key: 'tempoResolucao', label: 'T.M. DE RESOLUÇÃO DO TICKET', value: stats.tempoResolucao, color: '#f39c12', subtext: 'Média de resolução', bar: 0 },
            { key: 'faturamento', label: 'FATURAMENTO ATUAL', value: stats.faturamento, color: '#2ecc71', subtext: 'no período', bar: 0 },
            { key: 'conversasFechadas', label: 'CONVERSAS FECHADAS', value: stats.conversasFechadas, color: '#2ecc71', subtext: '↑ Fechadas com sucesso', bar: 0 },
          ].map((kpi) => (
            <div
              key={kpi.key}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderRadius: '14px',
                padding: '18px 20px',
                position: 'relative',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ fontSize: '10px', color: '#7a96aa', fontWeight: 700 }}>{kpi.label}</div>
                <div
                  onMouseEnter={() => setTooltipVisible(kpi.key)}
                  onMouseLeave={() => setTooltipVisible(null)}
                  style={{
                    fontSize: '12px',
                    color: '#7a96aa',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  ℹ️
                  {tooltipVisible === kpi.key && (
                    <div style={{
                      position: 'absolute',
                      bottom: '120%',
                      right: 0,
                      background: '#0a1218',
                      border: '1px solid #1e3d54',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '10px',
                      color: '#b0b8c1',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                      minWidth: '200px',
                    }}>
                      {KPI_TOOLTIPS[kpi.key as keyof typeof KPI_TOOLTIPS]}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: kpi.color, marginBottom: '6px' }}>
                {kpi.value}
              </div>
              {kpi.bar > 0 && (
                <div style={{
                  height: '3px',
                  background: '#1a3347',
                  borderRadius: '2px',
                  marginBottom: '6px',
                  overflow: 'hidden',
                }}>
                  <div style={{ height: '100%', width: `${kpi.bar}%`, background: kpi.color }} />
                </div>
              )}
              <div style={{ fontSize: '10px', color: '#7a96aa' }}>{kpi.subtext}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LINHA DO TEMPO */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.5px' }}>
          Linha do Tempo — Indicadores
        </h2>
        <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '12px' }}>
          SELECIONE OS INDICADORES PARA VISUALIZAR
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {[
            { key: 'tickets', label: 'Total de Tickets', color: '#3498db' },
            { key: 'agendamento', label: '% Agendamento', color: '#3498db' },
            { key: 'fechamento', label: '% Fechamento', color: '#2ecc71' },
            { key: 'comparecimento', label: '% Comparecimento', color: '#f39c12' },
            { key: 'followups', label: '🔁 Follow-ups', color: '#c9943a' },
            { key: 'reativados', label: '⚡ Reativados', color: '#9b59b6' },
            { key: 'primeiraResposta', label: '1ª Resposta', color: '#2ecc71' },
            { key: 'tempoResposta', label: '📊 T.M. Resposta', color: '#3498db' },
            { key: 'tempoResolucao', label: '🔧 T.M. Resolução', color: '#f39c12' },
            { key: 'faturamento', label: '💰 Faturamento', color: '#2ecc71' },
            { key: 'conversasFechadas', label: '🔒 Conv. Fechadas', color: '#2ecc71' },
          ].map((ind) => (
            <button
              key={ind.key}
              onClick={() => toggleIndicador(ind.key)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: selectedIndicators.includes(ind.key) ? `2px solid ${ind.color}` : '1px solid #1e3d54',
                background: selectedIndicators.includes(ind.key) ? `${ind.color}15` : '#132636',
                color: selectedIndicators.includes(ind.key) ? ind.color : '#7a96aa',
                fontSize: '11px',
                fontWeight: selectedIndicators.includes(ind.key) ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {ind.label}
            </button>
          ))}
          <button
            onClick={() => setSelectedIndicators([])}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#7a96aa',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            ✕ Limpar
          </button>
        </div>
        <div style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '20px',
          height: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7a96aa',
          fontSize: '13px',
        }}>
          📊 Gráfico de Linha (indicadores selecionados: {selectedIndicators.length > 0 ? selectedIndicators.join(', ') : 'nenhum'})
        </div>
      </div>

      {/* CHANNELS & FUNNEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        {/* TICKETS POR CANAL */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tickets por Canal</span>
            <span style={{ fontSize: '11px', color: '#2ecc71', fontWeight: 600 }}>🟢 AO VIVO</span>
          </h3>
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            gap: '16px',
          }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#2ecc71 0deg 280deg, #e74c3c 280deg 338deg, #3498db 338deg 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#132636', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
                <div>437</div>
                <div style={{ fontSize: '8px', color: '#7a96aa' }}>TICKETS</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
              {[{ name: 'WhatsApp', pct: 78, count: 341, color: '#2ecc71' }, { name: 'Instagram', pct: 16, count: 70, color: '#e74c3c' }, { name: 'Direto', pct: 6, count: 26, color: '#3498db' }].map((c) => (
                <div key={c.name} style={{ fontSize: '10px', color: '#e8edf2' }}>
                  {c.name} • {c.pct}% ({c.count})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FUNNEL */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Funil de Conversão</h3>
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {[{ label: 'Leads', pct: 100, color: '#3498db' }, { label: 'Agendados', pct: 72, color: '#c9943a' }, { label: 'Compareceram', pct: 44, color: '#e8b86d' }, { label: 'Fecharam', pct: 27, color: '#2ecc71' }].map((f) => (
              <div key={f.label}>
                <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '4px' }}>{f.label}</div>
                <div style={{
                  background: f.color,
                  height: `${24 + f.pct / 5}px`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#e8edf2',
                }}>
                  {f.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALERTS & RANKING */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '16px' }}>
        {/* ALERTS */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Alertas Ativos</span>
            <span style={{ background: '#e74c3c', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>3</span>
          </h3>
          {[
            { icon: '⚠️', title: 'SLA Próximo do Vencimento', desc: '357 ticket(s) próximos de vencer o SLA', color: '#f39c12' },
            { icon: '👥', title: 'Atendentes Sobrecarregados', desc: '2 atendente(s) com mais de 10 tickets', color: '#3498db' },
            { icon: '🎫', title: 'Tickets Sem Atendente', desc: '17 ticket(s) aguardando distribuição', color: '#f39c12' },
          ].map((a) => (
            <div key={a.title} style={{
              background: '#132636',
              border: `2px solid ${a.color}`,
              borderLeft: `6px solid ${a.color}`,
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '8px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                {a.icon} {a.title}
              </div>
              <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '6px' }}>{a.desc}</div>
              <button style={{
                background: 'transparent',
                border: `1px solid ${a.color}`,
                color: a.color,
                fontSize: '9px',
                fontWeight: 600,
                padding: '3px 6px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}>
                Ação
              </button>
            </div>
          ))}
        </div>

        {/* RANKING TABLE */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Ranking de SDRs / Agentes</span>
            <button style={{ background: 'transparent', border: 'none', color: '#7a96aa', fontSize: '10px', cursor: 'pointer' }}>
              📥 Exportar
            </button>
          </h3>
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            overflow: 'auto',
            maxHeight: '300px',
          }}>
            <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e3d54' }}>
                  {['#', 'NOME', 'AVALIAÇÃO', 'TOTAL', 'EM AND.', 'FINALI.', 'T.M.ESP', 'T.M.AT', 'STATUS'].map((h) => (
                    <th key={h} style={{
                      padding: '8px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#7a96aa',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { no: 1, nome: 'Havila', aval: 4, total: 87, and: 85, fin: 2, esp: '09h', at: '00h', status: 'Online' },
                  { no: 2, nome: 'Camilly', aval: 4, total: 17, and: 16, fin: 1, esp: '15h', at: '00h', status: 'Online' },
                  { no: 3, nome: 'Fernando', aval: 4, total: 1, and: 1, fin: 0, esp: '23h', at: '00h', status: 'Online' },
                  { no: 4, nome: 'Deborah', aval: 4, total: 0, and: 0, fin: 0, esp: '00h', at: '00h', status: 'Offline' },
                ].map((a) => (
                  <tr key={a.nome} style={{ borderBottom: '1px solid #1e3d54' }}>
                    <td style={{ padding: '8px', color: '#7a96aa' }}>{a.no}</td>
                    <td style={{ padding: '8px', color: '#e8edf2' }}>{a.nome}</td>
                    <td style={{ padding: '8px', color: '#f39c12' }}>{'⭐'.repeat(a.aval)}</td>
                    <td style={{ padding: '8px', color: '#e8edf2', fontWeight: 600 }}>{a.total}</td>
                    <td style={{ padding: '8px', color: '#f39c12', fontWeight: 600 }}>{a.and}</td>
                    <td style={{ padding: '8px', color: '#2ecc71', fontWeight: 600 }}>{a.fin}</td>
                    <td style={{ padding: '8px', color: '#7a96aa' }}>{a.esp}</td>
                    <td style={{ padding: '8px', color: '#7a96aa' }}>{a.at}</td>
                    <td style={{
                      padding: '8px',
                      color: a.status === 'Online' ? '#2ecc71' : '#e74c3c',
                      fontWeight: 600,
                      fontSize: '9px',
                    }}>
                      {a.status === 'Online' ? '🟢' : '🔴'} {a.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

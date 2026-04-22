/**
 * Dashboard Page - CRM ProClinic
 * ULTRA MEGA PREMIUM AAA redesign
 * Mantém toda a lógica funcional (state, cálculos, gráfico)
 * Upgrade completo da camada visual/animação
 */

'use client';

import { useMemo, useState } from 'react';
import { IconSVG } from '@/lib/icons';
import styles from './Dashboard.module.css';

// ============ HELPERS ============
const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const PERIODS = ['Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 30 dias', 'Este mês'] as const;

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Hoje');
  const [startDate, setStartDate] = useState('2026-04-17');
  const [endDate, setEndDate] = useState('2026-04-17');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['tickets']);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; indicator: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const getIcon = (iconKey: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      active: IconSVG.active(),
      pending: IconSVG.pending(),
      completed: IconSVG.completed(),
      users: IconSVG.users(),
      inbox: IconSVG.inbox(),
      send: IconSVG.send(),
      alertTriangle: IconSVG.alertTriangle(),
      alertOverload: IconSVG.alertOverload(),
      tickets: IconSVG.tickets(),
      info: IconSVG.info(),
    };
    return iconMap[iconKey] || null;
  };

  // ============ MOCK DATA (fictício) ============
  const dailyData: Record<string, any> = {
    '2026-03-19': { atendendo: 250, aguardando: 12, fechados: 16, leads: 30, recebidas: 1600, enviadas: 1700, tickets: 80, agendamento: 15, fechamento: 55, comparecimento: 65, followups: 6, reativados: 1, primeiraResposta: 16, tempoResposta: 15, tempoResolucao: 0.13, faturamento: 2800, conversasFechadas: 12 },
    '2026-03-20': { atendendo: 270, aguardando: 13, fechados: 17, leads: 33, recebidas: 1700, enviadas: 1800, tickets: 88, agendamento: 15.5, fechamento: 56, comparecimento: 66, followups: 7, reativados: 1, primeiraResposta: 16, tempoResposta: 15, tempoResolucao: 0.13, faturamento: 3000, conversasFechadas: 13 },
    '2026-04-10': { atendendo: 290, aguardando: 14, fechados: 19, leads: 38, recebidas: 1900, enviadas: 2000, tickets: 105, agendamento: 17, fechamento: 59, comparecimento: 69, followups: 9, reativados: 2, primeiraResposta: 14, tempoResposta: 13, tempoResolucao: 0.11, faturamento: 3600, conversasFechadas: 15 },
    '2026-04-11': { atendendo: 305, aguardando: 15, fechados: 20, leads: 40, recebidas: 2000, enviadas: 2100, tickets: 110, agendamento: 17.2, fechamento: 59.5, comparecimento: 70, followups: 9, reativados: 2, primeiraResposta: 14, tempoResposta: 13, tempoResolucao: 0.115, faturamento: 3700, conversasFechadas: 16 },
    '2026-04-12': { atendendo: 330, aguardando: 17, fechados: 23, leads: 44, recebidas: 2100, enviadas: 2300, tickets: 128, agendamento: 17.8, fechamento: 60, comparecimento: 70.5, followups: 11, reativados: 2, primeiraResposta: 13, tempoResposta: 12.9, tempoResolucao: 0.105, faturamento: 3900, conversasFechadas: 17 },
    '2026-04-13': { atendendo: 315, aguardando: 16, fechados: 21, leads: 41, recebidas: 2050, enviadas: 2200, tickets: 120, agendamento: 17.5, fechamento: 59.8, comparecimento: 71, followups: 10, reativados: 2, primeiraResposta: 13.5, tempoResposta: 13, tempoResolucao: 0.11, faturamento: 3800, conversasFechadas: 16 },
    '2026-04-14': { atendendo: 340, aguardando: 19, fechados: 24, leads: 45, recebidas: 2150, enviadas: 2400, tickets: 135, agendamento: 18.1, fechamento: 61, comparecimento: 71.5, followups: 11, reativados: 3, primeiraResposta: 13, tempoResposta: 12.8, tempoResolucao: 0.1, faturamento: 4000, conversasFechadas: 18 },
    '2026-04-15': { atendendo: 280, aguardando: 15, fechados: 18, leads: 35, recebidas: 1800, enviadas: 1900, tickets: 95, agendamento: 16.5, fechamento: 58, comparecimento: 68, followups: 8, reativados: 2, primeiraResposta: 15, tempoResposta: 14, tempoResolucao: 0.12, faturamento: 3200, conversasFechadas: 14 },
    '2026-04-16': { atendendo: 320, aguardando: 18, fechados: 22, leads: 42, recebidas: 2000, enviadas: 2200, tickets: 118, agendamento: 17.8, fechamento: 60, comparecimento: 70, followups: 10, reativados: 2, primeiraResposta: 14, tempoResposta: 13, tempoResolucao: 0.11, faturamento: 3800, conversasFechadas: 17 },
    '2026-04-17': { atendendo: 366, aguardando: 20, fechados: 26, leads: 47, recebidas: 2200, enviadas: 2500, tickets: 141, agendamento: 18.4, fechamento: 61.5, comparecimento: 72, followups: 12, reativados: 3, primeiraResposta: 13, tempoResposta: 12.9, tempoResolucao: 0.1, faturamento: 4200, conversasFechadas: 19 },
  };

  // ============ STATS ============
  const stats = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    const valid = dates.filter((d) => dailyData[d]);

    if (valid.length === 0) {
      return {
        atendendo: 0, aguardando: 0, fechados: 0, leads: 0, recebidas: '0', enviadas: '0',
        tickets: 0, agendamento: '0%', fechamento: '0%', comparecimento: '0%', followups: 0,
        reativados: 0, primeiraResposta: '0 min', tempoResposta: '0 min', tempoResolucao: '0h',
        faturamento: 'R$ 0', conversasFechadas: 0,
      };
    }

    const sum = (key: string) => valid.reduce((acc, d) => acc + (dailyData[d][key] || 0), 0);
    const avg = (key: string) => Math.round((sum(key) / valid.length) * 10) / 10;

    return {
      atendendo: sum('atendendo'),
      aguardando: sum('aguardando'),
      fechados: sum('fechados'),
      leads: sum('leads'),
      recebidas: fmtCompact(sum('recebidas')),
      enviadas: fmtCompact(sum('enviadas')),
      tickets: sum('tickets'),
      agendamento: `${avg('agendamento').toFixed(1)}%`,
      fechamento: `${avg('fechamento').toFixed(1)}%`,
      comparecimento: `${Math.round(avg('comparecimento'))}%`,
      followups: sum('followups'),
      reativados: sum('reativados'),
      primeiraResposta: `${Math.round(avg('primeiraResposta'))} min`,
      tempoResposta: `${avg('tempoResposta').toFixed(1)} min`,
      tempoResolucao: `${(sum('tempoResolucao') / valid.length).toFixed(2)}h`,
      faturamento: `R$ ${fmtCompact(sum('faturamento'))}`,
      conversasFechadas: sum('conversasFechadas'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const activity = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    const valid = dates.filter((d) => dailyData[d]);
    if (valid.length === 0) return { leads: 0, recebidas: '0', enviadas: '0' };
    const sum = (key: string) => valid.reduce((acc, d) => acc + (dailyData[d][key] || 0), 0);
    return { leads: sum('leads'), recebidas: fmtCompact(sum('recebidas')), enviadas: fmtCompact(sum('enviadas')) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const KPI_TOOLTIPS: Record<string, string> = {
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

  const applyPeriod = (period: string) => {
    const today = new Date('2026-04-17');
    const start = new Date(today);
    const end = new Date(today);
    switch (period) {
      case 'Hoje':
        break;
      case 'Ontem':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'Últimos 7 dias':
        start.setDate(start.getDate() - 6);
        break;
      case 'Últimos 30 dias':
        start.setDate(start.getDate() - 29);
        break;
      case 'Este mês':
        start.setDate(1);
        break;
    }
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setSelectedPeriod(period);
  };

  const toggleIndicador = (key: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ============ CHART ============
  const indicatorMeta: Record<string, { color: string; label: string }> = {
    tickets: { color: '#3498db', label: 'Total de Tickets' },
    agendamento: { color: '#c9943a', label: '% Agendamento' },
    fechamento: { color: '#2ecc71', label: '% Fechamento' },
    comparecimento: { color: '#f39c12', label: '% Comparecimento' },
    followups: { color: '#9b59b6', label: 'Follow-ups' },
    reativados: { color: '#e74c3c', label: 'Reativados' },
    primeiraResposta: { color: '#1abc9c', label: '1ª Resposta' },
    tempoResposta: { color: '#34495e', label: 'T.M. Resposta' },
    tempoResolucao: { color: '#95a5a6', label: 'T.M. Resolução' },
    faturamento: { color: '#27ae60', label: 'Faturamento' },
    conversasFechadas: { color: '#d35400', label: 'Conv. Fechadas' },
  };

  const chartData = useMemo(() => {
    if (selectedPeriod === 'Hoje' || selectedPeriod === 'Ontem') {
      const hours = ['00h', '04h', '08h', '12h', '16h', '20h', '24h'];
      return hours.map((hour, i) => ({
        hour,
        tickets: 3 + i * 5.5, agendamento: 2 + i * 3, fechamento: 5 + i * 7,
        comparecimento: 4 + i * 8, followups: 1 + i * 1.5, reativados: 0.2 + i * 0.4,
        primeiraResposta: 20 - i * 1.2, tempoResposta: 18 - i * 0.9, tempoResolucao: 0.15 - i * 0.01,
        faturamento: 100 + i * 60, conversasFechadas: 2 + i * 2.8,
      }));
    }
    if (selectedPeriod === 'Últimos 7 dias') {
      const diasSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
      return diasSemana.map((dia, i) => ({
        hour: dia,
        tickets: 25 + i * 8, agendamento: 15 + i * 2, fechamento: 35 + i * 5,
        comparecimento: 40 + i * 6, followups: 5 + i * 1, reativados: 2 + i * 0.5,
        primeiraResposta: 15 - i * 0.5, tempoResposta: 14 - i * 0.3, tempoResolucao: 0.12 - i * 0.005,
        faturamento: 800 + i * 200, conversasFechadas: 10 + i * 2,
      }));
    }
    if (selectedPeriod === 'Últimos 30 dias' || selectedPeriod === 'Este mês') {
      return Array.from({ length: 30 }, (_, i) => ({
        hour: String(i + 1).padStart(2, '0'),
        tickets: 20 + (i % 20) * 3, agendamento: 12 + (i % 15) * 2, fechamento: 30 + (i % 25) * 3,
        comparecimento: 35 + (i % 20) * 4, followups: 4 + (i % 10) * 1, reativados: 1 + (i % 5) * 0.5,
        primeiraResposta: 14 + (i % 8) * 0.5, tempoResposta: 13 + (i % 7) * 0.3, tempoResolucao: 0.11 + (i % 5) * 0.01,
        faturamento: 700 + (i % 30) * 100, conversasFechadas: 8 + (i % 12) * 1,
      }));
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates.map((date, i) => ({
      hour: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit' }),
      tickets: 20 + i * 3, agendamento: 12 + i * 2, fechamento: 30 + i * 3,
      comparecimento: 35 + i * 4, followups: 4 + i * 0.5, reativados: 1 + i * 0.3,
      primeiraResposta: 14 + i * 0.3, tempoResposta: 13 + i * 0.2, tempoResolucao: 0.11 + i * 0.001,
      faturamento: 700 + i * 50, conversasFechadas: 8 + i * 0.5,
    }));
  }, [selectedPeriod, startDate, endDate]);

  const chartWidth = 1600;
  const chartHeight = 380;
  const padding = 70;
  const maxValue = 100;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  const createPoints = (key: string) => {
    const divisor = Math.max(chartData.length - 1, 1);
    return chartData.map((data, i) => ({
      x: padding + (i / divisor) * graphWidth,
      y: chartHeight - padding - ((data[key as keyof typeof data] as number) / maxValue) * graphHeight,
      value: data[key as keyof typeof data],
    }));
  };

  // Smooth cubic bezier path (Catmull-Rom → Bezier)
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const buildAreaPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    const line = buildSmoothPath(pts);
    return `${line} L ${pts[pts.length - 1].x},${chartHeight - padding} L ${pts[0].x},${chartHeight - padding} Z`;
  };

  // ============ DELTA (comparação fictícia vs período anterior) ============
  const deltaFor = (key: string): { value: number; up: boolean } => {
    // Valores fictícios que refletem crescimento saudável
    const map: Record<string, number> = {
      tickets: 12.4, agendamento: 3.2, fechamento: 1.8, comparecimento: 2.1,
      followups: 18.0, reativados: 50.0, primeiraResposta: -7.4,
      tempoResposta: -4.2, tempoResolucao: -9.0, faturamento: 14.5, conversasFechadas: 11.8,
    };
    const v = map[key] ?? 0;
    // para tempos, negativo é BOM (mais rápido)
    const isTimeKpi = ['primeiraResposta', 'tempoResposta', 'tempoResolucao'].includes(key);
    return { value: v, up: isTimeKpi ? v < 0 : v >= 0 };
  };

  // ============ RENDER ============
  return (
    <div
      className={styles.dashboardContent}
      style={{
        padding: '26px 28px 40px',
        background:
          'radial-gradient(1200px circle at 80% -10%, rgba(201,148,58,0.06), transparent 50%), radial-gradient(800px circle at -10% 20%, rgba(52,152,219,0.05), transparent 50%), #0d1f2d',
        minHeight: '100%',
        color: '#e8edf2',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(201, 148, 58, 0.4) rgba(13, 31, 45, 0.3)',
      }}
    >
      {/* ============ HERO HEADER ============ */}
      <div
        className={styles.fadeIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 22,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#2ecc71',
                boxShadow: '0 0 0 0 rgba(46,204,113,0.6)',
              }}
              className={styles.pulseDot}
            />
            <span style={{ fontSize: 11, color: '#7a96aa', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Visão geral · Sincronizado em tempo real
            </span>
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.8px',
              background: 'linear-gradient(120deg, #ffffff 0%, #e8edf2 40%, #c9943a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Dashboard Executivo
          </h1>
          <div style={{ fontSize: 12, color: '#7a96aa', marginTop: 4 }}>
            Acompanhe os indicadores-chave do atendimento, pipeline e performance da equipe
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(46,204,113,0.05))',
              border: '1px solid rgba(46,204,113,0.35)',
              fontSize: 11,
              fontWeight: 700,
              color: '#2ecc71',
              letterSpacing: '0.3px',
            }}
          >
            <span className={styles.liveBadge}>AO VIVO</span>
          </div>
          <button
            style={{
              padding: '9px 18px',
              borderRadius: 12,
              border: '1px solid rgba(201,148,58,0.4)',
              background: 'linear-gradient(135deg, #c9943a, #a87a28)',
              color: '#0d1f2d',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.3px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(201,148,58,0.25)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)')}
          >
            ↓ Exportar Relatório
          </button>
        </div>
      </div>

      {/* ============ PREMIUM FILTER TOOLBAR ============ */}
      <div
        className={`${styles.toolbar} ${styles.fadeIn}`}
        style={{
          border: '1px solid #1e3d54',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: '#7a96aa', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Período
        </span>
        {PERIODS.map((period) => {
          const active = selectedPeriod === period;
          return (
            <button
              key={period}
              onClick={() => applyPeriod(period)}
              className={active ? styles.pillActive : undefined}
              style={{
                padding: '7px 14px',
                borderRadius: 10,
                border: active ? '1px solid rgba(201,148,58,0.6)' : '1px solid #1e3d54',
                background: active
                  ? 'linear-gradient(135deg, rgba(201,148,58,0.18), rgba(201,148,58,0.05))'
                  : 'rgba(26,51,71,0.4)',
                color: active ? '#c9943a' : '#b0c4d4',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {period}
            </button>
          );
        })}

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            borderRadius: 10,
            background: 'rgba(13,31,45,0.5)',
            border: '1px solid #1e3d54',
          }}
        >
          <span style={{ fontSize: 11, color: '#7a96aa', fontWeight: 600 }}>De</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Data de início do período"
            style={{
              padding: '6px 10px',
              background: '#1a3347',
              border: '1px solid #1e3d54',
              borderRadius: 8,
              color: '#e8edf2',
              fontSize: 12,
            }}
          />
          <span style={{ fontSize: 11, color: '#7a96aa', fontWeight: 600 }}>Até</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Data de fim do período"
            style={{
              padding: '6px 10px',
              background: '#1a3347',
              border: '1px solid #1e3d54',
              borderRadius: 8,
              color: '#e8edf2',
              fontSize: 12,
            }}
          />
          <button
            onClick={() => setSelectedPeriod('Personalizado')}
            style={{
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #c9943a, #e8b86d, #c9943a)',
              backgroundSize: '200% 100%',
              border: 'none',
              borderRadius: 8,
              color: '#0d1f2d',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundPosition = '100% 0')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundPosition = '0 0')}
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* ============ STATUS EM TEMPO REAL ============ */}
      <div style={{ marginBottom: 26 }} className={styles.fadeIn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Status em Tempo Real</h2>
          <span className={styles.sectionSubtitle}>Atualizado agora · há poucos segundos</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { icon: 'active', label: 'Atendendo', value: stats.atendendo, color: '#2ecc71', subtext: 'tickets em atendimento ativo', trend: '+12' },
            { icon: 'pending', label: 'Aguardando', value: stats.aguardando, color: '#f39c12', subtext: 'tickets pendentes na fila', trend: '-3' },
            { icon: 'completed', label: 'Fechados no Período', value: stats.fechados, color: '#3498db', subtext: 'tickets finalizados', trend: '+8' },
          ].map((card) => (
            <div
              key={card.label}
              className={styles.premiumCard}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
                (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              style={{
                padding: 22,
                display: 'flex',
                gap: 16,
                borderLeft: `4px solid ${card.color}`,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: `radial-gradient(circle at 30% 30%, ${card.color}30, ${card.color}10)`,
                  border: `1px solid ${card.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${card.color}15`,
                }}
              >
                {getIcon(card.icon)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: '#7a96aa',
                    marginBottom: 6,
                    fontWeight: 800,
                    letterSpacing: '0.7px',
                    textTransform: 'uppercase',
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 900, color: card.color, lineHeight: 1 }}>
                    {card.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 8,
                      background:
                        card.trend.startsWith('+') ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                      color: card.trend.startsWith('+') ? '#2ecc71' : '#e74c3c',
                      border: card.trend.startsWith('+')
                        ? '1px solid rgba(46,204,113,0.3)'
                        : '1px solid rgba(231,76,60,0.3)',
                    }}
                  >
                    {card.trend.startsWith('+') ? '▲' : '▼'} {card.trend}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#7a96aa' }}>{card.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ ATIVIDADE DO DIA ============ */}
      <div style={{ marginBottom: 28 }} className={styles.fadeIn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Atividade do Dia</h2>
          <span className={styles.sectionSubtitle}>fluxo de mensagens e novos contatos</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { icon: 'users', label: 'Novos Leads Chegaram', value: activity.leads.toString(), color: '#3498db', subtext: 'no período selecionado' },
            { icon: 'inbox', label: 'Mensagens Recebidas', value: activity.recebidas, color: '#9b59b6', subtext: 'WhatsApp + Instagram + Direto' },
            { icon: 'send', label: 'Mensagens Enviadas', value: activity.enviadas, color: '#2ecc71', subtext: 'pela equipe de atendimento' },
          ].map((card) => (
            <div
              key={card.label}
              className={styles.premiumCard}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
                (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              style={{ padding: 22, display: 'flex', gap: 16, cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: `radial-gradient(circle at 30% 30%, ${card.color}30, ${card.color}10)`,
                  border: `1px solid ${card.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                {getIcon(card.icon)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: '#7a96aa',
                    marginBottom: 6,
                    fontWeight: 800,
                    letterSpacing: '0.7px',
                    textTransform: 'uppercase',
                  }}
                >
                  {card.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: card.color, marginBottom: 6, lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 10, color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {card.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ KPI GRID ============ */}
      <div style={{ marginBottom: 28 }} className={styles.fadeIn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Indicadores de Performance</h2>
          <span className={styles.sectionSubtitle}>11 KPIs · variação vs período anterior</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { key: 'tickets', label: 'Total de Tickets', value: stats.tickets, color: '#c9943a', subtext: 'Criados no período', bar: 70 },
            { key: 'agendamento', label: '% de Agendamento', value: stats.agendamento, color: '#3498db', subtext: 'leads → agendados', bar: 18 },
            { key: 'fechamento', label: '% de Fechamento', value: stats.fechamento, color: '#2ecc71', subtext: 'compareceram → fecharam', bar: 61 },
            { key: 'comparecimento', label: '% de Comparecimento', value: stats.comparecimento, color: '#f39c12', subtext: 'agendados → compareceram', bar: 72 },
            { key: 'followups', label: 'Follow-ups Realizados', value: stats.followups, color: '#9b59b6', subtext: 'no período', bar: 55 },
            { key: 'reativados', label: 'Pacientes Reativados', value: stats.reativados, color: '#e74c3c', subtext: 'no período', bar: 28 },
            { key: 'primeiraResposta', label: 'Primeira Resposta', value: stats.primeiraResposta, color: '#1abc9c', subtext: 'Tempo médio inicial', bar: 40 },
            { key: 'tempoResposta', label: 'T.M. de Resposta', value: stats.tempoResposta, color: '#16a085', subtext: 'Entre mensagens', bar: 35 },
            { key: 'tempoResolucao', label: 'T.M. de Resolução', value: stats.tempoResolucao, color: '#f39c12', subtext: 'Ticket → fechamento', bar: 25 },
            { key: 'faturamento', label: 'Faturamento no Período', value: stats.faturamento, color: '#27ae60', subtext: 'Receita gerada', bar: 80 },
            { key: 'conversasFechadas', label: 'Conversas Fechadas', value: stats.conversasFechadas, color: '#d35400', subtext: 'Com sucesso', bar: 68 },
          ].map((kpi) => {
            const d = deltaFor(kpi.key);
            const deltaClass = d.value === 0 ? styles.deltaNeutral : d.up ? styles.deltaUp : styles.deltaDown;
            return (
              <div
                key={kpi.key}
                className={styles.premiumCard}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
                  (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
                style={{ padding: '20px 20px 18px', position: 'relative' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: '#b0c4d4',
                      fontWeight: 800,
                      letterSpacing: '0.6px',
                      textTransform: 'uppercase',
                      lineHeight: 1.3,
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    onMouseEnter={() => setTooltipVisible(kpi.key)}
                    onMouseLeave={() => setTooltipVisible(null)}
                    style={{
                      fontSize: 13,
                      color: '#7a96aa',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'color 0.2s',
                    }}
                  >
                    {getIcon('info')}
                    {tooltipVisible === kpi.key && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '150%',
                          right: 0,
                          background: 'rgba(10,18,24,0.98)',
                          border: '1px solid rgba(201,148,58,0.6)',
                          borderRadius: 10,
                          padding: '10px 12px',
                          fontSize: 11,
                          color: '#e8edf2',
                          zIndex: 20,
                          whiteSpace: 'normal',
                          width: 220,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                          backdropFilter: 'blur(8px)',
                          animation: 'dashTooltipIn 0.2s cubic-bezier(0.22,1,0.36,1)',
                          lineHeight: 1.4,
                        }}
                      >
                        {KPI_TOOLTIPS[kpi.key]}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: kpi.color,
                      lineHeight: 1,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div
                    className={deltaClass}
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 8,
                    }}
                  >
                    {d.value > 0 ? '▲' : d.value < 0 ? '▼' : '—'} {Math.abs(d.value).toFixed(1)}%
                  </div>
                </div>

                <div
                  style={{
                    height: 4,
                    background: 'rgba(26,51,71,0.8)',
                    borderRadius: 3,
                    marginBottom: 10,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${kpi.bar}%`,
                      background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}66)`,
                      borderRadius: 3,
                      transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
                      boxShadow: `0 0 8px ${kpi.color}55`,
                    }}
                  />
                </div>

                <div style={{ fontSize: 11, color: '#7a96aa', lineHeight: 1.4 }}>{kpi.subtext}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ LINHA DO TEMPO — GRÁFICO ============ */}
      <div style={{ marginBottom: 28 }} className={styles.fadeIn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Linha do Tempo · Indicadores</h2>
          <span className={styles.sectionSubtitle}>
            {selectedIndicators.length} indicador{selectedIndicators.length !== 1 ? 'es' : ''} selecionado{selectedIndicators.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {Object.entries(indicatorMeta).map(([key, meta]) => {
            const active = selectedIndicators.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleIndicador(key)}
                style={{
                  padding: '7px 13px',
                  borderRadius: 20,
                  border: active ? `1.5px solid ${meta.color}` : '1px solid #1e3d54',
                  background: active ? `${meta.color}18` : 'rgba(19,38,54,0.6)',
                  color: active ? meta.color : '#b0c4d4',
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: active ? `0 4px 14px ${meta.color}25` : 'none',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: meta.color,
                    boxShadow: active ? `0 0 8px ${meta.color}` : 'none',
                  }}
                />
                {meta.label}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedIndicators([])}
            style={{
              padding: '7px 13px',
              borderRadius: 20,
              border: '1px solid #1e3d54',
              background: 'rgba(19,38,54,0.6)',
              color: '#7a96aa',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              marginLeft: 'auto',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#e74c3c';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(231,76,60,0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#7a96aa';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e3d54';
            }}
          >
            × Limpar tudo
          </button>
        </div>

        <div
          className={styles.premiumCard}
          style={{
            padding: '28px 36px',
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {selectedIndicators.length === 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7a96aa',
                gap: 10,
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: 32, opacity: 0.4 }}>📈</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Selecione um ou mais indicadores acima</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>As linhas serão renderizadas aqui em tempo real</div>
            </div>
          )}

          <svg width={chartWidth} height={chartHeight} style={{ width: '100%', height: 'auto', maxWidth: '100%' }}>
            <defs>
              {Object.entries(indicatorMeta).map(([key, meta]) => (
                <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={meta.color} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={meta.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>

            {/* Grid */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={padding + (i / 4) * graphHeight}
                x2={chartWidth - padding}
                y2={padding + (i / 4) * graphHeight}
                stroke="#1a3347"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            ))}

            {/* Eixos */}
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#1e3d54" strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#1e3d54" strokeWidth="1.5" />

            {/* Y labels */}
            {Array.from({ length: 5 }, (_, i) => Math.round((maxValue / 4) * i)).map((val) => (
              <text
                key={`y-label-${val}`}
                x={padding - 12}
                y={chartHeight - padding - (val / maxValue) * graphHeight + 4}
                textAnchor="end"
                fontSize="10"
                fill="#7a96aa"
                fontWeight="600"
              >
                {val}
              </text>
            ))}

            {/* X labels */}
            {chartData.map((data, i) => (
              <text
                key={`x-label-${i}`}
                x={padding + (i / Math.max(chartData.length - 1, 1)) * graphWidth}
                y={chartHeight - padding + 22}
                textAnchor="middle"
                fontSize="10"
                fill="#7a96aa"
                fontWeight="600"
              >
                {data.hour}
              </text>
            ))}

            {/* Linhas + áreas de indicadores selecionados */}
            {selectedIndicators.map((indicator) => {
              const points = createPoints(indicator);
              const meta = indicatorMeta[indicator];
              if (!meta) return null;
              const linePath = buildSmoothPath(points);
              const areaPath = buildAreaPath(points);
              return (
                <g key={`line-${indicator}`}>
                  <path d={areaPath} fill={`url(#grad-${indicator})`} />
                  <path
                    d={linePath}
                    stroke={meta.color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    opacity="0.6"
                  />
                  <path
                    d={linePath}
                    stroke={meta.color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {points.map((p, i) => {
                    const isHover =
                      hoveredPoint?.index === i && hoveredPoint?.indicator === indicator;
                    return (
                      <g key={`point-${indicator}-${i}`}>
                        {isHover && (
                          <circle cx={p.x} cy={p.y} r="10" fill={meta.color} opacity="0.2" />
                        )}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHover ? 6 : 4}
                          fill="#0d1f2d"
                          stroke={meta.color}
                          strokeWidth="2.5"
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={() => {
                            setHoveredPoint({ index: i, indicator });
                            setTooltipPos({ x: p.x, y: p.y - 30 });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                left: `${(tooltipPos.x / chartWidth) * 100}%`,
                top: `${(tooltipPos.y / chartHeight) * 100}%`,
                background: 'rgba(10,18,24,0.98)',
                border: `1px solid ${indicatorMeta[hoveredPoint.indicator]?.color}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                color: '#e8edf2',
                fontWeight: 600,
                zIndex: 10,
                whiteSpace: 'nowrap',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                animation: 'dashTooltipIn 0.18s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={{ fontSize: 10, color: '#7a96aa', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4, textTransform: 'uppercase' }}>
                {chartData[hoveredPoint.index].hour}
              </div>
              <div style={{ color: indicatorMeta[hoveredPoint.indicator]?.color }}>
                {hoveredPoint.indicator === 'tickets' && `Tickets: ${Math.round(chartData[hoveredPoint.index].tickets as number)}`}
                {hoveredPoint.indicator === 'agendamento' && `Agendamento: ${(chartData[hoveredPoint.index].agendamento as number).toFixed(1)}%`}
                {hoveredPoint.indicator === 'fechamento' && `Fechamento: ${(chartData[hoveredPoint.index].fechamento as number).toFixed(1)}%`}
                {hoveredPoint.indicator === 'comparecimento' && `Comparecimento: ${(chartData[hoveredPoint.index].comparecimento as number).toFixed(0)}%`}
                {hoveredPoint.indicator === 'followups' && `Follow-ups: ${Math.round(chartData[hoveredPoint.index].followups as number)}`}
                {hoveredPoint.indicator === 'reativados' && `Reativados: ${(chartData[hoveredPoint.index].reativados as number).toFixed(1)}`}
                {hoveredPoint.indicator === 'primeiraResposta' && `1ª Resposta: ${Math.round(chartData[hoveredPoint.index].primeiraResposta as number)} min`}
                {hoveredPoint.indicator === 'tempoResposta' && `T.M. Resposta: ${(chartData[hoveredPoint.index].tempoResposta as number).toFixed(1)} min`}
                {hoveredPoint.indicator === 'tempoResolucao' && `T.M. Resolução: ${(chartData[hoveredPoint.index].tempoResolucao as number).toFixed(2)}h`}
                {hoveredPoint.indicator === 'faturamento' && `Faturamento: R$ ${Math.round(chartData[hoveredPoint.index].faturamento as number)}`}
                {hoveredPoint.indicator === 'conversasFechadas' && `Conv. Fechadas: ${Math.round(chartData[hoveredPoint.index].conversasFechadas as number)}`}
              </div>
            </div>
          )}

          {/* Legenda abaixo do gráfico */}
          {selectedIndicators.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 24,
                marginTop: 20,
                justifyContent: 'center',
                flexWrap: 'wrap',
                paddingTop: 16,
                borderTop: '1px solid rgba(30,61,84,0.6)',
                width: '100%',
              }}
            >
              {selectedIndicators.map((indicator) => {
                const meta = indicatorMeta[indicator];
                if (!meta) return null;
                return (
                  <div key={`legend-${indicator}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: meta.color,
                        boxShadow: `0 0 8px ${meta.color}`,
                      }}
                    />
                    <span style={{ fontSize: 12, color: '#e8edf2', fontWeight: 600 }}>{meta.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============ CANAIS + FUNIL ============ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }} className={styles.fadeIn}>
        {/* DISTRIBUIÇÃO POR CANAL */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Distribuição por Canal</h2>
            <span className={styles.liveBadge} style={{ fontSize: 10, color: '#2ecc71', fontWeight: 700, letterSpacing: '0.5px' }}>
              AO VIVO
            </span>
          </div>
          <div
            className={styles.premiumCard}
            style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}
          >
            <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
              <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                  <linearGradient id="donutGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2ecc71" />
                    <stop offset="100%" stopColor="#27ae60" />
                  </linearGradient>
                  <linearGradient id="donutGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e74c3c" />
                    <stop offset="100%" stopColor="#c0392b" />
                  </linearGradient>
                  <linearGradient id="donutGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3498db" />
                    <stop offset="100%" stopColor="#2980b9" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="55" fill="none" stroke="#1a3347" strokeWidth="14" />
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="url(#donutGradGreen)"
                  strokeWidth="14"
                  strokeDasharray="269.8 345.4"
                  strokeLinecap="round"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="url(#donutGradRed)"
                  strokeWidth="14"
                  strokeDasharray="55.3 345.4"
                  strokeDashoffset="-269.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="url(#donutGradBlue)"
                  strokeWidth="14"
                  strokeDasharray="20.7 345.4"
                  strokeDashoffset="-325.1"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 900, color: '#e8edf2', lineHeight: 1 }}>437</div>
                <div style={{ fontSize: 9, color: '#7a96aa', fontWeight: 800, letterSpacing: '1px', marginTop: 4 }}>
                  TICKETS
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              {[
                { name: 'WhatsApp', pct: 78, count: 341, color: '#2ecc71' },
                { name: 'Instagram', pct: 16, count: 70, color: '#e74c3c' },
                { name: 'Direto', pct: 6, count: 26, color: '#3498db' },
              ].map((c) => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e8edf2', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                      {c.name}
                    </span>
                    <span style={{ fontSize: 11, color: '#7a96aa' }}>
                      <strong style={{ color: c.color, fontWeight: 800 }}>{c.pct}%</strong> · {c.count} tickets
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${c.pct}%`,
                        background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`,
                        borderRadius: 3,
                        transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
                        boxShadow: `0 0 10px ${c.color}55`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FUNIL */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Funil de Conversão</h2>
            <span className={styles.sectionSubtitle}>Lead → Agendou → Compareceu → Fechou</span>
          </div>
          <div
            className={styles.premiumCard}
            style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {[
              { label: 'Leads', pct: 100, color: '#3498db', count: 437 },
              { label: 'Agendados', pct: 72, color: '#c9943a', count: 315 },
              { label: 'Compareceram', pct: 44, color: '#e8b86d', count: 192 },
              { label: 'Fecharam', pct: 27, color: '#2ecc71', count: 118 },
            ].map((f, idx, arr) => {
              const prevPct = idx > 0 ? arr[idx - 1].pct : 100;
              const dropRate = idx > 0 ? (((prevPct - f.pct) / prevPct) * 100).toFixed(0) : null;
              return (
                <div key={f.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e8edf2' }}>{f.label}</span>
                    <span style={{ fontSize: 11, color: '#7a96aa' }}>
                      <strong style={{ color: f.color, fontWeight: 800 }}>{f.pct}%</strong> · {f.count}
                      {dropRate && (
                        <span style={{ marginLeft: 8, color: '#e74c3c', fontSize: 10 }}>
                          ↓ {dropRate}% dropout
                        </span>
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      background: `linear-gradient(90deg, ${f.color}, ${f.color}cc)`,
                      height: 30,
                      borderRadius: 8,
                      width: `${f.pct}%`,
                      minWidth: 40,
                      transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)',
                      boxShadow: `0 4px 14px ${f.color}40`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'dashShimmer 3s linear infinite',
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 10,
                paddingTop: 12,
                borderTop: '1px solid rgba(30,61,84,0.5)',
              }}
            >
              {[0, 20, 40, 60, 80, 100].map((tick) => (
                <span key={tick} style={{ fontSize: 9, color: '#7a96aa', fontWeight: 700 }}>
                  {tick}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ ALERTAS + RANKING ============ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 18 }} className={styles.fadeIn}>
        {/* ALERTAS */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Alertas Ativos</h2>
            <span
              style={{
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: 10,
                boxShadow: '0 4px 12px rgba(231,76,60,0.35)',
              }}
            >
              3 ativos
            </span>
          </div>
          {[
            { icon: 'alertTriangle', title: 'SLA Próximo do Vencimento', desc: '357 ticket(s) próximos de vencer o SLA', color: '#f39c12', action: 'Priorizar' },
            { icon: 'alertOverload', title: 'Atendentes Sobrecarregados', desc: '2 atendente(s) com mais de 10 tickets', color: '#e74c3c', action: 'Redistribuir' },
            { icon: 'tickets', title: 'Tickets Sem Atendente', desc: '17 ticket(s) aguardando distribuição', color: '#3498db', action: 'Atribuir' },
          ].map((a) => (
            <div
              key={a.title}
              className={styles.premiumCard}
              style={{
                padding: '14px 16px',
                marginBottom: 10,
                borderLeft: `4px solid ${a.color}`,
              }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
                (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 6,
                  color: '#e8edf2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: a.color,
                    background: `${a.color}18`,
                    border: `1px solid ${a.color}35`,
                  }}
                >
                  {getIcon(a.icon)}
                </span>
                {a.title}
              </div>
              <div style={{ fontSize: 11, color: '#7a96aa', marginBottom: 12, lineHeight: 1.4 }}>{a.desc}</div>
              <button
                style={{
                  background: `${a.color}18`,
                  border: `1.5px solid ${a.color}`,
                  color: a.color,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '6px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${a.color}30`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 18px ${a.color}35`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${a.color}18`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                → {a.action}
              </button>
            </div>
          ))}
        </div>

        {/* RANKING */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ranking de SDRs / Agentes</h2>
            <button
              style={{
                background: 'rgba(201,148,58,0.12)',
                border: '1px solid rgba(201,148,58,0.35)',
                color: '#c9943a',
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,148,58,0.22)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,148,58,0.12)';
              }}
            >
              ↗ Exportar
            </button>
          </div>
          <div
            className={styles.premiumCard}
            style={{ overflow: 'auto', maxHeight: 360 }}
          >
            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                <tr style={{ background: 'linear-gradient(180deg, rgba(13,31,45,0.98), rgba(13,31,45,0.92))', borderBottom: '1px solid #1e3d54' }}>
                  {['#', 'NOME', 'AVALIAÇÃO', 'TOTAL', 'EM AND.', 'FINALI.', 'T.M.ESP', 'T.M.AT', 'STATUS'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 10px',
                        textAlign: 'left',
                        fontWeight: 800,
                        color: '#7a96aa',
                        fontSize: 9,
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { no: 1, nome: 'Hávila', aval: 5, total: 127, and: 95, fin: 32, esp: '08h40m', at: '00h06m', status: 'Online', color: '#f39c12' },
                  { no: 2, nome: 'Camilly', aval: 5, total: 98, and: 67, fin: 31, esp: '12h05m', at: '00h08m', status: 'Online', color: '#95a5a6' },
                  { no: 3, nome: 'Fernando', aval: 4, total: 76, and: 52, fin: 24, esp: '10h30m', at: '00h11m', status: 'Online', color: '#c9943a' },
                  { no: 4, nome: 'Déborah', aval: 4, total: 54, and: 38, fin: 16, esp: '14h15m', at: '00h09m', status: 'Offline', color: '#7a96aa' },
                  { no: 5, nome: 'Dra. Andressa', aval: 5, total: 89, and: 61, fin: 28, esp: '09h50m', at: '00h05m', status: 'Online', color: '#7a96aa' },
                  { no: 6, nome: 'Gustavo', aval: 4, total: 62, and: 44, fin: 18, esp: '11h20m', at: '00h10m', status: 'Online', color: '#7a96aa' },
                  { no: 7, nome: 'Beatriz', aval: 4, total: 48, and: 32, fin: 16, esp: '13h40m', at: '00h12m', status: 'Offline', color: '#7a96aa' },
                  { no: 8, nome: 'Lucas', aval: 4, total: 71, and: 50, fin: 21, esp: '10h15m', at: '00h08m', status: 'Online', color: '#7a96aa' },
                ].map((a) => (
                  <tr
                    key={a.nome}
                    style={{
                      borderBottom: '1px solid rgba(30,61,84,0.5)',
                      transition: 'background 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201,148,58,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '11px 10px', color: a.no <= 3 ? a.color : '#7a96aa', fontWeight: 800, fontSize: 12 }}>
                      {a.no <= 3 ? ['🥇', '🥈', '🥉'][a.no - 1] : a.no}
                    </td>
                    <td style={{ padding: '11px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${a.color}, ${a.color}99)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0d1f2d',
                            fontSize: 11,
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          {a.nome[0]}
                        </div>
                        <span style={{ color: '#e8edf2', fontWeight: 700 }}>{a.nome}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 10px', color: a.aval === 5 ? '#f39c12' : '#c9943a', fontSize: 12, letterSpacing: '2px' }}>
                      {'★'.repeat(a.aval)}
                    </td>
                    <td style={{ padding: '11px 10px', color: '#e8edf2', fontWeight: 800, textAlign: 'center' }}>{a.total}</td>
                    <td style={{ padding: '11px 10px', color: '#f39c12', fontWeight: 800, textAlign: 'center' }}>{a.and}</td>
                    <td style={{ padding: '11px 10px', color: '#2ecc71', fontWeight: 800, textAlign: 'center' }}>{a.fin}</td>
                    <td style={{ padding: '11px 10px', color: '#7a96aa', fontSize: 11 }}>{a.esp}</td>
                    <td style={{ padding: '11px 10px', color: '#7a96aa', fontSize: 11 }}>{a.at}</td>
                    <td
                      style={{
                        padding: '11px 10px',
                        color: a.status === 'Online' ? '#2ecc71' : '#e74c3c',
                        fontWeight: 800,
                        fontSize: 10,
                        textAlign: 'center',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '3px 9px',
                          borderRadius: 8,
                          background:
                            a.status === 'Online' ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)',
                          border:
                            a.status === 'Online'
                              ? '1px solid rgba(46,204,113,0.3)'
                              : '1px solid rgba(231,76,60,0.3)',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: a.status === 'Online' ? '#2ecc71' : '#e74c3c',
                            boxShadow: a.status === 'Online' ? '0 0 6px #2ecc71' : 'none',
                          }}
                        />
                        {a.status}
                      </span>
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

/**
 * Dashboard Page - CRM ProClinic
 * 100% Fiel ao protótipo com todos os KPIs, gráficos e interatividade
 */

'use client';

import { useState } from 'react';
import { IconSVG } from '@/lib/icons';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Hoje');
  const [startDate, setStartDate] = useState('2026-04-17');
  const [endDate, setEndDate] = useState('2026-04-17');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['tickets']);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; indicator: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // ============ Helper: Get Icon by Key ============
  const getIcon = (iconKey: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'active': IconSVG.active(),
      'pending': IconSVG.pending(),
      'completed': IconSVG.completed(),
      'users': IconSVG.users(),
      'inbox': IconSVG.inbox(),
      'send': IconSVG.send(),
      'alertTriangle': IconSVG.alertTriangle(),
      'alertOverload': IconSVG.alertOverload(),
      'tickets': IconSVG.tickets(),
      'info': IconSVG.info(),
    };
    return iconMap[iconKey] || null;
  };

  // Mock Data por dia (últimos 30 dias + hoje)
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

  // Função para calcular stats baseado no período
  const calculateStats = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];

    // Gerar array de datas entre start e end
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dates.push(dateStr);
    }

    // Filtrar apenas datas que existem em dailyData
    const validDates = dates.filter(d => dailyData[d]);

    if (validDates.length === 0) {
      return {
        atendendo: 0, aguardando: 0, fechados: 0, leads: 0, recebidas: '0', enviadas: '0',
        tickets: 0, agendamento: '0%', fechamento: '0%', comparecimento: '0%', followups: 0, reativados: 0,
        primeiraResposta: '0 min', tempoResposta: '0 min', tempoResolucao: '0h', faturamento: 'R$ 0', conversasFechadas: 0,
      };
    }

    // Somar valores
    const sum = (key: string) => validDates.reduce((acc, d) => acc + (dailyData[d][key] || 0), 0);
    const avg = (key: string) => {
      const total = sum(key);
      return Math.round((total / validDates.length) * 10) / 10;
    };

    // Formatar números grandes (1000 -> 1k)
    const formatK = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();

    return {
      atendendo: sum('atendendo'),
      aguardando: sum('aguardando'),
      fechados: sum('fechados'),
      leads: sum('leads'),
      recebidas: formatK(sum('recebidas')),
      enviadas: formatK(sum('enviadas')),
      tickets: sum('tickets'),
      agendamento: `${avg('agendamento').toFixed(1)}%`,
      fechamento: `${avg('fechamento').toFixed(1)}%`,
      comparecimento: `${Math.round(avg('comparecimento'))}%`,
      followups: sum('followups'),
      reativados: sum('reativados'),
      primeiraResposta: `${Math.round(avg('primeiraResposta'))} min`,
      tempoResposta: `${avg('tempoResposta').toFixed(1)} min`,
      tempoResolucao: `${(sum('tempoResolucao') / validDates.length).toFixed(2)}h`,
      faturamento: `R$ ${formatK(sum('faturamento'))}`,
      conversasFechadas: sum('conversasFechadas'),
    };
  };

  const stats = calculateStats();

  // Função para calcular atividades do dia baseado no período
  const calculateActivity = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dates.push(dateStr);
    }

    const validDates = dates.filter(d => dailyData[d]);

    if (validDates.length === 0) {
      return {
        leads: 0,
        recebidas: '0',
        enviadas: '0',
      };
    }

    const sum = (key: string) => validDates.reduce((acc, d) => acc + (dailyData[d][key] || 0), 0);
    const formatK = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();

    return {
      leads: sum('leads'),
      recebidas: formatK(sum('recebidas')),
      enviadas: formatK(sum('enviadas')),
    };
  };

  const activity = calculateActivity();

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

  // Função para aplicar períodos pré-definidos
  const applyPeriod = (period: string) => {
    const today = new Date('2026-04-17');
    let start = new Date(today);
    let end = new Date(today);

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
    if (selectedIndicators.includes(key)) {
      setSelectedIndicators(selectedIndicators.filter((k) => k !== key));
    } else {
      setSelectedIndicators([...selectedIndicators, key]);
    }
  };

  // =============== GRÁFICO DINÂMICO COM MÚLTIPLOS INDICADORES ===============
  const indicatorColors: Record<string, { color: string; light: string }> = {
    tickets: { color: '#3498db', light: '#3498db' },
    agendamento: { color: '#c9943a', light: '#c9943a' },
    fechamento: { color: '#2ecc71', light: '#2ecc71' },
    comparecimento: { color: '#f39c12', light: '#f39c12' },
    followups: { color: '#9b59b6', light: '#9b59b6' },
    reativados: { color: '#e74c3c', light: '#e74c3c' },
    primeiraResposta: { color: '#1abc9c', light: '#1abc9c' },
    tempoResposta: { color: '#34495e', light: '#34495e' },
    tempoResolucao: { color: '#95a5a6', light: '#95a5a6' },
    faturamento: { color: '#27ae60', light: '#27ae60' },
    conversasFechadas: { color: '#d35400', light: '#d35400' },
  };

  // Detectar tipo de período e gerar dados dinâmicos - usa selectedPeriod para ser mais robusto
  const generateChartData = () => {
    // MODO 1: Hoje ou Ontem (por horas - 24h completas)
    if (selectedPeriod === 'Hoje' || selectedPeriod === 'Ontem') {
      const hours = ['00h', '04h', '08h', '12h', '16h', '20h', '24h'];
      return hours.map((hour, i) => ({
        hour,
        tickets: 3 + i * 5.5,
        agendamento: 2 + i * 3,
        fechamento: 5 + i * 7,
        comparecimento: 4 + i * 8,
        followups: 1 + i * 1.5,
        reativados: 0.2 + i * 0.4,
        primeiraResposta: 20 - i * 1.2,
        tempoResposta: 18 - i * 0.9,
        tempoResolucao: 0.15 - i * 0.01,
        faturamento: 100 + i * 60,
        conversasFechadas: 2 + i * 2.8,
      }));
    }

    // MODO 2: Últimos 7 dias (por dias da semana)
    if (selectedPeriod === 'Últimos 7 dias') {
      const diasSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
      return diasSemana.map((dia, i) => ({
        hour: dia,
        tickets: 25 + i * 8,
        agendamento: 15 + i * 2,
        fechamento: 35 + i * 5,
        comparecimento: 40 + i * 6,
        followups: 5 + i * 1,
        reativados: 2 + i * 0.5,
        primeiraResposta: 15 - i * 0.5,
        tempoResposta: 14 - i * 0.3,
        tempoResolucao: 0.12 - i * 0.005,
        faturamento: 800 + i * 200,
        conversasFechadas: 10 + i * 2,
      }));
    }

    // MODO 3: Últimos 30 dias ou Este mês (por números 1-30)
    if (selectedPeriod === 'Últimos 30 dias' || selectedPeriod === 'Este mês') {
      const days = Array.from({length: 30}, (_, i) => {
        const day = String(i + 1).padStart(2, '0');
        return day;
      });
      return days.map((day, i) => ({
        hour: day,
        tickets: 20 + (i % 20) * 3,
        agendamento: 12 + (i % 15) * 2,
        fechamento: 30 + (i % 25) * 3,
        comparecimento: 35 + (i % 20) * 4,
        followups: 4 + (i % 10) * 1,
        reativados: 1 + (i % 5) * 0.5,
        primeiraResposta: 14 + (i % 8) * 0.5,
        tempoResposta: 13 + (i % 7) * 0.3,
        tempoResolucao: 0.11 + (i % 5) * 0.01,
        faturamento: 700 + (i % 30) * 100,
        conversasFechadas: 8 + (i % 12) * 1,
      }));
    }

    // FALLBACK: Use dados do período atual (último caso)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    return dates.map((date, i) => ({
      hour: new Date(date).toLocaleDateString('pt-BR', {day: '2-digit'}),
      tickets: 20 + i * 3,
      agendamento: 12 + i * 2,
      fechamento: 30 + i * 3,
      comparecimento: 35 + i * 4,
      followups: 4 + i * 0.5,
      reativados: 1 + i * 0.3,
      primeiraResposta: 14 + i * 0.3,
      tempoResposta: 13 + i * 0.2,
      tempoResolucao: 0.11 + i * 0.001,
      faturamento: 700 + i * 50,
      conversasFechadas: 8 + i * 0.5,
    }));
  };

  const chartData = generateChartData();
  const chartWidth = 1600;
  const chartHeight = 360;
  const padding = 70;

  // Usar maxValue fixo que funciona bem para todos os períodos
  const maxValue = 100;

  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Função para criar pontos de um indicador
  const createPoints = (key: string) => {
    return chartData.map((data, i) => ({
      x: padding + (i / (chartData.length - 1)) * graphWidth,
      y: chartHeight - padding - ((data[key as keyof typeof data] as number) / maxValue) * graphHeight,
      value: data[key as keyof typeof data],
    }));
  };

  return (
    <div style={{
      padding: '24px',
      background: '#0d1f2d',
      minHeight: '100%',
      color: '#e8edf2',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
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
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#7a96aa' }}>Período:</span>
        {['Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 30 dias', 'Este mês'].map((period) => (
          <button
            key={period}
            onClick={() => applyPeriod(period)}
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
            onClick={() => setSelectedPeriod('Personalizado')}
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
            { icon: 'active', label: 'Atendendo', value: stats.atendendo, color: '#2ecc71', subtext: 'tickets em atendimento ativo' },
            { icon: 'pending', label: 'Aguardando', value: stats.aguardando, color: '#f39c12', subtext: 'tickets pendentes' },
            { icon: 'completed', label: 'Fechados no Período', value: stats.fechados, color: '#3498db', subtext: 'tickets finalizados' },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderLeft: `4px solid ${card.color}`,
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                gap: '16px',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = '#c9943a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#1e3d54';
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: `${card.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0,
              }}>
                {getIcon(card.icon as string)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{card.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: card.color, marginBottom: '4px', lineHeight: '1' }}>{card.value}</div>
                <div style={{ fontSize: '10px', color: '#7a96aa' }}>{card.subtext}</div>
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
            { icon: 'users', label: 'Novos Leads Chegaram', value: activity.leads.toString(), color: '#3498db', subtext: 'no período selecionado' },
            { icon: 'inbox', label: 'Mensagens Recebidas', value: activity.recebidas, color: '#3498db', subtext: 'WhatsApp + Instagram' },
            { icon: 'send', label: 'Mensagens Enviadas', value: activity.enviadas, color: '#2ecc71', subtext: 'Pela equipe' },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                gap: '16px',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = '#c9943a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#1e3d54';
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: `${card.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0,
              }}>
                {getIcon(card.icon as string)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{card.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: card.color, marginBottom: '6px', lineHeight: '1' }}>{card.value}</div>
                <div style={{ fontSize: '10px', color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{card.subtext}</div>
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
            { key: 'tempoResposta', label: 'TEMPO MÉDIO DE RESPOSTA', value: stats.tempoResposta, color: '#2ecc71', subtext: 'Média: 15min', bar: 0 },
            { key: 'tempoResolucao', label: 'T.M. DE RESOLUÇÃO DO TICKET', value: stats.tempoResolucao, color: '#f39c12', subtext: 'Média de resolução', bar: 0 },
            { key: 'faturamento', label: 'FATURAMENTO ATUAL', value: stats.faturamento, color: '#2ecc71', subtext: 'no período', bar: 0 },
            { key: 'conversasFechadas', label: 'CONVERSAS FECHADAS', value: stats.conversasFechadas, color: '#2ecc71', subtext: 'Fechadas com sucesso', bar: 0 },
          ].map((kpi) => (
            <div
              key={kpi.key}
              style={{
                background: '#132636',
                border: '1px solid #1e3d54',
                borderRadius: '14px',
                padding: '20px 22px',
                position: 'relative',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = '#c9943a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#1e3d54';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div style={{ fontSize: '9px', color: '#7a96aa', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{kpi.label}</div>
                <div
                  onMouseEnter={(e) => {
                    setTooltipVisible(kpi.key);
                    (e.currentTarget as HTMLElement).style.color = '#c9943a';
                  }}
                  onMouseLeave={(e) => {
                    setTooltipVisible(null);
                    (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                  }}
                  style={{
                    fontSize: '13px',
                    color: '#7a96aa',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s',
                  }}
                >
                  {getIcon('info')}
                  {tooltipVisible === kpi.key && (
                    <div style={{
                      position: 'absolute',
                      bottom: '140%',
                      right: 0,
                      background: '#0a1218',
                      border: '2px solid #c9943a',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '10px',
                      color: '#e8edf2',
                      zIndex: 10,
                      whiteSpace: 'normal',
                      width: '220px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                    }}>
                      {KPI_TOOLTIPS[kpi.key as keyof typeof KPI_TOOLTIPS]}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: kpi.color, marginBottom: '10px', lineHeight: '1' }}>
                {kpi.value}
              </div>
              {kpi.bar > 0 && (
                <div style={{
                  height: '3px',
                  background: '#1a3347',
                  borderRadius: '3px',
                  marginBottom: '10px',
                  overflow: 'hidden',
                }}>
                  <div style={{ height: '100%', width: `${kpi.bar}%`, background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}aa)`, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              )}
              <div style={{ fontSize: '11px', color: '#7a96aa', lineHeight: '1.4' }}>{kpi.subtext}</div>
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
            { key: 'followups', label: 'Follow-ups', color: '#c9943a' },
            { key: 'reativados', label: 'Reativados', color: '#9b59b6' },
            { key: 'primeiraResposta', label: '1ª Resposta', color: '#2ecc71' },
            { key: 'tempoResposta', label: 'T.M. Resposta', color: '#3498db' },
            { key: 'tempoResolucao', label: 'T.M. Resolução', color: '#f39c12' },
            { key: 'faturamento', label: 'Faturamento', color: '#2ecc71' },
            { key: 'conversasFechadas', label: 'Conv. Fechadas', color: '#2ecc71' },
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
            Limpar
          </button>
        </div>
        <div style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '40px 60px',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width={chartWidth} height={chartHeight} style={{ width: '100%', height: 'auto', maxWidth: '100%' }}>
            <defs>
              {/* Gradientes para áreas preenchidas */}
              <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3498db', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#3498db', stopOpacity: 0.05 }} />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#c9943a', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#c9943a', stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>

            {/* Grid background */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`grid-${i}`} x1={padding} y1={padding + (i / 4) * (chartHeight - padding * 2)} x2={chartWidth - padding} y2={padding + (i / 4) * (chartHeight - padding * 2)} stroke="#1a3347" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
            ))}

            {/* Eixos */}
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#1e3d54" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#1e3d54" strokeWidth="2" />

            {/* Labels Y (valores dinâmicos) */}
            {Array.from({length: 5}, (_, i) => Math.round((maxValue / 4) * i)).map((val) => (
              <text key={`y-label-${val}`} x={padding - 10} y={chartHeight - padding - (val / maxValue) * graphHeight + 4} textAnchor="end" fontSize="10" fill="#7a96aa">
                {val}
              </text>
            ))}

            {/* Labels X (horas) */}
            {chartData.map((data, i) => (
              <text key={`label-${i}`} x={padding + (i / (chartData.length - 1)) * (chartWidth - padding * 2)} y={chartHeight - padding + 20} textAnchor="middle" fontSize="11" fill="#7a96aa" fontWeight="500">
                {data.hour}
              </text>
            ))}

            {/* Renderizar linhas de todos os indicadores selecionados */}
            {selectedIndicators.map((indicator) => {
              const points = createPoints(indicator);
              const pathD = 'M ' + points.map(p => `${p.x},${p.y}`).join(' L ');
              const color = indicatorColors[indicator]?.color || '#ffffff';
              return (
                <g key={`line-${indicator}`}>
                  <path d={pathD} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map((p, i) => (
                    <circle
                      key={`point-${indicator}-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill={color}
                      opacity={hoveredPoint?.index === i && hoveredPoint?.indicator === indicator ? 1 : 0.8}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => {
                        setHoveredPoint({ index: i, indicator });
                        setTooltipPos({ x: p.x, y: p.y - 30 });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </g>
              );
            })}

            {/* Legenda SVG (vazia - legenda abaixo do gráfico) */}
          </svg>

          {/* TOOLTIP DO GRÁFICO */}
          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`,
                background: '#0a1218',
                border: '2px solid #c9943a',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#e8edf2',
                fontWeight: '600',
                zIndex: 10,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            >
              <div>{chartData[hoveredPoint.index].hour}</div>
              <div style={{ color: indicatorColors[hoveredPoint.indicator]?.color || '#ffffff', marginTop: '4px' }}>
                {hoveredPoint.indicator === 'tickets' ? `Tickets: ${Math.round(chartData[hoveredPoint.index].tickets as number)}` : null}
                {hoveredPoint.indicator === 'agendamento' ? `Agendamento: ${(chartData[hoveredPoint.index].agendamento as number).toFixed(1)}%` : null}
                {hoveredPoint.indicator === 'fechamento' ? `Fechamento: ${(chartData[hoveredPoint.index].fechamento as number).toFixed(1)}%` : null}
                {hoveredPoint.indicator === 'comparecimento' ? `Comparecimento: ${(chartData[hoveredPoint.index].comparecimento as number).toFixed(0)}%` : null}
                {hoveredPoint.indicator === 'followups' ? `Follow-ups: ${Math.round(chartData[hoveredPoint.index].followups as number)}` : null}
                {hoveredPoint.indicator === 'reativados' ? `Reativados: ${(chartData[hoveredPoint.index].reativados as number).toFixed(1)}` : null}
                {hoveredPoint.indicator === 'primeiraResposta' ? `1ª Resposta: ${Math.round(chartData[hoveredPoint.index].primeiraResposta as number)} min` : null}
                {hoveredPoint.indicator === 'tempoResposta' ? `T.M. Resposta: ${(chartData[hoveredPoint.index].tempoResposta as number).toFixed(1)} min` : null}
                {hoveredPoint.indicator === 'tempoResolucao' ? `T.M. Resolução: ${(chartData[hoveredPoint.index].tempoResolucao as number).toFixed(2)}h` : null}
                {hoveredPoint.indicator === 'faturamento' ? `Faturamento: R$ ${Math.round(chartData[hoveredPoint.index].faturamento as number)}` : null}
                {hoveredPoint.indicator === 'conversasFechadas' ? `Conv. Fechadas: ${Math.round(chartData[hoveredPoint.index].conversasFechadas as number)}` : null}
              </div>
            </div>
          )}

          {/* LEGENDA DINÂMICA */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {selectedIndicators.map((indicator) => {
              const indicatorLabels: Record<string, string> = {
                tickets: 'Total de Tickets',
                agendamento: '% Agendamento',
                fechamento: '% Fechamento',
                comparecimento: '% Comparecimento',
                followups: 'Follow-ups',
                reativados: 'Reativados',
                primeiraResposta: '1ª Resposta',
                tempoResposta: 'T.M. Resposta',
                tempoResolucao: 'T.M. Resolução',
                faturamento: 'Faturamento',
                conversasFechadas: 'Conv. Fechadas',
              };

              const color = indicatorColors[indicator]?.color || '#ffffff';
              return (
                <div key={`legend-${indicator}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: color }} />
                  <span style={{ fontSize: '13px', color: '#e8edf2', fontWeight: '500' }}>{indicatorLabels[indicator]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHANNELS & FUNNEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        {/* DISTRIBUIÇÃO POR CANAL */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Distribuição por Canal</span>
            <span style={{ fontSize: '11px', color: '#2ecc71', fontWeight: 600, background: 'rgba(46, 204, 113, 0.1)', padding: '4px 10px', borderRadius: '12px', border: '1px solid #2ecc71' }}>◉ AO VIVO</span>
          </h3>
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            gap: '24px',
            transition: 'all 0.3s',
          }}>
            {/* GRÁFICO DONUT */}
            <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2ecc71" strokeWidth="12" strokeDasharray="196.8 314" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e74c3c" strokeWidth="12" strokeDasharray="50.24 314" strokeDashoffset="-196.8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#3498db" strokeWidth="12" strokeDasharray="18.84 314" strokeDashoffset="-247.04" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#e8edf2' }}>437</div>
                <div style={{ fontSize: '9px', color: '#7a96aa', fontWeight: 700, letterSpacing: '0.5px', marginTop: '2px' }}>TICKETS</div>
              </div>
            </div>

            {/* LEGENDA COM BARRAS */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
              {[
                { name: 'WhatsApp', pct: 78, count: 341, color: '#2ecc71' },
                { name: 'Instagram', pct: 16, count: 70, color: '#e74c3c' },
                { name: 'Direto', pct: 6, count: 26, color: '#3498db' }
              ].map((c) => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#e8edf2' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: c.color }}>{c.pct}%</span>
                  </div>
                  <div style={{
                    height: '5px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${c.pct}%`,
                      background: c.color,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FUNNEL DE CONVERSÃO */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Funil de Conversão</h3>
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {[
              { label: 'Leads', pct: 100, color: '#3498db' },
              { label: 'Agendados', pct: 72, color: '#c9943a' },
              { label: 'Compareceram', pct: 44, color: '#e8b86d' },
              { label: 'Fecharam', pct: 27, color: '#2ecc71' }
            ].map((f) => (
              <div key={f.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#e8edf2' }}>{f.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: f.color }}>{f.pct}%</span>
                </div>
                <div style={{
                  background: f.color,
                  height: '28px',
                  borderRadius: '8px',
                  width: `${f.pct}%`,
                  minWidth: '30px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            ))}
            {/* ESCALA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {[0, 20, 40, 60, 80, 100].map((tick) => (
                <span key={tick} style={{ fontSize: '9px', color: '#7a96aa', fontWeight: 600 }}>{tick}</span>
              ))}
            </div>
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
            { icon: 'alertTriangle', title: 'SLA Próximo do Vencimento', desc: '357 ticket(s) próximos de vencer o SLA', color: '#f39c12', action: 'Priorizar' },
            { icon: 'alertOverload', title: 'Atendentes Sobrecarregados', desc: '2 atendente(s) com mais de 10 tickets', color: '#e74c3c', action: 'Redistribuir' },
            { icon: 'tickets', title: 'Tickets Sem Atendente', desc: '17 ticket(s) aguardando distribuição', color: '#3498db', action: 'Atribuir' },
          ].map((a) => (
            <div key={a.title} style={{
              background: '#132636',
              border: `1px solid ${a.color}40`,
              borderLeft: `5px solid ${a.color}`,
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '10px',
              transition: 'all 0.2s',
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 12px ${a.color}20`;
              e.currentTarget.style.borderColor = `${a.color}70`;
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = `${a.color}40`;
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, marginBottom: '6px', color: '#e8edf2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>{getIcon(a.icon)}</span>
                {a.title}
              </div>
              <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '10px', lineHeight: '1.4' }}>{a.desc}</div>
              <button style={{
                background: `${a.color}15`,
                border: `1.5px solid ${a.color}`,
                color: a.color,
                fontSize: '10px',
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }} onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${a.color}25`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }} onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${a.color}15`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>
                {a.action}
              </button>
            </div>
          ))}
        </div>

        {/* RANKING TABLE */}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Ranking de SDRs / Agentes</span>
            <button style={{ background: 'transparent', border: 'none', color: '#7a96aa', fontSize: '10px', cursor: 'pointer' }}>
              ↗ Exportar
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
                      fontWeight: 700,
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
                  { no: 1, nome: 'Hávila', aval: 5, total: 127, and: 95, fin: 32, esp: '08h40m', at: '00h06m', status: 'Online' },
                  { no: 2, nome: 'Camilly', aval: 5, total: 98, and: 67, fin: 31, esp: '12h05m', at: '00h08m', status: 'Online' },
                  { no: 3, nome: 'Fernando', aval: 4, total: 76, and: 52, fin: 24, esp: '10h30m', at: '00h11m', status: 'Online' },
                  { no: 4, nome: 'Déborah', aval: 4, total: 54, and: 38, fin: 16, esp: '14h15m', at: '00h09m', status: 'Offline' },
                  { no: 5, nome: 'Dra. Andressa', aval: 5, total: 89, and: 61, fin: 28, esp: '09h50m', at: '00h05m', status: 'Online' },
                  { no: 6, nome: 'Gustavo', aval: 4, total: 62, and: 44, fin: 18, esp: '11h20m', at: '00h10m', status: 'Online' },
                  { no: 7, nome: 'Beatriz', aval: 4, total: 48, and: 32, fin: 16, esp: '13h40m', at: '00h12m', status: 'Offline' },
                  { no: 8, nome: 'Lucas', aval: 4, total: 71, and: 50, fin: 21, esp: '10h15m', at: '00h08m', status: 'Online' },
                ].map((a) => (
                  <tr key={a.nome} style={{ borderBottom: '1px solid #1e3d54', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201, 148, 58, 0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <td style={{ padding: '10px 8px', color: '#7a96aa', fontWeight: 600 }}>{a.no}</td>
                    <td style={{ padding: '10px 8px', color: '#e8edf2', fontWeight: 600 }}>{a.nome}</td>
                    <td style={{ padding: '10px 8px', color: a.aval === 5 ? '#f39c12' : '#c9943a', fontSize: '11px', letterSpacing: '2px' }}>{'★'.repeat(a.aval)}</td>
                    <td style={{ padding: '10px 8px', color: '#e8edf2', fontWeight: 700, textAlign: 'center' }}>{a.total}</td>
                    <td style={{ padding: '10px 8px', color: '#f39c12', fontWeight: 700, textAlign: 'center' }}>{a.and}</td>
                    <td style={{ padding: '10px 8px', color: '#2ecc71', fontWeight: 700, textAlign: 'center' }}>{a.fin}</td>
                    <td style={{ padding: '10px 8px', color: '#7a96aa', fontSize: '11px' }}>{a.esp}</td>
                    <td style={{ padding: '10px 8px', color: '#7a96aa', fontSize: '11px' }}>{a.at}</td>
                    <td style={{
                      padding: '10px 8px',
                      color: a.status === 'Online' ? '#2ecc71' : '#e74c3c',
                      fontWeight: 700,
                      fontSize: '10px',
                      textAlign: 'center',
                    }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: a.status === 'Online' ? '#2ecc71' : '#e74c3c', marginRight: '6px', verticalAlign: 'middle' }} />
                      {a.status}
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

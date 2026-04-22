'use client';

import { useMemo, useState } from 'react';
import {
  BarChart3,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Target,
  DollarSign,
  Filter,
} from 'lucide-react';

interface Indicador {
  data: string;
  leads: number;
  conversas: number;
  propostas: number;
  agendamentos: number;
  conversao: string;
  faturamento: number;
}

const INITIAL: Indicador[] = [
  { data: '2026-04-10', leads: 12, conversas: 45, propostas: 8, agendamentos: 6, conversao: '50%', faturamento: 3200 },
  { data: '2026-04-11', leads: 15, conversas: 52, propostas: 10, agendamentos: 7, conversao: '66%', faturamento: 4100 },
  { data: '2026-04-12', leads: 8, conversas: 38, propostas: 5, agendamentos: 4, conversao: '50%', faturamento: 2500 },
  { data: '2026-04-13', leads: 18, conversas: 61, propostas: 12, agendamentos: 8, conversao: '66%', faturamento: 5000 },
  { data: '2026-04-14', leads: 11, conversas: 44, propostas: 7, agendamentos: 5, conversao: '45%', faturamento: 3100 },
  { data: '2026-04-15', leads: 20, conversas: 68, propostas: 14, agendamentos: 11, conversao: '78%', faturamento: 6200 },
  { data: '2026-04-16', leads: 16, conversas: 55, propostas: 11, agendamentos: 9, conversao: '81%', faturamento: 4800 },
];

type Periodo = '7d' | '15d' | '30d';

export function Indicadores() {
  const [dados] = useState<Indicador[]>(INITIAL);
  const [periodo, setPeriodo] = useState<Periodo>('7d');
  const [sincronizando, setSincronizando] = useState(false);

  const totals = useMemo(() => {
    const totalLeads = dados.reduce((a, d) => a + d.leads, 0);
    const totalConversas = dados.reduce((a, d) => a + d.conversas, 0);
    const totalAgendamentos = dados.reduce((a, d) => a + d.agendamentos, 0);
    const totalFaturamento = dados.reduce((a, d) => a + d.faturamento, 0);
    const mediaConversao = Math.round(dados.reduce((a, d) => a + parseInt(d.conversao), 0) / (dados.length || 1));

    // variações (simulação entre primeira metade e segunda metade)
    const meio = Math.floor(dados.length / 2);
    const primeiraMetade = dados.slice(0, meio);
    const segundaMetade = dados.slice(meio);
    const delta = (arr: Indicador[], key: keyof Pick<Indicador, 'leads' | 'conversas' | 'agendamentos' | 'faturamento'>) =>
      arr.reduce((a, d) => a + (d[key] as number), 0);

    const varLeads = primeiraMetade.length && segundaMetade.length
      ? Math.round(((delta(segundaMetade, 'leads') - delta(primeiraMetade, 'leads')) / (delta(primeiraMetade, 'leads') || 1)) * 100)
      : 0;
    const varFat = primeiraMetade.length && segundaMetade.length
      ? Math.round(((delta(segundaMetade, 'faturamento') - delta(primeiraMetade, 'faturamento')) / (delta(primeiraMetade, 'faturamento') || 1)) * 100)
      : 0;

    return {
      totalLeads,
      totalConversas,
      totalAgendamentos,
      totalFaturamento,
      mediaConversao,
      varLeads,
      varFat,
    };
  }, [dados]);

  const maxFat = Math.max(...dados.map((d) => d.faturamento));

  const handleSincronizar = () => {
    setSincronizando(true);
    setTimeout(() => setSincronizando(false), 1200);
  };

  return (
    <div
      style={{
        padding: '28px',
        background: 'linear-gradient(180deg, #0d1f2d 0%, #0a1826 100%)',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes inCardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes inSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .in-card { animation: inCardIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .in-input:focus { border-color: #c9943a !important; box-shadow: 0 0 0 3px rgba(201, 148, 58, 0.18) !important; }
        .in-btn:hover { transform: translateY(-1px); }
        .in-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(201, 148, 58, 0.35); }
        .in-pill:hover { transform: translateY(-1px); }
        .in-row:hover { background: rgba(201, 148, 58, 0.05); }
        .in-spin { animation: inSpin 0.8s linear infinite; }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 24px rgba(201, 148, 58, 0.35)',
            }}
          >
            <BarChart3 size={22} color="#0d1f2d" strokeWidth={2.4} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Indicadores</h1>
            <p style={{ fontSize: '13px', color: '#7a96aa', margin: '2px 0 0 0' }}>Acompanhe a performance do CRM e vendas em tempo real</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="in-btn"
            onClick={handleSincronizar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(52, 152, 219, 0.45)',
              background: 'rgba(52, 152, 219, 0.08)',
              color: '#3498db',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <RefreshCw size={14} className={sincronizando ? 'in-spin' : ''} /> Sincronizar
          </button>
          <button
            className="in-btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
              color: '#0d1f2d',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(201, 148, 58, 0.28)',
              transition: 'all 0.25s ease',
            }}
          >
            <Download size={14} strokeWidth={2.6} /> Exportar
          </button>
        </div>
      </div>

      {/* STATS KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <KpiCard
          label="Total de Leads"
          value={totals.totalLeads.toLocaleString('pt-BR')}
          color="#3498db"
          Icon={Users}
          delta={totals.varLeads}
        />
        <KpiCard
          label="Conversas"
          value={totals.totalConversas.toLocaleString('pt-BR')}
          color="#c9943a"
          Icon={MessageSquare}
        />
        <KpiCard
          label="Agendamentos"
          value={totals.totalAgendamentos.toLocaleString('pt-BR')}
          color="#2ecc71"
          Icon={Calendar}
        />
        <KpiCard
          label="Conversão Média"
          value={`${totals.mediaConversao}%`}
          color="#9b59b6"
          Icon={Target}
        />
        <KpiCard
          label="Faturamento Total"
          value={totals.totalFaturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
          color="#e67e22"
          Icon={DollarSign}
          delta={totals.varFat}
        />
      </div>

      {/* GRÁFICO BAR + PERÍODO */}
      <div
        style={{
          background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
          border: '1px solid #1e3d54',
          borderRadius: '16px',
          padding: '22px',
          marginBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#e8edf2' }}>Faturamento Diário</h2>
            <p style={{ fontSize: '12px', color: '#7a96aa', margin: '3px 0 0 0' }}>Visão do período selecionado</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['7d', '15d', '30d'] as Periodo[]).map((p) => (
              <button
                key={p}
                className="in-pill"
                onClick={() => setPeriodo(p)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  border: `1px solid ${periodo === p ? '#c9943a' : '#1e3d54'}`,
                  background: periodo === p ? 'rgba(201, 148, 58, 0.14)' : 'rgba(13, 31, 45, 0.4)',
                  color: periodo === p ? '#c9943a' : '#7a96aa',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {p === '7d' ? '7 Dias' : p === '15d' ? '15 Dias' : '30 Dias'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '180px', padding: '10px 0' }}>
          {dados.map((d, i) => {
            const height = Math.max(8, Math.round((d.faturamento / maxFat) * 150));
            return (
              <div
                key={i}
                className="in-card"
                title={`${new Date(d.data).toLocaleDateString('pt-BR')} — R$ ${d.faturamento.toLocaleString('pt-BR')}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div style={{ fontSize: '10px', color: '#c9943a', fontWeight: 600 }}>
                  {Math.round(d.faturamento / 100) / 10}k
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${height}px`,
                    background: 'linear-gradient(180deg, #c9943a 0%, #a87a28 100%)',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 6px 14px rgba(201, 148, 58, 0.25)',
                    transition: 'height 0.4s ease',
                  }}
                />
                <div style={{ fontSize: '10px', color: '#7a96aa' }}>
                  {new Date(d.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABELA */}
      <div
        style={{
          background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
          border: '1px solid #1e3d54',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #1e3d54', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={15} color="#c9943a" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Relatório Detalhado</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#7a96aa' }}>
            <Filter size={12} />
            {dados.length} registros • período {periodo}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ background: 'rgba(13, 31, 45, 0.6)' }}>
              <tr>
                <Th>Data</Th>
                <Th>Leads</Th>
                <Th>Conversas</Th>
                <Th>Propostas</Th>
                <Th>Agendamentos</Th>
                <Th>Conversão</Th>
                <Th>Faturamento</Th>
              </tr>
            </thead>
            <tbody>
              {dados.map((d, i) => (
                <tr
                  key={i}
                  className="in-row"
                  style={{ borderBottom: '1px solid #1e3d54', transition: 'background 0.2s ease' }}
                >
                  <Td bold>
                    {new Date(d.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </Td>
                  <Td color="#3498db">{d.leads}</Td>
                  <Td color="#c9943a">{d.conversas}</Td>
                  <Td color="#e67e22">{d.propostas}</Td>
                  <Td color="#2ecc71">{d.agendamentos}</Td>
                  <Td>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        background: 'rgba(155, 89, 182, 0.14)',
                        color: '#9b59b6',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {d.conversao}
                    </span>
                  </Td>
                  <Td color="#2ecc71" bold>
                    {d.faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========= Subcomponentes =========

function KpiCard({
  label,
  value,
  color,
  Icon,
  delta,
}: {
  label: string;
  value: string;
  color: string;
  Icon: typeof Users;
  delta?: number;
}) {
  const positive = typeof delta === 'number' && delta >= 0;

  return (
    <div
      className="in-card"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        padding: '18px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle at top right, ${color}26 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '10px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color, lineHeight: 1, marginBottom: typeof delta === 'number' ? '8px' : 0 }}>
            {value}
          </div>
          {typeof delta === 'number' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 7px',
                borderRadius: '10px',
                background: positive ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.12)',
                color: positive ? '#2ecc71' : '#e74c3c',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {positive ? '+' : ''}{delta}%
            </div>
          )}
        </div>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: `${color}1f`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={17} color={color} strokeWidth={2.3} />
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '14px 18px',
        textAlign: 'left',
        fontWeight: 700,
        color: '#7a96aa',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, color = '#e8edf2', bold = false }: { children: React.ReactNode; color?: string; bold?: boolean }) {
  return (
    <td style={{ padding: '13px 18px', color, fontWeight: bold ? 700 : 500, fontSize: '12px' }}>
      {children}
    </td>
  );
}

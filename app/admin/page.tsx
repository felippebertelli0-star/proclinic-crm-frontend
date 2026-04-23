'use client';

/**
 * Master Admin — Visão Geral
 * Cockpit SaaS multi-tenant (JARVIS Control)
 */

import {
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  CircleDollarSign,
  Activity,
  ArrowUpRight,
  Bell,
  Plus,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

// ============================================================================
// DADOS (mock — substituir por API quando backend expuser /admin/metrics)
// ============================================================================

type KpiSpark = { value: number }[];

const kpis = [
  {
    label: 'MRR',
    sublabel: 'Receita recorrente',
    value: 'R$ 48.500',
    delta: '+8,2%',
    deltaPositive: true,
    accent: '#c9943a',
    spark: [31, 35, 34, 39, 42, 41, 45, 43, 46, 48, 47, 49] as number[],
  },
  {
    label: 'CLÍNICAS ATIVAS',
    sublabel: 'Tenants em produção',
    value: '12',
    delta: '+2',
    deltaPositive: true,
    accent: '#2ecc71',
    spark: [6, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 12] as number[],
  },
  {
    label: 'USUÁRIOS TOTAIS',
    sublabel: 'Somados entre clínicas',
    value: '2.847',
    delta: '+142',
    deltaPositive: true,
    accent: '#3498db',
    spark: [1820, 1950, 2100, 2180, 2310, 2400, 2520, 2590, 2680, 2730, 2790, 2847] as number[],
  },
  {
    label: 'UPTIME (30d)',
    sublabel: 'Disponibilidade da API',
    value: '99,82%',
    delta: '+0,04%',
    deltaPositive: true,
    accent: '#e8b86d',
    spark: [99.6, 99.7, 99.8, 99.65, 99.82, 99.9, 99.85, 99.8, 99.78, 99.82, 99.88, 99.82] as number[],
  },
];

const topClinicas = [
  { nome: 'Clínica Dra. Andressa Barbarotti', mrr: 'R$ 1.290', usuarios: 18, status: 'ativo', crescimento: '+12%' },
  { nome: 'OdontoPrime São Paulo', mrr: 'R$ 990', usuarios: 14, status: 'ativo', crescimento: '+8%' },
  { nome: 'Instituto Bella Face', mrr: 'R$ 890', usuarios: 11, status: 'ativo', crescimento: '+5%' },
  { nome: 'Clínica Vida & Saúde', mrr: 'R$ 690', usuarios: 9, status: 'atencao', crescimento: '-2%' },
  { nome: 'Derma Estética Premium', mrr: 'R$ 690', usuarios: 7, status: 'ativo', crescimento: '+15%' },
];

const atividade = [
  { tipo: 'signup', titulo: 'Nova clínica cadastrada', detalhe: 'Derma Estética Premium — Plano Pro', tempo: 'há 12 min', cor: '#2ecc71' },
  { tipo: 'payment', titulo: 'Pagamento recebido', detalhe: 'R$ 1.290 — OdontoPrime SP', tempo: 'há 47 min', cor: '#c9943a' },
  { tipo: 'alert', titulo: 'WhatsApp desconectado', detalhe: 'Clínica Vida & Saúde — sessão expirada', tempo: 'há 1 h', cor: '#f39c12' },
  { tipo: 'upgrade', titulo: 'Upgrade de plano', detalhe: 'Instituto Bella Face → Pro', tempo: 'há 2 h', cor: '#3498db' },
  { tipo: 'signup', titulo: 'Novo agente convidado', detalhe: 'Clínica Andressa adicionou 2 agentes', tempo: 'há 3 h', cor: '#2ecc71' },
];

const alertas = [
  { nivel: 'critico', titulo: 'Inadimplência', texto: '1 clínica com pagamento em atraso', cor: '#e74c3c' },
  { nivel: 'atencao', titulo: 'CPU em 78%', texto: 'Railway servidor principal', cor: '#f39c12' },
  { nivel: 'info', titulo: 'SSL expira em 30d', texto: 'proclinic.com.br — renovar', cor: '#3498db' },
];

// ============================================================================
// SPARKLINE (SVG inline, zero dependência)
// ============================================================================

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 140;
  const h = 38;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPoints = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`;
  const gradId = `grad-${color.replace('#', '')}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================================
// LINE CHART GRANDE (crescimento MRR últimos 12 meses)
// ============================================================================

function GrowthChart() {
  const data = [18000, 21000, 23500, 26000, 29000, 32000, 34500, 37000, 39500, 42000, 45000, 48500];
  const meses = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'];

  const w = 640;
  const h = 220;
  const padL = 50;
  const padR = 14;
  const padT = 14;
  const padB = 30;

  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const points = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * innerW;
    const y = padT + innerH - ((v - min) / range) * innerH;
    return { x, y, v };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${padT + innerH} L ${points[0].x.toFixed(1)} ${padT + innerH} Z`;

  const yTicks = 4;
  const yValues = Array.from({ length: yTicks + 1 }, (_, i) => min + (range * i) / yTicks);

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id="mrr-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9943a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c9943a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid horizontal */}
      {yValues.map((val, i) => {
        const y = padT + innerH - ((val - min) / range) * innerH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#1e3d54" strokeWidth="1" strokeDasharray="2 4" />
            <text x={padL - 8} y={y + 3} fontSize="9" fill="#5a6f82" textAnchor="end" fontFamily="ui-sans-serif, system-ui">
              {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* área */}
      <path d={areaD} fill="url(#mrr-grad)" />

      {/* linha */}
      <path d={pathD} fill="none" stroke="#c9943a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* pontos */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#0a1520" stroke="#c9943a" strokeWidth="1.8" />
          <text x={p.x} y={h - padB + 18} fontSize="9" fill="#7a96aa" textAnchor="middle" fontFamily="ui-sans-serif, system-ui">
            {meses[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ============================================================================
// PÁGINA
// ============================================================================

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#1e3d54] bg-gradient-to-br from-[#0f2233] via-[#0c1b28] to-[#0a1520] p-7">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{
          background: 'radial-gradient(600px 200px at 90% -10%, rgba(201,148,58,0.35), transparent 60%)'
        }} />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(201,148,58,0.12)] border border-[rgba(201,148,58,0.35)] text-[#e8b86d] text-[11px] font-semibold tracking-wider uppercase mb-3">
              <Sparkles size={12} strokeWidth={2.5} />
              Control Panel
            </div>
            <h1 className="text-[32px] font-bold text-white tracking-tight leading-tight">
              Olá, Felippe. <span className="text-[#7a96aa] font-normal">aqui está sua operação hoje.</span>
            </h1>
            <p className="text-sm text-[#7a96aa] mt-2">
              12 clínicas ativas · 2.847 usuários · R$ 48,5k MRR · todos sistemas operacionais.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#2a3647] bg-[rgba(255,255,255,0.02)] text-[#b0b8c1] text-sm font-medium hover:border-[#c9943a] hover:text-white transition-all">
              <Bell size={15} strokeWidth={2} />
              3 alertas
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#c9943a] hover:bg-[#e8b86d] text-[#0a1520] text-sm font-bold shadow-[0_8px_24px_-8px_rgba(201,148,58,0.6)] transition-all">
              <Plus size={15} strokeWidth={2.5} />
              Nova clínica
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-[16px] border border-[#1e3d54] bg-[#0f1f2e] p-5 transition-all hover:border-[rgba(201,148,58,0.55)] hover:-translate-y-[1px] hover:shadow-[0_12px_40px_-12px_rgba(201,148,58,0.35)]"
          >
            <div
              className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${k.accent}, transparent)` }}
            />
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] font-bold tracking-[0.12em] text-[#7a96aa]">
                  {k.label}
                </div>
                <div className="text-[10px] text-[#5a6f82] mt-0.5">
                  {k.sublabel}
                </div>
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${k.accent}22`, color: k.accent }}
              >
                {i === 0 && <CircleDollarSign size={14} strokeWidth={2.2} />}
                {i === 1 && <Building2 size={14} strokeWidth={2.2} />}
                {i === 2 && <Users size={14} strokeWidth={2.2} />}
                {i === 3 && <Activity size={14} strokeWidth={2.2} />}
              </div>
            </div>

            <div className="text-[32px] font-bold text-white leading-none tracking-tight tabular-nums">
              {k.value}
            </div>

            <div className="mt-3 flex items-end justify-between gap-3">
              <div
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  k.deltaPositive ? 'text-[#2ecc71]' : 'text-[#e74c3c]'
                }`}
              >
                {k.deltaPositive ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
                {k.delta}
                <span className="text-[#5a6f82] font-normal ml-1">vs mês ant.</span>
              </div>
              <Sparkline data={k.spark} color={k.accent} />
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICO + ATIVIDADE */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 rounded-[16px] border border-[#1e3d54] bg-[#0f1f2e] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Crescimento do MRR</h2>
              <p className="text-xs text-[#7a96aa] mt-1">Últimos 12 meses · receita recorrente líquida</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0a1520] border border-[#1e3d54] text-[11px]">
              <button className="px-2.5 py-1 rounded-md bg-[rgba(201,148,58,0.12)] text-[#c9943a] font-semibold">12m</button>
              <button className="px-2.5 py-1 rounded-md text-[#7a96aa] hover:text-white transition-colors">6m</button>
              <button className="px-2.5 py-1 rounded-md text-[#7a96aa] hover:text-white transition-colors">30d</button>
            </div>
          </div>
          <GrowthChart />
        </div>

        <div className="col-span-4 rounded-[16px] border border-[#1e3d54] bg-[#0f1f2e] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Atividade recente</h2>
              <p className="text-xs text-[#7a96aa] mt-0.5">Eventos em tempo real</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#2ecc71] uppercase tracking-wider">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#2ecc71] animate-ping opacity-60" />
                <span className="relative rounded-full bg-[#2ecc71] w-2 h-2" />
              </span>
              Live
            </span>
          </div>
          <div className="space-y-3">
            {atividade.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-3 border-b border-[#132636] last:border-b-0 last:pb-0"
              >
                <div
                  className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: a.cor, boxShadow: `0 0 10px ${a.cor}` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">{a.titulo}</div>
                  <div className="text-[11px] text-[#7a96aa] mt-0.5 truncate">{a.detalhe}</div>
                  <div className="text-[10px] text-[#5a6f82] mt-1">{a.tempo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP CLÍNICAS + ALERTAS + INFRA */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 rounded-[16px] border border-[#1e3d54] bg-[#0f1f2e] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Top clínicas por MRR</h2>
              <p className="text-xs text-[#7a96aa] mt-0.5">Ranking de receita recorrente mensal</p>
            </div>
            <button className="text-xs text-[#c9943a] hover:text-[#e8b86d] font-semibold flex items-center gap-1 transition-colors">
              Ver todas
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_100px_80px_90px] gap-4 px-3 py-2 text-[10px] font-bold text-[#5a6f82] uppercase tracking-wider">
              <div>Clínica</div>
              <div className="text-right">MRR</div>
              <div className="text-right">Usuários</div>
              <div className="text-right">Tendência</div>
            </div>

            {topClinicas.map((c, i) => {
              const statusColor = c.status === 'ativo' ? '#2ecc71' : c.status === 'atencao' ? '#f39c12' : '#e74c3c';
              const cresceu = c.crescimento.startsWith('+');
              return (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_100px_80px_90px] gap-4 items-center px-3 py-3 rounded-lg hover:bg-[#132636] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${statusColor}30, ${statusColor}10)`,
                        color: statusColor,
                        border: `1px solid ${statusColor}40`,
                      }}
                    >
                      {c.nome
                        .split(' ')
                        .filter((w) => w.length > 2)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-white truncate group-hover:text-[#e8b86d] transition-colors">
                        {c.nome}
                      </div>
                      <div className="text-[10px] text-[#7a96aa] capitalize">{c.status === 'atencao' ? 'atenção' : c.status}</div>
                    </div>
                  </div>
                  <div className="text-right text-[14px] font-bold text-white tabular-nums">{c.mrr}</div>
                  <div className="text-right text-[13px] text-[#b0b8c1] tabular-nums">{c.usuarios}</div>
                  <div
                    className={`text-right text-[12px] font-semibold tabular-nums ${
                      cresceu ? 'text-[#2ecc71]' : 'text-[#e74c3c]'
                    }`}
                  >
                    {c.crescimento}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          {/* Alertas */}
          <div className="rounded-[16px] border border-[#1e3d54] bg-[#0f1f2e] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Alertas</h2>
              <span className="px-1.5 py-0.5 rounded-md bg-[rgba(231,76,60,0.15)] text-[#e74c3c] text-[10px] font-bold">
                {alertas.length}
              </span>
            </div>
            <div className="space-y-2">
              {alertas.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-[#132636] hover:border-[#1e3d54] bg-[#0a1520] transition-all"
                >
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: a.cor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white">{a.titulo}</div>
                    <div className="text-[11px] text-[#7a96aa] mt-0.5">{a.texto}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infra saúde */}
          <div className="rounded-[16px] border border-[#1e3d54] bg-[#0f1f2e] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Infraestrutura</h2>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#2ecc71] uppercase tracking-wider">
                <ShieldCheck size={12} strokeWidth={2.5} />
                OK
              </span>
            </div>
            <div className="space-y-3">
              {[
                { nome: 'API Railway', valor: '99.82%', cor: '#2ecc71' },
                { nome: 'Supabase DB', valor: '12ms', cor: '#2ecc71' },
                { nome: 'WhatsApp (12)', valor: '11/12', cor: '#f39c12' },
                { nome: 'Asaas Gateway', valor: 'OK', cor: '#2ecc71' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 text-[#b0b8c1]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.cor, boxShadow: `0 0 8px ${s.cor}` }} />
                    {s.nome}
                  </span>
                  <span className="font-semibold tabular-nums" style={{ color: s.cor }}>{s.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

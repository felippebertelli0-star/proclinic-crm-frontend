'use client';

/**
 * INDICADORES — Painel Operacional Diário
 *
 * Todos os indicadores são preenchidos automaticamente pelo sistema (derivados
 * dos stores de contatos, pipeline e conversas em tempo real). O único campo
 * editável pela secretária é o "Investimento em Tráfego" por dia, persistido
 * em localStorage via `useIndicadoresStore`.
 *
 * Qualidade: ULTRA MEGA PREMIUM AAA.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  RefreshCw,
  Download,
  Clock,
  Zap,
  Pencil,
  Users,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

import styles from './Indicadores.module.css';
import { useContatosStore } from '@/store/contatosStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { useIndicadoresStore } from '@/store/indicadoresStore';
import { calcularMes, totalizar } from '@/hooks/useIndicadoresCompute';

const MESES_LABEL = [
  'Janeiro',  'Fevereiro', 'Março',     'Abril',
  'Maio',     'Junho',     'Julho',     'Agosto',
  'Setembro', 'Outubro',   'Novembro',  'Dezembro',
] as const;

function conversaoClass(pct: number): string {
  if (pct >= 70) return styles.valPositive;
  if (pct >= 30) return styles.valWarning;
  return styles.valDanger;
}

function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

function parseBRL(s: string): number {
  const cleaned = s.replace(/[^\d,]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export function Indicadores() {
  /* ── Hidratar stores ── */
  const contatos = useContatosStore((s) => s.contatos);
  const hydrateContatos = useContatosStore((s) => s.hydrate);
  const estagios = usePipelineStore((s) => s.estagios);
  const investStore = useIndicadoresStore((s) => s.investTrafego);
  const setInvestTrafego = useIndicadoresStore((s) => s.setInvestTrafego);
  const hydrateIndicadores = useIndicadoresStore((s) => s.hydrate);

  useEffect(() => {
    hydrateContatos();
    hydrateIndicadores();
  }, [hydrateContatos, hydrateIndicadores]);

  /* ── Estado UI ── */
  const hoje = useMemo(() => new Date(), []);
  const [ano, setAno] = useState<number>(hoje.getFullYear());
  const [mes, setMes] = useState<number>(hoje.getMonth() + 1); // 1..12
  const [sincronizando, setSincronizando] = useState(false);
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  /* ── Polling 60s para manter auto-sync ── */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── Cálculo das métricas ── */
  const dias = useMemo(
    () => calcularMes(ano, mes, contatos, estagios, investStore),
    // tick force-recalculates every 60s
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ano, mes, contatos, estagios, investStore, tick],
  );
  const totais = useMemo(() => totalizar(dias), [dias]);

  /* ── Ações ── */
  const handleSincronizar = () => {
    setSincronizando(true);
    setTick((t) => t + 1);
    setTimeout(() => {
      setSincronizando(false);
      setToast('Indicadores sincronizados com o sistema');
      setTimeout(() => setToast(null), 2400);
    }, 900);
  };

  const handleExportCsv = () => {
    const header = [
      'Data', 'Leads Gerados', 'TM Resposta (min)', 'Conversas SDR',
      'Propostas Enviadas', 'Agendamentos', 'Agend. Tráfego', 'Agend. Orgânico',
      'Conversão (%)', 'Leads Reativações', 'Reativações', 'Conv. Reativações (%)',
      'Follow-ups', 'Invest. Tráfego (R$)',
    ];
    const rows = dias.map((d) => [
      d.date,
      d.leadsGerados,
      d.tmResposta,
      d.conversasSdr,
      d.propostasEnviadas,
      d.agendamentos,
      d.agendTrafego,
      d.agendOrganico,
      d.conversao,
      d.leadsReativacoes,
      d.reativacoes,
      d.convReativacoes,
      d.followUps,
      d.investTrafego,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indicadores_${ano}-${String(mes).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('CSV exportado com sucesso');
    setTimeout(() => setToast(null), 2400);
  };

  const handleInvestChange = (dateIso: string, raw: string) => {
    const valor = parseBRL(raw);
    setInvestTrafego(dateIso, valor);
  };

  const anoAtual = hoje.getFullYear();
  const anos = [anoAtual - 1, anoAtual, anoAtual + 1];

  return (
    <div className={styles.page}>
      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <BarChart3 size={24} color="#0d1f2d" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className={styles.brandTitle}>Indicadores</h1>
            <p className={styles.brandSub}>
              Acompanhamento diário de métricas operacionais
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnGhostGreen}`}
            onClick={handleSincronizar}
            aria-label="Sincronizar com o sistema"
          >
            <RefreshCw size={14} className={sincronizando ? styles.spin : ''} strokeWidth={2.4} />
            Sincronizar do Sistema
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleExportCsv}
            aria-label="Exportar CSV"
          >
            <Download size={14} strokeWidth={2.6} />
            Exportar CSV
          </button>
        </div>
      </header>

      {/* ── SELETOR DE MÊS/ANO ──────────────────────────────── */}
      <div className={styles.monthBar}>
        {MESES_LABEL.map((label, i) => {
          const m = i + 1;
          const active = m === mes;
          return (
            <button
              key={label}
              className={`${styles.monthPill} ${active ? styles.monthPillActive : ''}`}
              onClick={() => setMes(m)}
            >
              {label}
            </button>
          );
        })}
        <div className={styles.yearSelect}>
          <span>Ano</span>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
            {anos.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── BANNER INFO ─────────────────────────────────────── */}
      <div className={styles.infoBanner}>
        <div className={styles.infoIcon}>
          <Clock size={16} strokeWidth={2.4} />
        </div>
        <div>
          Campos com
          <span className={styles.tagAutoInline}>
            <Zap size={9} strokeWidth={3} /> AUTO
          </span>
          são preenchidos automaticamente pelo sistema. Campos com
          <span className={styles.tagManualInline}>
            <Pencil size={9} strokeWidth={3} /> MANUAL
          </span>
          precisam de entrada da secretária.
        </div>
      </div>

      {/* ── KPIs RESUMO ─────────────────────────────────────── */}
      <div className={styles.kpiGrid}>
        <KpiCard
          label="Leads Gerados"
          value={totais.leadsGerados.toLocaleString('pt-BR')}
          sub={`${MESES_LABEL[mes - 1]} · ${ano}`}
          color="#3498db"
          Icon={Users}
        />
        <KpiCard
          label="Agendamentos"
          value={totais.agendamentos.toLocaleString('pt-BR')}
          sub={`${totais.agendTrafego} tráfego · ${totais.agendOrganico} orgânico`}
          color="#2ecc71"
          Icon={Calendar}
        />
        <KpiCard
          label="Conversão Média"
          value={`${totais.conversaoMedia}%`}
          sub={`TMR ${totais.tmRespostaMedio} min`}
          color="#9b59b6"
          Icon={Target}
        />
        <KpiCard
          label="Reativações"
          value={totais.reativacoes.toLocaleString('pt-BR')}
          sub={`${totais.leadsReativacoes} leads · ${totais.convReativacoesMedia}% conv.`}
          color="#e67e22"
          Icon={TrendingUp}
        />
        <KpiCard
          label="Invest. Tráfego"
          value={fmtBRL(totais.investTrafego)}
          sub={totais.cpa > 0 ? `CPA ${fmtBRL(totais.cpa)}` : 'sem investimento'}
          color="#c9943a"
          Icon={Download}
        />
      </div>

      {/* ── TABELA ──────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            <BarChart3 size={15} color="#c9943a" strokeWidth={2.4} />
            Relatório Detalhado · {MESES_LABEL[mes - 1]} {ano}
          </h2>
          <div className={styles.tableMeta}>
            <span>
              <strong>{dias.filter((d) => !d.isFuturo).length}</strong> dias apurados
            </span>
            <span>
              <strong>{dias.length}</strong> dias no mês
            </span>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={`${styles.th} ${styles.thLeft}`}>Dia</th>
                <Th label="Leads Gerados" auto />
                <Th label="TM Resposta" auto />
                <Th label="Conversas SDR" auto />
                <Th label="Propostas Enviadas" auto />
                <Th label="Agendamentos" auto />
                <Th label="Agend. Tráfego" auto />
                <Th label="Agend. Orgânico" auto />
                <Th label="Conversão" auto />
                <Th label="Leads Reativações" auto />
                <Th label="Reativações" auto />
                <Th label="Conv. Reativações" auto />
                <Th label="Follow-ups" auto />
                <Th label="Inves. Tráfego" manual />
              </tr>
            </thead>
            <tbody>
              {dias.map((d) => {
                const dataLabel = `${String(d.dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
                return (
                  <tr
                    key={d.date}
                    className={[
                      styles.row,
                      d.isHoje ? styles.rowToday : '',
                      d.isFuturo ? styles.rowFuturo : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <td className={`${styles.td} ${styles.tdLeft}`}>
                      <span>{dataLabel}</span>
                      {d.isHoje && <span className={styles.chipHoje}>HOJE</span>}
                      {d.isFds && !d.isHoje && <span className={styles.chipFds}>FDS</span>}
                    </td>

                    {d.isFuturo ? (
                      <>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <td key={i} className={`${styles.td} ${styles.valMuted}`}>—</td>
                        ))}
                      </>
                    ) : (
                      <>
                        <td className={styles.td}>{d.leadsGerados}</td>
                        <td className={styles.td}>{d.tmResposta} min</td>
                        <td className={styles.td}>{d.conversasSdr}</td>
                        <td className={styles.td}>{d.propostasEnviadas}</td>
                        <td className={`${styles.td} ${d.agendamentos >= 4 ? styles.valPositive : ''}`}>
                          {d.agendamentos}
                        </td>
                        <td className={styles.td}>{d.agendTrafego}</td>
                        <td className={styles.td}>{d.agendOrganico}</td>
                        <td className={`${styles.td} ${conversaoClass(d.conversao)}`}>
                          {d.conversao}%
                        </td>
                        <td className={styles.td}>{d.leadsReativacoes}</td>
                        <td className={`${styles.td} ${d.reativacoes > 0 ? styles.valBlue : styles.valMuted}`}>
                          {d.reativacoes}
                        </td>
                        <td className={`${styles.td} ${d.convReativacoes >= 50 ? styles.valPositive : d.convReativacoes > 0 ? styles.valWarning : styles.valMuted}`}>
                          {d.convReativacoes}%
                        </td>
                        <td className={styles.td}>{d.followUps}</td>
                      </>
                    )}

                    <td className={`${styles.td} ${styles.investCell}`}>
                      <InvestInput
                        dateIso={d.date}
                        valor={d.investTrafego}
                        onChange={handleInvestChange}
                        disabled={d.isFuturo}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className={styles.tfoot}>
              <tr>
                <td className={`${styles.td} ${styles.tdLeft}`}>Totais</td>
                <td className={styles.td}>{totais.leadsGerados}</td>
                <td className={styles.td}>{totais.tmRespostaMedio} min</td>
                <td className={styles.td}>{totais.conversasSdr}</td>
                <td className={styles.td}>{totais.propostasEnviadas}</td>
                <td className={`${styles.td} ${styles.valPositive}`}>{totais.agendamentos}</td>
                <td className={styles.td}>{totais.agendTrafego}</td>
                <td className={styles.td}>{totais.agendOrganico}</td>
                <td className={`${styles.td} ${conversaoClass(totais.conversaoMedia)}`}>{totais.conversaoMedia}%</td>
                <td className={styles.td}>{totais.leadsReativacoes}</td>
                <td className={`${styles.td} ${styles.valBlue}`}>{totais.reativacoes}</td>
                <td className={styles.td}>{totais.convReativacoesMedia}%</td>
                <td className={styles.td}>{totais.followUps}</td>
                <td className={`${styles.td} ${styles.valAmber}`}>{fmtBRL(totais.investTrafego)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── TOAST ───────────────────────────────────────────── */}
      {toast && (
        <div className={styles.toast}>
          <CheckCircle2 size={16} strokeWidth={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ═══ Subcomponentes ═══════════════════════════════════════ */

function Th({ label, auto, manual }: { label: string; auto?: boolean; manual?: boolean }) {
  return (
    <th className={styles.th}>
      <span className={styles.thTop}>{label}</span>
      {auto && (
        <span className={styles.tagAuto}>
          <Zap size={9} strokeWidth={3} /> AUTO
        </span>
      )}
      {manual && (
        <span className={styles.tagManual}>
          <Pencil size={9} strokeWidth={3} /> MANUAL
        </span>
      )}
    </th>
  );
}

function KpiCard({
  label,
  value,
  sub,
  color,
  Icon,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  Icon: typeof Users;
}) {
  return (
    <div
      className={`${styles.kpiCard} ${styles.fadeIn}`}
      style={{ ['--kpi-color' as string]: color }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.kpiLabel}>{label}</div>
          <div className={styles.kpiValue}>{value}</div>
          <div className={styles.kpiSub}>{sub}</div>
        </div>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${color}1f`, border: `1px solid ${color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={color} strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

function InvestInput({
  dateIso,
  valor,
  onChange,
  disabled,
}: {
  dateIso: string;
  valor: number;
  onChange: (date: string, raw: string) => void;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [local, setLocal] = useState(valor > 0 ? String(valor) : '');

  useEffect(() => {
    if (!focused) setLocal(valor > 0 ? String(valor) : '');
  }, [valor, focused]);

  const display = focused
    ? local
    : valor > 0
      ? fmtBRL(valor)
      : '';

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      placeholder={disabled ? '—' : 'R$ 0'}
      disabled={disabled}
      className={`${styles.investInput} ${valor === 0 ? styles.investInputEmpty : ''}`}
      onFocus={() => {
        setFocused(true);
        setLocal(valor > 0 ? String(valor) : '');
      }}
      onBlur={() => {
        setFocused(false);
        onChange(dateIso, local);
      }}
      onChange={(e) => setLocal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        if (e.key === 'Escape') {
          setLocal(valor > 0 ? String(valor) : '');
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}

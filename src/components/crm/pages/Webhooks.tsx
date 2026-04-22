'use client';

import { useMemo, useState } from 'react';
import {
  Webhook,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Zap,
  Copy,
  Check,
  Edit3,
  Trash2,
  Play,
  Pause,
  X,
  Link2,
  Calendar,
  TrendingUp,
} from 'lucide-react';

type StatusWH = 'Ativo' | 'Erro' | 'Pausado';

interface WebhookItem {
  id: number;
  nome: string;
  url: string;
  metodo: 'POST' | 'GET' | 'PUT' | 'DELETE';
  status: StatusWH;
  chamadas: number;
  ultimaExecucao: string;
  evento: string;
}

const STATUS_CONFIG: Record<StatusWH, { color: string; bg: string; gradient: string; Icon: typeof CheckCircle2 }> = {
  Ativo: {
    color: '#2ecc71',
    bg: 'rgba(46, 204, 113, 0.12)',
    gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    Icon: CheckCircle2,
  },
  Erro: {
    color: '#e74c3c',
    bg: 'rgba(231, 76, 60, 0.12)',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    Icon: AlertTriangle,
  },
  Pausado: {
    color: '#f39c12',
    bg: 'rgba(243, 156, 18, 0.12)',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)',
    Icon: Pause,
  },
};

const METODO_COLOR: Record<string, string> = {
  POST: '#3498db',
  GET: '#2ecc71',
  PUT: '#f39c12',
  DELETE: '#e74c3c',
};

const INITIAL_WEBHOOKS: WebhookItem[] = [
  { id: 1, nome: 'Lead WhatsApp → CRM', url: 'https://hooks.proclinic.com/wa-lead', metodo: 'POST', status: 'Ativo', chamadas: 1947, ultimaExecucao: '2026-04-22T10:32', evento: 'mensagem.recebida' },
  { id: 2, nome: 'Agendamento → Google Cal', url: 'https://hooks.proclinic.com/gcal-sync', metodo: 'POST', status: 'Ativo', chamadas: 234, ultimaExecucao: '2026-04-22T09:15', evento: 'agenda.criada' },
  { id: 3, nome: 'Pipeline → Planilha', url: 'https://hooks.proclinic.com/sheet-sync', metodo: 'POST', status: 'Ativo', chamadas: 567, ultimaExecucao: '2026-04-22T08:45', evento: 'pipeline.atualizado' },
  { id: 4, nome: 'IA Qualificação', url: 'https://api.jarvis.io/qualify', metodo: 'POST', status: 'Erro', chamadas: 882, ultimaExecucao: '2026-04-22T07:20', evento: 'lead.novo' },
  { id: 5, nome: 'Relatório Semanal', url: 'https://hooks.proclinic.com/weekly-report', metodo: 'POST', status: 'Ativo', chamadas: 12, ultimaExecucao: '2026-04-21T18:00', evento: 'relatorio.semanal' },
  { id: 6, nome: 'Notificação Pagamento', url: 'https://hooks.proclinic.com/payment', metodo: 'POST', status: 'Pausado', chamadas: 445, ultimaExecucao: '2026-04-20T14:12', evento: 'pagamento.recebido' },
];

export function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(INITIAL_WEBHOOKS);
  const [query, setQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusWH | 'Todos'>('Todos');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WebhookItem | null>(null);

  const stats = useMemo(() => {
    const total = webhooks.length;
    const ativos = webhooks.filter((w) => w.status === 'Ativo').length;
    const erros = webhooks.filter((w) => w.status === 'Erro').length;
    const totalChamadas = webhooks.reduce((acc, w) => acc + w.chamadas, 0);
    return { total, ativos, erros, totalChamadas };
  }, [webhooks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return webhooks.filter((w) => {
      const matchStatus = filtroStatus === 'Todos' ? true : w.status === filtroStatus;
      const matchQuery = !q ||
        w.nome.toLowerCase().includes(q) ||
        w.url.toLowerCase().includes(q) ||
        w.evento.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [webhooks, filtroStatus, query]);

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleToggleStatus = (id: number) => {
    setWebhooks((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const novoStatus: StatusWH = w.status === 'Ativo' ? 'Pausado' : 'Ativo';
        return { ...w, status: novoStatus };
      }),
    );
  };

  const handleDelete = (id: number) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  const handleSave = (data: Omit<WebhookItem, 'id' | 'chamadas' | 'ultimaExecucao'>, id?: number) => {
    if (id) {
      setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
    } else {
      const nextId = Math.max(0, ...webhooks.map((w) => w.id)) + 1;
      setWebhooks((prev) => [
        { id: nextId, ...data, chamadas: 0, ultimaExecucao: '-' },
        ...prev,
      ]);
    }
    setModalOpen(false);
    setEditing(null);
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
        @keyframes whModalIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes whCardIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes whPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .wh-card { animation: whCardIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .wh-card:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(0,0,0,0.4); border-color: rgba(201, 148, 58, 0.45) !important; }
        .wh-input:focus { border-color: #c9943a !important; box-shadow: 0 0 0 3px rgba(201, 148, 58, 0.18) !important; }
        .wh-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(201, 148, 58, 0.35); }
        .wh-pill:hover { transform: translateY(-1px); }
        .wh-action:hover { transform: translateY(-1px); }
        .wh-pulse-dot { animation: whPulse 1.6s ease-in-out infinite; }
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
            <Webhook size={22} color="#0d1f2d" strokeWidth={2.4} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Webhooks & Triggers</h1>
            <p style={{ fontSize: '13px', color: '#7a96aa', margin: '2px 0 0 0' }}>Integre seu CRM com sistemas externos via automação</p>
          </div>
        </div>
        <button
          className="wh-btn-primary"
          onClick={() => { setEditing(null); setModalOpen(true); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
            color: '#0d1f2d',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(201, 148, 58, 0.28)',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Plus size={16} strokeWidth={2.6} /> Novo Webhook
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <StatsCard label="Total" value={stats.total} color="#c9943a" Icon={Webhook} />
        <StatsCard label="Ativos" value={stats.ativos} color="#2ecc71" Icon={CheckCircle2} />
        <StatsCard label="Com Erro" value={stats.erros} color="#e74c3c" Icon={AlertTriangle} />
        <StatsCard label="Total de Chamadas" value={stats.totalChamadas.toLocaleString('pt-BR')} color="#3498db" Icon={Activity} />
      </div>

      {/* TOOLBAR */}
      <div
        style={{
          background: 'rgba(19, 38, 54, 0.75)',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={16} color="#7a96aa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="wh-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, URL ou evento..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              background: '#0d1f2d',
              border: '1px solid #1e3d54',
              borderRadius: '10px',
              color: '#e8edf2',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <FilterPill label="Todos" count={webhooks.length} active={filtroStatus === 'Todos'} onClick={() => setFiltroStatus('Todos')} />
          {(['Ativo', 'Erro', 'Pausado'] as StatusWH[]).map((s) => (
            <FilterPill
              key={s}
              label={s}
              count={webhooks.filter((w) => w.status === s).length}
              color={STATUS_CONFIG[s].color}
              Icon={STATUS_CONFIG[s].Icon}
              active={filtroStatus === s}
              onClick={() => setFiltroStatus(s)}
            />
          ))}
        </div>
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(19, 38, 54, 0.4)', borderRadius: '14px', border: '1px dashed #1e3d54' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔗</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e8edf2', margin: '0 0 6px 0' }}>Nenhum webhook encontrado</h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>Crie um novo webhook ou ajuste os filtros.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filtered.map((w, i) => {
            const statusCfg = STATUS_CONFIG[w.status];
            const StatusIcon = statusCfg.Icon;
            const metodoColor = METODO_COLOR[w.metodo] || '#c9943a';

            return (
              <div
                key={w.id}
                className="wh-card"
                style={{
                  position: 'relative',
                  background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
                  border: '1px solid #1e3d54',
                  borderRadius: '16px',
                  padding: '18px',
                  overflow: 'hidden',
                  animationDelay: `${i * 0.03}s`,
                  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: statusCfg.gradient,
                  }}
                />

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {w.nome}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#7a96aa' }}>
                      <Zap size={11} color="#c9943a" /> {w.evento}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      background: statusCfg.bg,
                      border: `1px solid ${statusCfg.color}40`,
                      color: statusCfg.color,
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className={w.status === 'Ativo' ? 'wh-pulse-dot' : ''}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusCfg.color }}
                    />
                    {w.status}
                  </div>
                </div>

                {/* URL */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: 'rgba(13, 31, 45, 0.7)',
                    border: '1px solid #1e3d54',
                    borderRadius: '10px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      padding: '3px 7px',
                      borderRadius: '6px',
                      background: `${metodoColor}1f`,
                      border: `1px solid ${metodoColor}40`,
                      color: metodoColor,
                      fontSize: '9px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}
                  >
                    {w.metodo}
                  </div>
                  <Link2 size={12} color="#7a96aa" style={{ flexShrink: 0 }} />
                  <div
                    title={w.url}
                    style={{
                      fontSize: '11px',
                      color: '#b0c4d4',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                    }}
                  >
                    {w.url}
                  </div>
                  <button
                    onClick={() => handleCopy(w.id, w.url)}
                    title="Copiar URL"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedId === w.id ? '#2ecc71' : '#7a96aa',
                      cursor: 'pointer',
                      padding: '3px',
                      display: 'flex',
                      transition: 'color 0.2s',
                    }}
                  >
                    {copiedId === w.id ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>

                {/* META */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  <MetaChip Icon={Activity} label="Chamadas" value={w.chamadas.toLocaleString('pt-BR')} color="#3498db" />
                  <MetaChip
                    Icon={Calendar}
                    label="Última execução"
                    value={w.ultimaExecucao === '-' ? '-' : new Date(w.ultimaExecucao).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    color="#c9943a"
                  />
                </div>

                {/* ACTIONS */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="wh-action"
                    onClick={() => handleToggleStatus(w.id)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: `1px solid ${w.status === 'Ativo' ? 'rgba(243, 156, 18, 0.35)' : 'rgba(46, 204, 113, 0.35)'}`,
                      background: w.status === 'Ativo' ? 'rgba(243, 156, 18, 0.08)' : 'rgba(46, 204, 113, 0.08)',
                      color: w.status === 'Ativo' ? '#f39c12' : '#2ecc71',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {w.status === 'Ativo' ? <><Pause size={13} /> Pausar</> : <><Play size={13} /> Ativar</>}
                  </button>
                  <button
                    className="wh-action"
                    onClick={() => { setEditing(w); setModalOpen(true); }}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 148, 58, 0.35)',
                      background: 'rgba(201, 148, 58, 0.08)',
                      color: '#c9943a',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    className="wh-action"
                    onClick={() => handleDelete(w.id)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(231, 76, 60, 0.35)',
                      background: 'rgba(231, 76, 60, 0.08)',
                      color: '#e74c3c',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <WebhookModal
          initial={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ========= Subcomponentes =========

function StatsCard({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: number | string;
  color: string;
  Icon: typeof Webhook;
}) {
  return (
    <div
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
          width: '110px',
          height: '110px',
          background: `radial-gradient(circle at top right, ${color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color, lineHeight: 1 }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `${color}1f`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color={color} strokeWidth={2.3} />
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  count,
  color = '#c9943a',
  Icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color?: string;
  Icon?: typeof AlertTriangle;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="wh-pill"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '8px 14px',
        borderRadius: '999px',
        border: `1px solid ${active ? color : '#1e3d54'}`,
        background: active ? `${color}1f` : 'rgba(13, 31, 45, 0.4)',
        color: active ? color : '#7a96aa',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {Icon && <Icon size={12} strokeWidth={2.4} />}
      {label}
      <span
        style={{
          minWidth: '18px',
          padding: '1px 6px',
          borderRadius: '10px',
          background: active ? `${color}33` : 'rgba(122, 150, 170, 0.15)',
          color: active ? color : '#7a96aa',
          fontSize: '10px',
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        {count}
      </span>
    </button>
  );
}

function MetaChip({ Icon, label, value, color }: { Icon: typeof Activity; label: string; value: string; color: string }) {
  return (
    <div
      style={{
        padding: '8px 10px',
        borderRadius: '8px',
        background: 'rgba(13, 31, 45, 0.5)',
        border: '1px solid #1e3d54',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600, marginBottom: '3px' }}>
        <Icon size={10} color={color} /> {label}
      </div>
      <div style={{ fontSize: '13px', color: '#e8edf2', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function WebhookModal({
  initial,
  onClose,
  onSave,
}: {
  initial: WebhookItem | null;
  onClose: () => void;
  onSave: (data: Omit<WebhookItem, 'id' | 'chamadas' | 'ultimaExecucao'>, id?: number) => void;
}) {
  const [form, setForm] = useState<Omit<WebhookItem, 'id' | 'chamadas' | 'ultimaExecucao'>>({
    nome: initial?.nome || '',
    url: initial?.url || '',
    metodo: initial?.metodo || 'POST',
    status: initial?.status || 'Ativo',
    evento: initial?.evento || '',
  });

  const valido =
    form.nome.trim().length >= 3 &&
    form.url.trim().length >= 8 &&
    form.evento.trim().length >= 2;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 17, 26, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
          border: '1px solid #1e3d54',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
          animation: 'whModalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #c9943a 0%, #a87a28 100%)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #1e3d54' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Webhook size={16} color="#0d1f2d" strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                {initial ? 'Editar Webhook' : 'Novo Webhook'}
              </h2>
              <p style={{ fontSize: '12px', color: '#7a96aa', margin: '2px 0 0 0' }}>Configure integração HTTP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7a96aa',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'grid', gap: '14px' }}>
          <Field label="Nome do Webhook">
            <Input value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} placeholder="Ex: Lead WhatsApp → CRM" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
            <Field label="Método">
              <Select
                value={form.metodo}
                onChange={(v) => setForm({ ...form, metodo: v as WebhookItem['metodo'] })}
                options={['POST', 'GET', 'PUT', 'DELETE']}
              />
            </Field>
            <Field label="URL Endpoint">
              <Input value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://..." />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Evento Disparador">
              <Input value={form.evento} onChange={(v) => setForm({ ...form, evento: v })} placeholder="ex: mensagem.recebida" />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v as StatusWH })}
                options={['Ativo', 'Pausado', 'Erro']}
              />
            </Field>
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e3d54', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: 'transparent',
              color: '#b0c4d4',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            disabled={!valido}
            onClick={() => onSave(form, initial?.id)}
            className="wh-btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: valido ? 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)' : '#1e3d54',
              color: valido ? '#0d1f2d' : '#7a96aa',
              fontSize: '13px',
              fontWeight: 700,
              cursor: valido ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            {initial ? 'Salvar alterações' : 'Criar Webhook'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', color: '#7a96aa', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className="wh-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: '#0d1f2d',
        border: '1px solid #1e3d54',
        borderRadius: '10px',
        color: '#e8edf2',
        fontSize: '13px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
      }}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      className="wh-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: '#0d1f2d',
        border: '1px solid #1e3d54',
        borderRadius: '10px',
        color: '#e8edf2',
        fontSize: '13px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

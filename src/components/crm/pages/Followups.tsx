'use client';

import { useMemo, useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  AtSign,
  X,
  Send,
  Trash2,
  Edit3,
} from 'lucide-react';

type Canal = 'WhatsApp' | 'Instagram' | 'Email' | 'Ligação';
type StatusFU = 'Urgente' | 'Agendado' | 'Pendente' | 'Convertida';

interface Followup {
  id: number;
  nome: string;
  canal: Canal;
  status: StatusFU;
  data: string;
  acao: string;
  observacao?: string;
}

const STATUS_CONFIG: Record<StatusFU, { color: string; bg: string; gradient: string; Icon: typeof AlertTriangle }> = {
  Urgente: {
    color: '#e74c3c',
    bg: 'rgba(231, 76, 60, 0.12)',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    Icon: AlertTriangle,
  },
  Agendado: {
    color: '#3498db',
    bg: 'rgba(52, 152, 219, 0.12)',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    Icon: Calendar,
  },
  Pendente: {
    color: '#f39c12',
    bg: 'rgba(243, 156, 18, 0.12)',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)',
    Icon: Clock,
  },
  Convertida: {
    color: '#2ecc71',
    bg: 'rgba(46, 204, 113, 0.12)',
    gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    Icon: CheckCircle2,
  },
};

const CANAL_CONFIG: Record<Canal, { color: string; Icon: typeof MessageSquare }> = {
  WhatsApp: { color: '#25d366', Icon: MessageSquare },
  Instagram: { color: '#e1306c', Icon: AtSign },
  Email: { color: '#c9943a', Icon: Mail },
  'Ligação': { color: '#3498db', Icon: Phone },
};

const INITIAL_FOLLOWUPS: Followup[] = [
  { id: 1, nome: 'Maria Rosa', canal: 'WhatsApp', status: 'Urgente', data: '2026-04-18', acao: 'Ligar', observacao: 'Cliente pediu retorno hoje' },
  { id: 2, nome: 'Carlos Mendes', canal: 'Instagram', status: 'Agendado', data: '2026-04-19', acao: 'Mensagem', observacao: 'Confirmar agendamento' },
  { id: 3, nome: 'Ana Paula', canal: 'WhatsApp', status: 'Urgente', data: '2026-04-18', acao: 'Confirmar', observacao: 'Aguardando retorno de exame' },
  { id: 4, nome: 'Laura Ferreira', canal: 'Email', status: 'Pendente', data: '2026-04-20', acao: 'Enviar', observacao: 'Orçamento procedimento' },
  { id: 5, nome: 'Patricia Lima', canal: 'WhatsApp', status: 'Convertida', data: '2026-04-17', acao: 'Nenhuma', observacao: 'Conversão concluída' },
  { id: 6, nome: 'João Pereira', canal: 'Ligação', status: 'Pendente', data: '2026-04-21', acao: 'Ligar', observacao: 'Aguardando contato' },
];

export function Followups() {
  const [followups, setFollowups] = useState<Followup[]>(INITIAL_FOLLOWUPS);
  const [query, setQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusFU | 'Todos'>('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Followup | null>(null);

  const stats = useMemo(() => {
    return {
      total: followups.length,
      urgentes: followups.filter((f) => f.status === 'Urgente').length,
      agendados: followups.filter((f) => f.status === 'Agendado').length,
      convertidas: followups.filter((f) => f.status === 'Convertida').length,
    };
  }, [followups]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFU | 'Todos', number> = {
      Todos: followups.length,
      Urgente: 0,
      Agendado: 0,
      Pendente: 0,
      Convertida: 0,
    };
    followups.forEach((f) => {
      counts[f.status] += 1;
    });
    return counts;
  }, [followups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return followups.filter((f) => {
      const matchStatus = filtroStatus === 'Todos' ? true : f.status === filtroStatus;
      const matchQuery = !q ||
        f.nome.toLowerCase().includes(q) ||
        f.acao.toLowerCase().includes(q) ||
        (f.observacao || '').toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [followups, filtroStatus, query]);

  const taxaConversao = followups.length > 0
    ? Math.round((stats.convertidas / followups.length) * 100)
    : 0;

  const handleSave = (data: Omit<Followup, 'id'>, id?: number) => {
    if (id) {
      setFollowups((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
    } else {
      const nextId = Math.max(0, ...followups.map((f) => f.id)) + 1;
      setFollowups((prev) => [{ id: nextId, ...data }, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    setFollowups((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConcluir = (id: number) => {
    setFollowups((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'Convertida', acao: 'Nenhuma' } : f)));
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
        @keyframes fuModalIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fuCardIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fu-card { animation: fuCardIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .fu-card:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.35); border-color: rgba(201, 148, 58, 0.45) !important; }
        .fu-input:focus { border-color: #c9943a !important; box-shadow: 0 0 0 3px rgba(201, 148, 58, 0.18) !important; }
        .fu-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(201, 148, 58, 0.35); }
        .fu-pill:hover { transform: translateY(-1px); }
        .fu-action:hover { transform: translateY(-1px); }
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
            <Bell size={22} color="#0d1f2d" strokeWidth={2.4} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Follow-ups</h1>
            <p style={{ fontSize: '13px', color: '#7a96aa', margin: '2px 0 0 0' }}>Acompanhe contatos pendentes e garanta conversões</p>
          </div>
        </div>
        <button
          className="fu-btn-primary"
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
          <Plus size={16} strokeWidth={2.6} /> Novo Follow-up
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <StatsCard label="Total" value={stats.total} color="#c9943a" Icon={Bell} />
        <StatsCard label="Urgentes" value={stats.urgentes} color="#e74c3c" Icon={AlertTriangle} />
        <StatsCard label="Agendados" value={stats.agendados} color="#3498db" Icon={Calendar} />
        <StatsCard label="Taxa de Conversão" value={`${taxaConversao}%`} color="#2ecc71" Icon={TrendingUp} />
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
            className="fu-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, ação ou observação..."
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
          <FilterPill label="Todos" count={statusCounts.Todos} active={filtroStatus === 'Todos'} onClick={() => setFiltroStatus('Todos')} />
          {(['Urgente', 'Agendado', 'Pendente', 'Convertida'] as StatusFU[]).map((s) => (
            <FilterPill
              key={s}
              label={s}
              count={statusCounts[s]}
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
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e8edf2', margin: '0 0 6px 0' }}>Nenhum follow-up encontrado</h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>Ajuste os filtros ou crie um novo follow-up.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map((f, i) => {
            const statusCfg = STATUS_CONFIG[f.status];
            const canalCfg = CANAL_CONFIG[f.canal];
            const StatusIcon = statusCfg.Icon;
            const CanalIcon = canalCfg.Icon;

            return (
              <div
                key={f.id}
                className="fu-card"
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
                {/* top line */}
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

                {/* HEADER row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: statusCfg.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '15px',
                        flexShrink: 0,
                      }}
                    >
                      {f.nome.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0', color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {f.nome}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: canalCfg.color, fontWeight: 600 }}>
                        <CanalIcon size={12} strokeWidth={2.4} />
                        {f.canal}
                      </div>
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
                    }}
                  >
                    <StatusIcon size={11} strokeWidth={2.6} />
                    {f.status}
                  </div>
                </div>

                {/* OBS */}
                {f.observacao && (
                  <div
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(13, 31, 45, 0.6)',
                      border: '1px solid #1e3d54',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#b0c4d4',
                      marginBottom: '12px',
                      lineHeight: 1.5,
                    }}
                  >
                    {f.observacao}
                  </div>
                )}

                {/* META */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7a96aa' }}>
                    <Calendar size={12} />
                    {new Date(f.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#c9943a', fontWeight: 600 }}>
                    <Send size={12} />
                    {f.acao}
                  </div>
                </div>

                {/* ACTIONS */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {f.status !== 'Convertida' && (
                    <button
                      className="fu-action"
                      onClick={() => handleConcluir(f.id)}
                      title="Marcar como convertida"
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '8px',
                        border: '1px solid rgba(46, 204, 113, 0.35)',
                        background: 'rgba(46, 204, 113, 0.08)',
                        color: '#2ecc71',
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
                      <CheckCircle2 size={13} /> Concluir
                    </button>
                  )}
                  <button
                    className="fu-action"
                    onClick={() => { setEditing(f); setModalOpen(true); }}
                    title="Editar"
                    style={{
                      flex: f.status === 'Convertida' ? 1 : 0,
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
                    <Edit3 size={13} /> {f.status === 'Convertida' ? 'Editar' : ''}
                  </button>
                  <button
                    className="fu-action"
                    onClick={() => handleDelete(f.id)}
                    title="Excluir"
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
        <FollowupModal
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
  Icon: typeof Bell;
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
      className="fu-pill"
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

function FollowupModal({
  initial,
  onClose,
  onSave,
}: {
  initial: Followup | null;
  onClose: () => void;
  onSave: (data: Omit<Followup, 'id'>, id?: number) => void;
}) {
  const [form, setForm] = useState<Omit<Followup, 'id'>>({
    nome: initial?.nome || '',
    canal: initial?.canal || 'WhatsApp',
    status: initial?.status || 'Pendente',
    data: initial?.data || new Date().toISOString().split('T')[0],
    acao: initial?.acao || '',
    observacao: initial?.observacao || '',
  });

  const valido = form.nome.trim().length >= 2 && form.acao.trim().length >= 2;

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
          maxWidth: '540px',
          background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
          border: '1px solid #1e3d54',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
          animation: 'fuModalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
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
              <Bell size={16} color="#0d1f2d" strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                {initial ? 'Editar Follow-up' : 'Novo Follow-up'}
              </h2>
              <p style={{ fontSize: '12px', color: '#7a96aa', margin: '2px 0 0 0' }}>Preencha os dados</p>
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
          <Field label="Nome do Contato">
            <Input value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} placeholder="Ex: Maria Rosa" />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Canal">
              <Select
                value={form.canal}
                onChange={(v) => setForm({ ...form, canal: v as Canal })}
                options={['WhatsApp', 'Instagram', 'Email', 'Ligação']}
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v as StatusFU })}
                options={['Urgente', 'Agendado', 'Pendente', 'Convertida']}
              />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Data">
              <Input type="date" value={form.data} onChange={(v) => setForm({ ...form, data: v })} />
            </Field>
            <Field label="Ação">
              <Input value={form.acao} onChange={(v) => setForm({ ...form, acao: v })} placeholder="Ex: Ligar, Enviar..." />
            </Field>
          </div>

          <Field label="Observação (opcional)">
            <textarea
              className="fu-input"
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              placeholder="Notas sobre o follow-up..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#0d1f2d',
                border: '1px solid #1e3d54',
                borderRadius: '10px',
                color: '#e8edf2',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </Field>
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
            className="fu-btn-primary"
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
            {initial ? 'Salvar alterações' : 'Criar Follow-up'}
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

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      className="fu-input"
      type={type}
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

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      className="fu-input"
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

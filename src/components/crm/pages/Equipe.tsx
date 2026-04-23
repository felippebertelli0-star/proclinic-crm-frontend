'use client';

import { useState, useMemo, useEffect } from 'react';
import { useEquipeStore } from '@/store/equipeStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { useEquipeSync } from '@/hooks/useEquipeSync';
import { CreateMembroModal } from './Equipe/CreateMembroModal';
import {
  Ticket,
  MessageCircle,
  Clock,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Send,
  Edit2,
  Plus,
  Search,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react';

type StatusFilter = 'Todos' | 'Online' | 'Ausente' | 'Offline';

export function Equipe() {
  const membros = useEquipeStore((state) => state.membros);
  const addMembro = useEquipeStore((state) => state.addMembro);
  const hydrate = useEquipeStore((state) => state.hydrate);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Dados reais do pipeline: achata todas as oportunidades de todos os estágios
  // e tagueia cada uma com o stage.id para permitir contagem por estágio.
  const estagios = usePipelineStore((state) => state.estagios);
  const opportunitiesReais = useMemo(
    () =>
      estagios.flatMap((s) =>
        s.opportunities.map((o) => ({ ...o, stage: s.id })),
      ),
    [estagios],
  );
  // conversasStore não mantém array de conversas (apenas contagens globais),
  // portanto passamos [] até existir histórico por agente.
  const conversasReais = useMemo(() => [], []);
  useEquipeSync(conversasReais, opportunitiesReais);

  const handleCreateMembro = (novoMembro: any) => {
    const id = membros.length > 0 ? Math.max(...membros.map((m) => m.id)) + 1 : 1;
    addMembro({
      ...novoMembro,
      id,
      conversas: 0,
      status: 'Offline',
    });
    setCreateModalOpen(false);
  };

  // Estatísticas globais
  const stats = useMemo(() => {
    const online = membros.filter((m) => m.status === 'Online').length;
    const ausente = membros.filter((m) => m.status === 'Ausente').length;
    const offline = membros.filter((m) => m.status === 'Offline').length;
    const ticketsTotal = membros.reduce((s, m) => s + (m.tickets || 0), 0);
    const conversasTotal = membros.reduce((s, m) => s + (m.conversas || 0), 0);
    // TMR médio (parse "5 min")
    const tmrValues = membros
      .map((m) => parseFloat((m.tmr || '0').replace(/[^\d.]/g, '')))
      .filter((v) => !isNaN(v) && v > 0);
    const tmrMedio = tmrValues.length > 0 ? (tmrValues.reduce((a, b) => a + b, 0) / tmrValues.length).toFixed(1) : '0';
    return { online, ausente, offline, ticketsTotal, conversasTotal, tmrMedio, total: membros.length };
  }, [membros]);

  // Ranking (top 3 por tickets)
  const topPerformers = useMemo(
    () =>
      [...membros]
        .sort((a, b) => (b.tickets || 0) - (a.tickets || 0))
        .slice(0, 3)
        .map((m) => m.id),
    [membros]
  );

  // Filtrados
  const filtrados = useMemo(() => {
    return membros.filter((m) => {
      const matchesSearch =
        !search.trim() ||
        m.nome.toLowerCase().includes(search.toLowerCase()) ||
        m.cargo.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [membros, search, statusFilter]);

  const statusColor = (s: string) =>
    s === 'Online' ? '#2ecc71' : s === 'Ausente' ? '#f39c12' : '#7a96aa';

  return (
    <div
      style={{
        padding: '26px 28px 40px',
        background:
          'radial-gradient(900px circle at 90% -10%, rgba(201,148,58,0.06), transparent 55%), radial-gradient(700px circle at -5% 30%, rgba(52,152,219,0.04), transparent 55%), #0d1f2d',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'auto',
        scrollbarGutter: 'stable',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      {/* HERO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
          animation: 'equipeFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: '#7a96aa',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#2ecc71',
                boxShadow: '0 0 0 0 rgba(46,204,113,0.6)',
                animation: 'equipePulse 2s infinite',
              }}
            />
            Gestão de Equipe · Sincronizado
          </span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.8px',
              background: 'linear-gradient(120deg, #ffffff 0%, #e8edf2 40%, #c9943a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Equipe
          </h1>
          <p style={{ fontSize: 12, color: '#7a96aa', margin: 0 }}>
            Acompanhe performance, carga de trabalho e disponibilidade dos atendentes em tempo real
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          style={{
            padding: '10px 20px',
            borderRadius: 12,
            border: '1px solid rgba(201,148,58,0.4)',
            background: 'linear-gradient(135deg, #c9943a, #a87a28)',
            color: '#0d1f2d',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 8px 20px rgba(201,148,58,0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(201,148,58,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(201,148,58,0.25)';
          }}
        >
          <Plus size={14} strokeWidth={2.6} /> Cadastrar Membro
        </button>
      </div>

      {/* STATS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
          animation: 'equipeFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both',
        }}
      >
        {[
          { label: 'Membros Ativos', value: stats.total, sub: `${stats.online} online agora`, color: '#c9943a', Icon: Users },
          { label: 'Online', value: stats.online, sub: 'disponíveis', color: '#2ecc71', Icon: Zap },
          { label: 'Tickets Totais', value: stats.ticketsTotal, sub: 'em atendimento', color: '#3498db', Icon: Ticket },
          { label: 'Conversas', value: stats.conversasTotal, sub: 'acumuladas', color: '#9b59b6', Icon: MessageCircle },
          { label: 'TMR Médio', value: `${stats.tmrMedio} min`, sub: 'resposta da equipe', color: '#f39c12', Icon: Clock },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              position: 'relative',
              background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
              border: '1px solid #1e3d54',
              borderLeft: `4px solid ${s.color}`,
              borderRadius: 14,
              padding: '14px 16px',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <s.Icon size={14} style={{ color: s.color }} />
              <div
                style={{
                  fontSize: 10,
                  color: '#7a96aa',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1, letterSpacing: '-0.5px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 10, color: '#7a96aa', marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div
        style={{
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          background: 'rgba(19,38,54,0.85)',
          border: '1px solid #1e3d54',
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
          animation: 'equipeFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        }}
      >
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7a96aa', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: 10,
              border: '1px solid #1e3d54',
              background: 'rgba(13,31,45,0.6)',
              color: '#e8edf2',
              fontSize: 12,
              outline: 'none',
              transition: 'all 0.2s',
            }}
          />
        </div>

        <div style={{ display: 'inline-flex', gap: 6 }}>
          {(['Todos', 'Online', 'Ausente', 'Offline'] as StatusFilter[]).map((opt) => {
            const active = statusFilter === opt;
            const color = opt === 'Online' ? '#2ecc71' : opt === 'Ausente' ? '#f39c12' : opt === 'Offline' ? '#7a96aa' : '#c9943a';
            const count = opt === 'Todos' ? stats.total : opt === 'Online' ? stats.online : opt === 'Ausente' ? stats.ausente : stats.offline;
            return (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                style={{
                  padding: '7px 13px',
                  borderRadius: 10,
                  border: active ? `1px solid ${color}80` : '1px solid #1e3d54',
                  background: active ? `${color}1f` : 'rgba(13,31,45,0.5)',
                  color: active ? color : '#b0c4d4',
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: active ? `0 4px 14px ${color}25` : 'none',
                }}
              >
                {opt}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 8,
                    background: active ? `${color}30` : 'rgba(122,150,170,0.15)',
                    color: active ? color : '#7a96aa',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LISTA DE MEMBROS */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          animation: 'equipeFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both',
        }}
      >
        {filtrados.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
              border: '1px dashed #1e3d54',
              borderRadius: 16,
              textAlign: 'center',
              color: '#7a96aa',
            }}
          >
            <div style={{ fontSize: 46, opacity: 0.4, marginBottom: 10 }}>👥</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e8edf2', marginBottom: 4 }}>
              Nenhum membro encontrado
            </div>
            <div style={{ fontSize: 12 }}>
              {search || statusFilter !== 'Todos'
                ? 'Tente ajustar os filtros.'
                : 'Cadastre o primeiro membro da sua equipe.'}
            </div>
          </div>
        ) : (
          filtrados.map((membro) => {
            const isTop = topPerformers.includes(membro.id);
            const topIdx = topPerformers.indexOf(membro.id);
            const sColor = statusColor(membro.status);
            return (
              <div
                key={membro.id}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
                  border: '1px solid #1e3d54',
                  borderLeft: `4px solid ${membro.avatarColor}`,
                  borderRadius: 16,
                  padding: '16px 22px',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(220px, 260px) auto 1fr auto',
                  alignItems: 'center',
                  gap: 20,
                  minHeight: 86,
                }}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
                  (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 18px 42px rgba(0,0,0,0.45), 0 0 0 1px ${membro.avatarColor}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* AVATAR + NOME + STATUS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${membro.avatarColor}, ${membro.avatarColor}aa)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 900,
                        color: '#fff',
                        boxShadow: `0 6px 20px ${membro.avatarColor}55`,
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {membro.nome[0].toUpperCase()}
                    </div>
                    {/* status dot */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: sColor,
                        border: '2.5px solid #0f2130',
                        boxShadow: membro.status === 'Online' ? `0 0 8px ${sColor}` : 'none',
                      }}
                    />
                    {isTop && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -8,
                          left: -8,
                          fontSize: 16,
                          background: 'rgba(13,31,45,0.95)',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(201,148,58,0.35)',
                        }}
                        title={`Top ${topIdx + 1} em tickets`}
                      >
                        {['🥇', '🥈', '🥉'][topIdx]}
                      </div>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          margin: 0,
                          color: '#e8edf2',
                          letterSpacing: '-0.3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {membro.nome}
                      </h3>
                    </div>
                    <div style={{ fontSize: 11, color: '#7a96aa', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {membro.cargo}
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 9px',
                        borderRadius: 8,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.3px',
                        background: `${sColor}18`,
                        color: sColor,
                        border: `1px solid ${sColor}40`,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: sColor,
                          boxShadow: membro.status === 'Online' ? `0 0 6px ${sColor}` : 'none',
                        }}
                      />
                      {membro.status}
                    </div>
                  </div>
                </div>

                {/* MÉTRICAS PRINCIPAIS */}
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { label: 'Tickets', value: membro.tickets || 0, Icon: Ticket, color: '#c9943a' },
                    { label: 'Conversas', value: membro.conversas || 0, Icon: MessageCircle, color: '#3498db' },
                    { label: 'TMR', value: membro.tmr || '0 min', Icon: Clock, color: '#2ecc71' },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      style={{
                        background: 'rgba(13,31,45,0.55)',
                        border: '1px solid #1e3d54',
                        borderRadius: 11,
                        padding: '8px 14px',
                        minWidth: 92,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <metric.Icon size={11} style={{ color: metric.color }} />
                        <div
                          style={{
                            fontSize: 8,
                            color: '#7a96aa',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            letterSpacing: '0.6px',
                          }}
                        >
                          {metric.label}
                        </div>
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: metric.color, letterSpacing: '-0.4px', lineHeight: 1.1 }}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* PIPELINE STATS */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 18, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: '#7a96aa',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    Pipeline
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { value: membro.pipelineStats?.negociacao ?? 0, Icon: Briefcase, title: 'Negociação', color: '#f39c12' },
                      { value: membro.pipelineStats?.agendou ?? 0, Icon: Calendar, title: 'Agendou', color: '#3498db' },
                      { value: membro.pipelineStats?.convertido ?? 0, Icon: CheckCircle, title: 'Convertido', color: '#2ecc71' },
                      { value: membro.pipelineStats?.naoAgendou ?? 0, Icon: XCircle, title: 'Não agendou', color: '#e74c3c' },
                    ].map((stage, idx) => (
                      <div
                        key={idx}
                        title={stage.title}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 3,
                          minWidth: 44,
                          padding: '4px 6px',
                          borderRadius: 8,
                          background: `${stage.color}10`,
                          border: `1px solid ${stage.color}25`,
                        }}
                      >
                        <stage.Icon size={14} style={{ color: stage.color }} />
                        <span style={{ fontWeight: 800, color: '#e8edf2', fontSize: 11 }}>{stage.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* mini trend bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 10, opacity: 0.85 }}>
                    <TrendingUp size={13} style={{ color: '#2ecc71' }} />
                    <div
                      style={{
                        fontSize: 10,
                        color: '#2ecc71',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 8,
                        background: 'rgba(46,204,113,0.12)',
                        border: '1px solid rgba(46,204,113,0.3)',
                      }}
                    >
                      +{Math.min(99, Math.round((membro.tickets || 0) / 2))}%
                    </div>
                  </div>
                </div>

                {/* AÇÕES */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '9px 14px',
                      borderRadius: 10,
                      border: '1px solid rgba(201,148,58,0.4)',
                      background: 'linear-gradient(135deg, rgba(201,148,58,0.18), rgba(201,148,58,0.08))',
                      color: '#c9943a',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                      letterSpacing: '0.3px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 18px rgba(201,148,58,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Send size={13} strokeWidth={2.4} />
                    Mensagem
                  </button>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '9px 14px',
                      borderRadius: 10,
                      border: '1px solid #2a4a63',
                      background: 'rgba(26,51,71,0.4)',
                      color: '#b0c4d4',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                      letterSpacing: '0.3px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#7a96aa';
                      e.currentTarget.style.color = '#e8edf2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#2a4a63';
                      e.currentTarget.style.color = '#b0c4d4';
                    }}
                  >
                    <Edit2 size={13} strokeWidth={2.4} />
                    Editar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* KEYFRAMES inline */}
      <style>{`
        @keyframes equipeFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes equipePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.45); }
          50% { box-shadow: 0 0 0 10px rgba(46,204,113,0); }
        }
      `}</style>

      <CreateMembroModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateMembro}
      />
    </div>
  );
}

'use client';

/**
 * Portal das IAs — Dashboard da Clínica (READ-ONLY)
 * Qualidade: Premium AAA
 *
 * A clínica visualiza todas as IAs configuradas pelo master admin
 * mas não pode editar. Cada card abre detalhes em modo somente-leitura.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Lock,
  Search,
  Sparkles,
  Activity,
  TrendingUp,
  Bot,
  CircleDollarSign,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Heart,
  BarChart3,
  X,
  Shield,
  Cpu,
  Zap,
  BookOpen,
  Globe,
  Target,
  AlertCircle,
} from 'lucide-react';
import {
  useIAsStore,
  IA,
  IAFuncao,
  IAStatus,
  FUNCAO_LABELS,
  CANAL_LABELS,
  MODO_LABELS,
  PROVIDER_LABELS,
  TOM_LABELS,
} from '@/store/iasStore';
import { useAuthStore } from '@/store/authStore';

/* ─────────────────────────────────────────────
 *  Helpers
 * ───────────────────────────────────────────── */

function getIconByName(name: string, size = 20) {
  const props = { size, strokeWidth: 2 };
  switch (name) {
    case 'MessageCircle':
      return <MessageCircle {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'BarChart3':
      return <BarChart3 {...props} />;
    default:
      return <Sparkles {...props} />;
  }
}

const STATUS_CONFIG: Record<IAStatus, { label: string; color: string; bg: string }> = {
  ativa: { label: 'Ativa', color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' },
  pausada: { label: 'Pausada', color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
  rascunho: { label: 'Preparando', color: '#8ea3b5', bg: 'rgba(142,163,181,0.10)' },
};

/* ─────────────────────────────────────────────
 *  Página
 * ───────────────────────────────────────────── */

export default function PortalIAsClinicaPage() {
  const ias = useIAsStore((s) => s.ias);
  const hydrated = useIAsStore((s) => s.hydrated);
  const hydrate = useIAsStore((s) => s.hydrate);
  const fetchBySistema = useIAsStore((s) => s.fetchBySistema);
  const usuario = useAuthStore((s) => s.usuario);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const sistemaIdUsuario = usuario?.sistemaId ?? null;

  const [busca, setBusca] = useState('');
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const [authHidratado, setAuthHidratado] = useState(false);

  useEffect(() => {
    if (!hydrated) hydrate();
    if (!usuario) hydrateAuth();
    setAuthHidratado(true);
  }, [hydrated, hydrate, usuario, hydrateAuth]);

  // Busca IAs do sistema no backend quando o usuário é conhecido
  useEffect(() => {
    if (sistemaIdUsuario) {
      fetchBySistema(sistemaIdUsuario).catch(() => {
        /* erro já capturado no store; mantém fallback local */
      });
    }
  }, [sistemaIdUsuario, fetchBySistema]);

  // Isolamento multi-tenant: só IAs da clínica do usuário logado
  const iasDaClinica = useMemo(() => {
    if (!sistemaIdUsuario) return [];
    return ias.filter((ia) => ia.sistemaId === sistemaIdUsuario);
  }, [ias, sistemaIdUsuario]);

  const filtradas = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return iasDaClinica;
    return iasDaClinica.filter(
      (ia) =>
        ia.nome.toLowerCase().includes(t) ||
        FUNCAO_LABELS[ia.funcao].label.toLowerCase().includes(t),
    );
  }, [iasDaClinica, busca]);

  const detalhe = detalheId ? iasDaClinica.find((x) => x.id === detalheId) : null;

  const kpis = useMemo(() => {
    const ativas = iasDaClinica.filter((i) => i.status === 'ativa').length;
    const interacoes = iasDaClinica.reduce((s, i) => s + i.interacoes, 0);
    const aprovacaoMedia =
      iasDaClinica.length > 0
        ? Math.round(
            iasDaClinica.reduce((s, i) => s + i.aprovacaoHumana, 0) / iasDaClinica.length,
          )
        : 0;
    return { total: iasDaClinica.length, ativas, interacoes, aprovacaoMedia };
  }, [iasDaClinica]);

  const semIAsConfiguradas = hydrated && authHidratado && iasDaClinica.length === 0;

  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2' }}>
      {/* ── HERO ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '18px',
          border: '1px solid #1e3d54',
          background:
            'linear-gradient(135deg, #0d1f2d 0%, #132636 50%, #0d1f2d 100%)',
          padding: '26px 28px',
          marginBottom: '20px',
        }}
      >
        {/* glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            opacity: 0.18,
            filter: 'blur(80px)',
            background:
              'radial-gradient(circle, rgba(201,148,58,0.55) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #c9943a, #8a6424)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px -4px rgba(201,148,58,0.6)',
                }}
              >
                <Sparkles size={13} color="#0a1520" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#c9943a',
                  textTransform: 'uppercase',
                }}
              >
                Portal das IAs · JARVIS Engine
              </span>
            </div>

            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '8px',
                margin: 0,
              }}
            >
              Suas IAs estão{' '}
              <span
                style={{
                  background: 'linear-gradient(to right, #c9943a, #e8b86d, #c9943a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                trabalhando por você
              </span>
            </h1>
            <p style={{ fontSize: '13px', color: '#8ea3b5', maxWidth: '600px', lineHeight: 1.6, marginTop: '6px' }}>
              Essas IAs foram configuradas pelo time ProClinic para trabalhar especificamente na
              sua clínica. Elas aprendem com cada conversa e ficam mais precisas a cada semana.
            </p>
          </div>

          {/* Selo de leitura */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.25)',
            }}
          >
            <Lock size={13} color="#a78bfa" />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#c7b6ff' }}>
                Modo visualização
              </div>
              <div style={{ fontSize: '10px', color: '#8ea3b5' }}>
                Edição pelo administrador
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div
          style={{
            position: 'relative',
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
        >
          <HeroKpi icon={<Bot size={14} />} label="IAs ativas" value={`${kpis.ativas}`} hint={`de ${kpis.total} configuradas`} />
          <HeroKpi icon={<Activity size={14} />} label="Conversas" value={kpis.interacoes.toLocaleString('pt-BR')} hint="últimos 30 dias" />
          <HeroKpi icon={<TrendingUp size={14} />} label="Aprovação" value={`${kpis.aprovacaoMedia}%`} hint="qualidade média" accent />
          <HeroKpi icon={<Shield size={14} />} label="Uptime" value="99.9%" hint="últimos 90 dias" />
        </div>
      </div>

      {/* ── BUSCA ── */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search
          size={15}
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a6f82' }}
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar IA por nome ou função..."
          style={{
            width: '100%',
            background: '#0f1f2e',
            border: '1px solid #1e3d54',
            borderRadius: '10px',
            padding: '10px 14px 10px 40px',
            fontSize: '13px',
            color: '#fff',
            outline: 'none',
          }}
        />
      </div>

      {/* ── GRID ── */}
      {semIAsConfiguradas ? (
        <AguardandoConfiguracao />
      ) : filtradas.length === 0 ? (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            borderRadius: '14px',
            border: '1px dashed #1e3d54',
            background: 'rgba(15,31,46,0.5)',
          }}
        >
          <Bot size={32} color="#c9943a" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Nenhuma IA encontrada</div>
          <div style={{ fontSize: '12px', color: '#7a8ea0', marginTop: '4px' }}>
            Ajuste o filtro para encontrar a IA desejada.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px',
          }}
        >
          {filtradas.map((ia) => (
            <IAReadOnlyCard key={ia.id} ia={ia} onClick={() => setDetalheId(ia.id)} />
          ))}
        </div>
      )}

      {/* Modal de detalhe */}
      {detalhe && <DetailModal ia={detalhe} onClose={() => setDetalheId(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Card read-only
 * ───────────────────────────────────────────── */

const FALLBACK_FUNCAO = { label: '—', descricao: 'Sem descrição', emoji: '🤖' };
const FALLBACK_CANAL = { label: '—', emoji: '💬' };
const FALLBACK_MODO = { label: '—', descricao: '' };
const FALLBACK_STATUS = { label: '—', color: '#8ea3b5', bg: 'rgba(142,163,181,0.10)' };
const FALLBACK_PROVIDER = { label: '—', modelos: [] as { id: string; label: string; custoRelativo: number }[] };

function IAReadOnlyCard({ ia, onClick }: { ia: IA; onClick: () => void }) {
  const funcaoInfo = FUNCAO_LABELS[ia.funcao] ?? FALLBACK_FUNCAO;
  const canalInfo = CANAL_LABELS[ia.canal] ?? FALLBACK_CANAL;
  const modoInfo = MODO_LABELS[ia.modo] ?? FALLBACK_MODO;
  const statusInfo = STATUS_CONFIG[ia.status] ?? FALLBACK_STATUS;

  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        border: 'none',
        padding: 0,
        background: 'transparent',
        width: '100%',
      }}
      className="group"
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '14px',
          border: '1px solid #132636',
          background: 'linear-gradient(135deg, #0f1f2e, #0a1520)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#1e3d54';
          e.currentTarget.style.boxShadow = `0 20px 50px -20px rgba(0,0,0,0.4)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#132636';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 18px 16px 18px', borderBottom: '1px solid #132636', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: ia.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {getIconByName(ia.avatarIcon, 20)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>{ia.nome}</h3>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: statusInfo.color,
                  background: statusInfo.bg,
                }}
              >
                {statusInfo.label}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#8ea3b5', lineHeight: 1.4 }}>
              {funcaoInfo.descricao}
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', borderBottom: '1px solid #132636' }}>
          <Metric label="Interações" value={ia.interacoes.toLocaleString('pt-BR')} />
          <Metric label="Resolução" value={`${ia.taxaResolucao}%`} />
          <Metric label="Aprovação" value={`${ia.aprovacaoHumana}%`} accent />
        </div>

        {/* Tags */}
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Tag>{canalInfo.emoji} {canalInfo.label}</Tag>
          <Tag>{modoInfo.label}</Tag>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid #132636',
            background: 'rgba(10,21,32,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#7a8ea0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Lock size={10} /> Somente visualização
          </div>
          <div style={{ color: '#c9943a', fontWeight: 600 }}>Ver detalhes →</div>
        </div>
      </div>
    </button>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '9px', letterSpacing: '0.14em', fontWeight: 700, color: '#5a6f82', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: accent ? '#c9943a' : '#fff',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: '10px',
        fontWeight: 600,
        color: '#8ea3b5',
        padding: '3px 8px',
        borderRadius: '5px',
        background: 'rgba(30,61,84,0.4)',
        border: '1px solid #132636',
      }}
    >
      {children}
    </span>
  );
}

function HeroKpi({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: '12px',
        background: 'rgba(15,31,46,0.6)',
        backdropFilter: 'blur(6px)',
        border: '1px solid #132636',
        padding: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '0.14em', fontWeight: 700, color: '#5a6f82', textTransform: 'uppercase', marginBottom: '6px' }}>
        <span style={{ color: accent ? '#c9943a' : '#5a6f82' }}>{icon}</span>
        {label}
      </div>
      <div
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: accent ? '#c9943a' : '#fff',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '10px', color: '#5a6f82', marginTop: '4px' }}>{hint}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Modal de detalhe (read-only)
 * ───────────────────────────────────────────── */

function DetailModal({ ia, onClose }: { ia: IA; onClose: () => void }) {
  const funcaoInfo = FUNCAO_LABELS[ia.funcao] ?? FALLBACK_FUNCAO;
  const canalInfo = CANAL_LABELS[ia.canal] ?? FALLBACK_CANAL;
  const modoInfo = MODO_LABELS[ia.modo] ?? FALLBACK_MODO;
  const providerInfo = PROVIDER_LABELS[ia.provider] ?? FALLBACK_PROVIDER;
  const statusInfo = STATUS_CONFIG[ia.status] ?? FALLBACK_STATUS;

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '88vh',
          background: '#0a1520',
          border: '1px solid #1e3d54',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 60px 120px -20px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'relative',
            padding: '20px 24px',
            borderBottom: '1px solid #132636',
            background: `linear-gradient(135deg, ${ia.avatarColor}15 0%, transparent 60%)`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#0f1f2e',
              border: '1px solid #132636',
              color: '#7a8ea0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={15} />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '14px',
                background: ia.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {getIconByName(ia.avatarIcon, 26)}
            </div>

            <div style={{ flex: 1, paddingRight: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>{ia.nome}</h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    color: statusInfo.color,
                    background: statusInfo.bg,
                    textTransform: 'uppercase',
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#8ea3b5' }}>
                {funcaoInfo.label} · {TOM_LABELS[ia.tom]} · {ia.idiomaPrimario}
              </div>
            </div>
          </div>
        </div>

        {/* Body scrollable */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Badge read-only */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.20)',
              marginBottom: '18px',
            }}
          >
            <Lock size={13} color="#a78bfa" />
            <div style={{ fontSize: '11px', color: '#c7b6ff', lineHeight: 1.4 }}>
              Essa IA é gerenciada pela equipe ProClinic. Para solicitar alterações, entre em contato com o suporte.
            </div>
          </div>

          {/* Seções */}
          <Section title="Objetivo" icon={<Target size={13} />}>
            <p style={{ fontSize: '12px', color: '#c9d4df', lineHeight: 1.6 }}>{ia.objetivo || 'Sem objetivo definido.'}</p>
          </Section>

          <Section title="Prompt de sistema" icon={<Sparkles size={13} />}>
            <pre
              style={{
                fontSize: '11px',
                color: '#c9d4df',
                lineHeight: 1.6,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                whiteSpace: 'pre-wrap',
                background: '#0f1f2e',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #132636',
                maxHeight: '180px',
                overflowY: 'auto',
              }}
            >
              {ia.promptSistema || '—'}
            </pre>
          </Section>

          {ia.regrasNegocio && (
            <Section title="Regras de negócio" icon={<Shield size={13} />}>
              <p style={{ fontSize: '12px', color: '#c9d4df', lineHeight: 1.6 }}>{ia.regrasNegocio}</p>
            </Section>
          )}

          {ia.limites.length > 0 && (
            <Section title="Limites éticos" icon={<AlertCircle size={13} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ia.limites.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '11px',
                      color: '#f5c6c6',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(231,76,60,0.06)',
                      border: '1px solid rgba(231,76,60,0.20)',
                    }}
                  >
                    • {l}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {ia.conhecimento.length > 0 && (
            <Section title={`Base de conhecimento (${ia.conhecimento.length})`} icon={<BookOpen size={13} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ia.conhecimento.map((k) => (
                  <div
                    key={k.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#0f1f2e',
                      border: '1px solid #132636',
                    }}
                  >
                    <BookOpen size={13} color="#c9943a" />
                    <span style={{ fontSize: '11px', color: '#c9d4df', flex: 1 }}>{k.nome}</span>
                    <span style={{ fontSize: '10px', color: '#5a6f82' }}>
                      {k.tamanhoKb}KB · {k.chunks} chunks
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {ia.links.length > 0 && (
            <Section title={`Links consultados (${ia.links.length})`} icon={<Globe size={13} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ia.links.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#0f1f2e',
                      border: '1px solid #132636',
                    }}
                  >
                    <Globe size={13} color="#3498db" />
                    <span style={{ fontSize: '11px', color: '#c9d4df', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.descricao || l.url}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: l.ativo ? '#2ecc71' : '#7a8ea0',
                        background: l.ativo ? 'rgba(46,204,113,0.12)' : 'rgba(142,163,181,0.08)',
                      }}
                    >
                      {l.ativo ? 'ATIVO' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Conexão técnica */}
          <Section title="Conexão & Modelo" icon={<Cpu size={13} />}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11px',
              }}
            >
              <KV icon={<span>{canalInfo.emoji}</span>} label="Canal" value={canalInfo.label} />
              <KV icon={<Zap size={11} />} label="Modo" value={modoInfo.label} />
              <KV icon={<Cpu size={11} />} label="Provider" value={providerInfo.label} />
              <KV icon={<Sparkles size={11} />} label="Modelo" value={ia.modelo} />
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #132636',
            background: '#081118',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(to right, #c9943a, #8a6424)',
              color: '#0a1520',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10px',
          letterSpacing: '0.14em',
          fontWeight: 700,
          color: '#7a8ea0',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        <span style={{ color: '#c9943a' }}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Estado: Aguardando configuração
 * ───────────────────────────────────────────── */

function AguardandoConfiguracao() {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '18px',
        border: '1px solid #1e3d54',
        background: 'linear-gradient(135deg, #0f1f2e 0%, #0a1520 100%)',
        padding: '56px 32px',
        textAlign: 'center',
      }}
    >
      {/* glow */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          opacity: 0.14,
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle, rgba(201,148,58,0.8) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '22px',
            margin: '0 auto 18px',
            background: 'linear-gradient(135deg, #c9943a, #8a6424)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 50px -12px rgba(201,148,58,0.55)',
          }}
        >
          <Bot size={34} color="#0a1520" strokeWidth={2.2} />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '6px',
            background: 'rgba(201,148,58,0.10)',
            border: '1px solid rgba(201,148,58,0.25)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            fontWeight: 700,
            color: '#c9943a',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <Sparkles size={11} /> Em preparação
        </div>

        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0',
            lineHeight: 1.25,
          }}
        >
          Suas IAs estão sendo{' '}
          <span
            style={{
              background: 'linear-gradient(to right, #c9943a, #e8b86d, #c9943a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            configuradas a dedo
          </span>
        </h2>

        <p
          style={{
            fontSize: '13px',
            color: '#8ea3b5',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '0 auto 22px',
          }}
        >
          O time ProClinic está personalizando IAs especialistas para o seu
          negócio — treinando cada uma com o tom, os protocolos e a base de
          conhecimento da sua clínica. Em breve elas estarão disponíveis aqui.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.22)',
            fontSize: '11px',
            color: '#c7b6ff',
          }}
        >
          <Lock size={12} color="#a78bfa" />
          Configuração gerenciada pelo administrador ProClinic
        </div>
      </div>
    </div>
  );
}

function KV({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '10px',
        background: '#0f1f2e',
        border: '1px solid #132636',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', letterSpacing: '0.14em', fontWeight: 700, color: '#5a6f82', textTransform: 'uppercase', marginBottom: '4px' }}>
        <span style={{ color: '#8ea3b5' }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{value}</div>
    </div>
  );
}

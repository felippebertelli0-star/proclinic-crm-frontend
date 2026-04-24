'use client';

/**
 * Portal das IAs — Master Admin
 * Qualidade: Premium AAA
 *
 * Página central onde o master admin cria/edita/gerencia todas as IAs
 * do ecossistema. Cada IA pode ser replicada para as clínicas.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Play,
  Pause,
  Copy,
  Settings2,
  Trash2,
  Cpu,
  Activity,
  TrendingUp,
  CircleDollarSign,
  Bot,
  Zap,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Heart,
  BarChart3,
  Building2,
  Check,
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
} from '@/store/iasStore';
import { useSistemasStore, PLANO_CONFIG } from '@/store/sistemasStore';
import { JarvisWizard } from '@/components/admin/JarvisWizard';
import { AuroraConfigModal } from '@/components/admin/AuroraConfigModal';

/* ─────────────────────────────────────────────
 *  Helpers
 * ───────────────────────────────────────────── */

function getIconByName(name: string, size = 20, color?: string) {
  const props = { size, strokeWidth: 2, color };
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

const STATUS_CONFIG: Record<IAStatus, { label: string; color: string; bg: string; dot: string }> = {
  ativa: {
    label: 'Ativa',
    color: '#2ecc71',
    bg: 'rgba(46,204,113,0.12)',
    dot: '#2ecc71',
  },
  pausada: {
    label: 'Pausada',
    color: '#f39c12',
    bg: 'rgba(243,156,18,0.12)',
    dot: '#f39c12',
  },
  rascunho: {
    label: 'Rascunho',
    color: '#8ea3b5',
    bg: 'rgba(142,163,181,0.10)',
    dot: '#8ea3b5',
  },
};

/* ─────────────────────────────────────────────
 *  Página
 * ───────────────────────────────────────────── */

export default function JarvisAdminPage() {
  const ias = useIAsStore((s) => s.ias);
  const hydrated = useIAsStore((s) => s.hydrated);
  const hydrate = useIAsStore((s) => s.hydrate);
  const criarIA = useIAsStore((s) => s.criarIA);
  const atualizarIA = useIAsStore((s) => s.atualizarIA);
  const removerIA = useIAsStore((s) => s.removerIA);
  const aplicarKitPadrao = useIAsStore((s) => s.aplicarKitPadrao);
  const fetchBySistema = useIAsStore((s) => s.fetchBySistema);
  const toggleStatus = useIAsStore((s) => s.toggleStatus);
  const duplicarIA = useIAsStore((s) => s.duplicarIA);
  const {
    clinicas,
    hydrated: sistemasHydrated,
    hydrate: hydrateSistemas,
  } = useSistemasStore();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [auroraConfig, setAuroraConfig] = useState<{ iaId: string; iaNome: string } | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroFuncao, setFiltroFuncao] = useState<IAFuncao | 'todas'>('todas');
  const [sistemaAtivo, setSistemaAtivo] = useState<string | null>(null);
  const [seletorAberto, setSeletorAberto] = useState(false);

  useEffect(() => {
    if (!hydrated) hydrate();
    if (!sistemasHydrated) hydrateSistemas();
  }, [hydrated, hydrate, sistemasHydrated, hydrateSistemas]);

  // Seleciona a primeira clínica como padrão após hidratação
  useEffect(() => {
    if (sistemasHydrated && !sistemaAtivo && clinicas.length > 0) {
      setSistemaAtivo(clinicas[0].id);
    }
  }, [sistemasHydrated, sistemaAtivo, clinicas]);

  // Carrega IAs do backend sempre que muda a clínica ativa
  useEffect(() => {
    if (sistemaAtivo) {
      fetchBySistema(sistemaAtivo).catch(() => {
        /* erro tratado no store */
      });
    }
  }, [sistemaAtivo, fetchBySistema]);

  const clinicaAtual = useMemo(
    () => clinicas.find((c) => c.id === sistemaAtivo),
    [clinicas, sistemaAtivo],
  );

  // IAs da clínica ativa (multi-tenant isolation)
  const iasDaClinica = useMemo(
    () => (sistemaAtivo ? ias.filter((ia) => ia.sistemaId === sistemaAtivo) : []),
    [ias, sistemaAtivo],
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return iasDaClinica.filter((ia) => {
      if (filtroFuncao !== 'todas' && ia.funcao !== filtroFuncao) return false;
      if (!termo) return true;
      return (
        ia.nome.toLowerCase().includes(termo) ||
        FUNCAO_LABELS[ia.funcao].label.toLowerCase().includes(termo)
      );
    });
  }, [iasDaClinica, busca, filtroFuncao]);

  const kpis = useMemo(() => {
    const ativas = iasDaClinica.filter((i) => i.status === 'ativa').length;
    const interacoes = iasDaClinica.reduce((s, i) => s + i.interacoes, 0);
    const custoTotal = iasDaClinica.reduce((s, i) => s + i.custoMensalBrl, 0);
    const aprovacaoMedia =
      iasDaClinica.length > 0
        ? Math.round(iasDaClinica.reduce((s, i) => s + i.aprovacaoHumana, 0) / iasDaClinica.length)
        : 0;
    return { total: iasDaClinica.length, ativas, interacoes, custoTotal, aprovacaoMedia };
  }, [iasDaClinica]);

  const editingIA = useMemo(
    () => (editingId ? ias.find((i) => i.id === editingId) : undefined),
    [editingId, ias],
  );

  const handleSeedKit = async () => {
    if (!sistemaAtivo || !clinicaAtual) return;
    if (
      confirm(
        `Aplicar o kit padrão de 5 IAs (Aurora, Agenda, Confirma, Nora, Insight) para "${clinicaAtual.nome}"?`,
      )
    ) {
      try {
        await aplicarKitPadrao(sistemaAtivo);
      } catch (err) {
        alert('Erro ao aplicar kit padrão. Tente novamente.');
        console.error(err);
      }
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setWizardOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setWizardOpen(true);
  };

  const handleSave = async (ia: IA) => {
    if (!sistemaAtivo) return;
    try {
      if (editingId) {
        await atualizarIA(sistemaAtivo, editingId, ia);
      } else {
        await criarIA(sistemaAtivo, { ...ia, sistemaId: sistemaAtivo });
      }
      setWizardOpen(false);
      setEditingId(null);
    } catch (err) {
      alert('Erro ao salvar IA. Tente novamente.');
      console.error(err);
    }
  };

  const handleRemover = async (id: string, nome: string) => {
    if (!sistemaAtivo) return;
    if (confirm(`Remover a IA "${nome}"? Esta ação não pode ser desfeita.`)) {
      try {
        await removerIA(sistemaAtivo, id);
      } catch (err) {
        alert('Erro ao remover IA. Tente novamente.');
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#1e3d54] bg-gradient-to-br from-[#0a1520] via-[#0f1f2e] to-[#0a1520] p-7">
        {/* Glow de fundo */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(201,148,58,0.55) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.55) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#c9943a] to-[#8a6424] flex items-center justify-center shadow-[0_4px_14px_-4px_rgba(201,148,58,0.6)]">
                <Sparkles size={13} className="text-[#0a1520]" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#c9943a] uppercase">
                Portal das IAs · JARVIS Engine
              </span>
            </div>
            <h1 className="text-[28px] font-bold text-white tracking-tight leading-[1.15] mb-2">
              Inteligência que{' '}
              <span className="bg-gradient-to-r from-[#c9943a] via-[#e8b86d] to-[#c9943a] bg-clip-text text-transparent">
                aprende, evolui e escala
              </span>{' '}
              com cada clínica.
            </h1>
            <p className="text-[13px] text-[#8ea3b5] max-w-[640px] leading-relaxed">
              Crie, edite e monitore todas as IAs do ecossistema ProClinic. Cada clínica
              tem o seu próprio conjunto — isolado, seguro e personalizado.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            {/* Seletor de clínica */}
            <ClinicaSelector
              clinicaAtual={clinicaAtual}
              clinicas={clinicas}
              isOpen={seletorAberto}
              setIsOpen={setSeletorAberto}
              onSelect={(id) => {
                setSistemaAtivo(id);
                setSeletorAberto(false);
              }}
            />

            <button
              onClick={handleOpenNew}
              disabled={!sistemaAtivo}
              className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-[12px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] font-bold text-[13px] shadow-[0_10px_28px_-8px_rgba(201,148,58,0.65)] hover:shadow-[0_14px_36px_-6px_rgba(201,148,58,0.85)] hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Plus size={16} strokeWidth={2.5} />
              Criar nova IA
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="relative mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
          <HeroKpi
            icon={<Bot size={14} />}
            label="IAs configuradas"
            value={kpis.total.toString()}
            hint={`${kpis.ativas} ativas`}
          />
          <HeroKpi
            icon={<Activity size={14} />}
            label="Interações (30d)"
            value={kpis.interacoes.toLocaleString('pt-BR')}
            hint="mensagens processadas"
          />
          <HeroKpi
            icon={<CircleDollarSign size={14} />}
            label="Custo estimado"
            value={`R$ ${kpis.custoTotal.toFixed(2)}`}
            hint="mês corrente"
            accent
          />
          <HeroKpi
            icon={<TrendingUp size={14} />}
            label="Aprovação humana"
            value={`${kpis.aprovacaoMedia}%`}
            hint="média ponderada"
          />
        </div>
      </div>

      {/* ── BARRA DE FILTRO ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6f82]"
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar IA por nome ou função..."
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[10px] bg-[#0f1f2e] border border-[#1e3d54]">
          <FilterChip
            active={filtroFuncao === 'todas'}
            onClick={() => setFiltroFuncao('todas')}
          >
            Todas
          </FilterChip>
          {(Object.keys(FUNCAO_LABELS) as IAFuncao[]).map((f) => (
            <FilterChip
              key={f}
              active={filtroFuncao === f}
              onClick={() => setFiltroFuncao(f)}
            >
              {FUNCAO_LABELS[f].label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ── GRID DE IAs ── */}
      {filtradas.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-[#1e3d54] bg-[#0f1f2e]/50 p-16 text-center">
          <div className="w-16 h-16 rounded-[14px] bg-[rgba(201,148,58,0.08)] border border-[rgba(201,148,58,0.20)] flex items-center justify-center mx-auto mb-4">
            <Bot size={26} className="text-[#c9943a]" />
          </div>
          {iasDaClinica.length === 0 && clinicaAtual ? (
            <>
              <div className="text-[15px] font-bold text-white mb-1">
                {clinicaAtual.nome} ainda não tem IAs configuradas
              </div>
              <div className="text-[12px] text-[#7a8ea0] mb-5 max-w-[420px] mx-auto leading-relaxed">
                Aplique o kit padrão (5 IAs pré-configuradas: atendimento, agendamento,
                confirmação, follow-up e relatório) ou crie uma nova IA personalizada.
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleSeedKit}
                  className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold shadow-[0_8px_24px_-8px_rgba(201,148,58,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(201,148,58,0.75)] transition-all"
                >
                  <Sparkles size={13} strokeWidth={2.5} />
                  Aplicar kit padrão (5 IAs)
                </button>
                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 px-4 py-2 rounded-[10px] border border-[#1e3d54] bg-[#0f1f2e] text-[#8ea3b5] text-[12px] font-semibold hover:text-white hover:border-[#c9943a] transition-colors"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  Criar do zero
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-[14px] font-semibold text-white mb-1">
                Nenhuma IA encontrada
              </div>
              <div className="text-[12px] text-[#7a8ea0]">
                Ajuste o filtro ou crie uma nova IA pra começar.
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map((ia) => (
            <IACard
              key={ia.id}
              ia={ia}
              onEdit={() => handleOpenEdit(ia.id)}
              onToggle={() => toggleStatus(ia.id)}
              onDuplicate={() => duplicarIA(ia.id)}
              onRemove={() => handleRemover(ia.id, ia.nome)}
              onConfigAurora={
                ia.funcao === 'atendimento'
                  ? () => setAuroraConfig({ iaId: ia.id, iaNome: ia.nome })
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* ── WIZARD ── */}
      <JarvisWizard
        isOpen={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          setEditingId(null);
        }}
        onSave={handleSave}
        initialIA={editingIA}
        sistemaId={sistemaAtivo ?? undefined}
      />

      {/* ── AURORA CONFIG (IA de Atendimento v1) ── */}
      {auroraConfig && sistemaAtivo && (
        <AuroraConfigModal
          isOpen={!!auroraConfig}
          sistemaId={sistemaAtivo}
          iaId={auroraConfig.iaId}
          iaNome={auroraConfig.iaNome}
          onClose={() => setAuroraConfig(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Sub-componentes
 * ───────────────────────────────────────────── */

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
    <div className="rounded-[12px] bg-[rgba(15,31,46,0.6)] backdrop-blur-sm border border-[#132636] p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#5a6f82] font-bold mb-1.5">
        <span className={accent ? 'text-[#c9943a]' : 'text-[#5a6f82]'}>{icon}</span>
        {label}
      </div>
      <div
        className={`text-[20px] font-bold tabular-nums leading-none ${
          accent ? 'text-[#c9943a]' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-[#5a6f82] mt-1">{hint}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-colors ${
        active
          ? 'bg-[rgba(201,148,58,0.15)] text-[#e8b86d]'
          : 'text-[#8ea3b5] hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function IACard({
  ia,
  onEdit,
  onToggle,
  onDuplicate,
  onRemove,
  onConfigAurora,
}: {
  ia: IA;
  onEdit: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onConfigAurora?: () => void;
}) {
  const funcaoInfo = FUNCAO_LABELS[ia.funcao];
  const canalInfo = CANAL_LABELS[ia.canal];
  const modoInfo = MODO_LABELS[ia.modo];
  const providerInfo = PROVIDER_LABELS[ia.provider];
  const statusInfo = STATUS_CONFIG[ia.status];

  return (
    <div className="group relative overflow-hidden rounded-[16px] border border-[#132636] bg-gradient-to-br from-[#0f1f2e] to-[#0a1520] hover:border-[#1e3d54] transition-all hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
      {/* Glow sutil no hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${ia.avatarColor}18 0%, transparent 60%)`,
        }}
      />

      {/* ── Header ── */}
      <div className="relative p-5 flex items-start gap-4 border-b border-[#132636]">
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] shrink-0"
          style={{ background: ia.avatarColor }}
        >
          {getIconByName(ia.avatarIcon, 22)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-bold text-white truncate">{ia.nome}</h3>
            <span
              className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
              style={{ color: statusInfo.color, background: statusInfo.bg }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: statusInfo.dot }}
              />
              {statusInfo.label}
            </span>
          </div>
          <div className="text-[11px] text-[#8ea3b5] leading-relaxed line-clamp-2">
            {funcaoInfo.descricao}
          </div>
        </div>
      </div>

      {/* ── Métricas ── */}
      <div className="relative px-5 py-4 grid grid-cols-3 gap-3 border-b border-[#132636]">
        <MiniMetric label="Interações" value={ia.interacoes.toLocaleString('pt-BR')} />
        <MiniMetric label="Resolução" value={`${ia.taxaResolucao}%`} />
        <MiniMetric label="Aprovação" value={`${ia.aprovacaoHumana}%`} accent />
      </div>

      {/* ── Tags técnicas ── */}
      <div className="relative px-5 py-3.5 flex items-center gap-2 flex-wrap">
        <TechTag icon={<span>{canalInfo.emoji}</span>} label={canalInfo.label} />
        <TechTag icon={<Zap size={10} />} label={modoInfo.label} />
        <TechTag icon={<Cpu size={10} />} label={providerInfo.label} />
      </div>

      {/* ── Footer / Ações ── */}
      <div className="relative px-5 py-3 border-t border-[#132636] bg-[rgba(10,21,32,0.4)] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ActionButton
            title={ia.status === 'ativa' ? 'Pausar' : 'Ativar'}
            onClick={onToggle}
            color={ia.status === 'ativa' ? '#f39c12' : '#2ecc71'}
          >
            {ia.status === 'ativa' ? <Pause size={13} /> : <Play size={13} />}
          </ActionButton>
          <ActionButton title="Duplicar" onClick={onDuplicate} color="#a78bfa">
            <Copy size={13} />
          </ActionButton>
          <ActionButton title="Remover" onClick={onRemove} color="#e74c3c">
            <Trash2 size={13} />
          </ActionButton>
        </div>

        <div className="flex items-center gap-2">
          {onConfigAurora && (
            <button
              onClick={onConfigAurora}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-[rgba(167,139,250,0.10)] border border-[rgba(167,139,250,0.30)] text-[#a78bfa] text-[11px] font-bold hover:bg-[rgba(167,139,250,0.18)] transition-all"
              title="Configurar Aurora (API key, persona, humanização, métricas)"
            >
              <Sparkles size={12} strokeWidth={2.5} />
              Aurora
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[11px] font-bold hover:shadow-[0_8px_20px_-8px_rgba(201,148,58,0.6)] transition-all"
          >
            <Settings2 size={12} strokeWidth={2.5} />
            Configurar
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.14em] font-bold text-[#5a6f82] mb-1">
        {label}
      </div>
      <div
        className={`text-[14px] font-bold tabular-nums leading-none ${
          accent ? 'text-[#c9943a]' : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TechTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8ea3b5] px-2 py-1 rounded-md bg-[rgba(30,61,84,0.4)] border border-[#132636]">
      <span className="text-[#5a6f82]">{icon}</span>
      {label}
    </div>
  );
}

function ActionButton({
  title,
  onClick,
  children,
  color,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#7a8ea0] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
      style={{ color: '#7a8ea0' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = color)}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#7a8ea0')}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
 *  ClinicaSelector — dropdown premium para escolher o tenant ativo
 * ───────────────────────────────────────────── */

function ClinicaSelector({
  clinicaAtual,
  clinicas,
  isOpen,
  setIsOpen,
  onSelect,
}: {
  clinicaAtual: { id: string; nome: string; slug: string; plano: 'starter' | 'pro' | 'enterprise'; status: 'ativo' | 'trial' | 'suspenso' } | undefined;
  clinicas: Array<{ id: string; nome: string; slug: string; plano: 'starter' | 'pro' | 'enterprise'; status: 'ativo' | 'trial' | 'suspenso' }>;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onSelect: (id: string) => void;
}) {
  // Fecha ao clicar fora
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-clinica-selector]')) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [isOpen, setIsOpen]);

  const planoAtual = clinicaAtual ? PLANO_CONFIG[clinicaAtual.plano] : null;

  return (
    <div className="relative" data-clinica-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[260px] flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] bg-[rgba(10,21,32,0.7)] border border-[#1e3d54] hover:border-[#c9943a] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#1a3347] to-[#0f1f2e] border border-[#1e3d54] flex items-center justify-center shrink-0">
          <Building2 size={14} className="text-[#c9943a]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7a8ea0] mb-0.5">
            Clínica ativa
          </div>
          <div className="text-[12px] font-bold text-white truncate">
            {clinicaAtual?.nome ?? 'Selecione uma clínica...'}
          </div>
        </div>
        {planoAtual && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
            style={{
              color: planoAtual.color,
              background: planoAtual.bg,
              border: `1px solid ${planoAtual.border}`,
            }}
          >
            {planoAtual.label}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`text-[#7a8ea0] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[320px] rounded-[12px] bg-[#0f1f2e] border border-[#1e3d54] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] overflow-hidden z-50">
          <div className="px-3.5 py-2.5 border-b border-[#1e3d54] bg-[#0a1520]">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#c9943a]">
              Selecione a clínica
            </div>
            <div className="text-[10px] text-[#7a8ea0] mt-0.5">
              Cada clínica tem suas próprias IAs isoladas
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {clinicas.map((c) => {
              const plano = PLANO_CONFIG[c.plano];
              const isActive = clinicaAtual?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left border-b border-[#132636] last:border-b-0 transition-colors ${
                    isActive
                      ? 'bg-[rgba(201,148,58,0.08)]'
                      : 'hover:bg-[rgba(255,255,255,0.02)]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#1a3347] to-[#0f1f2e] border border-[#1e3d54] flex items-center justify-center text-[11px] font-bold text-[#c9943a] shrink-0">
                    {c.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white truncate">{c.nome}</div>
                    <div className="text-[10px] text-[#7a8ea0] font-mono truncate">
                      {c.slug}.crmproclinic.com.br
                    </div>
                  </div>
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                    style={{
                      color: plano.color,
                      background: plano.bg,
                      border: `1px solid ${plano.border}`,
                    }}
                  >
                    {plano.label}
                  </span>
                  {isActive && <Check size={13} className="text-[#c9943a] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

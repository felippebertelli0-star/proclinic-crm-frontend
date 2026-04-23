'use client';

import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Building2,
  Users,
  CircleDollarSign,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

type PlanoId = 'starter' | 'pro' | 'enterprise';
type StatusId = 'ativo' | 'trial' | 'suspenso';

interface Clinica {
  id: string;
  nome: string;
  slug: string;
  plano: PlanoId;
  status: StatusId;
  usuarios: number;
  mrr: number;
  criadaEm: string;
}

const SLUGS_RESERVADOS = new Set([
  'admin',
  'api',
  'www',
  'app',
  'auth',
  'mail',
  'blog',
  'help',
  'support',
  'suporte',
  'login',
  'dashboard',
  'portal',
  'docs',
  'status',
  'dev',
  'staging',
  'test',
  'beta',
  'alpha',
  'master',
  'root',
  'system',
  'sistema',
  'cdn',
  'static',
  'assets',
]);

const CLINICAS_MOCK: Clinica[] = [
  {
    id: '1',
    nome: 'Clínica Andressa Estética',
    slug: 'andressa',
    plano: 'pro',
    status: 'ativo',
    usuarios: 12,
    mrr: 697,
    criadaEm: '12 mar 2026',
  },
  {
    id: '2',
    nome: 'Odonto Premium SP',
    slug: 'odontopremium',
    plano: 'enterprise',
    status: 'ativo',
    usuarios: 34,
    mrr: 1997,
    criadaEm: '02 fev 2026',
  },
  {
    id: '3',
    nome: 'Dermato Vida Plena',
    slug: 'vidaplena',
    plano: 'pro',
    status: 'trial',
    usuarios: 5,
    mrr: 0,
    criadaEm: '18 abr 2026',
  },
];

const planoConfig: Record<PlanoId, { label: string; color: string; bg: string; border: string }> = {
  starter: {
    label: 'Starter',
    color: '#8ea3b5',
    bg: 'rgba(142,163,181,0.10)',
    border: 'rgba(142,163,181,0.25)',
  },
  pro: {
    label: 'Pro',
    color: '#c9943a',
    bg: 'rgba(201,148,58,0.12)',
    border: 'rgba(201,148,58,0.30)',
  },
  enterprise: {
    label: 'Enterprise',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.30)',
  },
};

const statusConfig: Record<StatusId, { label: string; color: string; bg: string }> = {
  ativo: { label: 'Ativo', color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' },
  trial: { label: 'Trial', color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
  suspenso: { label: 'Suspenso', color: '#e74c3c', bg: 'rgba(231,76,60,0.12)' },
};

function normalizarSlug(valor: string): string {
  return valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

interface ValidacaoSlug {
  valido: boolean;
  motivo?: string;
}

function validarSlug(slug: string, slugsExistentes: Set<string>): ValidacaoSlug {
  if (!slug) return { valido: false, motivo: 'Informe um slug.' };
  if (slug.length < 3) return { valido: false, motivo: 'Mínimo de 3 caracteres.' };
  if (slug.length > 40) return { valido: false, motivo: 'Máximo de 40 caracteres.' };
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return { valido: false, motivo: 'Apenas letras, números e hífens.' };
  }
  if (SLUGS_RESERVADOS.has(slug)) {
    return { valido: false, motivo: 'Este slug é reservado do sistema.' };
  }
  if (slugsExistentes.has(slug)) {
    return { valido: false, motivo: 'Já existe uma clínica com esse slug.' };
  }
  return { valido: true };
}

export default function ClinicasPage() {
  const [clinicas, setClinicas] = useState<Clinica[]>(CLINICAS_MOCK);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const slugsExistentes = useMemo(
    () => new Set(clinicas.map((c) => c.slug)),
    [clinicas],
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clinicas;
    return clinicas.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.slug.toLowerCase().includes(termo),
    );
  }, [clinicas, busca]);

  const kpis = useMemo(() => {
    const total = clinicas.length;
    const ativas = clinicas.filter((c) => c.status === 'ativo').length;
    const usuariosTotais = clinicas.reduce((s, c) => s + c.usuarios, 0);
    const mrr = clinicas.reduce((s, c) => s + c.mrr, 0);
    return { total, ativas, usuariosTotais, mrr };
  }, [clinicas]);

  const handleCreate = (nova: Omit<Clinica, 'id' | 'criadaEm'>) => {
    const hoje = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setClinicas((prev) => [
      ...prev,
      {
        ...nova,
        id: String(Math.max(0, ...prev.map((c) => Number(c.id))) + 1),
        criadaEm: hoje,
      },
    ]);
    setModalAberto(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Clínicas</h1>
          <p className="text-[12px] text-[#7a8ea0] mt-0.5">
            Cadastre e gerencie os tenants do ProClinic — cada clínica tem seu próprio subdomínio.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="group flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] font-semibold text-[13px] shadow-[0_8px_24px_-8px_rgba(201,148,58,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(201,148,58,0.75)] transition-all"
        >
          <Plus size={16} strokeWidth={2.5} />
          Cadastrar clínica
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KpiCard
          icon={<Building2 size={16} />}
          label="Clínicas"
          value={kpis.total.toString()}
          hint={`${kpis.ativas} ativas`}
        />
        <KpiCard
          icon={<Users size={16} />}
          label="Usuários"
          value={kpis.usuariosTotais.toLocaleString('pt-BR')}
          hint="todas clínicas"
        />
        <KpiCard
          icon={<CircleDollarSign size={16} />}
          label="MRR agregado"
          value={`R$ ${kpis.mrr.toLocaleString('pt-BR')}`}
          hint="mensal"
          accent
        />
        <KpiCard
          icon={<Sparkles size={16} />}
          label="Trial ativos"
          value={clinicas.filter((c) => c.status === 'trial').length.toString()}
          hint="convertendo"
        />
      </div>

      {/* Busca */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6f82]"
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou slug..."
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] transition-colors"
        />
      </div>

      {/* Lista */}
      <div className="bg-[#0f1f2e] border border-[#132636] rounded-[14px] overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1.2fr_110px_120px_110px_140px_110px] gap-4 px-5 py-3 border-b border-[#132636] bg-[#0a1520]">
          <HeaderCol>Clínica</HeaderCol>
          <HeaderCol>Subdomínio</HeaderCol>
          <HeaderCol>Plano</HeaderCol>
          <HeaderCol>Status</HeaderCol>
          <HeaderCol>Usuários</HeaderCol>
          <HeaderCol>MRR</HeaderCol>
          <HeaderCol className="text-right">Ações</HeaderCol>
        </div>

        {filtradas.length === 0 ? (
          <div className="px-5 py-16 text-center text-[13px] text-[#7a8ea0]">
            Nenhuma clínica encontrada.
          </div>
        ) : (
          filtradas.map((c) => {
            const plano = planoConfig[c.plano];
            const status = statusConfig[c.status];
            const url = `https://${c.slug}.crmproclinic.com.br`;
            return (
              <div
                key={c.id}
                className="grid grid-cols-[1.6fr_1.2fr_110px_120px_110px_140px_110px] gap-4 px-5 py-4 border-b border-[#132636] last:border-b-0 items-center hover:bg-[rgba(255,255,255,0.015)] transition-colors"
              >
                {/* Nome */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1a3347] to-[#0f1f2e] border border-[#1e3d54] flex items-center justify-center text-[13px] font-bold text-[#c9943a] shrink-0">
                    {c.nome.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-white truncate">{c.nome}</div>
                    <div className="text-[10px] text-[#5a6f82]">Desde {c.criadaEm}</div>
                  </div>
                </div>

                {/* Slug */}
                <div className="flex items-center gap-1.5 text-[12px] text-[#8ea3b5] font-mono min-w-0">
                  <span className="truncate">{c.slug}</span>
                  <span className="text-[#2a3647]">.crmproclinic.com.br</span>
                </div>

                {/* Plano */}
                <div>
                  <span
                    className="inline-flex text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider"
                    style={{
                      color: plano.color,
                      background: plano.bg,
                      borderColor: plano.border,
                    }}
                  >
                    {plano.label}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md"
                    style={{ color: status.color, background: status.bg }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: status.color }}
                    />
                    {status.label}
                  </span>
                </div>

                {/* Usuários */}
                <div className="text-[13px] font-semibold text-white tabular-nums">
                  {c.usuarios}
                </div>

                {/* MRR */}
                <div className="text-[13px] font-semibold text-[#c9943a] tabular-nums">
                  R$ {c.mrr.toLocaleString('pt-BR')}
                </div>

                {/* Ações */}
                <div className="flex items-center justify-end gap-1">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    title="Abrir clínica"
                    className="p-1.5 rounded-md text-[#7a8ea0] hover:text-[#c9943a] hover:bg-[rgba(201,148,58,0.08)] transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    title="Editar"
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#8ea3b5] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalAberto && (
        <CreateClinicaModal
          slugsExistentes={slugsExistentes}
          onClose={() => setModalAberto(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

/* ============================================================
 *  KPI Card
 * ============================================================ */
function KpiCard({
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
    <div className="bg-[#0f1f2e] border border-[#132636] rounded-[12px] p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[#5a6f82] font-bold mb-2">
        <span className={accent ? 'text-[#c9943a]' : 'text-[#5a6f82]'}>{icon}</span>
        {label}
      </div>
      <div
        className={`text-[22px] font-bold tabular-nums ${
          accent ? 'text-[#c9943a]' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-[#5a6f82] mt-1">{hint}</div>
    </div>
  );
}

function HeaderCol({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[9px] font-bold tracking-[0.16em] text-[#5a6f82] uppercase ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
 *  Modal de cadastro
 * ============================================================ */
function CreateClinicaModal({
  slugsExistentes,
  onClose,
  onCreate,
}: {
  slugsExistentes: Set<string>;
  onClose: () => void;
  onCreate: (nova: Omit<Clinica, 'id' | 'criadaEm'>) => void;
}) {
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTocado, setSlugTocado] = useState(false);
  const [plano, setPlano] = useState<PlanoId>('pro');
  const [status, setStatus] = useState<StatusId>('trial');
  const [copiado, setCopiado] = useState(false);

  const slugSugerido = slugTocado ? slug : normalizarSlug(nome);
  const validacao = validarSlug(slugSugerido, slugsExistentes);
  const podeSalvar = nome.trim().length >= 3 && validacao.valido;

  const comandoVercel = `vercel domains add ${slugSugerido || 'slug'}.crmproclinic.com.br`;

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(comandoVercel);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeSalvar) return;
    onCreate({
      nome: nome.trim(),
      slug: slugSugerido,
      plano,
      status,
      usuarios: 0,
      mrr: 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-[#0f1f2e] border border-[#1e3d54] rounded-[16px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[rgba(201,148,58,0.12)] to-transparent border-b border-[#1e3d54]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#c9943a] to-[#8a6424] flex items-center justify-center">
              <Building2 size={15} className="text-[#0a1520]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-white leading-tight">Nova clínica</div>
              <div className="text-[11px] text-[#7a8ea0]">
                Cada clínica tem subdomínio dedicado
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nome */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#7a8ea0] block mb-1.5">
              Nome da clínica
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Clínica Andressa Estética"
              autoFocus
              className="w-full bg-[#0a1520] border border-[#1e3d54] rounded-[10px] px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#7a8ea0] block mb-1.5">
              Subdomínio
            </label>
            <div
              className={`flex items-stretch rounded-[10px] overflow-hidden border transition-colors ${
                slugSugerido && !validacao.valido
                  ? 'border-[#e74c3c]'
                  : validacao.valido && slugSugerido
                  ? 'border-[#2ecc71]'
                  : 'border-[#1e3d54]'
              }`}
            >
              <input
                type="text"
                value={slugSugerido}
                onChange={(e) => {
                  setSlugTocado(true);
                  setSlug(normalizarSlug(e.target.value));
                }}
                placeholder="andressa"
                className="flex-1 bg-[#0a1520] px-3.5 py-2.5 text-[13px] text-white font-mono placeholder:text-[#5a6f82] focus:outline-none"
              />
              <div className="px-3 flex items-center text-[12px] text-[#5a6f82] font-mono bg-[#081118] border-l border-[#1e3d54]">
                .crmproclinic.com.br
              </div>
            </div>
            <div className="mt-1.5 min-h-[16px] text-[11px]">
              {slugSugerido && !validacao.valido ? (
                <span className="text-[#e74c3c] flex items-center gap-1">
                  <AlertCircle size={11} /> {validacao.motivo}
                </span>
              ) : validacao.valido && slugSugerido ? (
                <span className="text-[#2ecc71] flex items-center gap-1">
                  <Check size={11} /> Disponível
                </span>
              ) : (
                <span className="text-[#5a6f82]">
                  Apenas letras, números e hífens (3–40 caracteres)
                </span>
              )}
            </div>
          </div>

          {/* Plano + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#7a8ea0] block mb-1.5">
                Plano
              </label>
              <select
                value={plano}
                onChange={(e) => setPlano(e.target.value as PlanoId)}
                className="w-full bg-[#0a1520] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#7a8ea0] block mb-1.5">
                Status inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusId)}
                className="w-full bg-[#0a1520] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
              >
                <option value="trial">Trial</option>
                <option value="ativo">Ativo</option>
                <option value="suspenso">Suspenso</option>
              </select>
            </div>
          </div>

          {/* Instrução Vercel */}
          <div className="bg-[#0a1520] border border-[#132636] rounded-[10px] p-3.5">
            <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#c9943a] mb-1.5 flex items-center gap-1.5">
              <Sparkles size={11} /> Próximo passo — Vercel
            </div>
            <p className="text-[11px] text-[#8ea3b5] leading-relaxed mb-2.5">
              Após cadastrar, registre o subdomínio na Vercel executando:
            </p>
            <div className="flex items-center gap-2 bg-[#081118] border border-[#132636] rounded-[8px] px-3 py-2">
              <code className="text-[11px] text-[#c9943a] font-mono flex-1 truncate">
                {comandoVercel}
              </code>
              <button
                type="button"
                onClick={handleCopiar}
                disabled={!slugSugerido || !validacao.valido}
                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md text-[#8ea3b5] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copiado ? <Check size={11} /> : <Copy size={11} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] text-[12px] font-semibold text-[#8ea3b5] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!podeSalvar}
              className="px-5 py-2 rounded-[10px] text-[12px] font-bold bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] shadow-[0_8px_24px_-8px_rgba(201,148,58,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(201,148,58,0.75)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cadastrar clínica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

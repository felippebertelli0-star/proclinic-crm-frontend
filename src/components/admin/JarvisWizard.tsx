'use client';

/**
 * JarvisWizard — Assistente de criação/edição de IAs (master admin)
 * Qualidade: Premium AAA
 *
 * Modal full-screen com 6 etapas:
 *   1. Identidade  2. Função  3. Prompt  4. Conhecimento  5. Links  6. Conexão
 */

import { useEffect, useMemo, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Radio,
  Target,
  Sparkles,
  BookOpen,
  Globe,
  Grid3x3,
  Plus,
  Trash2,
  Upload,
  Link2,
  FileText,
  AlertCircle,
  Cpu,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Heart,
  BarChart3,
} from 'lucide-react';
import {
  IA,
  IAFuncao,
  TomVoz,
  Canal,
  ModoOperacao,
  Provider,
  KnowledgeItem,
  LinkItem,
  FUNCAO_LABELS,
  TOM_LABELS,
  MODO_LABELS,
  CANAL_LABELS,
  PROVIDER_LABELS,
} from '@/store/iasStore';

/* ─────────────────────────────────────────────
 *  Tipos / props
 * ───────────────────────────────────────────── */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ia: IA) => void;
  initialIA?: IA; // se fornecido → modo edição
  sistemaId?: string; // tenant ativo (obrigatório ao criar nova IA)
}

interface Etapa {
  id: number;
  titulo: string;
  sub: string;
  icon: React.ReactNode;
}

const ETAPAS: Etapa[] = [
  { id: 1, titulo: 'Identidade', sub: 'Nome, voz e limites', icon: <Radio size={15} /> },
  { id: 2, titulo: 'Função', sub: 'O que ela vai fazer', icon: <Target size={15} /> },
  { id: 3, titulo: 'Prompt', sub: 'Cérebro e diretrizes', icon: <Sparkles size={15} /> },
  { id: 4, titulo: 'Conhecimento', sub: 'Base de RAG', icon: <BookOpen size={15} /> },
  { id: 5, titulo: 'Links', sub: 'Fontes externas', icon: <Globe size={15} /> },
  { id: 6, titulo: 'Conexão', sub: 'Canal e modo', icon: <Grid3x3 size={15} /> },
];

/* ─────────────────────────────────────────────
 *  Paleta de cores para avatar
 * ───────────────────────────────────────────── */

const CORES_AVATAR = [
  { color: '#c9943a', label: 'Dourado' },
  { color: '#3498db', label: 'Azul' },
  { color: '#2ecc71', label: 'Verde' },
  { color: '#e91e63', label: 'Rosa' },
  { color: '#a78bfa', label: 'Lilás' },
  { color: '#f39c12', label: 'Laranja' },
  { color: '#00bcd4', label: 'Ciano' },
  { color: '#e74c3c', label: 'Vermelho' },
];

const ICONS_POR_FUNCAO: Record<IAFuncao, string> = {
  atendimento: 'MessageCircle',
  agendamento: 'Calendar',
  confirmacao: 'CheckCircle2',
  followup: 'Heart',
  relatorio: 'BarChart3',
};

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

/* ─────────────────────────────────────────────
 *  Valor padrão ao criar uma IA do zero
 * ───────────────────────────────────────────── */

function createDefaultIA(sistemaId?: string): IA {
  const agora = new Date().toISOString();
  return {
    id: `ia-${Date.now()}`,
    sistemaId,
    nome: '',
    avatarColor: '#c9943a',
    avatarIcon: 'MessageCircle',
    tom: 'empatico',
    idiomaPrimario: 'pt-BR',
    limites: [],
    funcao: 'atendimento',
    promptSistema: '',
    objetivo: '',
    regrasNegocio: '',
    exemplos: [],
    guardrails: [],
    conhecimento: [],
    links: [],
    canal: 'whatsapp',
    modo: 'autonomo',
    provider: 'openai',
    modelo: 'gpt-4o-mini',
    temperatura: 0.7,
    maxTokens: 1024,
    status: 'rascunho',
    interacoes: 0,
    taxaResolucao: 0,
    tempoMedioResposta: 0,
    custoMensalBrl: 0,
    aprovacaoHumana: 0,
    criadaEm: agora,
    atualizadaEm: agora,
  };
}

/* ─────────────────────────────────────────────
 *  Componente principal
 * ───────────────────────────────────────────── */

export function JarvisWizard({ isOpen, onClose, onSave, initialIA, sistemaId }: Props) {
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState<IA>(() => initialIA ?? createDefaultIA(sistemaId));

  // Reset quando reabrir
  useEffect(() => {
    if (isOpen) {
      setEtapa(1);
      setForm(initialIA ?? createDefaultIA(sistemaId));
    }
  }, [isOpen, initialIA, sistemaId]);

  // ESC fecha
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* ── Validação por etapa ── */
  const podeAvancar = useMemo(() => {
    switch (etapa) {
      case 1:
        return form.nome.trim().length >= 2 && form.avatarColor && form.tom;
      case 2:
        return !!form.funcao;
      case 3:
        return form.promptSistema.trim().length >= 20 && form.objetivo.trim().length >= 10;
      case 4:
        return true; // Conhecimento é opcional
      case 5:
        return true; // Links é opcional
      case 6:
        return !!form.canal && !!form.modo && !!form.provider && !!form.modelo;
      default:
        return false;
    }
  }, [etapa, form]);

  const update = <K extends keyof IA>(key: K, value: IA[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (etapa < 6) setEtapa(etapa + 1);
  };

  const handlePrev = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const handleFinalizar = () => {
    onSave({ ...form, atualizadaEm: new Date().toISOString() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-[1100px] h-[min(92vh,820px)] bg-[#0a1520] border border-[#1e3d54] rounded-[20px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sidebar com etapas ── */}
        <aside className="w-[280px] bg-[#081118] border-r border-[#132636] p-6 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#c9943a] to-[#8a6424] flex items-center justify-center">
                <Sparkles size={14} className="text-[#0a1520]" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#c9943a] uppercase">
                Assistente de Criação
              </span>
            </div>
            <div className="text-[16px] font-bold text-white leading-tight">
              {initialIA ? 'Editar IA' : 'Nova IA'}
            </div>
            <div className="text-[11px] text-[#5a6f82] mt-0.5">
              Etapa {etapa} de {ETAPAS.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#0f1f2e] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-[#c9943a] to-[#e8b86d] transition-all duration-300"
              style={{ width: `${(etapa / ETAPAS.length) * 100}%` }}
            />
          </div>

          {/* Lista de etapas */}
          <nav className="space-y-1 flex-1">
            {ETAPAS.map((e) => {
              const ativa = e.id === etapa;
              const concluida = e.id < etapa;
              return (
                <button
                  key={e.id}
                  onClick={() => {
                    // permite voltar e ir pra frente só se já completou
                    if (e.id <= etapa) setEtapa(e.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-left ${
                    ativa
                      ? 'bg-[rgba(201,148,58,0.12)] border border-[rgba(201,148,58,0.25)]'
                      : concluida
                      ? 'hover:bg-[rgba(255,255,255,0.03)]'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={e.id > etapa}
                >
                  <div
                    className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${
                      concluida
                        ? 'bg-[#2ecc71] text-[#0a1520]'
                        : ativa
                        ? 'bg-[#c9943a] text-[#0a1520]'
                        : 'bg-[#132636] text-[#5a6f82]'
                    }`}
                  >
                    {concluida ? <Check size={13} strokeWidth={3} /> : e.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[12px] font-semibold ${
                        ativa ? 'text-white' : concluida ? 'text-[#8ea3b5]' : 'text-[#5a6f82]'
                      }`}
                    >
                      {e.titulo}
                    </div>
                    <div className="text-[10px] text-[#5a6f82] truncate">{e.sub}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Preview do avatar */}
          {form.nome && (
            <div className="mt-4 p-3 rounded-[10px] bg-[#0f1f2e] border border-[#132636]">
              <div className="text-[9px] uppercase tracking-[0.14em] font-bold text-[#5a6f82] mb-2">
                Preview
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white shrink-0"
                  style={{ background: form.avatarColor }}
                >
                  {getIconByName(form.avatarIcon, 17)}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-white truncate">
                    {form.nome || '—'}
                  </div>
                  <div className="text-[10px] text-[#5a6f82] truncate">
                    {FUNCAO_LABELS[form.funcao].label}
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Conteúdo principal ── */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="px-8 py-5 border-b border-[#132636] flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-white">
                {ETAPAS[etapa - 1].titulo}
              </h2>
              <p className="text-[12px] text-[#7a8ea0] mt-0.5">{ETAPAS[etapa - 1].sub}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-[10px] bg-[#0f1f2e] border border-[#132636] text-[#7a8ea0] hover:text-white hover:border-[#1e3d54] flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </header>

          {/* Steps */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {etapa === 1 && <StepIdentidade form={form} update={update} />}
            {etapa === 2 && <StepFuncao form={form} update={update} />}
            {etapa === 3 && <StepPrompt form={form} update={update} />}
            {etapa === 4 && <StepConhecimento form={form} update={update} />}
            {etapa === 5 && <StepLinks form={form} update={update} />}
            {etapa === 6 && <StepConexao form={form} update={update} />}
          </div>

          {/* Footer com botões */}
          <footer className="px-8 py-4 border-t border-[#132636] flex items-center justify-between bg-[#081118]">
            <button
              onClick={handlePrev}
              disabled={etapa === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold text-[#8ea3b5] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Anterior
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#5a6f82]">
                {etapa}/{ETAPAS.length}
              </span>
              {etapa < 6 ? (
                <button
                  onClick={handleNext}
                  disabled={!podeAvancar}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-[10px] text-[12px] font-bold bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] shadow-[0_8px_24px_-8px_rgba(201,148,58,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(201,148,58,0.75)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Avançar
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleFinalizar}
                  disabled={!podeAvancar}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-[10px] text-[12px] font-bold bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-[#0a1520] shadow-[0_8px_24px_-8px_rgba(46,204,113,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(46,204,113,0.75)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check size={14} strokeWidth={3} />
                  {initialIA ? 'Salvar alterações' : 'Criar IA'}
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  STEP 1 · IDENTIDADE
 * ═══════════════════════════════════════════════════════════ */

function StepIdentidade({
  form,
  update,
}: {
  form: IA;
  update: <K extends keyof IA>(key: K, value: IA[K]) => void;
}) {
  const [novoLimite, setNovoLimite] = useState('');

  return (
    <div className="space-y-5 max-w-[720px]">
      {/* Nome */}
      <Field label="Nome da IA" hint="Como ela vai se apresentar aos pacientes">
        <input
          type="text"
          value={form.nome}
          onChange={(e) => update('nome', e.target.value)}
          placeholder="Ex: Aurora, Agenda, Confirma..."
          autoFocus
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] transition-colors"
        />
      </Field>

      {/* Avatar preview + cor */}
      <Field label="Aparência" hint="Cor do avatar e ícone">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-[14px] flex items-center justify-center text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
            style={{ background: form.avatarColor }}
          >
            {getIconByName(form.avatarIcon, 26)}
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-8 gap-2">
              {CORES_AVATAR.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => update('avatarColor', c.color)}
                  title={c.label}
                  className={`w-full aspect-square rounded-[8px] transition-all ${
                    form.avatarColor === c.color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a1520] scale-105'
                      : 'hover:scale-110'
                  }`}
                  style={{ background: c.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </Field>

      {/* Tom de voz */}
      <Field label="Tom de voz" hint="Como ela se comunica">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(TOM_LABELS) as TomVoz[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update('tom', t)}
              className={`px-3.5 py-2.5 rounded-[10px] text-[12px] font-semibold text-left border transition-colors ${
                form.tom === t
                  ? 'border-[#c9943a] bg-[rgba(201,148,58,0.08)] text-white'
                  : 'border-[#1e3d54] bg-[#0f1f2e] text-[#8ea3b5] hover:border-[#2a3647] hover:text-white'
              }`}
            >
              {TOM_LABELS[t]}
            </button>
          ))}
        </div>
      </Field>

      {/* Idioma */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Idioma primário">
          <select
            value={form.idiomaPrimario}
            onChange={(e) => update('idiomaPrimario', e.target.value)}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
          >
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="en-US">🇺🇸 Inglês</option>
            <option value="es-ES">🇪🇸 Espanhol</option>
          </select>
        </Field>
        <Field label="Idioma de fallback (opcional)">
          <select
            value={form.idiomaFallback ?? ''}
            onChange={(e) => update('idiomaFallback', e.target.value || undefined)}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
          >
            <option value="">Nenhum</option>
            <option value="en-US">🇺🇸 Inglês</option>
            <option value="es-ES">🇪🇸 Espanhol</option>
          </select>
        </Field>
      </div>

      {/* Limites */}
      <Field
        label="Limites éticos"
        hint="Listas de coisas que a IA NUNCA deve fazer (regras absolutas)"
      >
        <div className="space-y-2">
          {form.limites.map((limite, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[rgba(231,76,60,0.06)] border border-[rgba(231,76,60,0.20)] text-[12px] text-[#f5c6c6]"
            >
              <AlertCircle size={13} className="shrink-0 text-[#e74c3c]" />
              <span className="flex-1">{limite}</span>
              <button
                type="button"
                onClick={() => update('limites', form.limites.filter((_, i) => i !== idx))}
                className="text-[#e74c3c] hover:text-white"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              value={novoLimite}
              onChange={(e) => setNovoLimite(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && novoLimite.trim()) {
                  e.preventDefault();
                  update('limites', [...form.limites, novoLimite.trim()]);
                  setNovoLimite('');
                }
              }}
              placeholder="Ex: Nunca fornecer diagnóstico médico"
              className="flex-1 bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[12px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a]"
            />
            <button
              type="button"
              onClick={() => {
                if (novoLimite.trim()) {
                  update('limites', [...form.limites, novoLimite.trim()]);
                  setNovoLimite('');
                }
              }}
              disabled={!novoLimite.trim()}
              className="px-3 py-2 rounded-[10px] bg-[#1e3d54] text-white text-[12px] font-semibold hover:bg-[#2a4a63] disabled:opacity-40 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </Field>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  STEP 2 · FUNÇÃO
 * ═══════════════════════════════════════════════════════════ */

function StepFuncao({
  form,
  update,
}: {
  form: IA;
  update: <K extends keyof IA>(key: K, value: IA[K]) => void;
}) {
  const funcoes = Object.keys(FUNCAO_LABELS) as IAFuncao[];

  return (
    <div className="space-y-5 max-w-[720px]">
      <p className="text-[12px] text-[#8ea3b5] leading-relaxed">
        A <strong className="text-white">função</strong> define o propósito principal da IA e
        quais ferramentas ela pode usar. Escolha a que melhor representa o trabalho dela.
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {funcoes.map((f) => {
          const info = FUNCAO_LABELS[f];
          const ativa = form.funcao === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => {
                update('funcao', f);
                update('avatarIcon', ICONS_POR_FUNCAO[f]);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[12px] border-2 transition-all text-left ${
                ativa
                  ? 'border-[#c9943a] bg-[rgba(201,148,58,0.08)]'
                  : 'border-[#1e3d54] bg-[#0f1f2e] hover:border-[#2a3647]'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center text-[20px] shrink-0 ${
                  ativa ? 'bg-[#c9943a]' : 'bg-[#132636]'
                }`}
              >
                {info.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[14px] font-bold ${ativa ? 'text-white' : 'text-[#c9d4df]'}`}
                >
                  {info.label}
                </div>
                <div className="text-[11px] text-[#8ea3b5] mt-0.5">{info.descricao}</div>
              </div>
              {ativa && (
                <div className="w-6 h-6 rounded-full bg-[#c9943a] flex items-center justify-center shrink-0">
                  <Check size={13} className="text-[#0a1520]" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  STEP 3 · PROMPT
 * ═══════════════════════════════════════════════════════════ */

function StepPrompt({
  form,
  update,
}: {
  form: IA;
  update: <K extends keyof IA>(key: K, value: IA[K]) => void;
}) {
  const [novoGuardrail, setNovoGuardrail] = useState('');

  // Estimativa simples: ~4 chars = 1 token
  const totalTokens = Math.ceil(
    (form.promptSistema.length + form.objetivo.length + form.regrasNegocio.length) / 4,
  );
  const custoEstimadoPor1k = totalTokens * 0.00015; // gpt-4o-mini input
  const custoEstimadoBrl = custoEstimadoPor1k * 5.5 * 1000; // conversão USD->BRL x por 1000 msg

  return (
    <div className="space-y-5 max-w-[780px]">
      <Field
        label="Prompt de sistema"
        hint="Instrução base que define quem a IA é. Escreva em 2ª pessoa (Você é...)."
      >
        <textarea
          value={form.promptSistema}
          onChange={(e) => update('promptSistema', e.target.value)}
          placeholder="Você é Aurora, assistente virtual da clínica. Responde com acolhimento, clareza e empatia..."
          rows={6}
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3.5 py-2.5 text-[12px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] resize-y font-mono leading-relaxed"
        />
      </Field>

      <Field label="Objetivo principal" hint="Em uma frase: qual é a missão dela?">
        <input
          type="text"
          value={form.objetivo}
          onChange={(e) => update('objetivo', e.target.value)}
          placeholder="Ex: Atender pacientes e encaminhar para agendamento ou humano"
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3.5 py-2.5 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a]"
        />
      </Field>

      <Field label="Regras de negócio" hint="Regras específicas da clínica que ela deve seguir">
        <textarea
          value={form.regrasNegocio}
          onChange={(e) => update('regrasNegocio', e.target.value)}
          placeholder="Ex: Sempre confirmar cadastro antes de informar valores. Em urgências, escalar imediatamente..."
          rows={4}
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3.5 py-2.5 text-[12px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] resize-y leading-relaxed"
        />
      </Field>

      {/* Guardrails */}
      <Field label="Guardrails" hint="Proteções técnicas (além dos limites éticos)">
        <div className="space-y-2">
          {form.guardrails.map((g, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[rgba(167,139,250,0.06)] border border-[rgba(167,139,250,0.20)] text-[12px] text-[#d9cff7]"
            >
              <Cpu size={13} className="shrink-0 text-[#a78bfa]" />
              <span className="flex-1">{g}</span>
              <button
                type="button"
                onClick={() =>
                  update(
                    'guardrails',
                    form.guardrails.filter((_, i) => i !== idx),
                  )
                }
                className="text-[#a78bfa] hover:text-white"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={novoGuardrail}
              onChange={(e) => setNovoGuardrail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && novoGuardrail.trim()) {
                  e.preventDefault();
                  update('guardrails', [...form.guardrails, novoGuardrail.trim()]);
                  setNovoGuardrail('');
                }
              }}
              placeholder="Ex: Não gerar conteúdo fora da base de conhecimento"
              className="flex-1 bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[12px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a]"
            />
            <button
              type="button"
              onClick={() => {
                if (novoGuardrail.trim()) {
                  update('guardrails', [...form.guardrails, novoGuardrail.trim()]);
                  setNovoGuardrail('');
                }
              }}
              disabled={!novoGuardrail.trim()}
              className="px-3 py-2 rounded-[10px] bg-[#1e3d54] text-white text-[12px] font-semibold hover:bg-[#2a4a63] disabled:opacity-40 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </Field>

      {/* Estatísticas do prompt */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-[12px] bg-[#0f1f2e] border border-[#132636]">
        <MiniStat label="Tokens estimados" value={totalTokens.toLocaleString('pt-BR')} />
        <MiniStat label="Tamanho" value={`${form.promptSistema.length + form.regrasNegocio.length} chars`} />
        <MiniStat
          label="Custo/1k msgs"
          value={`~R$ ${custoEstimadoBrl.toFixed(2)}`}
          accent
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  STEP 4 · CONHECIMENTO
 * ═══════════════════════════════════════════════════════════ */

function StepConhecimento({
  form,
  update,
}: {
  form: IA;
  update: <K extends keyof IA>(key: K, value: IA[K]) => void;
}) {
  const totalKb = form.conhecimento.reduce((s, i) => s + (i.tamanhoKb ?? 0), 0);
  const totalChunks = form.conhecimento.reduce((s, i) => s + (i.chunks ?? 0), 0);

  return (
    <div className="space-y-5 max-w-[780px]">
      <p className="text-[12px] text-[#8ea3b5] leading-relaxed">
        A IA vai consultar essa base de conhecimento antes de responder
        <span className="text-[#c9943a] font-semibold"> (RAG — Retrieval-Augmented Generation)</span>.
        Aceita PDF, DOCX, texto, CSV e URLs.
      </p>

      {/* Upload box */}
      <div className="rounded-[14px] border-2 border-dashed border-[#1e3d54] bg-[#0f1f2e]/50 p-8 text-center hover:border-[#c9943a] transition-colors cursor-pointer group">
        <div className="w-14 h-14 rounded-[14px] bg-[rgba(201,148,58,0.08)] border border-[rgba(201,148,58,0.20)] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
          <Upload size={22} className="text-[#c9943a]" />
        </div>
        <div className="text-[13px] font-semibold text-white mb-1">
          Arraste arquivos aqui ou clique para selecionar
        </div>
        <div className="text-[11px] text-[#7a8ea0]">
          PDF, DOCX, TXT, CSV (max 20 MB por arquivo)
        </div>
        <button
          type="button"
          onClick={() => {
            // Mock: adicionar item de exemplo pra demonstrar UI
            const novo: KnowledgeItem = {
              id: `k-${Date.now()}`,
              tipo: 'pdf',
              nome: `Documento ${form.conhecimento.length + 1}.pdf`,
              tamanhoKb: Math.floor(Math.random() * 800) + 150,
              chunks: Math.floor(Math.random() * 50) + 10,
              criadoEm: new Date().toISOString(),
            };
            update('conhecimento', [...form.conhecimento, novo]);
          }}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c9943a] hover:text-[#e8b86d]"
        >
          <Plus size={12} /> Adicionar documento de exemplo
        </button>
      </div>

      {/* Lista */}
      {form.conhecimento.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a6f82]">
              {form.conhecimento.length} arquivo(s) · {totalChunks} chunks · {totalKb} KB
            </div>
          </div>

          {form.conhecimento.map((k) => (
            <div
              key={k.id}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] bg-[#0f1f2e] border border-[#132636] hover:border-[#1e3d54] transition-colors"
            >
              <div className="w-9 h-9 rounded-[8px] bg-[rgba(201,148,58,0.08)] flex items-center justify-center shrink-0">
                <FileText size={15} className="text-[#c9943a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-white truncate">{k.nome}</div>
                <div className="text-[10px] text-[#5a6f82]">
                  {k.tipo.toUpperCase()} · {k.tamanhoKb} KB · {k.chunks} chunks
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  update(
                    'conhecimento',
                    form.conhecimento.filter((x) => x.id !== k.id),
                  )
                }
                className="p-1.5 rounded-md text-[#7a8ea0] hover:text-[#e74c3c] hover:bg-[rgba(231,76,60,0.08)] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  STEP 5 · LINKS
 * ═══════════════════════════════════════════════════════════ */

function StepLinks({
  form,
  update,
}: {
  form: IA;
  update: <K extends keyof IA>(key: K, value: IA[K]) => void;
}) {
  const [urlNovo, setUrlNovo] = useState('');
  const [descricao, setDescricao] = useState('');

  const adicionar = () => {
    if (!urlNovo.trim()) return;
    try {
      // valida URL simples
      new URL(urlNovo.trim());
    } catch {
      return;
    }
    const novo: LinkItem = {
      id: `l-${Date.now()}`,
      url: urlNovo.trim(),
      descricao: descricao.trim() || undefined,
      ativo: true,
    };
    update('links', [...form.links, novo]);
    setUrlNovo('');
    setDescricao('');
  };

  return (
    <div className="space-y-5 max-w-[780px]">
      <p className="text-[12px] text-[#8ea3b5] leading-relaxed">
        URLs que a IA pode <strong className="text-white">consultar em tempo real</strong> ao
        responder — site da clínica, agenda pública, FAQ, Instagram, etc.
      </p>

      {/* Form */}
      <div className="p-4 rounded-[12px] bg-[#0f1f2e] border border-[#132636] space-y-3">
        <div className="grid grid-cols-[1fr_280px] gap-2">
          <input
            type="url"
            value={urlNovo}
            onChange={(e) => setUrlNovo(e.target.value)}
            placeholder="https://clinicaandressa.com.br/procedimentos"
            className="bg-[#081118] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[12px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a]"
          />
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição (ex: tabela de preços)"
            className="bg-[#081118] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[12px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a]"
          />
        </div>
        <button
          type="button"
          onClick={adicionar}
          disabled={!urlNovo.trim()}
          className="w-full py-2 rounded-[10px] bg-[#c9943a] text-[#0a1520] text-[12px] font-bold hover:bg-[#e8b86d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus size={14} strokeWidth={2.5} />
          Adicionar link
        </button>
      </div>

      {/* Lista */}
      {form.links.length === 0 ? (
        <div className="text-center py-10 text-[12px] text-[#5a6f82]">
          Nenhum link ainda — a IA só vai usar o conhecimento interno.
        </div>
      ) : (
        <div className="space-y-2">
          {form.links.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] bg-[#0f1f2e] border border-[#132636]"
            >
              <div className="w-9 h-9 rounded-[8px] bg-[rgba(52,152,219,0.08)] flex items-center justify-center shrink-0">
                <Link2 size={15} className="text-[#3498db]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-white truncate">
                  {l.descricao || l.url}
                </div>
                <div className="text-[10px] text-[#5a6f82] truncate font-mono">{l.url}</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  update(
                    'links',
                    form.links.map((x) =>
                      x.id === l.id ? { ...x, ativo: !x.ativo } : x,
                    ),
                  )
                }
                className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                  l.ativo
                    ? 'bg-[rgba(46,204,113,0.12)] text-[#2ecc71]'
                    : 'bg-[rgba(142,163,181,0.08)] text-[#7a8ea0]'
                }`}
              >
                {l.ativo ? 'ATIVO' : 'INATIVO'}
              </button>
              <button
                type="button"
                onClick={() =>
                  update(
                    'links',
                    form.links.filter((x) => x.id !== l.id),
                  )
                }
                className="p-1.5 rounded-md text-[#7a8ea0] hover:text-[#e74c3c] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  STEP 6 · CONEXÃO
 * ═══════════════════════════════════════════════════════════ */

function StepConexao({
  form,
  update,
}: {
  form: IA;
  update: <K extends keyof IA>(key: K, value: IA[K]) => void;
}) {
  const canais = Object.keys(CANAL_LABELS) as Canal[];
  const modos = Object.keys(MODO_LABELS) as ModoOperacao[];
  const providers = Object.keys(PROVIDER_LABELS) as Provider[];
  const modelosDoProvider = PROVIDER_LABELS[form.provider].modelos;

  return (
    <div className="space-y-5 max-w-[780px]">
      {/* Canal */}
      <Field label="Canal" hint="Onde a IA vai conversar com os pacientes">
        <div className="grid grid-cols-2 gap-2">
          {canais.map((c) => {
            const info = CANAL_LABELS[c];
            const ativo = form.canal === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => update('canal', c)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] border text-left transition-colors ${
                  ativo
                    ? 'border-[#c9943a] bg-[rgba(201,148,58,0.08)]'
                    : 'border-[#1e3d54] bg-[#0f1f2e] hover:border-[#2a3647]'
                }`}
              >
                <div className="text-[20px]">{info.emoji}</div>
                <div className="flex-1">
                  <div className={`text-[13px] font-semibold ${ativo ? 'text-white' : 'text-[#c9d4df]'}`}>
                    {info.label}
                  </div>
                </div>
                {ativo && <Check size={14} className="text-[#c9943a]" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Modo */}
      <Field label="Modo de operação">
        <div className="space-y-2">
          {modos.map((m) => {
            const info = MODO_LABELS[m];
            const ativo = form.modo === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => update('modo', m)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[10px] border text-left transition-colors ${
                  ativo
                    ? 'border-[#c9943a] bg-[rgba(201,148,58,0.08)]'
                    : 'border-[#1e3d54] bg-[#0f1f2e] hover:border-[#2a3647]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    ativo ? 'border-[#c9943a]' : 'border-[#1e3d54]'
                  }`}
                >
                  {ativo && <div className="w-2.5 h-2.5 rounded-full bg-[#c9943a]" />}
                </div>
                <div className="flex-1">
                  <div className={`text-[13px] font-semibold ${ativo ? 'text-white' : 'text-[#c9d4df]'}`}>
                    {info.label}
                  </div>
                  <div className="text-[11px] text-[#8ea3b5] mt-0.5">{info.descricao}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Provider + Modelo */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Provider LLM">
          <select
            value={form.provider}
            onChange={(e) => {
              const p = e.target.value as Provider;
              update('provider', p);
              update('modelo', PROVIDER_LABELS[p].modelos[0].id);
            }}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
          >
            {providers.map((p) => (
              <option key={p} value={p}>
                {PROVIDER_LABELS[p].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Modelo">
          <select
            value={form.modelo}
            onChange={(e) => update('modelo', e.target.value)}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
          >
            {modelosDoProvider.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Temperatura + max tokens */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label={`Temperatura: ${form.temperatura.toFixed(2)}`}
          hint="0 = preciso e determinístico · 2 = criativo e imprevisível"
        >
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={form.temperatura}
            onChange={(e) => update('temperatura', Number(e.target.value))}
            className="w-full accent-[#c9943a]"
          />
        </Field>

        <Field label="Máximo de tokens por resposta">
          <input
            type="number"
            min={128}
            max={4096}
            step={128}
            value={form.maxTokens}
            onChange={(e) => update('maxTokens', Number(e.target.value))}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
          />
        </Field>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 *  Helpers visuais
 * ═══════════════════════════════════════════════════════════ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a8ea0] mb-1.5">
        {label}
      </div>
      {children}
      {hint && <div className="text-[11px] text-[#5a6f82] mt-1.5">{hint}</div>}
    </div>
  );
}

function MiniStat({
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
      <div className={`text-[14px] font-bold tabular-nums ${accent ? 'text-[#c9943a]' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

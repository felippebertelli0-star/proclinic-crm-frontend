/**
 * Store de IAs - Portal das IAs (master admin + leitura clínica)
 * Qualidade: Premium AAA
 *
 * Fonte única de verdade para todas as IAs configuradas pelo master admin.
 * Multi-tenant ready: cada IA tem sistemaId; queries filtram por tenant.
 */

import { create } from 'zustand';
import {
  listarIAs,
  criarIA as apiCriarIA,
  atualizarIA as apiAtualizarIA,
  removerIA as apiRemoverIA,
  aplicarKitPadrao as apiAplicarKitPadrao,
  isMockToken,
} from '@/lib/iasApi';

/* ─────────────────────────────────────────────
 *  Tipos
 * ───────────────────────────────────────────── */

export type IAFuncao =
  | 'atendimento'
  | 'agendamento'
  | 'confirmacao'
  | 'followup'
  | 'relatorio';

export type IAStatus = 'ativa' | 'pausada' | 'rascunho';

export type TomVoz = 'formal' | 'empatico' | 'direto' | 'proximo';

export type Canal = 'whatsapp' | 'instagram' | 'webchat' | 'email';

export type ModoOperacao = 'autonomo' | 'copiloto' | 'hibrido';

export type Provider = 'openai' | 'anthropic';

export interface KnowledgeItem {
  id: string;
  tipo: 'pdf' | 'texto' | 'csv' | 'docx' | 'url';
  nome: string;
  tamanhoKb?: number;
  chunks?: number;
  criadoEm: string;
}

export interface LinkItem {
  id: string;
  url: string;
  descricao?: string;
  ativo: boolean;
}

export interface IA {
  id: string;
  sistemaId?: string; // null = template global | preenchido = instância da clínica

  // ── Etapa 1: Identidade ──
  nome: string;
  avatarColor: string;
  avatarIcon: string; // nome do icon (lucide) ou inicial
  tom: TomVoz;
  idiomaPrimario: string; // "pt-BR", "en-US"
  idiomaFallback?: string;
  limites: string[]; // "nunca falar de concorrentes", "não prometer cura", etc.

  // ── Etapa 2: Função ──
  funcao: IAFuncao;

  // ── Etapa 3: Prompt ──
  promptSistema: string;
  objetivo: string;
  regrasNegocio: string;
  exemplos: Array<{ usuario: string; resposta: string }>;
  guardrails: string[];

  // ── Etapa 4: Conhecimento (RAG) ──
  conhecimento: KnowledgeItem[];

  // ── Etapa 5: Links / Ações ──
  links: LinkItem[];

  // ── Etapa 6: Conexão ──
  canal: Canal;
  conexaoId?: string; // referência à Conexao (WhatsApp instance)
  modo: ModoOperacao;

  // ── Configuração técnica (master admin) ──
  provider: Provider;
  modelo: string; // "gpt-4o-mini" | "claude-sonnet-4-6" etc.
  temperatura: number; // 0 - 2
  maxTokens: number;

  // ── Métricas (read-only, alimentadas pelo backend/runtime) ──
  status: IAStatus;
  interacoes: number; // total de conversas
  taxaResolucao: number; // 0-100 (%)
  tempoMedioResposta: number; // em segundos
  custoMensalBrl: number;
  aprovacaoHumana: number; // 0-100 (% de thumbs up da secretária)

  // ── Metadata ──
  criadaEm: string;
  atualizadaEm: string;
}

/* ─────────────────────────────────────────────
 *  Valores iniciais (5 IAs que o Felippe definiu)
 * ───────────────────────────────────────────── */

const AGORA = new Date().toISOString();

/**
 * Helper: cria o kit padrão de 5 IAs para uma clínica recém-cadastrada.
 * Usa apenas os 5 templates canônicos (Aurora, Agenda, Confirma, Nora, Insight)
 * — nunca as IAs demo/experimentais de outras clínicas.
 * Cada clínica tem sua própria instância isolada com sistemaId preenchido.
 */
export function criarKitPadraoIAs(sistemaId: string): IA[] {
  const FUNCOES_KIT: IAFuncao[] = [
    'atendimento',
    'agendamento',
    'confirmacao',
    'followup',
    'relatorio',
  ];
  // Pega o primeiro template canônico de cada função a partir da clínica 1
  const templates = FUNCOES_KIT.map((funcao) =>
    IAS_INICIAIS.find((ia) => ia.sistemaId === '1' && ia.funcao === funcao),
  ).filter((ia): ia is IA => Boolean(ia));

  return templates.map((template) => ({
    ...template,
    id: `ia-${template.funcao}-${sistemaId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sistemaId,
    status: 'rascunho' as IAStatus,
    interacoes: 0,
    taxaResolucao: 0,
    aprovacaoHumana: 0,
    custoMensal: 0,
    criadaEm: new Date().toISOString(),
    atualizadaEm: new Date().toISOString(),
  }));
}

const IAS_INICIAIS: IA[] = [
  {
    id: 'ia-atendimento-01',
    sistemaId: '1',
    nome: 'Aurora',
    avatarColor: '#c9943a',
    avatarIcon: 'MessageCircle',
    tom: 'empatico',
    idiomaPrimario: 'pt-BR',
    limites: [
      'Nunca fornecer diagnósticos médicos',
      'Não prometer resultados de tratamento',
      'Sempre escalar para humano em caso de dúvida grave',
    ],
    funcao: 'atendimento',
    promptSistema:
      'Você é Aurora, assistente virtual de atendimento ao paciente. Responde com acolhimento, clareza e empatia. Encaminha perguntas médicas para o profissional adequado.',
    objetivo:
      'Atender pacientes, responder dúvidas sobre procedimentos e encaminhar para agendamento ou humano.',
    regrasNegocio:
      'Sempre confirmar se o paciente tem cadastro antes de enviar valores. Em caso de urgência, escalar imediatamente.',
    exemplos: [],
    guardrails: ['Não prescrever medicamentos', 'Não opinar sobre outros profissionais'],
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
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
  {
    id: 'ia-agendamento-01',
    sistemaId: '1',
    nome: 'Agenda',
    avatarColor: '#3498db',
    avatarIcon: 'Calendar',
    tom: 'direto',
    idiomaPrimario: 'pt-BR',
    limites: ['Nunca reservar sem confirmar disponibilidade real', 'Não remarcar sem autorização'],
    funcao: 'agendamento',
    promptSistema:
      'Você é Agenda, especialista em marcar consultas. Seja direta, ofereça horários claros e confirme explicitamente cada reserva.',
    objetivo: 'Marcar, remarcar e cancelar consultas com eficiência e zero conflitos.',
    regrasNegocio:
      'Sempre verificar conflitos. Respeitar blocos bloqueados. Confirmar dados de contato antes de finalizar.',
    exemplos: [],
    guardrails: ['Nunca criar agendamento duplicado', 'Não aceitar horários fora do expediente'],
    conhecimento: [],
    links: [],
    canal: 'whatsapp',
    modo: 'autonomo',
    provider: 'openai',
    modelo: 'gpt-4o',
    temperatura: 0.3,
    maxTokens: 1024,
    status: 'rascunho',
    interacoes: 0,
    taxaResolucao: 0,
    tempoMedioResposta: 0,
    custoMensalBrl: 0,
    aprovacaoHumana: 0,
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
  {
    id: 'ia-confirmacao-01',
    sistemaId: '1',
    nome: 'Confirma',
    avatarColor: '#2ecc71',
    avatarIcon: 'CheckCircle2',
    tom: 'direto',
    idiomaPrimario: 'pt-BR',
    limites: ['Respeitar horário comercial para disparos'],
    funcao: 'confirmacao',
    promptSistema:
      'Você é Confirma, responsável por confirmar consultas marcadas. Seja concisa, cordial e ofereça reagendamento fácil em caso de conflito.',
    objetivo: 'Reduzir no-show confirmando consultas 24h antes via template oficial.',
    regrasNegocio:
      'Disparar sempre 24h antes. Se paciente não confirmar em 2h, escalar para secretária.',
    exemplos: [],
    guardrails: ['Nunca confirmar em nome do paciente', 'Respeitar opt-out'],
    conhecimento: [],
    links: [],
    canal: 'whatsapp',
    modo: 'autonomo',
    provider: 'openai',
    modelo: 'gpt-4o-mini',
    temperatura: 0.2,
    maxTokens: 512,
    status: 'rascunho',
    interacoes: 0,
    taxaResolucao: 0,
    tempoMedioResposta: 0,
    custoMensalBrl: 0,
    aprovacaoHumana: 0,
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
  {
    id: 'ia-followup-01',
    sistemaId: '1',
    nome: 'Nora',
    avatarColor: '#e91e63',
    avatarIcon: 'Heart',
    tom: 'proximo',
    idiomaPrimario: 'pt-BR',
    limites: ['Não insistir após recusa explícita', 'Máximo 3 tentativas por lead'],
    funcao: 'followup',
    promptSistema:
      'Você é Nora, especialista em follow-up. Recupera leads frios e pós-consulta com abordagem humana e personalizada.',
    objetivo: 'Reativar leads inativos, pós-consulta e pacientes em recorrência.',
    regrasNegocio:
      'Segmentar por estágio do funil. Personalizar com base no histórico. Nunca parecer spam.',
    exemplos: [],
    guardrails: ['Não mencionar dados sensíveis sem autorização', 'Respeitar LGPD sempre'],
    conhecimento: [],
    links: [],
    canal: 'whatsapp',
    modo: 'hibrido',
    provider: 'openai',
    modelo: 'gpt-4o-mini',
    temperatura: 0.8,
    maxTokens: 1024,
    status: 'rascunho',
    interacoes: 0,
    taxaResolucao: 0,
    tempoMedioResposta: 0,
    custoMensalBrl: 0,
    aprovacaoHumana: 0,
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
  // ── Clínica 2: Odonto Premium SP (demonstração de isolamento multi-tenant) ──
  {
    id: 'ia-atendimento-02',
    sistemaId: '2',
    nome: 'Sophia',
    avatarColor: '#3498db',
    avatarIcon: 'MessageCircle',
    tom: 'formal',
    idiomaPrimario: 'pt-BR',
    limites: ['Nunca falar de cirurgias sem consulta presencial'],
    funcao: 'atendimento',
    promptSistema:
      'Você é Sophia, recepcionista virtual da Odonto Premium SP. Comunicação formal, institucional e acolhedora. Encaminha dúvidas clínicas ao dentista.',
    objetivo: 'Atender pacientes corporativos e triagem de primeiro contato.',
    regrasNegocio: 'Sempre identificar plano dental. Valorizar atendimento executivo.',
    exemplos: [],
    guardrails: ['Não orçar sem avaliação'],
    conhecimento: [],
    links: [],
    canal: 'whatsapp',
    modo: 'autonomo',
    provider: 'openai',
    modelo: 'gpt-4o-mini',
    temperatura: 0.5,
    maxTokens: 1024,
    status: 'ativa',
    interacoes: 142,
    taxaResolucao: 78,
    tempoMedioResposta: 3,
    custoMensalBrl: 24.8,
    aprovacaoHumana: 92,
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
  {
    id: 'ia-agendamento-02',
    sistemaId: '2',
    nome: 'Marcos',
    avatarColor: '#a78bfa',
    avatarIcon: 'Calendar',
    tom: 'direto',
    idiomaPrimario: 'pt-BR',
    limites: ['Respeitar horário de almoço dos dentistas'],
    funcao: 'agendamento',
    promptSistema:
      'Você é Marcos, agendador da Odonto Premium SP. Direto, oferece horários executivos (antes das 9h ou após 18h) para clientes corporativos.',
    objetivo: 'Marcar consultas odontológicas com prioridade em horários estendidos.',
    regrasNegocio: 'Respeitar blocos bloqueados. Confirmar convênio antes.',
    exemplos: [],
    guardrails: ['Nunca agendar fora do expediente'],
    conhecimento: [],
    links: [],
    canal: 'whatsapp',
    modo: 'autonomo',
    provider: 'openai',
    modelo: 'gpt-4o',
    temperatura: 0.2,
    maxTokens: 1024,
    status: 'ativa',
    interacoes: 89,
    taxaResolucao: 85,
    tempoMedioResposta: 2,
    custoMensalBrl: 41.2,
    aprovacaoHumana: 88,
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
  {
    id: 'ia-relatorio-01',
    sistemaId: '1',
    nome: 'Insight',
    avatarColor: '#a78bfa',
    avatarIcon: 'BarChart3',
    tom: 'formal',
    idiomaPrimario: 'pt-BR',
    limites: ['Nunca expor dados de outros tenants', 'Apenas queries read-only'],
    funcao: 'relatorio',
    promptSistema:
      'Você é Insight, analista de dados da clínica. Entrega relatórios claros, com gráficos e conclusões acionáveis.',
    objetivo:
      'Gerar relatórios gerenciais (financeiro, agendamentos, conversão) sob demanda.',
    regrasNegocio:
      'Sempre validar período. Arredondar valores monetários em R$. Gráficos em PNG ou PDF.',
    exemplos: [],
    guardrails: ['Não gerar dados inexistentes', 'Sempre citar fonte (tabela)'],
    conhecimento: [],
    links: [],
    canal: 'webchat',
    modo: 'copiloto',
    provider: 'openai',
    modelo: 'gpt-4o',
    temperatura: 0.2,
    maxTokens: 2048,
    status: 'rascunho',
    interacoes: 0,
    taxaResolucao: 0,
    tempoMedioResposta: 0,
    custoMensalBrl: 0,
    aprovacaoHumana: 0,
    criadaEm: AGORA,
    atualizadaEm: AGORA,
  },
];

/* ─────────────────────────────────────────────
 *  Store
 * ───────────────────────────────────────────── */

const STORAGE_KEY = 'proclinic_ias';

interface IAsStore {
  ias: IA[];
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  /** Rastreia por sistemaId se já buscamos do backend (evita refetch desnecessário) */
  fetchedSistemas: Record<string, number>;

  hydrate: () => void;
  setIAs: (ias: IA[]) => void;
  addIA: (ia: IA) => void;
  updateIA: (id: string, partial: Partial<IA>) => void;
  removeIA: (id: string) => void;
  getById: (id: string) => IA | undefined;
  getByFuncao: (funcao: IAFuncao) => IA[];
  getBySistema: (sistemaId: string) => IA[];

  // Ações específicas
  toggleStatus: (id: string) => void;
  duplicarIA: (id: string) => void;
  seedKitPadrao: (sistemaId: string) => void;

  // API-backed
  fetchBySistema: (sistemaId: string, opts?: { force?: boolean }) => Promise<IA[]>;
  criarIA: (sistemaId: string, ia: Partial<IA>) => Promise<IA>;
  atualizarIA: (sistemaId: string, iaId: string, patch: Partial<IA>) => Promise<IA>;
  removerIA: (sistemaId: string, iaId: string) => Promise<void>;
  aplicarKitPadrao: (sistemaId: string) => Promise<IA[]>;
}

function saveToStorage(ias: IA[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ias));
  } catch (err) {
    console.error('Erro ao salvar iasStore:', err);
  }
}

export const useIAsStore = create<IAsStore>((set, get) => ({
  ias: IAS_INICIAIS,
  hydrated: false,
  loading: false,
  error: null,
  fetchedSistemas: {},

  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as IA[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ ias: parsed, hydrated: true });
          return;
        }
      }
      set({ hydrated: true });
    } catch (err) {
      console.error('Erro ao hidratar iasStore:', err);
      set({ hydrated: true });
    }
  },

  setIAs: (ias) => {
    set({ ias });
    saveToStorage(ias);
  },

  addIA: (ia) => {
    const next = [...get().ias, ia];
    set({ ias: next });
    saveToStorage(next);
  },

  updateIA: (id, partial) => {
    const next = get().ias.map((ia) =>
      ia.id === id ? { ...ia, ...partial, atualizadaEm: new Date().toISOString() } : ia,
    );
    set({ ias: next });
    saveToStorage(next);
  },

  removeIA: (id) => {
    const next = get().ias.filter((ia) => ia.id !== id);
    set({ ias: next });
    saveToStorage(next);
  },

  getById: (id) => get().ias.find((ia) => ia.id === id),

  getByFuncao: (funcao) => get().ias.filter((ia) => ia.funcao === funcao),

  getBySistema: (sistemaId) => get().ias.filter((ia) => ia.sistemaId === sistemaId),

  seedKitPadrao: (sistemaId) => {
    // Evita duplicação se a clínica já tem IAs
    const jaExiste = get().ias.some((ia) => ia.sistemaId === sistemaId);
    if (jaExiste) return;
    const kit = criarKitPadraoIAs(sistemaId);
    const next = [...get().ias, ...kit];
    set({ ias: next });
    saveToStorage(next);
  },

  toggleStatus: (id) => {
    const ia = get().ias.find((x) => x.id === id);
    if (!ia) return;
    const novoStatus: IAStatus = ia.status === 'ativa' ? 'pausada' : 'ativa';
    get().updateIA(id, { status: novoStatus });
  },

  duplicarIA: (id) => {
    const original = get().ias.find((x) => x.id === id);
    if (!original) return;
    const copia: IA = {
      ...original,
      id: `ia-${Date.now()}`,
      nome: `${original.nome} (cópia)`,
      status: 'rascunho',
      interacoes: 0,
      taxaResolucao: 0,
      custoMensalBrl: 0,
      aprovacaoHumana: 0,
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
    };
    const next = [...get().ias, copia];
    set({ ias: next });
    saveToStorage(next);
  },

  // ──────────────────────────────────────────────────────────────
  // API-backed actions (produção multi-tenant)
  // ──────────────────────────────────────────────────────────────

  fetchBySistema: async (sistemaId, opts) => {
    if (!sistemaId) return [];
    // Ambiente mock/demo: não chamar backend
    if (isMockToken()) {
      return get().ias.filter((ia) => ia.sistemaId === sistemaId);
    }
    // Cache leve de 15s — evita chamadas duplicadas por re-renderizações
    const ts = get().fetchedSistemas[sistemaId];
    if (!opts?.force && ts && Date.now() - ts < 15000) {
      return get().ias.filter((ia) => ia.sistemaId === sistemaId);
    }

    set({ loading: true, error: null });
    try {
      const remotas = await listarIAs(sistemaId);
      // Merge: remove as antigas deste sistema e adiciona as novas
      const outrasClinicas = get().ias.filter((ia) => ia.sistemaId !== sistemaId);
      const next = [...outrasClinicas, ...remotas];
      set({
        ias: next,
        loading: false,
        fetchedSistemas: { ...get().fetchedSistemas, [sistemaId]: Date.now() },
      });
      saveToStorage(next);
      return remotas;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao carregar IAs';
      set({ loading: false, error: msg });
      // Fallback: retorna o que já temos em cache local
      return get().ias.filter((ia) => ia.sistemaId === sistemaId);
    }
  },

  criarIA: async (sistemaId, ia) => {
    if (isMockToken()) {
      const local: IA = {
        id: `ia-${Date.now()}`,
        sistemaId,
        nome: ia.nome ?? 'Nova IA',
        avatarColor: ia.avatarColor ?? '#c9943a',
        avatarIcon: ia.avatarIcon ?? 'Sparkles',
        tom: (ia.tom as TomVoz) ?? 'formal',
        idiomaPrimario: ia.idiomaPrimario ?? 'pt-BR',
        idiomaFallback: ia.idiomaFallback,
        limites: ia.limites ?? [],
        funcao: (ia.funcao as IAFuncao) ?? 'atendimento',
        promptSistema: ia.promptSistema ?? '',
        objetivo: ia.objetivo ?? '',
        regrasNegocio: ia.regrasNegocio ?? '',
        exemplos: ia.exemplos ?? [],
        guardrails: ia.guardrails ?? [],
        conhecimento: ia.conhecimento ?? [],
        links: ia.links ?? [],
        canal: (ia.canal as Canal) ?? 'whatsapp',
        conexaoId: ia.conexaoId,
        modo: (ia.modo as ModoOperacao) ?? 'autonomo',
        provider: (ia.provider as Provider) ?? 'openai',
        modelo: ia.modelo ?? 'gpt-4o-mini',
        temperatura: ia.temperatura ?? 0.7,
        maxTokens: ia.maxTokens ?? 1024,
        status: (ia.status as IAStatus) ?? 'rascunho',
        interacoes: 0,
        taxaResolucao: 0,
        tempoMedioResposta: 0,
        custoMensalBrl: 0,
        aprovacaoHumana: 0,
        criadaEm: new Date().toISOString(),
        atualizadaEm: new Date().toISOString(),
      };
      const next = [...get().ias, local];
      set({ ias: next });
      saveToStorage(next);
      return local;
    }

    const criada = await apiCriarIA(sistemaId, ia);
    const next = [...get().ias, criada];
    set({ ias: next });
    saveToStorage(next);
    return criada;
  },

  atualizarIA: async (sistemaId, iaId, patch) => {
    if (isMockToken()) {
      const atualEm = new Date().toISOString();
      let atualizada: IA | undefined;
      const next = get().ias.map((ia) => {
        if (ia.id !== iaId) return ia;
        atualizada = { ...ia, ...patch, atualizadaEm: atualEm };
        return atualizada;
      });
      set({ ias: next });
      saveToStorage(next);
      return (
        atualizada ??
        (get().ias.find((ia) => ia.id === iaId) as IA)
      );
    }

    const remota = await apiAtualizarIA(sistemaId, iaId, patch);
    const next = get().ias.map((ia) => (ia.id === iaId ? remota : ia));
    set({ ias: next });
    saveToStorage(next);
    return remota;
  },

  removerIA: async (sistemaId, iaId) => {
    if (!isMockToken()) {
      await apiRemoverIA(sistemaId, iaId);
    }
    const next = get().ias.filter((ia) => ia.id !== iaId);
    set({ ias: next });
    saveToStorage(next);
  },

  aplicarKitPadrao: async (sistemaId) => {
    if (isMockToken()) {
      // reutiliza o comportamento local
      const jaExiste = get().ias.some((ia) => ia.sistemaId === sistemaId);
      if (jaExiste) {
        return get().ias.filter((ia) => ia.sistemaId === sistemaId);
      }
      const kit = criarKitPadraoIAs(sistemaId);
      const next = [...get().ias, ...kit];
      set({ ias: next });
      saveToStorage(next);
      return kit;
    }

    const criadas = await apiAplicarKitPadrao(sistemaId);
    // refaz merge completo para refletir estado do backend
    const outrasClinicas = get().ias.filter((ia) => ia.sistemaId !== sistemaId);
    const atuaisDaClinica = get().ias.filter((ia) => ia.sistemaId === sistemaId);
    const next = [...outrasClinicas, ...atuaisDaClinica, ...criadas];
    set({ ias: next });
    saveToStorage(next);
    return criadas;
  },
}));

/* ─────────────────────────────────────────────
 *  Helpers / labels
 * ───────────────────────────────────────────── */

export const FUNCAO_LABELS: Record<IAFuncao, { label: string; descricao: string; emoji: string }> = {
  atendimento: {
    label: 'Atendimento',
    descricao: 'Responde dúvidas e acolhe pacientes no primeiro contato',
    emoji: '💬',
  },
  agendamento: {
    label: 'Agendamento',
    descricao: 'Marca, remarca e cancela consultas com zero conflito',
    emoji: '📅',
  },
  confirmacao: {
    label: 'Confirmação',
    descricao: 'Reduz faltas confirmando consultas 24h antes',
    emoji: '✅',
  },
  followup: {
    label: 'Follow-up',
    descricao: 'Recupera leads frios e reativa pós-consulta',
    emoji: '💝',
  },
  relatorio: {
    label: 'Relatório',
    descricao: 'Gera relatórios gerenciais sob demanda',
    emoji: '📊',
  },
};

export const TOM_LABELS: Record<TomVoz, string> = {
  formal: 'Formal e institucional',
  empatico: 'Empático e acolhedor',
  direto: 'Direto e objetivo',
  proximo: 'Próximo e amigável',
};

export const MODO_LABELS: Record<ModoOperacao, { label: string; descricao: string }> = {
  autonomo: {
    label: 'Autônomo',
    descricao: 'IA responde sozinha sem intervenção humana',
  },
  copiloto: {
    label: 'Copiloto',
    descricao: 'IA sugere resposta; secretária aprova antes de enviar',
  },
  hibrido: {
    label: 'Híbrido',
    descricao: 'Autônomo em casos simples, escala em casos complexos',
  },
};

export const CANAL_LABELS: Record<Canal, { label: string; emoji: string }> = {
  whatsapp: { label: 'WhatsApp', emoji: '💚' },
  instagram: { label: 'Instagram DM', emoji: '📸' },
  webchat: { label: 'Chat no site', emoji: '🌐' },
  email: { label: 'E-mail', emoji: '📧' },
};

export const PROVIDER_LABELS: Record<Provider, { label: string; modelos: { id: string; label: string; custoRelativo: number }[] }> = {
  openai: {
    label: 'OpenAI',
    modelos: [
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (rápido e barato)', custoRelativo: 1 },
      { id: 'gpt-4o', label: 'GPT-4o (máxima qualidade)', custoRelativo: 17 },
    ],
  },
  anthropic: {
    label: 'Anthropic (Claude)',
    modelos: [
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rápido)', custoRelativo: 7 },
      { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (equilibrado)', custoRelativo: 20 },
      { id: 'claude-opus-4-6', label: 'Claude Opus 4.6 (máximo)', custoRelativo: 100 },
    ],
  },
};

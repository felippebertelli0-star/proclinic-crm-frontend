/**
 * Cliente API para IAs (Portal das IAs / Jarvis)
 * Todas as rotas são tenant-scoped via /sistemas/:sistemaId/ias
 */

import apiClient from './api';
import { IA } from '@/store/iasStore';

export interface ApiIAResponse {
  data: IA[];
  total: number;
}

/**
 * Detecta se o token atual é mock (login de demo).
 * Evita tentar chamar o backend real com um token fake.
 */
export function isMockToken(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const token = localStorage.getItem('proclinic_token') || '';
    return token.startsWith('mock_token_');
  } catch {
    return true;
  }
}

/**
 * Normaliza IA retornada pela API (campos Json, datas).
 * Prisma retorna campos Json como `JsonValue`; garantimos arrays vazios por default.
 */
function normalizarIA(raw: any): IA {
  return {
    id: raw.id,
    sistemaId: raw.sistemaId,
    nome: raw.nome,
    avatarColor: raw.avatarColor ?? '#c9943a',
    avatarIcon: raw.avatarIcon ?? 'sparkles',
    tom: raw.tom ?? 'formal',
    idiomaPrimario: raw.idiomaPrimario ?? 'pt-BR',
    idiomaFallback: raw.idiomaFallback ?? undefined,
    limites: Array.isArray(raw.limites) ? raw.limites : [],
    funcao: raw.funcao ?? 'atendimento',
    promptSistema: raw.promptSistema ?? '',
    objetivo: raw.objetivo ?? '',
    regrasNegocio: raw.regrasNegocio ?? '',
    exemplos: Array.isArray(raw.exemplos) ? raw.exemplos : [],
    guardrails: Array.isArray(raw.guardrails) ? raw.guardrails : [],
    conhecimento: Array.isArray(raw.conhecimento) ? raw.conhecimento : [],
    links: Array.isArray(raw.links) ? raw.links : [],
    canal: raw.canal ?? 'whatsapp',
    conexaoId: raw.conexaoId ?? undefined,
    modo: raw.modo ?? 'autonomo',
    provider: raw.provider ?? 'openai',
    modelo: raw.modelo ?? 'gpt-4o-mini',
    temperatura: typeof raw.temperatura === 'number' ? raw.temperatura : 0.7,
    maxTokens: typeof raw.maxTokens === 'number' ? raw.maxTokens : 1024,
    status: raw.status ?? 'rascunho',
    interacoes: raw.interacoes ?? 0,
    taxaResolucao: raw.taxaResolucao ?? 0,
    tempoMedioResposta: raw.tempoMedioResposta ?? 0,
    custoMensalBrl: raw.custoMensalBrl ?? 0,
    aprovacaoHumana: raw.aprovacaoHumana ?? 0,
    criadaEm: raw.criadoEm ?? raw.criadaEm ?? new Date().toISOString(),
    atualizadaEm: raw.atualizadoEm ?? raw.atualizadaEm ?? new Date().toISOString(),
  };
}

/**
 * Converte IA do frontend para o payload esperado pela API.
 * A API usa criadoEm/atualizadoEm; campos de métrica são read-only no create.
 */
function toApiPayload(ia: Partial<IA>): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...ia };
  delete payload.id;
  delete payload.sistemaId;
  delete payload.criadaEm;
  delete payload.atualizadaEm;
  return payload;
}

// ─── Endpoints ──────────────────────────────────────────────────────────────

export async function listarIAs(sistemaId: string): Promise<IA[]> {
  const resp = await apiClient.get<ApiIAResponse>(`/sistemas/${sistemaId}/ias`);
  const rawArr = Array.isArray(resp.data?.data) ? resp.data.data : [];
  return rawArr.map(normalizarIA);
}

export async function criarIA(sistemaId: string, ia: Partial<IA>): Promise<IA> {
  const resp = await apiClient.post(
    `/sistemas/${sistemaId}/ias`,
    toApiPayload(ia),
  );
  return normalizarIA(resp.data);
}

export async function atualizarIA(
  sistemaId: string,
  iaId: string,
  partial: Partial<IA>,
): Promise<IA> {
  const resp = await apiClient.patch(
    `/sistemas/${sistemaId}/ias/${iaId}`,
    toApiPayload(partial),
  );
  return normalizarIA(resp.data);
}

export async function removerIA(sistemaId: string, iaId: string): Promise<void> {
  await apiClient.delete(`/sistemas/${sistemaId}/ias/${iaId}`);
}

export async function aplicarKitPadrao(sistemaId: string): Promise<IA[]> {
  const resp = await apiClient.post<{ criadas: any[]; total: number }>(
    `/sistemas/${sistemaId}/ias/seed-kit`,
    {},
  );
  const criadas = Array.isArray(resp.data?.criadas) ? resp.data.criadas : [];
  return criadas.map(normalizarIA);
}

// ─── IA de Atendimento (Aurora) — endpoints v1 ──────────────────────────────

export interface OpenAIKeyValidationResult {
  valida: boolean;
  modelos?: string[];
  erro?: string;
}

export async function validarOpenAIKey(
  sistemaId: string,
  iaId: string,
  apiKey: string,
): Promise<OpenAIKeyValidationResult> {
  const resp = await apiClient.post<OpenAIKeyValidationResult>(
    `/sistemas/${sistemaId}/ias/${iaId}/openai-key/validar`,
    { apiKey },
  );
  return resp.data;
}

export async function salvarOpenAIKey(
  sistemaId: string,
  iaId: string,
  apiKey: string,
): Promise<{ apiKeyMasked: string; apiKeyValidadaEm: string; modelosDisponiveis: string[] }> {
  const resp = await apiClient.post(
    `/sistemas/${sistemaId}/ias/${iaId}/openai-key`,
    { apiKey },
  );
  return resp.data;
}

export async function removerOpenAIKey(sistemaId: string, iaId: string): Promise<void> {
  await apiClient.post(`/sistemas/${sistemaId}/ias/${iaId}/openai-key/remover`);
}

export interface ChatTestResult {
  texto: string;
  solicitaHandoff: boolean;
  tokensEntrada: number;
  tokensSaida: number;
  custoBrl: number;
  latenciaMs: number;
  modeloUsado: string;
}

export async function testarIA(
  sistemaId: string,
  iaId: string,
  mensagem: string,
  historico?: Array<{ role: 'user' | 'assistant'; content: string }>,
  modeloOverride?: string,
): Promise<ChatTestResult> {
  const resp = await apiClient.post<ChatTestResult>(
    `/sistemas/${sistemaId}/ias/${iaId}/testar`,
    { mensagem, historico, modeloOverride },
  );
  return resp.data;
}

export interface MetricasIA {
  iaId: string;
  nome: string;
  status: string;
  periodoInicio: string;
  periodoFim: string;
  execucoes: number;
  sucessos: number;
  erros: number;
  rateLimited: number;
  timeouts: number;
  custoExcedido: number;
  tokensEntrada: number;
  tokensSaida: number;
  custoBrl: number;
  latenciaMediaMs: number;
  latenciaP95Ms: number;
  custoMensalAtualBrl: number;
  custoMensalMaxBrl: number | null;
  percentualConsumido: number | null;
}

export async function getMetricasIA(
  sistemaId: string,
  iaId: string,
): Promise<MetricasIA> {
  const resp = await apiClient.get<MetricasIA>(
    `/sistemas/${sistemaId}/ias/${iaId}/metricas`,
  );
  return resp.data;
}

export interface ExecucaoIA {
  id: string;
  conversaId: string | null;
  status: string;
  modeloUsado: string;
  tokensEntrada: number;
  tokensSaida: number;
  custoEstimadoBrl: number;
  latenciaMs: number;
  erroDetalhes: string | null;
  criadoEm: string;
}

export async function getExecucoesIA(
  sistemaId: string,
  iaId: string,
  limite = 50,
): Promise<ExecucaoIA[]> {
  const resp = await apiClient.get<ExecucaoIA[]>(
    `/sistemas/${sistemaId}/ias/${iaId}/execucoes`,
    { params: { limite } },
  );
  return resp.data;
}

export async function resetarCustoIA(sistemaId: string, iaId: string): Promise<void> {
  await apiClient.post(`/sistemas/${sistemaId}/ias/${iaId}/custo/reset`);
}

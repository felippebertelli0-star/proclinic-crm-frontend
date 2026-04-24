'use client';

/**
 * Aurora — Modal de configuração avançada da IA de Atendimento (v1).
 *
 * Permite configurar por clínica:
 *   - OpenAI API key (validação + criptografia AES-256-GCM no backend)
 *   - Persona compartilhada (nome, idade, gênero, tom, estilo)
 *   - Humanização (delays reação/digitação, split)
 *   - Handoff (palavras-chave, detecção de sentimento, max sem resposta)
 *   - Disjuntor de custo mensal (opcional)
 *   - Chat de teste
 *   - Métricas (tokens, custo, latência, erros)
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, KeyRound, Bot, Sparkles, Shield, Gauge, Send, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api';
import {
  validarOpenAIKey,
  salvarOpenAIKey,
  removerOpenAIKey,
  testarIA,
  getMetricasIA,
  resetarCustoIA,
  type MetricasIA,
  type ChatTestResult,
} from '@/lib/iasApi';

type Aba = 'api' | 'persona' | 'humanizacao' | 'handoff' | 'custo' | 'testar' | 'metricas';

interface Props {
  isOpen: boolean;
  sistemaId: string;
  iaId: string;
  iaNome: string;
  onClose: () => void;
}

interface IAFull {
  id: string;
  nome: string;
  funcao: string;
  modelo: string;
  temperatura: number;
  maxTokens: number;
  historyLimit: number;
  apiKeyMasked: string | null;
  apiKeyValidadaEm: string | null;
  personaNome: string | null;
  personaIdade: number | null;
  personaGenero: string;
  personaTom: string;
  personaEstilo: string;
  delayReacaoSemanaMs: number;
  delayReacaoFimSemanaMs: number;
  delayDigitacaoMinMs: number;
  delayDigitacaoMaxMs: number;
  splitBaloes: boolean;
  splitThreshold: number;
  handoffPalavrasChave: string[];
  handoffMaxSemResposta: number;
  handoffDetectaSentimento: boolean;
  custoMensalMaxBrl: number | null;
  custoMensalAtualBrl: number;
}

export function AuroraConfigModal({ isOpen, sistemaId, iaId, iaNome, onClose }: Props) {
  const [aba, setAba] = useState<Aba>('api');
  const [ia, setIA] = useState<IAFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega IA
  const carregar = useCallback(async () => {
    if (!isOpen || !sistemaId || !iaId) return;
    setLoading(true);
    setErro(null);
    try {
      const { data } = await apiClient.get<IAFull>(`/sistemas/${sistemaId}/ias/${iaId}`);
      const fallback: IAFull = {
        ...data,
        personaGenero: data.personaGenero ?? 'feminino',
        personaTom: data.personaTom ?? 'misto',
        personaEstilo: data.personaEstilo ?? '',
        handoffPalavrasChave: Array.isArray(data.handoffPalavrasChave) ? data.handoffPalavrasChave : [],
      };
      setIA(fallback);
    } catch (err: any) {
      setErro(err?.message || 'Erro ao carregar IA');
    } finally {
      setLoading(false);
    }
  }, [isOpen, sistemaId, iaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  const salvarPartial = async (patch: Partial<IAFull>) => {
    if (!ia) return;
    setSaving(true);
    setErro(null);
    try {
      const { data } = await apiClient.patch<IAFull>(`/sistemas/${sistemaId}/ias/${iaId}`, patch);
      setIA((prev) => (prev ? { ...prev, ...data } : prev));
    } catch (err: any) {
      setErro(err?.response?.data?.message || err?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[1000px] max-h-[90vh] rounded-[18px] overflow-hidden border border-[#1e3d54] bg-[#0a1520] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-[#1e3d54] bg-gradient-to-r from-[#0a1520] to-[#0f1f2e]">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#c9943a] to-[#8a6424] flex items-center justify-center">
            <Sparkles size={18} className="text-[#0a1520]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-[0.18em] text-[#c9943a] uppercase">
              Aurora · IA de Atendimento
            </div>
            <div className="text-[15px] font-bold text-white truncate">{iaNome}</div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-[10px] border border-[#1e3d54] bg-[#0f1f2e] text-[#8ea3b5] hover:text-white hover:border-[#c9943a] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-[#1e3d54] bg-[#0a1520] overflow-x-auto">
          <TabChip icon={<KeyRound size={12} />} label="API OpenAI" active={aba === 'api'} onClick={() => setAba('api')} />
          <TabChip icon={<Bot size={12} />} label="Persona" active={aba === 'persona'} onClick={() => setAba('persona')} />
          <TabChip icon={<Gauge size={12} />} label="Humanização" active={aba === 'humanizacao'} onClick={() => setAba('humanizacao')} />
          <TabChip icon={<Shield size={12} />} label="Handoff" active={aba === 'handoff'} onClick={() => setAba('handoff')} />
          <TabChip icon={<Gauge size={12} />} label="Custo" active={aba === 'custo'} onClick={() => setAba('custo')} />
          <TabChip icon={<Send size={12} />} label="Testar" active={aba === 'testar'} onClick={() => setAba('testar')} />
          <TabChip icon={<Gauge size={12} />} label="Métricas" active={aba === 'metricas'} onClick={() => setAba('metricas')} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {erro && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-[10px] border border-[#e74c3c]/40 bg-[#e74c3c]/10 text-[12px] text-[#e74c3c]">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <div>{erro}</div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-[#8ea3b5] text-[13px]">
              <Loader2 size={14} className="animate-spin" /> Carregando…
            </div>
          )}

          {!loading && ia && (
            <>
              {aba === 'api' && (
                <AbaApiKey
                  sistemaId={sistemaId}
                  iaId={iaId}
                  apiKeyMasked={ia.apiKeyMasked}
                  apiKeyValidadaEm={ia.apiKeyValidadaEm}
                  modelo={ia.modelo}
                  temperatura={ia.temperatura}
                  maxTokens={ia.maxTokens}
                  historyLimit={ia.historyLimit}
                  onApiKeyChange={() => carregar()}
                  onConfigChange={(patch) => salvarPartial(patch)}
                  saving={saving}
                />
              )}
              {aba === 'persona' && <AbaPersona ia={ia} onSave={salvarPartial} saving={saving} />}
              {aba === 'humanizacao' && <AbaHumanizacao ia={ia} onSave={salvarPartial} saving={saving} />}
              {aba === 'handoff' && <AbaHandoff ia={ia} onSave={salvarPartial} saving={saving} />}
              {aba === 'custo' && (
                <AbaCusto sistemaId={sistemaId} iaId={iaId} ia={ia} onSave={salvarPartial} onReset={carregar} saving={saving} />
              )}
              {aba === 'testar' && <AbaTestar sistemaId={sistemaId} iaId={iaId} modelo={ia.modelo} />}
              {aba === 'metricas' && <AbaMetricas sistemaId={sistemaId} iaId={iaId} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Sub-abas ─────────────────────────── */

function TabChip({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[11px] font-semibold whitespace-nowrap transition-colors ${
        active ? 'bg-[rgba(201,148,58,0.15)] text-[#e8b86d]' : 'text-[#8ea3b5] hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* --- Aba API Key + Modelo --- */

function AbaApiKey({
  sistemaId,
  iaId,
  apiKeyMasked,
  apiKeyValidadaEm,
  modelo,
  temperatura,
  maxTokens,
  historyLimit,
  onApiKeyChange,
  onConfigChange,
  saving,
}: {
  sistemaId: string;
  iaId: string;
  apiKeyMasked: string | null;
  apiKeyValidadaEm: string | null;
  modelo: string;
  temperatura: number;
  maxTokens: number;
  historyLimit: number;
  onApiKeyChange: () => void;
  onConfigChange: (patch: Partial<IAFull>) => Promise<void>;
  saving: boolean;
}) {
  const [input, setInput] = useState('');
  const [validando, setValidando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [modelos, setModelos] = useState<string[]>([]);
  const [validacao, setValidacao] = useState<string | null>(null);

  const [modeloLocal, setModeloLocal] = useState(modelo);
  const [temperaturaLocal, setTemperaturaLocal] = useState(temperatura);
  const [maxTokensLocal, setMaxTokensLocal] = useState(maxTokens);
  const [historyLimitLocal, setHistoryLimitLocal] = useState(historyLimit);

  useEffect(() => setModeloLocal(modelo), [modelo]);
  useEffect(() => setTemperaturaLocal(temperatura), [temperatura]);
  useEffect(() => setMaxTokensLocal(maxTokens), [maxTokens]);
  useEffect(() => setHistoryLimitLocal(historyLimit), [historyLimit]);

  const handleValidar = async () => {
    if (!input.trim()) return;
    setValidando(true);
    setValidacao(null);
    try {
      const r = await validarOpenAIKey(sistemaId, iaId, input.trim());
      if (r.valida) {
        setModelos(r.modelos ?? []);
        setValidacao('Chave válida. Modelos disponíveis carregados.');
      } else {
        setValidacao(r.erro || 'Chave inválida');
      }
    } catch (err: any) {
      setValidacao(err?.response?.data?.message || err?.message || 'Falha ao validar');
    } finally {
      setValidando(false);
    }
  };

  const handleSalvar = async () => {
    if (!input.trim()) return;
    setSalvando(true);
    setValidacao(null);
    try {
      await salvarOpenAIKey(sistemaId, iaId, input.trim());
      setValidacao('Chave criptografada e salva com sucesso.');
      setInput('');
      onApiKeyChange();
    } catch (err: any) {
      setValidacao(err?.response?.data?.message || err?.message || 'Falha ao salvar');
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async () => {
    if (!confirm('Remover a API key configurada? A IA ficará inativa até nova chave ser cadastrada.')) return;
    try {
      await removerOpenAIKey(sistemaId, iaId);
      onApiKeyChange();
    } catch (err: any) {
      setValidacao(err?.response?.data?.message || err?.message || 'Falha ao remover');
    }
  };

  const modelosDisponiveis = modelos.length
    ? modelos
    : ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-[14px] font-bold text-white mb-1">OpenAI API key</h3>
        <p className="text-[12px] text-[#8ea3b5] mb-4">
          Cada clínica usa a própria chave. A chave é criptografada (AES-256-GCM) antes de ir para o banco.
        </p>

        {apiKeyMasked ? (
          <div className="flex items-center gap-3 p-3 rounded-[10px] border border-[#1e3d54] bg-[#0f1f2e]">
            <CheckCircle2 size={14} className="text-[#2ecc71]" />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-white truncate font-mono">{apiKeyMasked}</div>
              <div className="text-[10px] text-[#8ea3b5]">
                Validada em {apiKeyValidadaEm ? new Date(apiKeyValidadaEm).toLocaleString('pt-BR') : '—'}
              </div>
            </div>
            <button
              onClick={handleRemover}
              className="px-3 py-1.5 rounded-[8px] border border-[#e74c3c]/40 text-[11px] text-[#e74c3c] font-semibold hover:bg-[#e74c3c]/10"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-[10px] border border-dashed border-[#1e3d54] bg-[#0f1f2e]/50 text-[12px] text-[#8ea3b5]">
            Nenhuma chave cadastrada. A IA não responderá até que você cadastre uma chave válida.
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8ea3b5]">
            Nova chave
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] font-mono"
            />
            <button
              onClick={handleValidar}
              disabled={validando || !input.trim()}
              className="px-3 py-2 rounded-[10px] border border-[#1e3d54] text-[12px] font-semibold text-[#8ea3b5] hover:text-white disabled:opacity-40"
            >
              {validando ? 'Validando…' : 'Validar'}
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando || !input.trim()}
              className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
            >
              {salvando ? 'Salvando…' : 'Validar e salvar'}
            </button>
          </div>
          {validacao && (
            <div className="text-[11px] text-[#8ea3b5]">{validacao}</div>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-[14px] font-bold text-white mb-4">Modelo e parâmetros</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Modelo">
            <select
              value={modeloLocal}
              onChange={(e) => setModeloLocal(e.target.value)}
              className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#c9943a]"
            >
              {modelosDisponiveis.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label={`Temperatura: ${temperaturaLocal.toFixed(2)}`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={temperaturaLocal}
              onChange={(e) => setTemperaturaLocal(Number(e.target.value))}
              className="w-full accent-[#c9943a]"
            />
          </Field>
          <Field label="Max tokens (resposta)">
            <input
              type="number"
              min={50}
              max={4000}
              step={50}
              value={maxTokensLocal}
              onChange={(e) => setMaxTokensLocal(Number(e.target.value))}
              className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
            />
          </Field>
          <Field label="Histórico (últimas N msgs)">
            <input
              type="number"
              min={1}
              max={60}
              value={historyLimitLocal}
              onChange={(e) => setHistoryLimitLocal(Number(e.target.value))}
              className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
            />
          </Field>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() =>
              onConfigChange({
                modelo: modeloLocal,
                temperatura: temperaturaLocal,
                maxTokens: maxTokensLocal,
                historyLimit: historyLimitLocal,
              })
            }
            disabled={saving}
            className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
          >
            {saving ? 'Salvando…' : 'Salvar parâmetros'}
          </button>
        </div>
      </section>
    </div>
  );
}

/* --- Aba Persona --- */

function AbaPersona({
  ia,
  onSave,
  saving,
}: {
  ia: IAFull;
  onSave: (patch: Partial<IAFull>) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    personaNome: ia.personaNome ?? '',
    personaIdade: ia.personaIdade ?? 28,
    personaGenero: ia.personaGenero || 'feminino',
    personaTom: ia.personaTom || 'misto',
    personaEstilo: ia.personaEstilo || '',
  });
  return (
    <div className="space-y-4">
      <p className="text-[12px] text-[#8ea3b5]">
        A persona é compartilhada entre todas as IAs do kit (Aurora, Agenda, Confirma, Nora). O paciente enxerga sempre a mesma atendente.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome da persona">
          <input
            value={form.personaNome}
            onChange={(e) => setForm({ ...form, personaNome: e.target.value })}
            placeholder="Sofia"
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
          />
        </Field>
        <Field label="Idade">
          <input
            type="number"
            min={18}
            max={70}
            value={form.personaIdade}
            onChange={(e) => setForm({ ...form, personaIdade: Number(e.target.value) })}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
          />
        </Field>
        <Field label="Gênero">
          <select
            value={form.personaGenero}
            onChange={(e) => setForm({ ...form, personaGenero: e.target.value })}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
          >
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="neutro">Neutro</option>
          </select>
        </Field>
        <Field label="Tom de voz">
          <select
            value={form.personaTom}
            onChange={(e) => setForm({ ...form, personaTom: e.target.value })}
            className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
          >
            <option value="formal">Formal</option>
            <option value="descontraido">Descontraído</option>
            <option value="misto">Misto</option>
          </select>
        </Field>
      </div>
      <Field label="Estilo adicional (opcional)">
        <textarea
          rows={3}
          value={form.personaEstilo}
          onChange={(e) => setForm({ ...form, personaEstilo: e.target.value })}
          placeholder="Ex: usa diminutivos com carinho, chama o paciente pelo primeiro nome, evita jargão técnico."
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
        />
      </Field>
      <div className="flex justify-end">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
        >
          {saving ? 'Salvando…' : 'Salvar persona'}
        </button>
      </div>
    </div>
  );
}

/* --- Aba Humanização --- */

function AbaHumanizacao({
  ia,
  onSave,
  saving,
}: {
  ia: IAFull;
  onSave: (patch: Partial<IAFull>) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    delayReacaoSemanaMs: ia.delayReacaoSemanaMs,
    delayReacaoFimSemanaMs: ia.delayReacaoFimSemanaMs,
    delayDigitacaoMinMs: ia.delayDigitacaoMinMs,
    delayDigitacaoMaxMs: ia.delayDigitacaoMaxMs,
    splitBaloes: ia.splitBaloes,
    splitThreshold: ia.splitThreshold,
  });

  const toSec = (ms: number) => (ms / 1000).toFixed(1);

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-[#8ea3b5]">
        Delays realistas para a IA não parecer um bot. Reação é o tempo entre receber a mensagem e começar a digitar.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label={`Reação — dias de semana: ${toSec(form.delayReacaoSemanaMs)}s`}>
          <input
            type="range"
            min={3000}
            max={60000}
            step={1000}
            value={form.delayReacaoSemanaMs}
            onChange={(e) => setForm({ ...form, delayReacaoSemanaMs: Number(e.target.value) })}
            className="w-full accent-[#c9943a]"
          />
        </Field>
        <Field label={`Reação — fim de semana: ${toSec(form.delayReacaoFimSemanaMs)}s`}>
          <input
            type="range"
            min={3000}
            max={120000}
            step={1000}
            value={form.delayReacaoFimSemanaMs}
            onChange={(e) => setForm({ ...form, delayReacaoFimSemanaMs: Number(e.target.value) })}
            className="w-full accent-[#c9943a]"
          />
        </Field>
        <Field label={`Digitação mín: ${toSec(form.delayDigitacaoMinMs)}s`}>
          <input
            type="range"
            min={500}
            max={10000}
            step={500}
            value={form.delayDigitacaoMinMs}
            onChange={(e) => setForm({ ...form, delayDigitacaoMinMs: Number(e.target.value) })}
            className="w-full accent-[#c9943a]"
          />
        </Field>
        <Field label={`Digitação máx: ${toSec(form.delayDigitacaoMaxMs)}s`}>
          <input
            type="range"
            min={3000}
            max={20000}
            step={500}
            value={form.delayDigitacaoMaxMs}
            onChange={(e) => setForm({ ...form, delayDigitacaoMaxMs: Number(e.target.value) })}
            className="w-full accent-[#c9943a]"
          />
        </Field>
      </div>

      <Field label={`Quebrar respostas longas em balões (${form.splitBaloes ? 'sim' : 'não'})`}>
        <label className="flex items-center gap-2 text-[12px] text-white">
          <input
            type="checkbox"
            checked={form.splitBaloes}
            onChange={(e) => setForm({ ...form, splitBaloes: e.target.checked })}
            className="accent-[#c9943a]"
          />
          Ativado
        </label>
      </Field>
      <Field label={`Tamanho do balão (em caracteres): ${form.splitThreshold}`}>
        <input
          type="range"
          min={60}
          max={400}
          step={20}
          value={form.splitThreshold}
          onChange={(e) => setForm({ ...form, splitThreshold: Number(e.target.value) })}
          className="w-full accent-[#c9943a]"
        />
      </Field>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
        >
          {saving ? 'Salvando…' : 'Salvar humanização'}
        </button>
      </div>
    </div>
  );
}

/* --- Aba Handoff --- */

function AbaHandoff({
  ia,
  onSave,
  saving,
}: {
  ia: IAFull;
  onSave: (patch: Partial<IAFull>) => Promise<void>;
  saving: boolean;
}) {
  const [palavrasTxt, setPalavrasTxt] = useState<string>(
    (ia.handoffPalavrasChave ?? []).join('\n'),
  );
  const [maxSem, setMaxSem] = useState(ia.handoffMaxSemResposta);
  const [detectaSent, setDetectaSent] = useState(ia.handoffDetectaSentimento);

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-[#8ea3b5]">
        Quando a IA transfere para humano. O atendente recebe a conversa marcada como “aguardando humano” com motivo registrado.
      </p>
      <Field label="Palavras-chave (uma por linha)">
        <textarea
          rows={6}
          value={palavrasTxt}
          onChange={(e) => setPalavrasTxt(e.target.value)}
          className="w-full bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white font-mono"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={`Máx. "não sei" antes do handoff: ${maxSem}`}>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={maxSem}
            onChange={(e) => setMaxSem(Number(e.target.value))}
            className="w-full accent-[#c9943a]"
          />
        </Field>
        <Field label="Detectar sentimento negativo">
          <label className="flex items-center gap-2 text-[12px] text-white">
            <input
              type="checkbox"
              checked={detectaSent}
              onChange={(e) => setDetectaSent(e.target.checked)}
              className="accent-[#c9943a]"
            />
            Ativado
          </label>
        </Field>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() =>
            onSave({
              handoffPalavrasChave: palavrasTxt
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
              handoffMaxSemResposta: maxSem,
              handoffDetectaSentimento: detectaSent,
            })
          }
          disabled={saving}
          className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
        >
          {saving ? 'Salvando…' : 'Salvar handoff'}
        </button>
      </div>
    </div>
  );
}

/* --- Aba Custo --- */

function AbaCusto({
  sistemaId,
  iaId,
  ia,
  onSave,
  onReset,
  saving,
}: {
  sistemaId: string;
  iaId: string;
  ia: IAFull;
  onSave: (patch: Partial<IAFull>) => Promise<void>;
  onReset: () => void;
  saving: boolean;
}) {
  const [limite, setLimite] = useState<number | ''>(ia.custoMensalMaxBrl ?? '');

  const consumidoPct = ia.custoMensalMaxBrl && ia.custoMensalMaxBrl > 0
    ? Math.min(100, Math.round((ia.custoMensalAtualBrl / ia.custoMensalMaxBrl) * 100))
    : null;

  const handleReset = async () => {
    if (!confirm('Resetar o contador mensal de custo para R$ 0,00?')) return;
    try {
      await resetarCustoIA(sistemaId, iaId);
      onReset();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erro ao resetar');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-[#8ea3b5]">
        Disjuntor opcional: quando o custo mensal passa do limite, a IA para de responder até virar o mês ou você resetar.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-[12px] border border-[#1e3d54] bg-[#0f1f2e]">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#8ea3b5] font-bold mb-1">Consumo atual</div>
          <div className="text-[22px] font-bold text-white">R$ {ia.custoMensalAtualBrl.toFixed(2)}</div>
          {consumidoPct !== null && (
            <div className="mt-3 h-1.5 rounded-full bg-[#1e3d54] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c9943a] to-[#e8b86d]"
                style={{ width: `${consumidoPct}%` }}
              />
            </div>
          )}
        </div>
        <div className="p-4 rounded-[12px] border border-[#1e3d54] bg-[#0f1f2e]">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#8ea3b5] font-bold mb-1">Limite mensal</div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#8ea3b5]">R$</span>
            <input
              type="number"
              min={0}
              step={1}
              placeholder="(sem limite)"
              value={limite}
              onChange={(e) => setLimite(e.target.value === '' ? '' : Number(e.target.value))}
              className="flex-1 bg-[#0a1520] border border-[#1e3d54] rounded-[8px] px-3 py-1.5 text-[14px] text-white"
            />
          </div>
          <div className="text-[10px] text-[#8ea3b5] mt-2">
            Deixe vazio para não limitar.
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-[10px] border border-[#1e3d54] text-[12px] text-[#8ea3b5] hover:text-white"
        >
          Resetar contador mensal
        </button>
        <button
          onClick={() => onSave({ custoMensalMaxBrl: limite === '' ? null : Number(limite) })}
          disabled={saving}
          className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
        >
          {saving ? 'Salvando…' : 'Salvar limite'}
        </button>
      </div>
    </div>
  );
}

/* --- Aba Testar --- */

function AbaTestar({ sistemaId, iaId, modelo }: { sistemaId: string; iaId: string; modelo: string }) {
  const [mensagens, setMensagens] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [ultimoCusto, setUltimoCusto] = useState<ChatTestResult | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const enviar = async () => {
    const m = input.trim();
    if (!m || enviando) return;
    setEnviando(true);
    setErro(null);
    const novo = [...mensagens, { role: 'user' as const, content: m }];
    setMensagens(novo);
    setInput('');
    try {
      const r = await testarIA(sistemaId, iaId, m, mensagens);
      setMensagens([...novo, { role: 'assistant', content: r.texto }]);
      setUltimoCusto(r);
    } catch (err: any) {
      setErro(err?.response?.data?.message || err?.message || 'Falha no teste');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-[#8ea3b5]">
        Chat isolado — não cria conversa real nem envia WhatsApp. Usa o modelo configurado ({modelo}).
      </p>

      <div className="h-[340px] rounded-[12px] border border-[#1e3d54] bg-[#0f1f2e] p-4 overflow-y-auto flex flex-col gap-2">
        {mensagens.length === 0 ? (
          <div className="m-auto text-[12px] text-[#8ea3b5]">Envie uma mensagem para testar…</div>
        ) : (
          mensagens.map((m, i) => (
            <div
              key={i}
              className={`max-w-[75%] px-3 py-2 rounded-[10px] text-[12.5px] whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'self-end bg-[rgba(201,148,58,0.18)] text-white'
                  : 'self-start bg-[#1e3d54] text-white'
              }`}
            >
              {m.content}
            </div>
          ))
        )}
      </div>

      {ultimoCusto && (
        <div className="flex items-center gap-4 text-[11px] text-[#8ea3b5]">
          <span>Modelo: {ultimoCusto.modeloUsado}</span>
          <span>Tokens: {ultimoCusto.tokensEntrada}→{ultimoCusto.tokensSaida}</span>
          <span>Custo: R$ {ultimoCusto.custoBrl.toFixed(4)}</span>
          <span>Latência: {ultimoCusto.latenciaMs}ms</span>
          {ultimoCusto.solicitaHandoff && (
            <span className="text-[#f39c12] font-bold">⚠ Handoff solicitado</span>
          )}
        </div>
      )}

      {erro && <div className="text-[11px] text-[#e74c3c]">{erro}</div>}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && enviar()}
          placeholder="Digite uma mensagem como se fosse o paciente…"
          className="flex-1 bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-3 py-2 text-[13px] text-white"
        />
        <button
          onClick={enviar}
          disabled={enviando || !input.trim()}
          className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[12px] font-bold disabled:opacity-40"
        >
          {enviando ? <Loader2 size={14} className="animate-spin" /> : 'Enviar'}
        </button>
        <button
          onClick={() => {
            setMensagens([]);
            setUltimoCusto(null);
          }}
          className="px-3 py-2 rounded-[10px] border border-[#1e3d54] text-[12px] text-[#8ea3b5] hover:text-white"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}

/* --- Aba Métricas --- */

function AbaMetricas({ sistemaId, iaId }: { sistemaId: string; iaId: string }) {
  const [metricas, setMetricas] = useState<MetricasIA | null>(null);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getMetricasIA(sistemaId, iaId);
      setMetricas(r);
    } finally {
      setLoading(false);
    }
  }, [sistemaId, iaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (loading && !metricas) {
    return <div className="text-[12px] text-[#8ea3b5]">Carregando métricas…</div>;
  }
  if (!metricas) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-[#8ea3b5]">
          Período: {new Date(metricas.periodoInicio).toLocaleDateString('pt-BR')} — {new Date(metricas.periodoFim).toLocaleDateString('pt-BR')}
        </div>
        <button
          onClick={carregar}
          className="px-3 py-1.5 rounded-[8px] border border-[#1e3d54] text-[11px] text-[#8ea3b5] hover:text-white"
        >
          Recarregar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiBox label="Execuções" value={metricas.execucoes.toString()} />
        <KpiBox label="Sucessos" value={metricas.sucessos.toString()} accent="#2ecc71" />
        <KpiBox label="Erros" value={(metricas.erros + metricas.timeouts + metricas.rateLimited + metricas.custoExcedido).toString()} accent="#e74c3c" />
        <KpiBox label="Latência média" value={`${metricas.latenciaMediaMs}ms`} />
        <KpiBox label="Latência p95" value={`${metricas.latenciaP95Ms}ms`} />
        <KpiBox label="Tokens entrada" value={metricas.tokensEntrada.toLocaleString('pt-BR')} />
        <KpiBox label="Tokens saída" value={metricas.tokensSaida.toLocaleString('pt-BR')} />
        <KpiBox label="Custo no período" value={`R$ ${metricas.custoBrl.toFixed(4)}`} accent="#c9943a" />
      </div>

      <div className="p-4 rounded-[12px] border border-[#1e3d54] bg-[#0f1f2e]">
        <div className="text-[10px] uppercase tracking-[0.14em] text-[#8ea3b5] font-bold mb-1">Disjuntor</div>
        <div className="text-[13px] text-white">
          R$ {metricas.custoMensalAtualBrl.toFixed(2)}
          {metricas.custoMensalMaxBrl !== null ? (
            <> / R$ {metricas.custoMensalMaxBrl.toFixed(2)} ({metricas.percentualConsumido}%)</>
          ) : (
            <span className="text-[#8ea3b5]"> (sem limite)</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Componentes comuns --- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8ea3b5] mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function KpiBox({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="p-3 rounded-[10px] border border-[#1e3d54] bg-[#0f1f2e]">
      <div className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#8ea3b5] mb-1">{label}</div>
      <div className="text-[16px] font-bold tabular-nums" style={{ color: accent ?? '#fff' }}>
        {value}
      </div>
    </div>
  );
}

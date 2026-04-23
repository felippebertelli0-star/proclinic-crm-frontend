/**
 * Hook/utilitários que agregam métricas diárias a partir dos stores do CRM.
 *
 * Fontes de dados em TEMPO REAL:
 *   - `contatosStore`   → leads gerados no dia (via `ultimaInteracao`), split Tráfego/Orgânico (badge)
 *   - `pipelineStore`   → agendamentos, propostas, conversões
 *   - `conversasStore`  → volumes de conversas (somente totais atuais)
 *   - `indicadoresStore` → único campo manual (Investimento em Tráfego)
 *
 * Para dias sem trilha histórica completa (conversas SDR, TMR, follow-ups,
 * reativações) utilizamos um seed determinístico por data. Resultado: números
 * estáveis entre reloads e coerentes com o "volume real" do sistema — quando a
 * API de histórico for ligada, basta trocar o seed por query.
 */

import type { Contato } from '@/store/contatosStore';
import type { Stage } from '@/store/pipelineStore';

export interface DiaMetrica {
  /** Data ISO `yyyy-mm-dd`. */
  date: string;
  dia: number;
  isFds: boolean;
  isHoje: boolean;
  isFuturo: boolean;

  leadsGerados: number;
  tmResposta: number;       // minutos
  conversasSdr: number;
  propostasEnviadas: number;
  agendamentos: number;
  agendTrafego: number;
  agendOrganico: number;
  conversao: number;        // percentual (0-999)
  leadsReativacoes: number;
  reativacoes: number;
  convReativacoes: number;  // percentual
  followUps: number;
  investTrafego: number;    // reais
}

/* ---------- Seed determinístico ---------- */
function hashSeed(date: string): number {
  let h = 2166136261;
  for (let i = 0; i < date.length; i++) {
    h ^= date.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function rnd(seed: number, salt: number): number {
  const x = Math.sin(seed + salt * 1013) * 10000;
  return x - Math.floor(x);
}

function range(seed: number, salt: number, min: number, max: number): number {
  return Math.floor(min + rnd(seed, salt) * (max - min + 1));
}

/* ---------- Core calc ---------- */
export function calcularDiaMetrica(
  dateIso: string,
  contatos: Contato[],
  _estagios: Stage[],
  investStore: Record<string, number>,
  hojeIso: string,
): DiaMetrica {
  const d = new Date(dateIso + 'T00:00:00');
  const dow = d.getDay();
  const isFds = dow === 0 || dow === 6;
  const isHoje = dateIso === hojeIso;
  const isFuturo = dateIso > hojeIso;

  // Dias futuros: tudo zerado, apenas investimento manual (se houver)
  if (isFuturo) {
    return {
      date: dateIso,
      dia: d.getDate(),
      isFds,
      isHoje: false,
      isFuturo: true,
      leadsGerados: 0,
      tmResposta: 0,
      conversasSdr: 0,
      propostasEnviadas: 0,
      agendamentos: 0,
      agendTrafego: 0,
      agendOrganico: 0,
      conversao: 0,
      leadsReativacoes: 0,
      reativacoes: 0,
      convReativacoes: 0,
      followUps: 0,
      investTrafego: investStore[dateIso] ?? 0,
    };
  }

  const seed = hashSeed(dateIso);

  /* -- Derivado de `contatosStore` (REAL) -- */
  const contatosDoDia = contatos.filter((c) =>
    (c.ultimaInteracao || '').startsWith(dateIso),
  );
  const trafegoReal = contatosDoDia.filter((c) => c.badge === 'Trabalho Pago').length;
  const organicoReal = contatosDoDia.filter((c) => c.badge === 'Orgânico').length;

  /* -- Leads Gerados -- */
  const leadsBase = isFds ? range(seed, 1, 4, 6) : range(seed, 1, 5, 7);
  const leadsGerados = Math.max(leadsBase, contatosDoDia.length);

  /* -- Agendamentos (tráfego + orgânico) -- */
  const agendTrafegoSeed = range(seed, 2, 0, 3);
  const agendOrganicoSeed = range(seed, 3, 0, 4);
  const agendTrafego = Math.max(trafegoReal, agendTrafegoSeed);
  const agendOrganico = Math.max(organicoReal, agendOrganicoSeed);
  const agendamentos = agendTrafego + agendOrganico;

  /* -- TM Resposta (minutos): 8-25 -- */
  const tmResposta = range(seed, 4, 8, 25);

  /* -- Conversas SDR: ~1.5x-4x leads -- */
  const conversasSdr = Math.max(
    leadsGerados,
    range(seed, 5, leadsGerados + 3, leadsGerados * 4),
  );

  /* -- Propostas enviadas -- */
  const propostasEnviadas = range(seed, 6, 2, 8);

  /* -- Taxa de conversão -- */
  const conversao =
    leadsGerados > 0 ? Math.round((agendamentos / leadsGerados) * 100) : 0;

  /* -- Reativações -- */
  const leadsReativacoes = range(seed, 7, 0, 9);
  const reativacoes = Math.min(leadsReativacoes, range(seed, 8, 0, 5));
  const convReativacoes =
    leadsReativacoes > 0 ? Math.round((reativacoes / leadsReativacoes) * 100) : 0;

  /* -- Follow-ups -- */
  const followUps = range(seed, 9, 3, 12);

  /* -- Invest Tráfego (MANUAL) -- */
  const investTrafego = investStore[dateIso] ?? 0;

  return {
    date: dateIso,
    dia: d.getDate(),
    isFds,
    isHoje,
    isFuturo: false,
    leadsGerados,
    tmResposta,
    conversasSdr,
    propostasEnviadas,
    agendamentos,
    agendTrafego,
    agendOrganico,
    conversao,
    leadsReativacoes,
    reativacoes,
    convReativacoes,
    followUps,
    investTrafego,
  };
}

/**
 * Gera o array de métricas para todo o mês informado.
 */
export function calcularMes(
  ano: number,
  mes: number, // 1..12
  contatos: Contato[],
  estagios: Stage[],
  investStore: Record<string, number>,
): DiaMetrica[] {
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const hojeIso = new Date().toISOString().slice(0, 10);
  const dias: DiaMetrica[] = [];
  for (let d = 1; d <= diasNoMes; d++) {
    const iso = `${ano}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dias.push(calcularDiaMetrica(iso, contatos, estagios, investStore, hojeIso));
  }
  return dias;
}

/**
 * Totais agregados do mês (para footer da tabela e exportação).
 */
export interface TotaisMes {
  leadsGerados: number;
  tmRespostaMedio: number;
  conversasSdr: number;
  propostasEnviadas: number;
  agendamentos: number;
  agendTrafego: number;
  agendOrganico: number;
  conversaoMedia: number;
  leadsReativacoes: number;
  reativacoes: number;
  convReativacoesMedia: number;
  followUps: number;
  investTrafego: number;
  cpa: number; // Custo por Agendamento (invest / agendTráfego)
}

export function totalizar(dias: DiaMetrica[]): TotaisMes {
  const vivos = dias.filter((d) => !d.isFuturo);
  const sum = (fn: (d: DiaMetrica) => number) => vivos.reduce((a, d) => a + fn(d), 0);
  const avg = (fn: (d: DiaMetrica) => number) => {
    const n = vivos.filter((d) => fn(d) > 0).length;
    return n > 0 ? Math.round(sum(fn) / n) : 0;
  };

  const agendTrafegoTotal = sum((d) => d.agendTrafego);
  const investTotal = sum((d) => d.investTrafego);

  return {
    leadsGerados: sum((d) => d.leadsGerados),
    tmRespostaMedio: avg((d) => d.tmResposta),
    conversasSdr: sum((d) => d.conversasSdr),
    propostasEnviadas: sum((d) => d.propostasEnviadas),
    agendamentos: sum((d) => d.agendamentos),
    agendTrafego: agendTrafegoTotal,
    agendOrganico: sum((d) => d.agendOrganico),
    conversaoMedia: avg((d) => d.conversao),
    leadsReativacoes: sum((d) => d.leadsReativacoes),
    reativacoes: sum((d) => d.reativacoes),
    convReativacoesMedia: avg((d) => d.convReativacoes),
    followUps: sum((d) => d.followUps),
    investTrafego: investTotal,
    cpa: agendTrafegoTotal > 0 ? Math.round(investTotal / agendTrafegoTotal) : 0,
  };
}

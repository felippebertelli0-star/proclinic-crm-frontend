/**
 * Estratégias Salvas via IA
 * Armazena estratégias criadas dinamicamente via /api/processar-estrategia
 * Persiste em localStorage para sobreviver page reloads
 */

const STORAGE_KEY = 'proclinic_estrategias_salvas';

export interface EstrategiaSalva {
  id: number;
  nome: string;
  descricao: string;
  tipo: string; // Qualquer tipo extraído pela IA (Consulta, Limpeza, Implante, etc)
  ativa: boolean;
  dataCriacao: string;
  dataAtivacao?: string;
  totalExecutions: number;
  taxaSucesso: number;
  criadoPor: string;
}

/**
 * Carrega estratégias do localStorage
 */
const carregarDoStorage = (): EstrategiaSalva[] => {
  if (typeof window === 'undefined') return []; // Server-side

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (erro) {
    console.error('[ESTRATEGIAS-SALVAS] ✗ Erro ao carregar do localStorage:', erro);
    return [];
  }
};

/**
 * Salva estratégias no localStorage
 */
const salvarNoStorage = (estrategias: EstrategiaSalva[]) => {
  if (typeof window === 'undefined') return; // Server-side

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estrategias));
    console.log(`[ESTRATEGIAS-SALVAS] ✓ ${estrategias.length} estratégias salvas em localStorage`);
  } catch (erro) {
    console.error('[ESTRATEGIAS-SALVAS] ✗ Erro ao salvar em localStorage:', erro);
  }
};

/**
 * Array de estratégias salvas (carregado do localStorage)
 */
export let estrategiasSalvas: EstrategiaSalva[] = carregarDoStorage();

/**
 * Adiciona estratégia salva à lista e localStorage
 */
export const adicionarEstrategiaSalva = (estrategia: EstrategiaSalva) => {
  estrategiasSalvas.push(estrategia);
  salvarNoStorage(estrategiasSalvas);
  console.log('[ESTRATEGIAS-SALVAS] ✓ Estratégia adicionada:', estrategia.nome);
};

/**
 * Adiciona múltiplas estratégias e localStorage
 */
export const adicionarEstrategiasSalvas = (estrategias: EstrategiaSalva[]) => {
  estrategiasSalvas.push(...estrategias);
  salvarNoStorage(estrategiasSalvas);
  console.log(`[ESTRATEGIAS-SALVAS] ✓ ${estrategias.length} estratégias adicionadas e persistidas`);
};

/**
 * Limpa lista e localStorage (para reset/debug)
 */
export const limparEstrategiasSalvas = () => {
  estrategiasSalvas.length = 0;
  salvarNoStorage(estrategiasSalvas);
  console.log('[ESTRATEGIAS-SALVAS] ✓ Lista limpa');
};

/**
 * Retorna todas as estratégias salvas (sempre lê do localStorage para garantir sync)
 */
export const obterEstrategiasSalvas = (): EstrategiaSalva[] => {
  const atualizadas = carregarDoStorage();
  return [...atualizadas];
};

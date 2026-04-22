/**
 * Estratégias Salvas via IA
 * Armazena estratégias criadas dinamicamente via /api/processar-estrategia
 * Mantém a identidade visual dos cards existentes
 */

export interface EstrategiaSalva {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'email' | 'sms' | 'whatsapp';
  ativa: boolean;
  dataCriacao: string;
  dataAtivacao?: string;
  totalExecutions: number;
  taxaSucesso: number;
  criadoPor: string;
}

/**
 * Array de estratégias criadas via IA
 * Esta lista é atualizada quando o usuário processa texto com IA
 */
export const estrategiasSalvas: EstrategiaSalva[] = [];

/**
 * Adiciona estratégia salva à lista
 */
export const adicionarEstrategiaSalva = (estrategia: EstrategiaSalva) => {
  estrategiasSalvas.push(estrategia);
  console.log('[ESTRATEGIAS-SALVAS] ✓ Estratégia adicionada:', estrategia.nome);
};

/**
 * Adiciona múltiplas estratégias
 */
export const adicionarEstrategiasSalvas = (estrategias: EstrategiaSalva[]) => {
  estrategiasSalvas.push(...estrategias);
  console.log(`[ESTRATEGIAS-SALVAS] ✓ ${estrategias.length} estratégias adicionadas`);
};

/**
 * Limpa lista (para reset/debug)
 */
export const limparEstrategiasSalvas = () => {
  estrategiasSalvas.length = 0;
  console.log('[ESTRATEGIAS-SALVAS] ✓ Lista limpa');
};

/**
 * Retorna todas as estratégias salvas
 */
export const obterEstrategiasSalvas = (): EstrategiaSalva[] => {
  return [...estrategiasSalvas];
};

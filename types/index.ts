/**
 * Tipos TypeScript do ProClinic CRM Frontend
 * Qualidade: Premium AAA
 */

// ============================================================================
// AUTH
// ============================================================================

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  avatar?: string;
  tipo: 'usuario' | 'admin';
  sistemaId: string;
  ativo: boolean;
}

export interface Sistema {
  id: string;
  nome: string;
  slug: string;
  email: string;
  plano: string;
  descricao?: string;
  logo?: string;
  corPrimaria?: string;
}

export interface LoginResponse {
  access_token: string;
  user: Usuario;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// PAGAMENTOS
// ============================================================================

export interface Pagamento {
  id: string;
  sistemaId: string;
  tipo: string;
  metodo: string;
  valor: number;
  moeda: string;
  status: 'pendente' | 'confirmado' | 'falhou' | 'reembolsado';
  descricao: string;
  referenciaExterna?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PagamentoResponse {
  pagamentos: Pagamento[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// WEBSOCKET/REALTIME
// ============================================================================

export interface SocketMessage {
  conversaId: string;
  mensagem: string;
  timestamp: string;
}

export interface ConversaUpdate {
  conversaId: string;
  status: string;
  timestamp: string;
}

export interface AgenteStatus {
  agenteId: string;
  status: 'online' | 'offline' | 'ocupado' | 'ausente';
  timestamp: string;
}

// ============================================================================
// ERRORES
// ============================================================================

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp?: string;
  path?: string;
  errors?: string[] | Record<string, any>;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// ============================================================================
// ESTRATÉGIAS
// ============================================================================

export interface ProcessarEstrategiaRequest {
  texto: string;
  mes: string;
  tamanho: number;
}

export interface EstrategiaExtraida {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'Limpeza' | 'Clareamento' | 'Implante' | 'Tratamento Estético' | 'Consulta' | 'Restauração' | 'Aparelho Ortodôntico';
  ativa: boolean;
  dataCriacao: string;
  dataAtivacao?: string;
  totalExecutions: number;
  taxaSucesso: number;
  criadoPor: string;
}

export interface ProcessarEstrategiaResponse {
  sucesso: boolean;
  erro?: string;
  detalhe?: string;
  estrategias?: EstrategiaExtraida[];
  total?: number;
  processadoEm?: string;
}

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
// CONVERSAS
// ============================================================================

export interface Conversa {
  id: string;
  sistemaId: string;
  titulo: string;
  descricao?: string;
  status: 'ativa' | 'fechada' | 'aguardando';
  nMensagens: number;
  ultimaMensagem?: string;
  criadoEm: string;
  atualizadoEm: string;
  agente?: string;
  cliente?: string;
}

export interface ConversaResponse {
  conversas: Conversa[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// CONTATOS
// ============================================================================

export interface Contato {
  id: string;
  sistemaId: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  tags: string[];
  notas?: string;
  criadoEm: string;
  atualizadoEm: string;
  ultimoContato?: string;
}

export interface ContatoResponse {
  contatos: Contato[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

export type ConfiguracaoTipo = 'notificacoes' | 'seguranca' | 'integracao' | 'equipe';

export interface ConfiguracaoNotificacoes {
  id: string;
  tipo: 'notificacoes';
  emailNotificacoes: boolean;
  smsNotificacoes: boolean;
  pushNotificacoes: boolean;
  notificacoesMarketing: boolean;
  frequencia: 'imediata' | 'diaria' | 'semanal';
}

export interface ConfiguracaoSeguranca {
  id: string;
  tipo: 'seguranca';
  autenticacaoDoisFatores: boolean;
  ultimaAlteracaoSenha?: string;
  sessoesAtivas: number;
  loginRecentes: {
    data: string;
    localizacao?: string;
    dispositivo?: string;
  }[];
}

export interface ConfiguracaoIntegracao {
  id: string;
  tipo: 'integracao';
  webhooks: {
    id: string;
    url: string;
    eventos: string[];
    ativa: boolean;
  }[];
  apiKeys: {
    id: string;
    nome: string;
    ativa: boolean;
    criadoEm: string;
  }[];
}

export interface ConfiguracaoEquipe {
  id: string;
  tipo: 'equipe';
  membros: {
    id: string;
    nome: string;
    email: string;
    role: 'admin' | 'manager' | 'agente' | 'visualizador';
    ativo: boolean;
  }[];
  convitesPendentes: {
    email: string;
    role: string;
    enviadoEm: string;
  }[];
}

export type Configuracao =
  | ConfiguracaoNotificacoes
  | ConfiguracaoSeguranca
  | ConfiguracaoIntegracao
  | ConfiguracaoEquipe;

// ============================================================================
// EXPANDIR USUARIO
// ============================================================================

export interface UsuarioExpandido extends Usuario {
  criadoEm: string;
  atualizadoEm: string;
  ultimoAcesso?: string;
}

export interface UsuarioResponse {
  usuarios: UsuarioExpandido[];
  total: number;
  limit: number;
  offset: number;
}

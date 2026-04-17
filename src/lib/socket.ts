/**
 * Socket.io Client para Real-time
 * Qualidade: Premium AAA
 */

import { io, Socket } from 'socket.io-client';
import { getToken } from './auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

// ============================================================================
// SOCKET INITIALIZATION
// ============================================================================

/**
 * Conectar ao servidor Socket.io
 */
export function connectSocket(usuarioId: string, sistemaId: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const token = getToken();

  if (!token) {
    throw new Error('Token não encontrado. Faça login antes de conectar ao socket.');
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  socket.on('connect', () => {
    console.log('✅ Socket conectado:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket desconectado:', reason);
  });

  socket.on('auth_error', (data) => {
    console.error('❌ Erro de autenticação:', data.message);
    socket?.disconnect();
  });

  socket.on('error', (error) => {
    console.error('❌ Erro no socket:', error);
  });

  return socket;
}

/**
 * Desconectar do servidor Socket.io
 */
export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Obter instância do socket
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Verificar se está conectado
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

// ============================================================================
// MESSAGE EVENTS
// ============================================================================

/**
 * Emitir nova mensagem
 */
export function emitNovaMsg(sistemaId: string, conversaId: string, mensagem: string): void {
  if (!socket?.connected) {
    console.warn('⚠️ Socket não conectado. Mensagem não foi enviada.');
    return;
  }

  socket.emit('mensagem:nova', {
    sistemaId,
    conversaId,
    mensagem,
  });
}

/**
 * Ouvir nova mensagem
 */
export function onNovaMsg(callback: (data: any) => void): void {
  if (!socket) {
    console.warn('⚠️ Socket não inicializado');
    return;
  }

  socket.on('mensagem:nova', callback);
}

// ============================================================================
// CONVERSATION EVENTS
// ============================================================================

/**
 * Emitir atualização de conversa
 */
export function emitAtualizarConversa(
  sistemaId: string,
  conversaId: string,
  status: string
): void {
  if (!socket?.connected) {
    console.warn('⚠️ Socket não conectado. Atualização não foi enviada.');
    return;
  }

  socket.emit('conversa:atualizar', {
    sistemaId,
    conversaId,
    status,
  });
}

/**
 * Ouvir conversa atualizada
 */
export function onConversaAtualizada(callback: (data: any) => void): void {
  if (!socket) {
    console.warn('⚠️ Socket não inicializado');
    return;
  }

  socket.on('conversa:atualizada', callback);
}

// ============================================================================
// AGENT STATUS EVENTS
// ============================================================================

/**
 * Emitir status do agente
 */
export function emitStatusAgente(
  sistemaId: string,
  agenteId: string,
  status: 'online' | 'offline' | 'ocupado' | 'ausente'
): void {
  if (!socket?.connected) {
    console.warn('⚠️ Socket não conectado. Status não foi enviado.');
    return;
  }

  socket.emit('agente:status', {
    sistemaId,
    agenteId,
    status,
  });
}

/**
 * Ouvir status do agente atualizado
 */
export function onStatusAgenteAtualizado(callback: (data: any) => void): void {
  if (!socket) {
    console.warn('⚠️ Socket não inicializado');
    return;
  }

  socket.on('agente:status-atualizado', callback);
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Remover listeners
 */
export function offEvent(event: string): void {
  if (socket) {
    socket.off(event);
  }
}

/**
 * Remover todos os listeners
 */
export function offAllEvents(): void {
  if (socket) {
    socket.removeAllListeners();
  }
}

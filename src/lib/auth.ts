/**
 * Utilitários de Autenticação
 * Qualidade: Premium AAA
 */

import Cookies from 'js-cookie';

const TOKEN_KEY = 'proclinic_token';
const USER_KEY = 'proclinic_user';

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Salvar token no cookie
 */
export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

/**
 * Obter token do cookie
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return Cookies.get(TOKEN_KEY) || null;
}

/**
 * Remover token
 */
export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
}

/**
 * Verificar se está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * Salvar dados do usuário
 */
export function setUser(user: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Obter dados do usuário
 */
export function getUser(): any {
  if (typeof window === 'undefined') {
    return null;
  }
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Remover dados do usuário
 */
export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Fazer logout (remover token e usuário)
 */
export function logout(): void {
  removeToken();
  removeUser();
}

// ============================================================================
// JWT DECODING (sem validação, apenas leitura)
// ============================================================================

/**
 * Decodificar JWT (apenas payload, sem validação)
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );

    return decoded;
  } catch (error) {
    console.error('❌ Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Verificar se token está expirado
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp está em segundos, Date.now() em ms
  const expiryTime = decoded.exp * 1000;
  return Date.now() >= expiryTime;
}

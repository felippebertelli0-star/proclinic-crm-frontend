/**
 * Cliente API com Axios
 * Qualidade: Premium AAA
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/types';
import { getToken, removeToken } from './auth';

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// ============================================================================
// INSTÂNCIA AXIOS
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// INTERCEPTADORES
// ============================================================================

/**
 * Request Interceptor: Adiciona JWT token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Trata erros e renovação de token
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Se receber 401, token inválido ou expirado
    if (error.response?.status === 401) {
      removeToken();
      // Redirecionar para login (será feito no provider)
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    // Se receber 403, sem permissão
    if (error.response?.status === 403) {
      console.error('❌ Acesso negado:', error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// MÉTODOS UTILITÁRIOS
// ============================================================================

/**
 * Extrair mensagem de erro da API
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError;

    if (Array.isArray(data?.message)) {
      return data.message[0];
    }

    return data?.message || error.message || 'Erro desconhecido';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro desconhecido';
}

/**
 * Verificar se é erro de rede
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response;
  }
  return false;
}

export default apiClient;

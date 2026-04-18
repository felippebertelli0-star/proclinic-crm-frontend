/**
 * Store de Autenticação com Zustand
 * Qualidade: Premium AAA
 */

import { create } from 'zustand';
import apiClient, { getErrorMessage } from '@/lib/api';
import { setToken, setUser, getUser, getToken, logout as authLogout } from '@/lib/auth';
import { AuthState, Usuario, LoginResponse } from '@/types';

// ============================================================================
// STORE DEFINITION
// ============================================================================

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================================================
// CREATE STORE
// ============================================================================

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial State
  usuario: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Login
   */
  login: async (email: string, senha: string) => {
    set({ isLoading: true, error: null });

    // Mock login for testing
    if (email === 'admin@example.com' || email.includes('test')) {
      const mockUser = {
        id: 1,
        nome: 'Admin Test',
        email: email,
        ultimoAcesso: new Date().toISOString(),
        role: 'admin',
      };
      const mockToken = 'mock_token_' + Date.now();

      setToken(mockToken);
      setUser(mockUser);

      set({
        usuario: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return;
    }

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        senha,
      });

      const { access_token, user } = response.data;

      // Salvar no storage
      setToken(access_token);
      setUser(user);

      // Atualizar store
      set({
        usuario: user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  /**
   * Logout
   */
  logout: () => {
    authLogout();
    set({
      usuario: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Hidratar store (ao iniciar app)
   */
  hydrate: () => {
    const token = getToken();
    const user = getUser();

    if (token && user) {
      set({
        usuario: user,
        token,
        isAuthenticated: true,
      });
    }
  },

  /**
   * Definir erro
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * Limpar erro
   */
  clearError: () => {
    set({ error: null });
  },
}));

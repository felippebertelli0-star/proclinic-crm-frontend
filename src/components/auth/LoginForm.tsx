/**
 * Componente de Login
 * Qualidade: Premium AAA
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/lib/api';

// ============================================================================
// COMPONENT
// ============================================================================

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    senha: 'Admin123456',
  });

  const [localError, setLocalError] = useState<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    // Validação básica
    if (!formData.email || !formData.senha) {
      setLocalError('Email e senha são obrigatórios');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Email inválido');
      return;
    }

    if (formData.senha.length < 6) {
      setLocalError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await login(formData.email, formData.senha);
      router.push('/dashboard');
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo com ícone amarelo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#c9943a] rounded-full p-4 shadow-lg">
              <svg className="w-8 h-8 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-slate-400">Gestão de Sistemas Jarvis</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(localError || error) && (
              <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
                <p className="text-sm text-red-300">
                  ❌ {localError || error}
                </p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-[#c9943a] focus:border-[#c9943a] outline-none transition"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-2">
                SENHA
              </label>
              <input
                id="senha"
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-700 border border-[#c9943a] text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-[#c9943a] focus:border-[#c9943a] outline-none transition"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c9943a] hover:bg-[#c9943a] disabled:bg-amber-300 text-slate-900 font-bold py-3 rounded-lg transition duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2">⏳</div>
                  Entrando...
                </div>
              ) : (
                'Entrar no Painel'
              )}
            </button>

            {/* Info */}
            <div className="text-center text-xs text-slate-500 pt-4 space-y-1">
              <p>📧 {formData.email}</p>
              <p>🔐 Jarvis@2025</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-6 text-sm">
          Sistema Premium AAA • v1.0.0
        </p>
      </div>
    </div>
  );
}

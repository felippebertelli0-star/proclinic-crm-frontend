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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ProClinic CRM</h1>
          <p className="text-blue-100">Login no seu sistema</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(localError || error) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  ❌ {localError || error}
                </p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2">⏳</div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Info */}
            <div className="text-center text-xs text-gray-600 pt-4">
              <p>Demo: admin@example.com / Admin123456</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 mt-6 text-sm">
          Sistema Premium AAA • v1.0.0
        </p>
      </div>
    </div>
  );
}

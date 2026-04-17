/**
 * Componente de Login - CRM ProClinic
 * Fiel ao protótipo aprovado em localhost:3456/
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

    if (!formData.email || !formData.senha) {
      setLocalError('Email e senha são obrigatórios');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Email inválido');
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
  // RENDER - Fiel ao protótipo localhost:3456/
  // ============================================================================

  return (
    <div style={{
      '--navy': '#0d1f2d',
      '--navy-mid': '#132636',
      '--navy-light': '#1a3347',
      '--navy-border': '#1e3d54',
      '--gold': '#c9943a',
      '--gold-light': '#e8b86d',
      '--gold-gradient': 'linear-gradient(135deg, #c9943a, #e8b86d, #c9943a)',
      '--text': '#e8edf2',
      '--text-muted': '#7a96aa',
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: '#0d1f2d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties}
    >
      {/* Background gradients */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse at 30% 50%, #1a3a5c44 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #c9943a11 0%, transparent 60%)',
      }} />

      {/* Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '20px',
        padding: '48px 44px',
        width: '420px',
        boxShadow: '0 30px 80px #00000066',
      }}>
        {/* Logo Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '36px',
        }}>
          <div style={{
            fontSize: '38px',
            fontWeight: 800,
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #c9943a, #e8b86d, #c9943a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            proclinic.
          </div>
          <div style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: '#7a96aa',
            marginTop: '4px',
            textTransform: 'uppercase',
          }}>
            inteligência comercial
          </div>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '6px',
          color: '#e8edf2',
        }}>
          Bem-vindo de volta
        </h2>
        <p style={{
          color: '#7a96aa',
          fontSize: '13px',
          marginBottom: '28px',
        }}>
          Acesse sua conta para continuar
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {(localError || error) && (
            <div style={{
              display: 'block',
              background: 'rgba(231, 76, 60, 0.12)',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '13px',
              color: '#e74c3c',
              textAlign: 'center',
            }}>
              {localError || error}
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#7a96aa',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}>
              E-MAIL
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
              style={{
                width: '100%',
                padding: '13px 16px',
                background: '#1a3347',
                border: '1px solid #1e3d54',
                borderRadius: '10px',
                color: '#e8edf2',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#7a96aa',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}>
              SENHA
            </label>
            <input
              id="senha"
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
              style={{
                width: '100%',
                padding: '13px 16px',
                background: '#1a3347',
                border: '1px solid #1e3d54',
                borderRadius: '10px',
                color: '#e8edf2',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #c9943a, #e8b86d, #c9943a)',
              border: 'none',
              borderRadius: '10px',
              color: '#0d1f2d',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isLoading ? 'default' : 'pointer',
              letterSpacing: '0.5px',
              marginTop: '8px',
              transition: 'opacity 0.2s, transform 0.1s',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                ⏳ Entrando...
              </span>
            ) : (
              'Entrar na plataforma →'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#7a96aa',
        }}>
          ProClinic — Inteligência Comercial · v1.0
        </div>
      </div>
    </div>
  );
}

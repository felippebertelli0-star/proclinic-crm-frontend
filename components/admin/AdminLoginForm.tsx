/**
 * Admin Login Form
 * Fiel ao protótipo localhost:3456/admin.html
 * Qualidade: Premium AAA
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: 'felippe@jarvis.com.br',
    senha: 'Jarvis@2025',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.email || !formData.senha) {
        setError('Email e senha são obrigatórios');
        return;
      }

      if (formData.email !== 'felippe@jarvis.com.br' || formData.senha !== 'Jarvis@2025') {
        setError('Email ou senha inválidos');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e12 0%, #0f1419 100%)',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: '#151d2a',
        border: '1px solid #2a3647',
        borderRadius: '20px',
        padding: '48px 44px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '36px',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontWeight: 800,
            fontSize: '32px',
            color: '#0f1419',
          }}>
            ⚙️
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 700,
            marginBottom: '8px',
            letterSpacing: '-0.5px',
            color: '#ffffff',
          }}>
            Painel Administrativo
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#7a8291',
          }}>
            Gestão de Sistemas Jarvis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(231, 76, 60, 0.12)',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13px',
              color: '#e74c3c',
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#b0b8c1',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}>
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
              style={{
                width: '100%',
                background: '#1a2332',
                border: '1px solid #2a3647',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#b0b8c1',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}>
              SENHA
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
              style={{
                width: '100%',
                background: '#1a2332',
                border: '1px solid #2a3647',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontWeight: 700,
              fontSize: '14px',
              color: '#0f1419',
              cursor: isLoading ? 'default' : 'pointer',
              marginTop: '8px',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                ⏳ Entrando...
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#7a8291',
          lineHeight: '1.6',
        }}>
          📧 felippe@jarvis.com.br<br />
          🔐 Jarvis@2025
        </div>
      </div>
    </div>
  );
}

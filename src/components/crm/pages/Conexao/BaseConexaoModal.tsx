/**
 * Base Conexao Modal - Componente base reutilizável para todos os modais
 * Qualidade: Ultra Premium AAA
 */

'use client';

import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface BaseConexaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  step?: { atual: number; total: number };
  accentColor: string;
  children: React.ReactNode;
  width?: number;
}

export default function BaseConexaoModal({
  isOpen,
  onClose,
  onBack,
  title,
  step,
  accentColor,
  children,
  width = 560,
}: BaseConexaoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          animation: 'fadeIn 0.25s ease',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(180deg, #16293c 0%, #0f1e2d 100%)',
          borderRadius: '18px',
          border: '1px solid rgba(90, 120, 140, 0.25)',
          boxShadow: `0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}15`,
          zIndex: 110,
          width: `${width}px`,
          maxWidth: '94%',
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Top gradient accent line */}
        <div
          style={{
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />

        {/* HEADER */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid rgba(90, 120, 140, 0.15)',
          }}
        >
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 11px',
                borderRadius: '8px',
                border: '1px solid rgba(90, 120, 140, 0.25)',
                background: 'rgba(15, 30, 45, 0.6)',
                color: '#e8edf2',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(90, 120, 140, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 30, 45, 0.6)';
              }}
            >
              <ArrowLeft size={13} />
              Voltar
            </button>
          )}

          <h2
            style={{
              flex: 1,
              fontSize: '15px',
              fontWeight: 700,
              margin: 0,
              color: '#e8edf2',
              letterSpacing: '-0.2px',
            }}
          >
            {title}
          </h2>

          {step && (
            <div
              style={{
                padding: '5px 11px',
                borderRadius: '99px',
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}45`,
                fontSize: '10.5px',
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '0.3px',
              }}
            >
              Passo {step.atual} de {step.total}
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#7a96aa',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e8edf2';
              e.currentTarget.style.background = 'rgba(90, 120, 140, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#7a96aa';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// HELPERS EXPORTADOS
// ============================================================================

export function ModalIcon({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '18px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          marginBottom: '14px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalTitle({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '22px' }}>
      <div style={{ fontSize: '20px', fontWeight: 800, color, marginBottom: '6px', letterSpacing: '-0.4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '13px', color: '#7a96aa', lineHeight: 1.5 }}>
        {subtitle}
      </div>
    </div>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '10.5px',
          fontWeight: 700,
          color: '#7a96aa',
          marginBottom: '6px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function PremiumInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '11px 13px',
        borderRadius: '9px',
        border: '1px solid rgba(90, 120, 140, 0.3)',
        background: 'rgba(15, 30, 45, 0.6)',
        color: '#e8edf2',
        fontSize: '13px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#3498db';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.15)';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)';
        e.currentTarget.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
    />
  );
}

export function PremiumButton({
  children,
  gradient,
  onClick,
  disabled,
  loading,
  icon,
}: {
  children: React.ReactNode;
  gradient: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%',
        padding: '13px',
        borderRadius: '11px',
        border: 'none',
        background: gradient,
        color: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s',
        boxShadow: '0 8px 22px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: disabled || loading ? 0.55 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.45)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 22px rgba(0, 0, 0, 0.3)';
      }}
    >
      {loading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            borderTopColor: '#fff',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      )}
      {!loading && icon}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

export function SecurityNote({ text, color = '#3498db' }: { text: string; color?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '11px 13px',
        borderRadius: '10px',
        background: `${color}15`,
        border: `1px solid ${color}30`,
        marginTop: '14px',
        marginBottom: '4px',
      }}
    >
      <span style={{ fontSize: '14px', marginTop: '1px' }}>🔒</span>
      <span style={{ fontSize: '11.5px', color: '#c6d5e0', lineHeight: 1.45 }}>{text}</span>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '11px 13px',
        borderRadius: '10px',
        background: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
      }}
    >
      <span style={{ fontSize: '14px' }}>⚠️</span>
      <span style={{ fontSize: '12px', color: '#fecaca', fontWeight: 500 }}>{message}</span>
    </div>
  );
}

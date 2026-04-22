/**
 * Toast System - Sistema de notificações premium
 * Qualidade: Ultra Premium AAA
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback silencioso - permite uso sem provider
    return {
      toasts: [],
      showToast: () => {},
      removeToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return ctx;
}

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: 'rgba(46, 204, 113, 0.15)', border: '#2ecc71', icon: '#2ecc71', text: '#a4eec4' },
  error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', icon: '#ef4444', text: '#fecaca' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', icon: '#f59e0b', text: '#fde68a' },
  info: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', icon: '#3b82f6', text: '#bfdbfe' },
};

const ICONS: Record<ToastType, React.ComponentType<{ size?: number; color?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newToast: Toast = { id, duration: 4000, ...toast };
    setToasts((prev) => [...prev, newToast]);
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => removeToast(id), newToast.duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => showToast({ type: 'success', title, message }), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast({ type: 'error', title, message }), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast({ type: 'warning', title, message }), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast({ type: 'info', title, message }), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [entering, setEntering] = useState(true);
  const colors = TOAST_COLORS[toast.type];
  const Icon = ICONS[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: '#132636',
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.border}`,
        borderRadius: '10px',
        padding: '14px 16px',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px ${colors.border}20`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        minWidth: '320px',
        pointerEvents: 'auto',
        transform: entering ? 'translateX(400px)' : 'translateX(0)',
        opacity: entering ? 0 : 1,
        transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={colors.icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8edf2', marginBottom: toast.message ? '3px' : 0 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: '11px', color: colors.text, lineHeight: 1.4 }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#7a96aa',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

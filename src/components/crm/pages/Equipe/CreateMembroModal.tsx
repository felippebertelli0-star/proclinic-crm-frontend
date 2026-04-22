/**
 * Modal: CreateMembroModal
 * Formulário para cadastro de novo membro da equipe
 * Premium AAA com validação completa
 */

'use client';

import { useState, useCallback } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Membro } from '@/store/equipeStore';

interface CreateMembroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (novoMembro: Omit<Membro, 'id' | 'conversas'>) => void;
}

interface FormData {
  nome: string;
  cargo: string;
  email: string;
  senha: string;
  avatarColor: string;
}

const CORES_DISPONIBLES = [
  { label: 'Rosa', valor: '#e91e63' },
  { label: 'Roxo', valor: '#9c27b0' },
  { label: 'Índigo', valor: '#3f51b5' },
  { label: 'Azul', valor: '#2196f3' },
  { label: 'Ciano', valor: '#00bcd4' },
  { label: 'Verde', valor: '#2ecc71' },
  { label: 'Âmbar', valor: '#ffc107' },
  { label: 'Laranja', valor: '#ff9800' },
];

export function CreateMembroModal({ isOpen, onClose, onCreate }: CreateMembroModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cargo: '',
    email: '',
    senha: '',
    avatarColor: '#e91e63',
  });
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (erro) setErro('');
    },
    [erro]
  );

  const validarFormulario = (): { valido: boolean; mensagem?: string } => {
    if (!formData.nome.trim() || formData.nome.trim().length < 3) {
      return { valido: false, mensagem: 'Nome deve ter pelo menos 3 caracteres' };
    }
    if (!formData.cargo.trim() || formData.cargo.trim().length < 2) {
      return { valido: false, mensagem: 'Cargo é obrigatório' };
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return { valido: false, mensagem: 'Email inválido' };
    }
    if (!formData.senha || formData.senha.length < 6) {
      return { valido: false, mensagem: 'Senha deve ter no mínimo 6 caracteres' };
    }
    if (!formData.avatarColor) {
      return { valido: false, mensagem: 'Selecione uma cor' };
    }
    return { valido: true };
  };

  const handleCriar = async () => {
    const validacao = validarFormulario();
    if (!validacao.valido) {
      setErro(validacao.mensagem || 'Validação falhou');
      return;
    }

    setCarregando(true);

    try {
      console.log('[CRIAR_MEMBRO] Criando novo membro:', formData.nome);

      const novoMembro: Omit<Membro, 'id' | 'conversas'> = {
        nome: formData.nome.trim(),
        cargo: formData.cargo.trim(),
        email: formData.email.trim(),
        status: 'Offline',
        tickets: 0,
        tmr: '0 min',
        avatarColor: formData.avatarColor,
        pipelineStats: {
          negociacao: 0,
          agendou: 0,
          convertido: 0,
          naoAgendou: 0,
        },
      };

      onCreate(novoMembro);

      // Reset form
      setFormData({
        nome: '',
        cargo: '',
        email: '',
        senha: '',
        avatarColor: '#e91e63',
      });
      setErro('');

      console.log('[CRIAR_MEMBRO] ✓ Membro criado com sucesso');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao criar membro';
      console.error('[CRIAR_MEMBRO] ✗ Erro:', mensagem);
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const avatarInitial = formData.nome ? formData.nome[0].toUpperCase() : '?';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#132636',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          zIndex: 50,
          maxWidth: '480px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #c9943a 0%, #a67c1f 100%)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0d1f2d' }}>
            Cadastrar Novo Membro
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#0d1f2d',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Avatar Preview */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: formData.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                color: '#fff',
                margin: '0 auto',
              }}
            >
              {avatarInitial}
            </div>
            <p style={{ color: '#7a96aa', fontSize: '12px', marginTop: '8px' }}>
              Preview do avatar
            </p>
          </div>

          {/* Erro */}
          {erro && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ color: '#ef4444' }} />
              <span style={{ color: '#fecaca', fontSize: '12px' }}>{erro}</span>
            </div>
          )}

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* Nome */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: João Silva"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: '1px solid #1e3d54',
                  borderRadius: '8px',
                  color: '#e8edf2',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Cargo */}
            <div>
              <label style={{ fontSize: '12px', color: '#7a96aa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Cargo
              </label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                placeholder="Ex: Gerente"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: '1px solid #1e3d54',
                  borderRadius: '8px',
                  color: '#e8edf2',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Status (informativo) */}
            <div>
              <label style={{ fontSize: '12px', color: '#7a96aa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Status Inicial
              </label>
              <div
                style={{
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: '1px solid #1e3d54',
                  borderRadius: '8px',
                  color: '#7a96aa',
                  fontSize: '13px',
                }}
              >
                Offline
              </div>
            </div>

            {/* Email */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ex: joao@example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: '1px solid #1e3d54',
                  borderRadius: '8px',
                  color: '#e8edf2',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Senha */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Senha (mín. 6 caracteres)
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: '1px solid #1e3d54',
                  borderRadius: '8px',
                  color: '#e8edf2',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Cores */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                Cor do Avatar
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {CORES_DISPONIBLES.map((cor) => (
                  <button
                    key={cor.valor}
                    onClick={() => setFormData((prev) => ({ ...prev, avatarColor: cor.valor }))}
                    title={cor.label}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: cor.valor,
                      border: formData.avatarColor === cor.valor ? '3px solid #c9943a' : '2px solid #1e3d54',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
              disabled={carregando}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                border: '1px solid #1e3d54',
                borderRadius: '8px',
                color: '#7a96aa',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: carregando ? 0.6 : 1,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleCriar}
              disabled={carregando}
              style={{
                padding: '10px 16px',
                background: '#c9943a',
                border: 'none',
                borderRadius: '8px',
                color: '#0d1f2d',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: carregando ? 0.6 : 1,
              }}
            >
              {carregando ? '⏳ Cadastrando...' : '✓ Cadastrar Membro'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Modal: CreateFilaModal
 * Criar nova fila com seleção de membros, cor, status e descrição
 * Validação completa com mensagens customizadas
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface CreateFilaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (novaFila: {
    nome: string;
    descricao?: string;
    cor: string;
    agenteIds: string[];
    status: 'ativa' | 'pausada';
  }) => Promise<void>;
  membros?: Array<{ id: string; nome: string; avatarColor: string; status: 'online' | 'offline' }>;
  carregando?: boolean;
}

interface FormData {
  nome: string;
  descricao: string;
  cor: string;
  agenteIds: string[];
  status: 'ativa' | 'pausada';
}

interface Erro {
  campo: string;
  mensagem: string;
}

// Paleta de 8 cores Premium AAA
const CORES_DISPONIVEIS = [
  { valor: '#c9943a', label: 'Ouro', nome: 'Ouro' },
  { valor: '#e91e63', label: 'Rosa', nome: 'Rosa' },
  { valor: '#9c27b0', label: 'Roxo', nome: 'Roxo' },
  { valor: '#3498db', label: 'Azul', nome: 'Azul' },
  { valor: '#2ecc71', label: 'Verde', nome: 'Verde' },
  { valor: '#f39c12', label: 'Laranja', nome: 'Laranja' },
  { valor: '#e74c3c', label: 'Vermelho', nome: 'Vermelho' },
  { valor: '#1abc9c', label: 'Teal', nome: 'Teal' },
];

const MAX_CARACTERES_NOME = 100;
const MAX_CARACTERES_DESCRICAO = 300;
const MIN_CARACTERES_NOME = 3;
const MAX_MEMBROS = 5;

export function CreateFilaModal({
  isOpen,
  onClose,
  onCreate,
  membros = [],
  carregando = false,
}: CreateFilaModalProps) {
  const [form, setForm] = useState<FormData>({
    nome: '',
    descricao: '',
    cor: '#c9943a',
    agenteIds: [],
    status: 'ativa',
  });

  const [erros, setErros] = useState<Erro[]>([]);
  const [processando, setProcessando] = useState(false);

  // Validar formulário
  const validarFormulario = (): boolean => {
    const novosErros: Erro[] = [];

    // Nome
    if (!form.nome || form.nome.trim().length === 0) {
      novosErros.push({
        campo: 'nome',
        mensagem: 'Nome é obrigatório',
      });
    } else if (form.nome.length < MIN_CARACTERES_NOME) {
      novosErros.push({
        campo: 'nome',
        mensagem: `Nome deve ter pelo menos ${MIN_CARACTERES_NOME} caracteres`,
      });
    } else if (form.nome.length > MAX_CARACTERES_NOME) {
      novosErros.push({
        campo: 'nome',
        mensagem: `Nome não pode exceder ${MAX_CARACTERES_NOME} caracteres`,
      });
    }

    // Cor
    if (!form.cor) {
      novosErros.push({
        campo: 'cor',
        mensagem: 'Selecione uma cor',
      });
    }

    // Agentes
    if (form.agenteIds.length === 0) {
      novosErros.push({
        campo: 'agenteIds',
        mensagem: 'Selecione pelo menos um membro da equipe',
      });
    } else if (form.agenteIds.length > MAX_MEMBROS) {
      novosErros.push({
        campo: 'agenteIds',
        mensagem: `Máximo ${MAX_MEMBROS} membros por fila`,
      });
    }

    setErros(novosErros);
    return novosErros.length === 0;
  };

  // Handler: Salvar fila
  const handleSalvar = async () => {
    if (!validarFormulario()) {
      console.log('[CREATE_FILA_MODAL] ✗ Validação falhou');
      return;
    }

    setProcessando(true);

    try {
      console.log('[CREATE_FILA_MODAL] ✓ Iniciando criação de fila:', form.nome);

      await onCreate({
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || undefined,
        cor: form.cor,
        agenteIds: form.agenteIds,
        status: form.status,
      });

      console.log('[CREATE_FILA_MODAL] ✓ Fila criada com sucesso');

      // Limpar formulário
      setForm({
        nome: '',
        descricao: '',
        cor: '#c9943a',
        agenteIds: [],
        status: 'ativa',
      });
      setErros([]);

      onClose();
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[CREATE_FILA_MODAL] ✗ Erro ao criar fila:', mensagem);
      setErros([
        {
          campo: 'geral',
          mensagem: `Erro ao criar fila: ${mensagem}`,
        },
      ]);
    } finally {
      setProcessando(false);
    }
  };

  // Handler: Toggle de agente
  const handleToggleAgente = (agenteId: string) => {
    setForm((prev) => {
      const novasIds = prev.agenteIds.includes(agenteId)
        ? prev.agenteIds.filter((id) => id !== agenteId)
        : [...prev.agenteIds, agenteId];

      return {
        ...prev,
        agenteIds: novasIds.slice(0, MAX_MEMBROS),
      };
    });
  };

  // Handler: Fechar modal (ESC ou click fora)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Obter erros por campo
  const errosCampo = useMemo(() => {
    const map = new Map<string, string>();
    erros.forEach((e) => {
      map.set(e.campo, e.mensagem);
    });
    return map;
  }, [erros]);

  // Verificar se tem erro geral
  const erroGeral = useMemo(() => {
    return erros.find((e) => e.campo === 'geral');
  }, [erros]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        onKeyDown={handleKeyDown}
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          width: '90%',
          maxWidth: '500px',
        }}
      >
        <div
          style={{
            background: '#132636',
            border: '1px solid rgba(201, 148, 58, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #c9943a 0%, #a6732f 100%)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              Nova Fila
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
            {/* Erro geral */}
            {erroGeral && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '8px',
                  color: '#ef4444',
                  fontSize: '13px',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                {erroGeral.mensagem}
              </div>
            )}

            {/* Nome */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#e8edf2', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Nome da Fila *
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (valor.length <= MAX_CARACTERES_NOME) {
                    setForm((prev) => ({ ...prev, nome: valor }));
                  }
                }}
                placeholder="Ex: Fila Principal"
                disabled={processando || carregando}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: errosCampo.has('nome') ? '1px solid #ef4444' : '1px solid rgba(201, 148, 58, 0.3)',
                  borderRadius: '8px',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  if (!errosCampo.has('nome')) {
                    e.currentTarget.style.borderColor = '#c9943a';
                  }
                }}
                onBlur={(e) => {
                  if (!errosCampo.has('nome')) {
                    e.currentTarget.style.borderColor = 'rgba(201, 148, 58, 0.3)';
                  }
                }}
              />
              <div style={{ fontSize: '11px', color: '#7a96aa', marginTop: '4px' }}>
                {form.nome.length}/{MAX_CARACTERES_NOME}
              </div>
              {errosCampo.has('nome') && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                  {errosCampo.get('nome')}
                </div>
              )}
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#e8edf2', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Descrição (Opcional)
              </label>
              <textarea
                value={form.descricao}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (valor.length <= MAX_CARACTERES_DESCRICAO) {
                    setForm((prev) => ({ ...prev, descricao: valor }));
                  }
                }}
                placeholder="Ex: Atendimento geral de pacientes"
                disabled={processando || carregando}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d1f2d',
                  border: '1px solid rgba(201, 148, 58, 0.3)',
                  borderRadius: '8px',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none',
                  height: '60px',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#c9943a';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 148, 58, 0.3)';
                }}
              />
              <div style={{ fontSize: '11px', color: '#7a96aa', marginTop: '4px' }}>
                {form.descricao.length}/{MAX_CARACTERES_DESCRICAO}
              </div>
            </div>

            {/* Cor */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#e8edf2', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Cor da Fila *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {CORES_DISPONIVEIS.map((cor) => (
                  <button
                    key={cor.valor}
                    onClick={() => setForm((prev) => ({ ...prev, cor: cor.valor }))}
                    disabled={processando || carregando}
                    aria-label={cor.nome}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: cor.valor,
                      border: form.cor === cor.valor ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      cursor: processando || carregando ? 'not-allowed' : 'pointer',
                      opacity: processando || carregando ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!processando && !carregando) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>
              {errosCampo.has('cor') && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>
                  {errosCampo.get('cor')}
                </div>
              )}
            </div>

            {/* Membros */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#e8edf2', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Selecionar Membros ({form.agenteIds.length}/{MAX_MEMBROS}) *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {membros.length === 0 ? (
                  <div style={{ color: '#7a96aa', fontSize: '12px', padding: '8px' }}>
                    Nenhum membro disponível
                  </div>
                ) : (
                  membros.map((membro) => (
                    <label
                      key={membro.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: '#0d1f2d',
                        border: '1px solid rgba(201, 148, 58, 0.2)',
                        borderRadius: '8px',
                        cursor: processando || carregando ? 'not-allowed' : 'pointer',
                        opacity: processando || carregando ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!processando && !carregando) {
                          e.currentTarget.style.background = 'rgba(201, 148, 58, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0d1f2d';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.agenteIds.includes(membro.id)}
                        onChange={() => handleToggleAgente(membro.id)}
                        disabled={processando || carregando || (form.agenteIds.length >= MAX_MEMBROS && !form.agenteIds.includes(membro.id))}
                        style={{
                          marginRight: '8px',
                          cursor: 'pointer',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: membro.avatarColor,
                          marginRight: '8px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#e8edf2', fontSize: '13px', fontWeight: 500 }}>
                          {membro.nome}
                        </div>
                        <div style={{ color: '#7a96aa', fontSize: '11px' }}>
                          {membro.status === 'online' ? '🟢 Online' : '⭕ Offline'}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              {errosCampo.has('agenteIds') && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>
                  {errosCampo.get('agenteIds')}
                </div>
              )}
            </div>

            {/* Status */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#e8edf2', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Status
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['ativa', 'pausada'].map((status) => (
                  <label
                    key={status}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: processando || carregando ? 'not-allowed' : 'pointer',
                      opacity: processando || carregando ? 0.6 : 1,
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={form.status === status}
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'ativa' | 'pausada' }))}
                      disabled={processando || carregando}
                      style={{ marginRight: '6px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#e8edf2', fontSize: '13px', textTransform: 'capitalize' }}>
                      {status === 'ativa' ? '🟢 Ativa' : '⭕ Pausada'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer com botões */}
          <div
            style={{
              padding: '16px 24px',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              borderTop: '1px solid rgba(201, 148, 58, 0.2)',
            }}
          >
            <button
              onClick={onClose}
              disabled={processando || carregando}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #7a96aa',
                color: '#7a96aa',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: processando || carregando ? 'not-allowed' : 'pointer',
                opacity: processando || carregando ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!processando && !carregando) {
                  e.currentTarget.style.background = 'rgba(122, 150, 170, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={processando || carregando}
              style={{
                padding: '10px 20px',
                background: form.nome && form.agenteIds.length > 0 ? 'linear-gradient(135deg, #c9943a 0%, #a6732f 100%)' : '#7a96aa',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: processando || carregando ? 'not-allowed' : 'pointer',
                opacity: processando || carregando ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!processando && !carregando && form.nome && form.agenteIds.length > 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(201, 148, 58, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {processando || carregando ? '⏳ Criando...' : '✓ Criar Fila'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateFilaModal;

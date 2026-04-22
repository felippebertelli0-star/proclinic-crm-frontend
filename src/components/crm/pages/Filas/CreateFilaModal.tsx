/**
 * Modal: CreateFilaModal
 * Criar nova fila com seleção de membros, cor, status e descrição
 * Validação completa com mensagens customizadas
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CORES_PADRAO } from '@/store/etiquetasStore';

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
  const pickerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    nome: '',
    descricao: '',
    cor: '#c9943a',
    agenteIds: [],
    status: 'ativa',
  });

  const [erros, setErros] = useState<Erro[]>([]);
  const [processando, setProcessando] = useState(false);
  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);
  const [searchMembros, setSearchMembros] = useState('');
  const [showMembrosDropdown, setShowMembrosDropdown] = useState(false);

  // Membros filtrados pela busca
  const membrosFiltrados = useMemo(() => {
    return membros.filter((m) =>
      m.nome.toLowerCase().includes(searchMembros.toLowerCase())
    );
  }, [membros, searchMembros]);

  // Handler para toggle de membro
  const handleToggleMembro = (membroId: string) => {
    setForm((prev) => ({
      ...prev,
      agenteIds: prev.agenteIds.includes(membroId)
        ? prev.agenteIds.filter((id) => id !== membroId)
        : [...prev.agenteIds, membroId],
    }));
  };

  // Handler para color picker avançado
  const handlePickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pickerRef.current) return;

    const rect = pickerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));

    const hue = percentage * 360;
    const cor = `hsl(${hue}, 100%, 50%)`;

    setForm((prev) => ({
      ...prev,
      cor,
    }));
  };

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

              {/* Paleta de cores padrão - Círculos pequenos */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {CORES_PADRAO.map((cor) => (
                  <button
                    key={cor}
                    onClick={() => setForm((prev) => ({ ...prev, cor }))}
                    disabled={processando || carregando}
                    title={cor}
                    aria-label={`Selecionar cor ${cor}`}
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: cor,
                      borderRadius: '50%',
                      border: form.cor === cor ? '2px solid white' : '2px solid transparent',
                      boxShadow: form.cor === cor ? '0 0 0 2px #0a1520, 0 0 0 3px white' : 'none',
                      cursor: processando || carregando ? 'not-allowed' : 'pointer',
                      opacity: processando || carregando ? 0.6 : 1,
                      transition: 'all 0.15s ease-out',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!processando && !carregando) {
                        e.currentTarget.style.transform = 'scale(1.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>

              {/* Color Picker Avançado */}
              <button
                onClick={() => setShowAdvancedPicker(!showAdvancedPicker)}
                disabled={processando || carregando}
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(201, 148, 58, 0.3)',
                  background: 'rgba(201, 148, 58, 0.1)',
                  color: '#c9943a',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: processando || carregando ? 'not-allowed' : 'pointer',
                  opacity: processando || carregando ? 0.6 : 1,
                  transition: 'all 0.15s ease-out',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!processando && !carregando) {
                    e.currentTarget.style.background = 'rgba(201, 148, 58, 0.2)';
                    e.currentTarget.style.borderColor = '#c9943a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!processando && !carregando) {
                    e.currentTarget.style.background = 'rgba(201, 148, 58, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(201, 148, 58, 0.3)';
                  }
                }}
              >
                {showAdvancedPicker ? '−' : '+'} Cor Personalizada
              </button>

              {/* Gradiente de cores avançado */}
              {showAdvancedPicker && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    ref={pickerRef}
                    onClick={handlePickerClick}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      cursor: 'crosshair',
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                      border: '1px solid rgba(201, 148, 58, 0.4)',
                      transition: 'all 0.15s ease-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#c9943a';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 148, 58, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 148, 58, 0.4)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#7a96aa', margin: '0', textAlign: 'center' }}>
                    Clique para escolher uma cor
                  </p>
                </div>
              )}

              {/* Preview da cor selecionada */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '12px', color: '#7a96aa' }}>
                <span>Preview:</span>
                <div
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '6px',
                    backgroundColor: form.cor,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '40px',
                  }}
                >
                  {form.nome || 'Sua Fila'}
                </div>
              </div>

              {errosCampo.has('cor') && (
                <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>
                  {errosCampo.get('cor')}
                </div>
              )}
            </div>

            {/* Membros com Busca */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#e8edf2', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Selecionar Membros ({form.agenteIds.length}/{MAX_MEMBROS}) *
              </label>

              {/* Campo de Busca */}
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Buscar membro..."
                  value={searchMembros}
                  onChange={(e) => setSearchMembros(e.target.value)}
                  disabled={processando || carregando}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0d1f2d',
                    border: errosCampo.has('agenteIds') ? '1px solid #ef4444' : '1px solid rgba(201, 148, 58, 0.3)',
                    borderRadius: '8px',
                    color: '#e8edf2',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease-out',
                    cursor: processando || carregando ? 'not-allowed' : 'text',
                    opacity: processando || carregando ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    setShowMembrosDropdown(true);
                    if (!errosCampo.has('agenteIds')) {
                      e.currentTarget.style.borderColor = '#c9943a';
                    }
                  }}
                  onBlur={(e) => {
                    setTimeout(() => setShowMembrosDropdown(false), 150);
                    if (!errosCampo.has('agenteIds')) {
                      e.currentTarget.style.borderColor = 'rgba(201, 148, 58, 0.3)';
                    }
                  }}
                />

                {/* Dropdown de Membros */}
                {showMembrosDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#0d1f2d',
                      border: '1px solid rgba(201, 148, 58, 0.3)',
                      borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {membrosFiltrados.length === 0 ? (
                      <div style={{ padding: '12px', color: '#7a96aa', fontSize: '12px', textAlign: 'center' }}>
                        {membros.length === 0 ? 'Nenhum membro disponível' : 'Nenhum membro encontrado'}
                      </div>
                    ) : (
                      membrosFiltrados.map((membro) => (
                        <button
                          key={membro.id}
                          onClick={() => handleToggleMembro(membro.id)}
                          disabled={processando || carregando || (form.agenteIds.length >= MAX_MEMBROS && !form.agenteIds.includes(membro.id))}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: form.agenteIds.includes(membro.id) ? 'rgba(201, 148, 58, 0.15)' : 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(201, 148, 58, 0.1)',
                            color: '#e8edf2',
                            fontSize: '13px',
                            cursor: processando || carregando ? 'not-allowed' : 'pointer',
                            opacity: processando || carregando ? 0.6 : 1,
                            textAlign: 'left',
                            transition: 'all 0.15s ease-out',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => {
                            if (!processando && !carregando) {
                              e.currentTarget.style.background = 'rgba(201, 148, 58, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = form.agenteIds.includes(membro.id) ? 'rgba(201, 148, 58, 0.15)' : 'transparent';
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={form.agenteIds.includes(membro.id)}
                            onChange={() => {}}
                            style={{
                              cursor: 'pointer',
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          <span>{membro.nome}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Tags dos Membros Selecionados */}
              {form.agenteIds.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {form.agenteIds.map((membroId) => {
                    const membro = membros.find((m) => m.id === membroId);
                    return membro ? (
                      <div
                        key={membroId}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          background: 'rgba(201, 148, 58, 0.2)',
                          border: '1px solid rgba(201, 148, 58, 0.4)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#e8edf2',
                        }}
                      >
                        <span>{membro.nome}</span>
                        <button
                          onClick={() => handleToggleMembro(membroId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#7a96aa',
                            cursor: 'pointer',
                            padding: '0',
                            fontSize: '14px',
                            transition: 'color 0.15s ease-out',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#7a96aa';
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

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

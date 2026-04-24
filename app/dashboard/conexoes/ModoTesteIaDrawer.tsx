/**
 * Drawer: Modo Teste IA
 * Gerencia por conexão: iaAtiva, iaModoTeste e allowlist de telefones.
 * Enquanto `iaModoTeste = true`, só números da allowlist acionam a IA.
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AllowlistItem,
  IaConfig,
  adicionarAllowlist,
  atualizarIaConfig,
  buscarIaConfig,
  listarAllowlist,
  removerAllowlist,
} from '@/lib/whatsappApi';

interface Props {
  sistemaId: string;
  conexaoId: string;
  conexaoNome: string;
  onClose: () => void;
}

function formatarTelefoneUi(tel: string): string {
  // "554491822697" → "+55 (44) 99182-2697" (melhor esforço)
  const d = tel.replace(/\D/g, '');
  if (d.length === 13 && d.startsWith('55')) {
    return `+55 (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  }
  if (d.length === 12 && d.startsWith('55')) {
    return `+55 (${d.slice(2, 4)}) ${d.slice(4, 8)}-${d.slice(8)}`;
  }
  return `+${d}`;
}

export function ModoTesteIaDrawer({ sistemaId, conexaoId, conexaoNome, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [config, setConfig] = useState<IaConfig | null>(null);
  const [allowlist, setAllowlist] = useState<AllowlistItem[]>([]);
  const [saving, setSaving] = useState(false);

  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [cfg, list] = await Promise.all([
        buscarIaConfig(sistemaId, conexaoId),
        listarAllowlist(sistemaId, conexaoId),
      ]);
      setConfig(cfg);
      setAllowlist(list);
    } catch (err: any) {
      setErro(err?.response?.data?.message || err?.message || 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, [sistemaId, conexaoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggle = async (field: 'iaAtiva' | 'iaModoTeste', valor: boolean) => {
    if (!config) return;
    setSaving(true);
    const anterior = config;
    setConfig({ ...config, [field]: valor });
    try {
      const atualizada = await atualizarIaConfig(sistemaId, conexaoId, { [field]: valor });
      setConfig((prev) => (prev ? { ...prev, ...atualizada } : prev));
    } catch (err: any) {
      setConfig(anterior);
      setErro(err?.response?.data?.message || 'Falha ao atualizar configuração');
    } finally {
      setSaving(false);
    }
  };

  const handleAdicionar = async () => {
    const tel = novoTelefone.trim();
    if (!tel) {
      setAddError('Informe o telefone');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const item = await adicionarAllowlist(sistemaId, conexaoId, {
        telefone: tel,
        nome: novoNome.trim() || undefined,
      });
      setAllowlist((prev) => [...prev, item]);
      setNovoTelefone('');
      setNovoNome('');
    } catch (err: any) {
      setAddError(
        err?.response?.data?.message || err?.message || 'Falha ao adicionar',
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemover = async (item: AllowlistItem) => {
    if (!confirm(`Remover ${formatarTelefoneUi(item.telefone)} da allowlist?`)) return;
    try {
      await removerAllowlist(sistemaId, conexaoId, item.id);
      setAllowlist((prev) => prev.filter((x) => x.id !== item.id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Falha ao remover');
    }
  };

  const iaVinculada = config?.ia;

  const avisoSeguranca = useMemo(() => {
    if (!config) return null;
    if (config.iaAtiva && !config.iaModoTeste) {
      return {
        tipo: 'warn' as const,
        texto:
          'Modo produção: a IA responderá TODOS os contatos que enviarem mensagem nesta conexão.',
      };
    }
    if (config.iaAtiva && config.iaModoTeste && allowlist.length === 0) {
      return {
        tipo: 'info' as const,
        texto:
          'IA ativa em modo teste, mas sem números liberados. Nenhum contato aciona a IA.',
      };
    }
    if (!config.iaAtiva) {
      return {
        tipo: 'info' as const,
        texto:
          'IA desligada nesta conexão. Todas as mensagens vão para atendimento humano.',
      };
    }
    return {
      tipo: 'ok' as const,
      texto: `Modo teste: ${allowlist.length} número(s) liberados acionam a IA. Demais contatos vão para atendimento humano.`,
    };
  }, [config, allowlist.length]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7,18,28,0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          height: '100%',
          background: '#0f2130',
          borderLeft: '1px solid #1e3d54',
          display: 'flex',
          flexDirection: 'column',
          color: '#e8edf2',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 22px',
            borderBottom: '1px solid #1e3d54',
            background: 'linear-gradient(135deg, rgba(201,148,58,0.12), transparent)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#c9943a', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                🧪 Modo Teste IA
              </div>
              <h2 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 800, color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conexaoNome}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#7a96aa' }}>
                Controle quais números acionam a IA antes do rollout.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #1e3d54',
                borderRadius: 8,
                color: '#7a96aa',
                fontSize: 18,
                width: 32,
                height: 32,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 28px' }}>
          {loading ? (
            <div style={{ color: '#7a96aa', fontSize: 13, padding: 20 }}>Carregando…</div>
          ) : erro ? (
            <div
              style={{
                background: 'rgba(231,76,60,0.1)',
                border: '1px solid rgba(231,76,60,0.3)',
                color: '#e74c3c',
                padding: 12,
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              {erro}
              <button
                onClick={carregar}
                style={{
                  marginLeft: 10,
                  background: 'transparent',
                  border: '1px solid #e74c3c',
                  color: '#e74c3c',
                  padding: '4px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              {/* IA vinculada */}
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  border: '1px solid #1e3d54',
                  background: 'rgba(19,38,54,0.6)',
                  marginBottom: 14,
                }}
              >
                <div style={{ fontSize: 10, color: '#7a96aa', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
                  IA vinculada
                </div>
                {iaVinculada ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{iaVinculada.nome}</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 8,
                        background: iaVinculada.status === 'ativa' ? 'rgba(46,204,113,0.15)' : 'rgba(122,150,170,0.15)',
                        color: iaVinculada.status === 'ativa' ? '#2ecc71' : '#7a96aa',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                      }}
                    >
                      {iaVinculada.status}
                    </span>
                    <span style={{ fontSize: 11, color: '#7a96aa' }}>modo: {iaVinculada.modo}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#f39c12' }}>
                    ⚠️ Nenhuma IA está apontando para esta conexão. Vincule uma IA em
                    {' '}
                    <code style={{ fontFamily: 'monospace', background: '#132636', padding: '2px 6px', borderRadius: 4 }}>
                      /admin/jarvis
                    </code>
                    {' '}antes de ativar.
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <ToggleRow
                  label="IA ativa nesta conexão"
                  hint="Liga/desliga o acionamento automático da IA pelo webhook."
                  value={!!config?.iaAtiva}
                  onChange={(v) => toggle('iaAtiva', v)}
                  disabled={saving || !iaVinculada}
                  color="#2ecc71"
                />
                <ToggleRow
                  label="Modo teste (somente allowlist)"
                  hint="Quando ligado, apenas números abaixo acionam a IA."
                  value={!!config?.iaModoTeste}
                  onChange={(v) => toggle('iaModoTeste', v)}
                  disabled={saving}
                  color="#c9943a"
                />
              </div>

              {/* Aviso */}
              {avisoSeguranca && (
                <div
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    fontSize: 12,
                    marginBottom: 18,
                    background:
                      avisoSeguranca.tipo === 'warn'
                        ? 'rgba(231,76,60,0.08)'
                        : avisoSeguranca.tipo === 'ok'
                        ? 'rgba(46,204,113,0.08)'
                        : 'rgba(52,152,219,0.08)',
                    border:
                      avisoSeguranca.tipo === 'warn'
                        ? '1px solid rgba(231,76,60,0.3)'
                        : avisoSeguranca.tipo === 'ok'
                        ? '1px solid rgba(46,204,113,0.3)'
                        : '1px solid rgba(52,152,219,0.3)',
                    color:
                      avisoSeguranca.tipo === 'warn'
                        ? '#e74c3c'
                        : avisoSeguranca.tipo === 'ok'
                        ? '#2ecc71'
                        : '#3498db',
                  }}
                >
                  {avisoSeguranca.tipo === 'warn' ? '⚠️ ' : avisoSeguranca.tipo === 'ok' ? '✅ ' : 'ℹ️ '}
                  {avisoSeguranca.texto}
                </div>
              )}

              {/* Allowlist */}
              <div
                style={{
                  fontSize: 11,
                  color: '#7a96aa',
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span>Números liberados</span>
                <span style={{ color: '#c9943a', fontWeight: 900 }}>{allowlist.length}</span>
              </div>

              {/* Form adicionar */}
              <div
                style={{
                  border: '1px solid #1e3d54',
                  background: '#132636',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 14,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
              >
                <input
                  type="tel"
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                  placeholder="Telefone (ex: 44 99182-2697)"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Nome (opcional)"
                  style={inputStyle}
                />
                <button
                  onClick={handleAdicionar}
                  disabled={addLoading}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '9px 14px',
                    background: '#c9943a',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0d1f2d',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: addLoading ? 'wait' : 'pointer',
                    opacity: addLoading ? 0.6 : 1,
                  }}
                >
                  {addLoading ? 'Adicionando…' : '+ Liberar este número'}
                </button>
                {addError && (
                  <div style={{ gridColumn: '1 / -1', color: '#e74c3c', fontSize: 11 }}>{addError}</div>
                )}
              </div>

              {/* Lista */}
              {allowlist.length === 0 ? (
                <div
                  style={{
                    padding: 22,
                    borderRadius: 10,
                    border: '1px dashed #1e3d54',
                    color: '#7a96aa',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  Nenhum número liberado. Adicione contatos da clínica para começar os testes.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {allowlist.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        border: '1px solid #1e3d54',
                        background: '#132636',
                        borderRadius: 10,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                          {formatarTelefoneUi(item.telefone)}
                        </div>
                        {item.nome && (
                          <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>
                            {item.nome}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemover(item)}
                        style={{
                          padding: '6px 10px',
                          background: 'transparent',
                          border: '1px solid rgba(231,76,60,0.4)',
                          color: '#e74c3c',
                          fontSize: 11,
                          fontWeight: 700,
                          borderRadius: 7,
                          cursor: 'pointer',
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
  disabled,
  color,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 14px',
        border: '1px solid #1e3d54',
        background: 'rgba(19,38,54,0.6)',
        borderRadius: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>{hint}</div>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        aria-pressed={value}
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          border: 'none',
          background: value ? color : '#1e3d54',
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 10px',
  background: '#0d1f2d',
  border: '1px solid #1e3d54',
  borderRadius: 8,
  color: '#e8edf2',
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
};

/**
 * Página: Conexões (WhatsApp real via Evolution API)
 * Pareamento via QR Code dentro da própria UI.
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/components/crm/pages/Calendario.module.css';
import { useAuthStore } from '@/store/authStore';
import {
  WhatsappConexao,
  listarConexoesWhatsapp,
  criarConexaoWhatsapp,
  buscarQrCodeWhatsapp,
  buscarStatusWhatsapp,
  removerConexaoWhatsapp,
  isMockToken,
} from '@/lib/whatsappApi';
import { ModoTesteIaDrawer } from './ModoTesteIaDrawer';

interface QrModalState {
  conexaoId: string;
  nome: string;
  qrCodeBase64?: string;
  pairingCode?: string;
  status: string;
  erro?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  conectado: { label: '✅ Conectado', color: '#2ecc71' },
  aguardando_qr: { label: '⏳ Aguardando QR', color: '#f39c12' },
  desconectado: { label: '⚠️ Desconectado', color: '#e74c3c' },
  erro: { label: '❌ Erro', color: '#e74c3c' },
  inativo: { label: '○ Inativo', color: '#7a96aa' },
};

export default function ConexoesPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const hydrate = useAuthStore((s) => s.hydrate);
  const sistemaId = usuario?.sistemaId;

  const [conexoes, setConexoes] = useState<WhatsappConexao[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [criarOpen, setCriarOpen] = useState(false);
  const [criarNome, setCriarNome] = useState('');
  const [criarDescricao, setCriarDescricao] = useState('');
  const [criarNumero, setCriarNumero] = useState('');
  const [criarLoading, setCriarLoading] = useState(false);

  const [qrModal, setQrModal] = useState<QrModalState | null>(null);
  const qrPollRef = useRef<{ status?: number; refresh?: number }>({});

  // Drawer Modo Teste IA (por conexão)
  const [iaDrawer, setIaDrawer] = useState<{ conexaoId: string; nome: string } | null>(null);

  const mockMode = isMockToken();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const carregarConexoes = useCallback(async () => {
    if (!sistemaId || mockMode) {
      setLoading(false);
      setConexoes([]);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listarConexoesWhatsapp(sistemaId);
      setConexoes(data);
    } catch (err: any) {
      setLoadError(err?.response?.data?.message || err?.message || 'Erro ao carregar conexões');
      setConexoes([]);
    } finally {
      setLoading(false);
    }
  }, [sistemaId, mockMode]);

  useEffect(() => {
    carregarConexoes();
  }, [carregarConexoes]);

  // ─── QR Modal lifecycle ────────────────────────────────────────────
  const pararPolling = () => {
    if (qrPollRef.current.status) {
      clearInterval(qrPollRef.current.status);
      qrPollRef.current.status = undefined;
    }
    if (qrPollRef.current.refresh) {
      clearInterval(qrPollRef.current.refresh);
      qrPollRef.current.refresh = undefined;
    }
  };

  const fecharQrModal = () => {
    pararPolling();
    setQrModal(null);
    carregarConexoes();
  };

  const atualizarQr = useCallback(async (conexaoId: string) => {
    if (!sistemaId) return;
    try {
      const resp = await buscarQrCodeWhatsapp(sistemaId, conexaoId);
      setQrModal((prev) =>
        prev && prev.conexaoId === conexaoId
          ? { ...prev, qrCodeBase64: resp.qrCodeBase64, pairingCode: resp.pairingCode, erro: undefined }
          : prev,
      );
    } catch (err: any) {
      setQrModal((prev) =>
        prev && prev.conexaoId === conexaoId
          ? { ...prev, erro: err?.response?.data?.message || err?.message || 'Falha ao atualizar QR' }
          : prev,
      );
    }
  }, [sistemaId]);

  const verificarStatus = useCallback(async (conexaoId: string) => {
    if (!sistemaId) return;
    try {
      const resp = await buscarStatusWhatsapp(sistemaId, conexaoId);
      setQrModal((prev) => {
        if (!prev || prev.conexaoId !== conexaoId) return prev;
        if (resp.status === 'conectado') {
          // pareado com sucesso — fecha em seguida
          setTimeout(() => fecharQrModal(), 800);
        }
        return { ...prev, status: resp.status };
      });
    } catch {
      /* silencia erros transientes */
    }
  }, [sistemaId]);

  // Ao abrir o QR modal, inicia polling
  useEffect(() => {
    if (!qrModal) return;
    pararPolling();
    qrPollRef.current.status = window.setInterval(() => {
      verificarStatus(qrModal.conexaoId);
    }, 3000);
    qrPollRef.current.refresh = window.setInterval(() => {
      atualizarQr(qrModal.conexaoId);
    }, 30000);
    return () => pararPolling();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrModal?.conexaoId]);

  // ─── Criar conexão ────────────────────────────────────────────────
  const handleCriar = async () => {
    if (!sistemaId) return;
    if (!criarNome.trim()) {
      alert('Informe um nome para a conexão');
      return;
    }
    setCriarLoading(true);
    try {
      const resp = await criarConexaoWhatsapp(sistemaId, {
        nome: criarNome.trim(),
        descricao: criarDescricao.trim() || undefined,
        numero: criarNumero.trim() || undefined,
      });
      setCriarOpen(false);
      setCriarNome('');
      setCriarDescricao('');
      setCriarNumero('');
      setQrModal({
        conexaoId: resp.conexaoId,
        nome: criarNome,
        qrCodeBase64: resp.qrCodeBase64,
        pairingCode: resp.pairingCode,
        status: resp.status,
      });
      carregarConexoes();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Falha ao criar conexão');
    } finally {
      setCriarLoading(false);
    }
  };

  const handleReconectar = async (c: WhatsappConexao) => {
    if (!sistemaId) return;
    setQrModal({ conexaoId: c.id, nome: c.nome, status: c.status });
    await atualizarQr(c.id);
  };

  const handleRemover = async (c: WhatsappConexao) => {
    if (!sistemaId) return;
    if (!confirm(`Remover a conexão "${c.nome}"? Essa ação desconecta o WhatsApp.`)) return;
    try {
      await removerConexaoWhatsapp(sistemaId, c.id);
      carregarConexoes();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Falha ao remover');
    }
  };

  // ─── Derivados ────────────────────────────────────────────────────
  const conexaoStats = useMemo(() => {
    return {
      total: conexoes.length,
      conectadas: conexoes.filter((c) => c.status === 'conectado').length,
      desconectadas: conexoes.filter((c) => c.status === 'desconectado').length,
      aguardando: conexoes.filter((c) => c.status === 'aguardando_qr').length,
    };
  }, [conexoes]);

  const conexoesFiltradas = useMemo(() => {
    let res = conexoes;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      res = res.filter(
        (c) =>
          c.nome.toLowerCase().includes(q) ||
          (c.descricao ?? '').toLowerCase().includes(q),
      );
    }
    if (statusFilter) res = res.filter((c) => c.status === statusFilter);
    return res;
  }, [conexoes, searchTerm, statusFilter]);

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Conexões WhatsApp</h1>
          <p className={styles.subtitle}>
            Pareie um número WhatsApp para alimentar a IA de atendimento Aurora.
          </p>

          <div className={styles.botoesContainer}>
            <button
              onClick={() => setStatusFilter('')}
              className={`${styles.botaoMes} ${!statusFilter ? styles.active : ''}`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('conectado')}
              className={`${styles.botaoMes} ${statusFilter === 'conectado' ? styles.active : ''}`}
            >
              Conectadas
            </button>
            <button
              onClick={() => setStatusFilter('aguardando_qr')}
              className={`${styles.botaoMes} ${statusFilter === 'aguardando_qr' ? styles.active : ''}`}
            >
              Aguardando
            </button>
            <button
              onClick={() => setStatusFilter('desconectado')}
              className={`${styles.botaoMes} ${statusFilter === 'desconectado' ? styles.active : ''}`}
            >
              Desconectadas
            </button>
          </div>
        </div>

        <button
          className={styles.btnNova}
          onClick={() => setCriarOpen(true)}
          disabled={mockMode}
          title={mockMode ? 'Faça login real para criar conexões' : 'Nova conexão WhatsApp'}
        >
          🔌 Nova Conexão WhatsApp
        </button>
      </div>

      {mockMode && (
        <div
          style={{
            background: 'rgba(243,156,18,0.08)',
            border: '1px solid rgba(243,156,18,0.3)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
            color: '#f39c12',
            fontSize: 13,
          }}
        >
          ⚠️ Modo demo ativo. Faça login real para conectar o WhatsApp.
        </div>
      )}

      {loadError && (
        <div
          style={{
            background: 'rgba(231,76,60,0.1)',
            border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
            color: '#e74c3c',
            fontSize: 13,
          }}
        >
          ❌ {loadError}
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>{conexaoStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Conectadas</span>
          <span className={styles.statValue}>{conexaoStats.conectadas}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Aguardando QR</span>
          <span className={styles.statValue}>{conexaoStats.aguardando}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Desconectadas</span>
          <span className={styles.statValue}>{conexaoStats.desconectadas}</span>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>Carregando conexões...</p>
        </div>
      ) : conexoesFiltradas.length > 0 ? (
        <div className={styles.gridCards}>
          {conexoesFiltradas.map((c) => {
            const statusInfo = STATUS_LABELS[c.status] || {
              label: c.status,
              color: '#7a96aa',
            };
            return (
              <div key={c.id} className={styles.estrategiaCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{c.nome}</h3>
                  <span
                    className={styles.cardType}
                    style={{ color: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {c.descricao && (
                  <p className={styles.cardDescription}>{c.descricao}</p>
                )}

                <div className={styles.cardStats}>
                  {c.ownerJid && (
                    <div className={styles.statItem}>
                      <span className={styles.statItemLabel}>Número pareado</span>
                      <span
                        className={styles.statItemValue}
                        style={{ fontSize: 12 }}
                      >
                        {c.ownerJid.replace(/@.*/, '')}
                      </span>
                    </div>
                  )}
                  {c.instanceName && (
                    <div className={styles.statItem}>
                      <span className={styles.statItemLabel}>Instância</span>
                      <span
                        className={styles.statItemValue}
                        style={{ fontSize: 11, wordBreak: 'break-all' }}
                      >
                        {c.instanceName}
                      </span>
                    </div>
                  )}
                  <div className={styles.statItem}>
                    <span className={styles.statItemLabel}>Criada em</span>
                    <span className={styles.statItemValue} style={{ fontSize: 11 }}>
                      {new Date(c.criadoEm).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {c.status !== 'conectado' && (
                    <button
                      onClick={() => handleReconectar(c)}
                      style={{
                        flex: '1 1 120px',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #c9943a',
                        background: 'transparent',
                        color: '#c9943a',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      📷 Parear QR
                    </button>
                  )}
                  <button
                    onClick={() => setIaDrawer({ conexaoId: c.id, nome: c.nome })}
                    title="Modo Teste IA (allowlist)"
                    style={{
                      flex: '1 1 120px',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(155,89,182,0.5)',
                      background: 'rgba(155,89,182,0.08)',
                      color: '#b07fd9',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🧪 Modo Teste IA
                  </button>
                  <button
                    onClick={() => handleRemover(c)}
                    style={{
                      flex: '1 1 120px',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(231,76,60,0.5)',
                      background: 'transparent',
                      color: '#e74c3c',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🗑 Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔌</div>
          <p className={styles.emptyTitle}>Nenhuma conexão WhatsApp</p>
          <p className={styles.emptySubtitle}>
            Clique em &ldquo;Nova Conexão WhatsApp&rdquo; para parear seu número.
          </p>
        </div>
      )}

      {/* ───────── Modal: Nova conexão ───────── */}
      {criarOpen && (
        <div
          onClick={() => !criarLoading && setCriarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7,18,28,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 480,
              color: '#e8edf2',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#c9943a' }}>
              Nova conexão WhatsApp
            </h2>
            <p style={{ margin: '6px 0 20px', color: '#7a96aa', fontSize: 12 }}>
              Crie uma instância Evolution. O QR Code aparecerá em seguida para pareamento.
            </p>

            <label style={{ display: 'block', fontSize: 11, color: '#7a96aa', marginBottom: 6 }}>
              Nome da conexão *
            </label>
            <input
              type="text"
              value={criarNome}
              onChange={(e) => setCriarNome(e.target.value)}
              placeholder="Ex: Recepção Principal"
              autoFocus
              style={inputStyle}
            />

            <label style={{ display: 'block', fontSize: 11, color: '#7a96aa', margin: '14px 0 6px' }}>
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={criarDescricao}
              onChange={(e) => setCriarDescricao(e.target.value)}
              placeholder="Ex: WhatsApp Business da clínica"
              style={inputStyle}
            />

            <label style={{ display: 'block', fontSize: 11, color: '#7a96aa', margin: '14px 0 6px' }}>
              Número (opcional, com DDI — ex: 5511999998888)
            </label>
            <input
              type="text"
              value={criarNumero}
              onChange={(e) => setCriarNumero(e.target.value)}
              placeholder="5511999998888"
              style={inputStyle}
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button
                onClick={() => setCriarOpen(false)}
                disabled={criarLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCriar}
                disabled={criarLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: criarLoading ? 0.6 : 1,
                }}
              >
                {criarLoading ? 'Criando...' : 'Criar e gerar QR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── Modal: QR Code ───────── */}
      {qrModal && (
        <div
          onClick={fecharQrModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7,18,28,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 460,
              color: '#e8edf2',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#c9943a' }}>
              Parear WhatsApp — {qrModal.nome}
            </h2>
            <p style={{ margin: '8px 0 20px', color: '#7a96aa', fontSize: 12 }}>
              Abra o WhatsApp no celular → <b>Mais opções</b> → <b>Aparelhos conectados</b> → <b>Conectar aparelho</b> e aponte a câmera.
            </p>

            {qrModal.status === 'conectado' ? (
              <div style={{ padding: 40, fontSize: 18, color: '#2ecc71', fontWeight: 700 }}>
                ✅ Conectado!
              </div>
            ) : qrModal.qrCodeBase64 ? (
              <div
                style={{
                  background: '#fff',
                  padding: 16,
                  borderRadius: 12,
                  display: 'inline-block',
                  margin: '0 auto',
                }}
              >
                <img
                  src={
                    qrModal.qrCodeBase64.startsWith('data:')
                      ? qrModal.qrCodeBase64
                      : `data:image/png;base64,${qrModal.qrCodeBase64}`
                  }
                  alt="QR Code"
                  style={{ width: 280, height: 280, display: 'block' }}
                />
              </div>
            ) : (
              <div style={{ padding: 40, color: '#7a96aa' }}>Gerando QR Code...</div>
            )}

            {qrModal.pairingCode && (
              <div style={{ marginTop: 16, fontSize: 12, color: '#7a96aa' }}>
                Ou use o código:{' '}
                <b style={{ color: '#c9943a', letterSpacing: 2 }}>
                  {qrModal.pairingCode}
                </b>
              </div>
            )}

            {qrModal.erro && (
              <div style={{ marginTop: 16, color: '#e74c3c', fontSize: 12 }}>
                ❌ {qrModal.erro}
              </div>
            )}

            <div style={{ marginTop: 14, fontSize: 11, color: '#7a96aa' }}>
              Status:{' '}
              <b style={{ color: STATUS_LABELS[qrModal.status]?.color || '#7a96aa' }}>
                {STATUS_LABELS[qrModal.status]?.label || qrModal.status}
              </b>
              {qrModal.status !== 'conectado' && ' · O QR atualiza automaticamente a cada 30s'}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button
                onClick={() => atualizarQr(qrModal.conexaoId)}
                disabled={qrModal.status === 'conectado'}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #c9943a',
                  background: 'transparent',
                  color: '#c9943a',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: qrModal.status === 'conectado' ? 0.4 : 1,
                }}
              >
                🔄 Atualizar QR
              </button>
              <button
                onClick={fecharQrModal}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── Drawer: Modo Teste IA ───────── */}
      {iaDrawer && sistemaId && (
        <ModoTesteIaDrawer
          sistemaId={sistemaId}
          conexaoId={iaDrawer.conexaoId}
          conexaoNome={iaDrawer.nome}
          onClose={() => setIaDrawer(null)}
        />
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #1e3d54',
  background: '#0d1f2d',
  color: '#e8edf2',
  fontSize: 13,
  outline: 'none',
};

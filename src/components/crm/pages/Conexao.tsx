'use client';

import { useState, useEffect } from 'react';
import {
  Camera,
  MessageCircle,
  Send,
  Mail,
  Link as LinkIcon,
  Plus,
  X,
} from 'lucide-react';
import { useConexoesStore, type PlatformType, type Conexao } from '@/store/conexoesStore';
import ConexaoWhatsAppModal from './Conexao/ConexaoWhatsAppModal';
import ConexaoInstagramModal from './Conexao/ConexaoInstagramModal';
import ConexaoTelegramModal from './Conexao/ConexaoTelegramModal';
import ConexaoEmailModal from './Conexao/ConexaoEmailModal';
import ConexaoFacebookModal from './Conexao/ConexaoFacebookModal';

type ModalType = PlatformType | null;

const PLATAFORMAS = [
  { id: 'whatsapp', nome: 'WhatsApp', icon: MessageCircle, cor: '#25D366' },
  { id: 'instagram', nome: 'Instagram', icon: Camera, cor: '#E4405F' },
  { id: 'telegram', nome: 'Telegram', icon: Send, cor: '#0088cc' },
  { id: 'email', nome: 'Email', icon: Mail, cor: '#EA4335' },
  { id: 'facebook_messenger', nome: 'Facebook Messenger', icon: LinkIcon, cor: '#0084FF' },
];

export function Conexao() {
  const conexoes = useConexoesStore((state) => state.conexoes);
  const hydrate = useConexoesStore((state) => state.hydrate);
  const updateConexao = useConexoesStore((state) => state.updateConexao);
  const desconectar = useConexoesStore((state) => state.desconectar);

  const [modalAberto, setModalAberto] = useState<ModalType>(null);
  const [contatoParaExcluir, setContatoParaExcluir] = useState<string | null>(null);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const getConexaoAtiva = (platform: PlatformType): Conexao | undefined => {
    return conexoes.find(c => c.platform === platform && c.status === 'connected');
  };

  const handleDesconectar = (id: string) => {
    desconectar(id);
    setContatoParaExcluir(null);
  };

  const getPlatformaInfo = (platformId: string) => {
    return PLATAFORMAS.find((p) => p.id === platformId);
  };

  return (
    <div
      style={{
        padding: '24px',
        background: '#0d1f2d',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'auto',
        scrollbarGutter: 'stable',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>
          Conexões
        </h1>
        <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>
          Integre suas plataformas de comunicação
        </p>
      </div>

      {/* Grid de Plataformas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {PLATAFORMAS.map((plataforma) => {
          const conexaoAtiva = getConexaoAtiva(plataforma.id as PlatformType);
          const Icon = plataforma.icon;

          return (
            <div
              key={plataforma.id}
              style={{
                background: 'rgba(25, 45, 65, 0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(90, 120, 140, 0.3)',
                borderRadius: '14px',
                padding: '20px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.5)';
                e.currentTarget.style.background = 'rgba(25, 45, 65, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)';
                e.currentTarget.style.background = 'rgba(25, 45, 65, 0.5)';
              }}
            >
              {/* Header da Plataforma */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: plataforma.cor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${plataforma.cor}40`,
                  }}
                >
                  <Icon size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0' }}>
                    {plataforma.nome}
                  </h3>
                  <div
                    style={{
                      fontSize: '11px',
                      color: conexaoAtiva ? '#2ecc71' : '#7a96aa',
                      fontWeight: 500,
                    }}
                  >
                    {conexaoAtiva ? '● Conectado' : '○ Desconectado'}
                  </div>
                </div>
              </div>

              {/* Status / Info */}
              {conexaoAtiva ? (
                <div
                  style={{
                    background: 'rgba(46, 204, 113, 0.12)',
                    border: '1px solid rgba(46, 204, 113, 0.3)',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  {conexaoAtiva.accountInfo.username && (
                    <div style={{ fontSize: '11px', color: '#e8edf2', marginBottom: '4px' }}>
                      <span style={{ color: '#7a96aa' }}>Usuário:</span> @{conexaoAtiva.accountInfo.username}
                    </div>
                  )}
                  {conexaoAtiva.accountInfo.email && (
                    <div style={{ fontSize: '11px', color: '#e8edf2', marginBottom: '4px' }}>
                      <span style={{ color: '#7a96aa' }}>Email:</span> {conexaoAtiva.accountInfo.email}
                    </div>
                  )}
                  {conexaoAtiva.accountInfo.phone && (
                    <div style={{ fontSize: '11px', color: '#e8edf2', marginBottom: '4px' }}>
                      <span style={{ color: '#7a96aa' }}>Telefone:</span> {conexaoAtiva.accountInfo.phone}
                    </div>
                  )}
                  {conexaoAtiva.accountInfo.name && (
                    <div style={{ fontSize: '11px', color: '#e8edf2' }}>
                      <span style={{ color: '#7a96aa' }}>Nome:</span> {conexaoAtiva.accountInfo.name}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    background: 'rgba(120, 130, 140, 0.12)',
                    border: '1px solid rgba(120, 130, 140, 0.2)',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '11px',
                    color: '#7a96aa',
                    textAlign: 'center',
                  }}
                >
                  Nenhuma conexão ativa
                </div>
              )}

              {/* Botões */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {!conexaoAtiva ? (
                  <button
                    onClick={() => setModalAberto(plataforma.id as PlatformType)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: plataforma.cor,
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Plus size={16} />
                    Conectar
                  </button>
                ) : (
                  <button
                    onClick={() => setContatoParaExcluir(conexaoAtiva.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #ef4444',
                      background: 'transparent',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <X size={16} />
                    Desconectar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Confirmação de Desconexão */}
      {contatoParaExcluir && (
        <>
          <div
            onClick={() => setContatoParaExcluir(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#132636',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              zIndex: 50,
              maxWidth: '360px',
              width: '90%',
              padding: '24px',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>
              Desconectar?
            </h2>
            <p style={{ fontSize: '12px', color: '#7a96aa', margin: '0 0 20px 0' }}>
              Tem certeza que deseja desconectar esta plataforma? Será necessário conectar novamente.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setContatoParaExcluir(null)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDesconectar(contatoParaExcluir)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Desconectar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modais por Plataforma */}
      {modalAberto === 'whatsapp' && (
        <ConexaoWhatsAppModal
          isOpen={true}
          onClose={() => setModalAberto(null)}
        />
      )}
      {modalAberto === 'instagram' && (
        <ConexaoInstagramModal
          isOpen={true}
          onClose={() => setModalAberto(null)}
        />
      )}
      {modalAberto === 'telegram' && (
        <ConexaoTelegramModal
          isOpen={true}
          onClose={() => setModalAberto(null)}
        />
      )}
      {modalAberto === 'email' && (
        <ConexaoEmailModal
          isOpen={true}
          onClose={() => setModalAberto(null)}
        />
      )}
      {modalAberto === 'facebook_messenger' && (
        <ConexaoFacebookModal
          isOpen={true}
          onClose={() => setModalAberto(null)}
        />
      )}
    </div>
  );
}

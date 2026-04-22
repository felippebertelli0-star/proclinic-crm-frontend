'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useConexoesStore } from '@/store/conexoesStore';
import BaseConexaoModal, { PremiumButton, ErrorBanner } from './BaseConexaoModal';
import { QRCodeDisplay } from './QRCodeDisplay';

interface ConexaoWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PASSOS = [
  { num: 1, texto: <>Abra o <strong>WhatsApp</strong> no celular</> },
  { num: 2, texto: <>Toque em <strong>⋮ Menu</strong> (Android) ou <strong>Configurações</strong> (iPhone)</> },
  { num: 3, texto: <>Acesse <strong>Aparelhos Conectados</strong></> },
  { num: 4, texto: <>Toque em <strong>Conectar um Aparelho</strong></> },
  { num: 5, texto: <>Aponte a câmera para o <strong>QR Code</strong> ao lado</> },
];

export default function ConexaoWhatsAppModal({ isOpen, onClose }: ConexaoWhatsAppModalProps) {
  const conectar = useConexoesStore((state) => state.conectar);
  const [qrValue, setQrValue] = useState('');
  const [status, setStatus] = useState<'aguardando' | 'conectando' | 'sucesso' | 'erro'>('aguardando');
  const [erro, setErro] = useState('');

  const gerarQR = useCallback(() => {
    const novo = `whatsapp://connect?token=${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    setQrValue(novo);
    setStatus('aguardando');
  }, []);

  useEffect(() => {
    if (isOpen) gerarQR();
  }, [isOpen, gerarQR]);

  useEffect(() => {
    if (!isOpen || status !== 'aguardando') return;
    const interval = setInterval(() => gerarQR(), 30000);
    return () => clearInterval(interval);
  }, [isOpen, status, gerarQR]);

  const handleSimular = async () => {
    setStatus('conectando');
    setErro('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const telefone = `+55 11 9${Math.floor(Math.random() * 90000000 + 10000000)}`;
      conectar(
        'whatsapp',
        { phone: telefone, name: 'WhatsApp Business' },
        qrValue
      );
      setStatus('sucesso');
      setTimeout(() => {
        onClose();
        setStatus('aguardando');
      }, 1200);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao conectar WhatsApp');
      setStatus('erro');
    }
  };

  return (
    <BaseConexaoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar WhatsApp"
      step={{ atual: 2, total: 2 }}
      accentColor="#25D366"
      width={620}
    >
      {erro && <ErrorBanner message={erro} />}

      {status === 'sucesso' ? (
        <SucessoState />
      ) : (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* QR CODE COLUMN */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCodeDisplay value={qrValue} size={240} scanning={status === 'aguardando'} />

            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: status === 'conectando' ? '#3498db' : '#f59e0b',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: status === 'conectando' ? '#3498db' : '#f59e0b',
                  animation: 'pulseDot 1.5s infinite',
                }}
              />
              {status === 'conectando' ? 'Conectando...' : 'Aguardando leitura...'}
            </div>

            <button
              onClick={gerarQR}
              disabled={status === 'conectando'}
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(90, 120, 140, 0.3)',
                background: 'rgba(15, 30, 45, 0.5)',
                color: '#7a96aa',
                fontSize: '11px',
                fontWeight: 600,
                cursor: status === 'conectando' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: status === 'conectando' ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (status !== 'conectando') {
                  e.currentTarget.style.color = '#e8edf2';
                  e.currentTarget.style.borderColor = '#25D366';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#7a96aa';
                e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)';
              }}
            >
              <RefreshCw size={12} />
              Atualizar QR
            </button>
          </div>

          {/* INSTRUÇÕES COLUMN */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#25D366',
                margin: '0 0 14px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>≡</span>
              Como conectar — 5 passos:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {PASSOS.map((passo) => (
                <div key={passo.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(37, 211, 102, 0.35)',
                    }}
                  >
                    {passo.num}
                  </div>
                  <div style={{ fontSize: '13px', color: '#e8edf2', lineHeight: 1.5, paddingTop: '2px' }}>
                    {passo.texto}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '9px',
                padding: '11px 13px',
                borderRadius: '10px',
                background: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                marginBottom: '14px',
              }}
            >
              <span style={{ fontSize: '13px' }}>🔒</span>
              <span style={{ fontSize: '11px', color: '#a4eec4', lineHeight: 1.45 }}>
                <strong>Conexão criptografada.</strong> Suas mensagens são protegidas pelo WhatsApp.
              </span>
            </div>

            <PremiumButton
              gradient="linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
              onClick={handleSimular}
              loading={status === 'conectando'}
              icon={<CheckCircle2 size={16} />}
            >
              Simular QR Lido (Demo)
            </PremiumButton>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
      `}</style>
    </BaseConexaoModal>
  );
}

function SucessoState() {
  return (
    <div style={{ textAlign: 'center', padding: '30px 20px' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(37, 211, 102, 0.15)',
          border: '2px solid #25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          animation: 'successBounce 0.5s',
        }}
      >
        <CheckCircle2 size={40} color="#25D366" />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8edf2', margin: '0 0 6px 0' }}>
        WhatsApp Conectado!
      </h3>
      <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>
        Sua conta está pronta para receber e enviar mensagens
      </p>
      <style>{`
        @keyframes successBounce {
          0% { transform: scale(0); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

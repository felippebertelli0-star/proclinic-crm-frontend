'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useConexoesStore } from '@/store/conexoesStore';
import BaseConexaoModal, { ModalIcon, ModalTitle, FormField, PremiumInput, PremiumButton, ErrorBanner } from './BaseConexaoModal';
import { FacebookMessengerLogo } from './PlatformLogos';

interface ConexaoFacebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConexaoFacebookModal({ isOpen, onClose }: ConexaoFacebookModalProps) {
  const conectar = useConexoesStore((state) => state.conectar);
  const [token, setToken] = useState('');
  const [stage, setStage] = useState<'escolha' | 'oauth_redirect' | 'sucesso'>('escolha');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const tokenValido = token.trim().startsWith('EAA') && token.trim().length > 40;

  const handleOAuth = async () => {
    setCarregando(true);
    setStage('oauth_redirect');
    setErro('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2200));
      const tokenGerado = `EAA_oauth_${Date.now()}_${Math.random().toString(36).slice(2, 30)}`;
      conectar(
        'facebook_messenger',
        { name: 'Clínica ProClinic', username: 'clinica.proclinic' },
        tokenGerado
      );
      setStage('sucesso');
      setTimeout(() => {
        onClose();
        setStage('escolha');
        setToken('');
      }, 1200);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao autenticar com Facebook');
      setStage('escolha');
    } finally {
      setCarregando(false);
    }
  };

  const handleTokenManual = async () => {
    if (!tokenValido) return;
    setCarregando(true);
    setErro('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      conectar(
        'facebook_messenger',
        { name: 'Página do Facebook', username: 'pagina.facebook' },
        token.trim()
      );
      setStage('sucesso');
      setTimeout(() => {
        onClose();
        setStage('escolha');
        setToken('');
      }, 1200);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Token inválido');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <BaseConexaoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar Facebook"
      step={{ atual: 2, total: 2 }}
      accentColor="#0084FF"
      width={500}
    >
      {erro && <ErrorBanner message={erro} />}

      {stage === 'sucesso' ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(0, 132, 255, 0.15)',
              border: '2px solid #0084FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              animation: 'successBounce 0.5s',
            }}
          >
            <CheckCircle2 size={40} color="#0084FF" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8edf2', margin: '0 0 6px 0' }}>
            Messenger Conectado!
          </h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>
            Sua página está pronta para receber mensagens
          </p>
          <style>{`@keyframes successBounce { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
        </div>
      ) : stage === 'oauth_redirect' ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0099FF 0%, #A033FF 60%, #FF5280 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'pulse 1.5s infinite',
              boxShadow: '0 0 40px rgba(0, 132, 255, 0.5)',
            }}
          >
            <FacebookMessengerLogo size={48} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0084FF', margin: '0 0 8px 0' }}>
            Redirecionando para o Facebook...
          </h3>
          <p style={{ fontSize: '12px', color: '#7a96aa', margin: '0 0 16px 0' }}>
            Autorize o acesso à sua Página para continuar
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '99px',
              background: 'rgba(0, 132, 255, 0.1)',
              border: '1px solid rgba(0, 132, 255, 0.3)',
              fontSize: '11px',
              color: '#0084FF',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#0084FF',
                animation: 'pulseDot 1s infinite',
              }}
            />
            Aguardando autorização...
          </div>
          <style>{`
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
          `}</style>
        </div>
      ) : (
        <>
          <ModalIcon gradient="linear-gradient(135deg, #0099FF 0%, #A033FF 60%, #FF5280 100%)">
            <FacebookMessengerLogo size={44} />
          </ModalIcon>

          <ModalTitle
            title="Facebook Messenger"
            subtitle="Conecte sua Página do Facebook para gerenciar mensagens diretas aqui no ProClinic"
            color="#0084FF"
          />

          {/* Botão OAuth principal */}
          <PremiumButton
            gradient="linear-gradient(135deg, #0099FF 0%, #0084FF 100%)"
            onClick={handleOAuth}
            loading={carregando}
            icon={<span style={{ fontSize: '15px' }}>📘</span>}
          >
            Entrar com Facebook
          </PremiumButton>

          {/* Separator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '20px 0 16px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'rgba(90, 120, 140, 0.25)' }} />
            <span style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 500 }}>
              ou conectar via token
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(90, 120, 140, 0.25)' }} />
          </div>

          {/* Token manual */}
          <FormField label="Page Access Token">
            <PremiumInput
              type="text"
              placeholder="EAAxxxxxxxxxxxxx..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={carregando}
              style={{ fontFamily: 'monospace', fontSize: '11.5px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tokenValido) handleTokenManual();
              }}
            />
            {token && !tokenValido && (
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '6px' }}>
                ⚠ Token inválido. Deve começar com <code>EAA</code> e ter pelo menos 40 caracteres.
              </div>
            )}
          </FormField>

          {tokenValido && (
            <div style={{ marginTop: '12px' }}>
              <PremiumButton
                gradient="linear-gradient(135deg, #0084FF 0%, #0066CC 100%)"
                onClick={handleTokenManual}
                loading={carregando}
                disabled={!tokenValido}
              >
                Conectar com Token
              </PremiumButton>
            </div>
          )}
        </>
      )}
    </BaseConexaoModal>
  );
}

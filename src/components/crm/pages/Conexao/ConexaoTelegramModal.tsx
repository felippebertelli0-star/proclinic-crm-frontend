'use client';

import { useState } from 'react';
import { Bot, CheckCircle2, ListOrdered } from 'lucide-react';
import { useConexoesStore } from '@/store/conexoesStore';
import BaseConexaoModal, { ModalIcon, ModalTitle, FormField, PremiumInput, PremiumButton, ErrorBanner } from './BaseConexaoModal';
import { TelegramLogo } from './PlatformLogos';

interface ConexaoTelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_PASSOS = [
  <>Abra o <strong>Telegram</strong> e pesquise <strong>@BotFather</strong></>,
  <>Envie o comando <code style={{ background: 'rgba(42, 171, 238, 0.15)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11.5px', color: '#2AABEE' }}>/newbot</code></>,
  <>Escolha um <strong>nome</strong> e <strong>@username</strong> para o bot</>,
  <>Copie o <strong>token de acesso</strong> enviado pelo BotFather</>,
];

export default function ConexaoTelegramModal({ isOpen, onClose }: ConexaoTelegramModalProps) {
  const conectar = useConexoesStore((state) => state.conectar);
  const [token, setToken] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const tokenValido = /^\d{8,12}:[A-Za-z0-9_-]{30,}$/.test(token.trim());
  const podeEnviar = tokenValido && !carregando;

  const handleConectar = async () => {
    if (!podeEnviar) return;
    setCarregando(true);
    setErro('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const botId = token.split(':')[0];
      conectar(
        'telegram',
        { username: `bot_${botId}`, name: `Bot Telegram #${botId}` },
        token.trim()
      );
      setSucesso(true);
      setTimeout(() => {
        onClose();
        setSucesso(false);
        setToken('');
      }, 1200);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Token inválido ou inacessível');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <BaseConexaoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar Telegram"
      step={{ atual: 2, total: 2 }}
      accentColor="#2AABEE"
      width={500}
    >
      {erro && <ErrorBanner message={erro} />}

      {sucesso ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(42, 171, 238, 0.15)',
              border: '2px solid #2AABEE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              animation: 'successBounce 0.5s',
            }}
          >
            <CheckCircle2 size={40} color="#2AABEE" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8edf2', margin: '0 0 6px 0' }}>
            Bot Conectado!
          </h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>
            Seu bot Telegram está pronto para receber e enviar mensagens
          </p>
          <style>{`@keyframes successBounce { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
        </div>
      ) : (
        <>
          <ModalIcon gradient="linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)">
            <TelegramLogo size={44} />
          </ModalIcon>

          <ModalTitle
            title="Telegram Bot"
            subtitle="Conecte um bot para receber e enviar mensagens"
            color="#2AABEE"
          />

          {/* Tutorial card */}
          <div
            style={{
              background: 'rgba(42, 171, 238, 0.08)',
              border: '1px solid rgba(42, 171, 238, 0.25)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#2AABEE',
                marginBottom: '12px',
              }}
            >
              <ListOrdered size={14} />
              Como obter o token:
            </div>

            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {TUTORIAL_PASSOS.map((passo, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      color: '#2AABEE',
                      fontWeight: 800,
                      fontSize: '12px',
                      minWidth: '18px',
                    }}
                  >
                    {idx + 1}.
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#c6d5e0', lineHeight: 1.5 }}>{passo}</span>
                </li>
              ))}
            </ol>
          </div>

          <FormField label="Token do Bot">
            <PremiumInput
              type="text"
              placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={carregando}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConectar();
              }}
            />
            {token && !tokenValido && (
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '6px' }}>
                ⚠ Formato de token inválido. Deve ser como <code>123456789:ABCdef...</code>
              </div>
            )}
          </FormField>

          <div style={{ marginTop: '18px' }}>
            <PremiumButton
              gradient="linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)"
              onClick={handleConectar}
              loading={carregando}
              disabled={!podeEnviar}
              icon={<Bot size={16} />}
            >
              Conectar Bot Telegram →
            </PremiumButton>
          </div>
        </>
      )}
    </BaseConexaoModal>
  );
}

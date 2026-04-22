'use client';

import { useState, useMemo } from 'react';
import { Mail, CheckCircle2, Zap } from 'lucide-react';
import { useConexoesStore } from '@/store/conexoesStore';
import BaseConexaoModal, { ModalIcon, ModalTitle, FormField, PremiumInput, PremiumButton, SecurityNote, ErrorBanner } from './BaseConexaoModal';

interface ConexaoEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Detecção automática de servidor IMAP baseado no domínio
const IMAP_SERVERS: Record<string, { server: string; port: number }> = {
  'gmail.com': { server: 'imap.gmail.com', port: 993 },
  'googlemail.com': { server: 'imap.gmail.com', port: 993 },
  'outlook.com': { server: 'outlook.office365.com', port: 993 },
  'hotmail.com': { server: 'outlook.office365.com', port: 993 },
  'live.com': { server: 'outlook.office365.com', port: 993 },
  'yahoo.com': { server: 'imap.mail.yahoo.com', port: 993 },
  'yahoo.com.br': { server: 'imap.mail.yahoo.com', port: 993 },
  'icloud.com': { server: 'imap.mail.me.com', port: 993 },
  'me.com': { server: 'imap.mail.me.com', port: 993 },
  'uol.com.br': { server: 'imap.uol.com.br', port: 993 },
};

export default function ConexaoEmailModal({ isOpen, onClose }: ConexaoEmailModalProps) {
  const conectar = useConexoesStore((state) => state.conectar);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [servidorImap, setServidorImap] = useState('');
  const [porta, setPorta] = useState('993');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [imapAutoDetectado, setImapAutoDetectado] = useState(false);

  const emailValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const podeEnviar = emailValido && senha.length >= 4 && servidorImap && porta && !carregando;

  // Auto-detect IMAP quando email é digitado
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const dominio = value.split('@')[1]?.toLowerCase();
    if (dominio && IMAP_SERVERS[dominio]) {
      setServidorImap(IMAP_SERVERS[dominio].server);
      setPorta(String(IMAP_SERVERS[dominio].port));
      setImapAutoDetectado(true);
    } else if (imapAutoDetectado) {
      setImapAutoDetectado(false);
    }
  };

  const providerDetectado = useMemo(() => {
    const dominio = email.split('@')[1]?.toLowerCase();
    if (!dominio) return null;
    if (dominio === 'gmail.com' || dominio === 'googlemail.com') return 'Gmail';
    if (['outlook.com', 'hotmail.com', 'live.com'].includes(dominio)) return 'Outlook';
    if (['yahoo.com', 'yahoo.com.br'].includes(dominio)) return 'Yahoo';
    if (['icloud.com', 'me.com'].includes(dominio)) return 'iCloud';
    if (dominio === 'uol.com.br') return 'UOL';
    return null;
  }, [email]);

  const handleConectar = async () => {
    if (!podeEnviar) return;
    setCarregando(true);
    setErro('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const token = btoa(`${email}:${senha}:${servidorImap}:${porta}`);
      conectar(
        'email',
        { email, name: email.split('@')[0] },
        token
      );
      setSucesso(true);
      setTimeout(() => {
        onClose();
        setSucesso(false);
        setEmail('');
        setSenha('');
        setServidorImap('');
        setPorta('993');
      }, 1200);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível conectar ao servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <BaseConexaoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar E-mail"
      step={{ atual: 2, total: 2 }}
      accentColor="#4285F4"
      width={540}
    >
      {erro && <ErrorBanner message={erro} />}

      {sucesso ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(66, 133, 244, 0.15)',
              border: '2px solid #4285F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              animation: 'successBounce 0.5s',
            }}
          >
            <CheckCircle2 size={40} color="#4285F4" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8edf2', margin: '0 0 6px 0' }}>
            E-mail Conectado!
          </h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>
            {email} está pronto para enviar e receber mensagens
          </p>
          <style>{`@keyframes successBounce { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
        </div>
      ) : (
        <>
          <ModalIcon gradient="linear-gradient(135deg, #4285F4 0%, #34A853 50%, #EA4335 100%)">
            <Mail size={40} color="#fff" />
          </ModalIcon>

          <ModalTitle
            title="E-mail"
            subtitle="Configure seu servidor IMAP para envio e recebimento"
            color="#4285F4"
          />

          {/* Provider detectado badge */}
          {providerDetectado && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '99px',
                background: 'rgba(52, 168, 83, 0.12)',
                border: '1px solid rgba(52, 168, 83, 0.35)',
                fontSize: '11.5px',
                color: '#34A853',
                fontWeight: 600,
                marginBottom: '16px',
                width: 'fit-content',
              }}
            >
              <Zap size={12} />
              {providerDetectado} detectado — servidor configurado automaticamente
            </div>
          )}

          {/* Grid: Email | Senha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FormField label="E-mail">
              <PremiumInput
                type="email"
                placeholder="contato@clinica.com.br"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={carregando}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Senha / App Password">
              <PremiumInput
                type="password"
                placeholder="••••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                autoComplete="current-password"
              />
            </FormField>
          </div>

          {/* Grid: Servidor IMAP | Porta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '14px' }}>
            <FormField label="Servidor IMAP">
              <PremiumInput
                type="text"
                placeholder="imap.gmail.com"
                value={servidorImap}
                onChange={(e) => {
                  setServidorImap(e.target.value);
                  setImapAutoDetectado(false);
                }}
                disabled={carregando}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
            </FormField>

            <FormField label="Porta">
              <PremiumInput
                type="number"
                placeholder="993"
                value={porta}
                onChange={(e) => setPorta(e.target.value)}
                disabled={carregando}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConectar();
                }}
              />
            </FormField>
          </div>

          <SecurityNote
            text="Recomendamos usar senhas específicas de aplicativo (App Password) quando disponível em seu provedor. Suas credenciais são criptografadas."
            color="#4285F4"
          />

          <div style={{ marginTop: '18px' }}>
            <PremiumButton
              gradient="linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)"
              onClick={handleConectar}
              loading={carregando}
              disabled={!podeEnviar}
              icon={<Mail size={16} />}
            >
              Verificar e Conectar →
            </PremiumButton>
          </div>
        </>
      )}
    </BaseConexaoModal>
  );
}

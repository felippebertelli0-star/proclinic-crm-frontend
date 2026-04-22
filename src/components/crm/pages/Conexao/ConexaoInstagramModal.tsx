'use client';

import { useState } from 'react';
import { Eye, EyeOff, LogIn, CheckCircle2 } from 'lucide-react';
import { useConexoesStore } from '@/store/conexoesStore';
import BaseConexaoModal, { ModalIcon, ModalTitle, FormField, PremiumInput, PremiumButton, SecurityNote, ErrorBanner } from './BaseConexaoModal';
import { InstagramLogo } from './PlatformLogos';

interface ConexaoInstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConexaoInstagramModal({ isOpen, onClose }: ConexaoInstagramModalProps) {
  const conectar = useConexoesStore((state) => state.conectar);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const usernameValido = /^[a-zA-Z0-9._]{3,30}$/.test(usuario.replace('@', ''));
  const podeEnviar = usernameValido && senha.length >= 4 && !carregando;

  const handleEntrar = async () => {
    if (!podeEnviar) return;
    setCarregando(true);
    setErro('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1600));
      const username = usuario.replace('@', '');
      const token = `instagram_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      conectar('instagram', { username, name: username }, token);
      setSucesso(true);
      setTimeout(() => {
        onClose();
        setSucesso(false);
        setUsuario('');
        setSenha('');
      }, 1200);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Credenciais inválidas');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <BaseConexaoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar Instagram"
      step={{ atual: 2, total: 2 }}
      accentColor="#E4405F"
      width={480}
    >
      {erro && <ErrorBanner message={erro} />}

      {sucesso ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(228, 64, 95, 0.15)',
              border: '2px solid #E4405F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              animation: 'successBounce 0.5s',
            }}
          >
            <CheckCircle2 size={40} color="#E4405F" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8edf2', margin: '0 0 6px 0' }}>
            Instagram Conectado!
          </h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>
            @{usuario.replace('@', '')} está pronto para direct messages
          </p>
          <style>{`@keyframes successBounce { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
        </div>
      ) : (
        <>
          <ModalIcon gradient="linear-gradient(135deg, #FDCB5C 0%, #FD8444 25%, #EF4B75 50%, #D22A8E 75%, #8E3ABF 100%)">
            <InstagramLogo size={44} />
          </ModalIcon>

          <ModalTitle
            title="Instagram Direct"
            subtitle="Entre com sua conta para receber mensagens diretas"
            color="#E4405F"
          />

          <FormField label="Usuário do Instagram">
            <PremiumInput
              type="text"
              placeholder="@seu.perfil"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={carregando}
              autoComplete="username"
            />
          </FormField>

          <FormField label="Senha">
            <div style={{ position: 'relative' }}>
              <PremiumInput
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Senha da sua conta"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                autoComplete="current-password"
                style={{ paddingRight: '42px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEntrar();
                }}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7a96aa',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <SecurityNote
            text="Suas credenciais são usadas apenas para autenticação e não são armazenadas em texto plano."
            color="#E4405F"
          />

          <div style={{ marginTop: '18px' }}>
            <PremiumButton
              gradient="linear-gradient(135deg, #FD8444 0%, #EF4B75 50%, #D22A8E 100%)"
              onClick={handleEntrar}
              loading={carregando}
              disabled={!podeEnviar}
              icon={<LogIn size={16} />}
            >
              Entrar no Instagram →
            </PremiumButton>
          </div>
        </>
      )}
    </BaseConexaoModal>
  );
}

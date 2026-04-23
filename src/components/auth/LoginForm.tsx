/**
 * Login — ProClinic / JARVIS Master Admin
 * Split premium (identidade | form) com toggle de contexto
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/lib/api';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  Building2,
  AlertCircle,
} from 'lucide-react';

type Contexto = 'clinica' | 'admin';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [contexto, setContexto] = useState<Contexto>('clinica');
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [localError, setLocalError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!formData.email || !formData.senha) {
      setLocalError('Informe e-mail e senha.');
      return;
    }
    if (!formData.email.includes('@')) {
      setLocalError('E-mail inválido.');
      return;
    }
    if (formData.senha.length < 6) {
      setLocalError('Senha deve ter ao menos 6 caracteres.');
      return;
    }

    try {
      await login(formData.email, formData.senha);
      router.push(contexto === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const isAdmin = contexto === 'admin';
  const activeErr = localError || error;

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_520px] bg-[#0a1520] text-white overflow-hidden">
      {/* ============ ESQUERDA: IDENTIDADE ============ */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Mesh gradient background */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(201,148,58,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(52,152,219,0.12), transparent 50%), radial-gradient(circle at 50% 50%, rgba(201,148,58,0.08), transparent 60%)',
          }}
        />
        {/* Grain + lines sutis */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glows */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,148,58,0.22) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(52,152,219,0.12) 0%, transparent 70%)' }}
        />

        {/* Topo — marca */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-[12px] flex items-center justify-center bg-gradient-to-br from-[#c9943a] to-[#8a6424] shadow-[0_10px_30px_-10px_rgba(201,148,58,0.6)]">
            <Sparkles size={20} strokeWidth={2.5} className="text-[#0a1520]" />
          </div>
          <div>
            <div className="text-[18px] font-bold tracking-tight leading-none">ProClinic</div>
            <div className="text-[10px] text-[#7a96aa] uppercase tracking-[0.2em] mt-1">
              Powered by JARVIS
            </div>
          </div>
        </div>

        {/* Centro — headline */}
        <div className="relative max-w-[480px] space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(201,148,58,0.1)] border border-[rgba(201,148,58,0.3)] text-[#e8b86d] text-[11px] font-semibold tracking-wider uppercase">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#c9943a] animate-ping opacity-60" />
              <span className="relative rounded-full bg-[#c9943a] w-1.5 h-1.5" />
            </span>
            v2.0 · Multi-tenant SaaS
          </div>

          <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight">
            Gestão premium <br />
            <span className="bg-gradient-to-r from-[#c9943a] via-[#e8b86d] to-[#c9943a] bg-clip-text text-transparent">
              para clínicas
            </span>{' '}
            que crescem.
          </h1>

          <p className="text-[15px] text-[#b0b8c1] leading-relaxed">
            Pipeline de pacientes, WhatsApp integrado, agenda inteligente e IA para
            qualificar leads — tudo em um só cockpit, desenhado para operar em escala.
          </p>

          {/* mini métricas */}
          <div className="flex items-center gap-8 pt-2">
            <div>
              <div className="text-[28px] font-bold tabular-nums leading-none text-white">
                12
              </div>
              <div className="text-[11px] text-[#7a96aa] mt-1.5 uppercase tracking-wider">
                Clínicas ativas
              </div>
            </div>
            <div className="w-px h-10 bg-[#1e3d54]" />
            <div>
              <div className="text-[28px] font-bold tabular-nums leading-none text-white">
                2.847
              </div>
              <div className="text-[11px] text-[#7a96aa] mt-1.5 uppercase tracking-wider">
                Usuários
              </div>
            </div>
            <div className="w-px h-10 bg-[#1e3d54]" />
            <div>
              <div className="text-[28px] font-bold tabular-nums leading-none text-white">
                99,8%
              </div>
              <div className="text-[11px] text-[#7a96aa] mt-1.5 uppercase tracking-wider">
                Uptime
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé — institucional */}
        <div className="relative flex items-center justify-between text-[11px] text-[#5a6f82]">
          <div className="flex items-center gap-2">
            <Shield size={12} strokeWidth={2} />
            <span>Criptografia AES-256 · LGPD compliant</span>
          </div>
          <div>© 2026 ProClinic — todos direitos reservados</div>
        </div>
      </aside>

      {/* ============ DIREITA: FORM ============ */}
      <section className="relative flex items-center justify-center p-6 lg:p-10 bg-[#0d1b28] border-l border-[#132636]">
        {/* Glow sutil topo */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[240px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(201,148,58,0.14) 0%, transparent 70%)',
          }}
        />

        <div className="relative w-full max-w-[400px]">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-gradient-to-br from-[#c9943a] to-[#8a6424]">
              <Sparkles size={18} strokeWidth={2.5} className="text-[#0a1520]" />
            </div>
            <div className="text-[16px] font-bold">ProClinic</div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
              {isAdmin ? 'Master Admin' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-[13px] text-[#7a96aa] mt-1.5">
              {isAdmin
                ? 'Acesso exclusivo ao cockpit JARVIS.'
                : 'Entre na sua conta para continuar.'}
            </p>
          </div>

          {/* Toggle contexto */}
          <div className="mb-6 relative grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-[#0a1520] border border-[#132636]">
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[9px] bg-gradient-to-br from-[#c9943a] to-[#8a6424] shadow-[0_4px_16px_-6px_rgba(201,148,58,0.55)] transition-transform duration-300"
              style={{ transform: isAdmin ? 'translateX(100%)' : 'translateX(0)' }}
            />
            <button
              type="button"
              onClick={() => setContexto('clinica')}
              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold rounded-[9px] transition-colors ${
                !isAdmin ? 'text-[#0a1520]' : 'text-[#7a96aa] hover:text-white'
              }`}
            >
              <Building2 size={14} strokeWidth={2.5} />
              Clínica
            </button>
            <button
              type="button"
              onClick={() => setContexto('admin')}
              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold rounded-[9px] transition-colors ${
                isAdmin ? 'text-[#0a1520]' : 'text-[#7a96aa] hover:text-white'
              }`}
            >
              <Shield size={14} strokeWidth={2.5} />
              Master Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Erro */}
            {activeErr && (
              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[rgba(231,76,60,0.08)] border border-[rgba(231,76,60,0.3)]">
                <AlertCircle size={14} strokeWidth={2.2} className="text-[#e74c3c] mt-0.5 flex-shrink-0" />
                <p className="text-[12px] text-[#e74c3c] font-medium leading-relaxed">{activeErr}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-[#7a96aa] tracking-wider uppercase mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6f82] peer-focus:text-[#c9943a] pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isAdmin ? 'admin@proclinic.com.br' : 'voce@clinica.com.br'}
                  autoComplete="email"
                  className="peer w-full pl-10 pr-4 py-3 bg-[#0a1520] border border-[#1e3d54] rounded-[10px] text-[14px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] focus:ring-2 focus:ring-[rgba(201,148,58,0.15)] transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="senha" className="text-[11px] font-bold text-[#7a96aa] tracking-wider uppercase">
                  Senha
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-[#c9943a] hover:text-[#e8b86d] transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6f82] pointer-events-none"
                />
                <input
                  id="senha"
                  type={showPass ? 'text' : 'password'}
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-[#0a1520] border border-[#1e3d54] rounded-[10px] text-[14px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] focus:ring-2 focus:ring-[rgba(201,148,58,0.15)] transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-[#5a6f82] hover:text-[#c9943a] hover:bg-[rgba(201,148,58,0.08)] transition-colors"
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Lembrar */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-4 h-4 rounded-[5px] border border-[#1e3d54] bg-[#0a1520] flex items-center justify-center peer-checked:bg-[#c9943a] peer-checked:border-[#c9943a] transition-all">
                <svg
                  className={`w-2.5 h-2.5 text-[#0a1520] transition-opacity ${remember ? 'opacity-100' : 'opacity-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[12px] text-[#b0b8c1]">Manter-me conectado</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-[10px] bg-gradient-to-br from-[#c9943a] to-[#8a6424] text-[#0a1520] text-[13px] font-bold shadow-[0_10px_30px_-10px_rgba(201,148,58,0.6)] hover:shadow-[0_14px_40px_-10px_rgba(201,148,58,0.8)] hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Autenticando...
                </>
              ) : (
                <>
                  {isAdmin ? 'Acessar JARVIS' : 'Entrar no ProClinic'}
                  <ArrowRight
                    size={15}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-1 h-px bg-[#132636]" />
              <span className="px-3 text-[10px] text-[#5a6f82] uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-[#132636]" />
            </div>

            {/* Cadastro clínica */}
            {!isAdmin && (
              <p className="text-center text-[12px] text-[#7a96aa]">
                Ainda não tem uma conta?{' '}
                <button
                  type="button"
                  className="font-semibold text-[#c9943a] hover:text-[#e8b86d] transition-colors"
                >
                  Cadastrar clínica
                </button>
              </p>
            )}
            {isAdmin && (
              <p className="text-center text-[11px] text-[#5a6f82]">
                Este acesso é restrito à equipe ProClinic.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

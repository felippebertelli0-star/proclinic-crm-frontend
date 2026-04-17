/**
 * Componente Header
 * Qualidade: Premium AAA
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export function Header() {
  const router = useRouter();
  const { usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-slate-900 font-bold text-lg">P</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white">ProClinic CRM</span>
              <p className="text-xs text-slate-400">Painel Administrativo</p>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {usuario && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{usuario.nome}</p>
                  <p className="text-xs text-slate-400">{usuario.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-amber-400 rounded-lg transition"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

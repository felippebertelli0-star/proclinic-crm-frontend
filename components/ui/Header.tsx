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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ProClinic CRM</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {usuario && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
                  <p className="text-xs text-gray-500">{usuario.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
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

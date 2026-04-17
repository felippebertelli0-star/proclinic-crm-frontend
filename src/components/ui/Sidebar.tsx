'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Phone,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  iconName: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', iconName: 'dashboard' },
  { label: 'Usuários', href: '/dashboard/usuarios', iconName: 'users' },
  { label: 'Conversas', href: '/dashboard/conversas', iconName: 'message' },
  { label: 'Contatos', href: '/dashboard/contatos', iconName: 'phone' },
  { label: 'Pagamentos', href: '/dashboard/pagamentos', iconName: 'card' },
  { label: 'Configurações', href: '/dashboard/configuracoes', iconName: 'settings' },
];

const getIcon = (iconName: string) => {
  const iconProps = { size: 20 };
  switch (iconName) {
    case 'dashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'message':
      return <MessageSquare {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'card':
      return <CreditCard {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    default:
      return null;
  }
};

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 min-h-screen flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-amber-400">ProClinic</h1>
        <p className="text-xs text-slate-500 mt-1">Painel Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-amber-500 bg-opacity-20 text-amber-400 font-semibold border-l-2 border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {getIcon(item.iconName)}
            <span className="flex-1">{item.label}</span>
            {pathname === item.href && <ChevronRight size={18} />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-lg transition-colors font-semibold"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

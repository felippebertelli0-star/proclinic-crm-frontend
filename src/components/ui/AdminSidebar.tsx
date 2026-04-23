'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  UsersRound,
  CircleDollarSign,
  Activity,
  LifeBuoy,
  Settings2,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface AdminNavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: string;
  section?: string;
}

const navItems: AdminNavItem[] = [
  // OPERAÇÃO
  { label: 'Visão Geral', href: '/admin', iconName: 'dashboard', section: 'OPERAÇÃO' },
  { label: 'Clínicas', href: '/admin/sistemas', iconName: 'clinicas', section: 'OPERAÇÃO', badge: 'clinicas' },
  { label: 'Usuários Globais', href: '/admin/usuarios', iconName: 'users', section: 'OPERAÇÃO' },
  // FINANCEIRO
  { label: 'Financeiro', href: '/admin/financeiro', iconName: 'billing', section: 'FINANCEIRO' },
  // PLATAFORMA
  { label: 'Infraestrutura', href: '/admin/monitoramento', iconName: 'infra', section: 'PLATAFORMA' },
  { label: 'Suporte', href: '/admin/suporte', iconName: 'support', section: 'PLATAFORMA', badge: 'support' },
  { label: 'Jarvis IA', href: '/admin/jarvis', iconName: 'jarvis', section: 'PLATAFORMA' },
  // CONFIG
  { label: 'Configurações', href: '/admin/config', iconName: 'settings', section: 'SISTEMA' },
];

const getIcon = (iconName: string) => {
  const iconProps = { size: 17, strokeWidth: 2 };
  switch (iconName) {
    case 'dashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'clinicas':
      return <Building2 {...iconProps} />;
    case 'users':
      return <UsersRound {...iconProps} />;
    case 'billing':
      return <CircleDollarSign {...iconProps} />;
    case 'infra':
      return <Activity {...iconProps} />;
    case 'support':
      return <LifeBuoy {...iconProps} />;
    case 'jarvis':
      return <Sparkles {...iconProps} />;
    case 'settings':
      return <Settings2 {...iconProps} />;
    default:
      return null;
  }
};

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  const getBadgeCount = (badgeType?: string) => {
    if (badgeType === 'clinicas') return 12;
    if (badgeType === 'support') return 3;
    return null;
  };

  // agrupa por seção mantendo ordem
  const sections = navItems.reduce<Record<string, AdminNavItem[]>>((acc, item) => {
    const key = item.section || 'OUTROS';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <aside className="w-[260px] bg-[#0a1520] border-r border-[#132636] min-h-screen flex flex-col">
      {/* Header / marca */}
      <div className="px-5 pt-6 pb-5 border-b border-[#132636]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gradient-to-br from-[#c9943a] to-[#8a6424] shadow-[0_4px_14px_-4px_rgba(201,148,58,0.6)]">
            <Sparkles size={17} strokeWidth={2.5} className="text-[#0a1520]" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-white leading-none tracking-tight">JARVIS</div>
            <div className="text-[10px] text-[#5a6f82] uppercase tracking-[0.18em] mt-1">Master Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-5">
            <div className="px-3 mb-2 text-[9px] font-bold tracking-[0.16em] text-[#5a6f82]">
              {section}
            </div>
            <div className="space-y-0.5">
              {items.map((item) => {
                const isActive = pathname === item.href;
                const badgeCount = getBadgeCount(item.badge);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all text-[13px] font-medium ${
                      isActive
                        ? 'bg-[rgba(201,148,58,0.12)] text-[#e8b86d]'
                        : 'text-[#8ea3b5] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#c9943a]" />
                    )}
                    <span className={isActive ? 'text-[#c9943a]' : 'text-[#5a6f82] group-hover:text-[#c9943a]'}>
                      {getIcon(item.iconName)}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {badgeCount !== null && badgeCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums ${
                          item.badge === 'support'
                            ? 'bg-[rgba(231,76,60,0.15)] text-[#e74c3c]'
                            : 'bg-[rgba(201,148,58,0.12)] text-[#c9943a]'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — user + logout */}
      <div className="px-3 py-3 border-t border-[#132636]">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9943a] to-[#8a6424] flex items-center justify-center text-[11px] font-bold text-[#0a1520]">
            F
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white truncate">Felippe Bertelli</div>
            <div className="text-[10px] text-[#5a6f82]">Master Admin</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-[#8ea3b5] hover:text-[#e74c3c] hover:bg-[rgba(231,76,60,0.06)] rounded-lg transition-all font-medium text-[12px]"
        >
          <LogOut size={15} strokeWidth={2} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

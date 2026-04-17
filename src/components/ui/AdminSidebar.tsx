'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  Activity,
  CreditCard,
  HelpCircle,
  Zap,
  LogOut,
} from 'lucide-react';

interface AdminNavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: string;
}

const navItems: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', iconName: 'dashboard' },
  { label: 'Sistemas', href: '/admin/sistemas', iconName: 'systems', badge: 'systems' },
  { label: 'Monitoramento', href: '/admin/monitoramento', iconName: 'monitoring' },
  { label: 'Financeiro', href: '/admin/financeiro', iconName: 'billing' },
  { label: 'Suporte', href: '/admin/suporte', iconName: 'support', badge: 'support' },
  { label: 'Jarvis', href: '/admin/jarvis', iconName: 'jarvis' },
];

const getIcon = (iconName: string) => {
  const iconProps = { size: 18, strokeWidth: 2 };
  switch (iconName) {
    case 'dashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'systems':
      return <Boxes {...iconProps} />;
    case 'monitoring':
      return <Activity {...iconProps} />;
    case 'billing':
      return <CreditCard {...iconProps} />;
    case 'support':
      return <HelpCircle {...iconProps} />;
    case 'jarvis':
      return <Zap {...iconProps} />;
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

  // Get badge count (mock data)
  const getBadgeCount = (badgeType?: string) => {
    if (badgeType === 'systems') return 0; // Will be dynamic
    if (badgeType === 'support') return 3; // From prototype
    return null;
  };

  return (
    <aside className="w-[280px] bg-[#151d2a] border-r border-[#2a3647] min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 py-6 border-b border-[#2a3647] mb-5">
        <h1 className="text-xl font-bold text-[#d4af37] mb-1">JARVIS</h1>
        <p className="text-xs text-[#7a8291] uppercase tracking-wider">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const badgeCount = getBadgeCount(item.badge);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] transition-all text-sm font-medium ${
                isActive
                  ? 'bg-[rgba(212,175,55,0.15)] text-[#d4af37]'
                  : 'text-[#b0b8c1] hover:bg-[rgba(212,175,55,0.08)] hover:text-white'
              }`}
            >
              {getIcon(item.iconName)}
              <span className="flex-1">{item.label}</span>
              {badgeCount !== null && badgeCount > 0 && (
                <span className="bg-[#e74c3c] text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#2a3647]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[#b0b8c1] hover:text-[#e74c3c] hover:bg-[rgba(231,76,60,0.08)] rounded-lg transition-all font-medium text-sm"
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

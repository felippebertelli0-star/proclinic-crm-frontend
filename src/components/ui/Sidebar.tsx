'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Kanban,
  TrendingUp,
  Tag,
  Zap,
  Calendar,
  ArrowRightCircle,
  CheckSquare,
  Lightbulb,
  Grid,
  Network,
  GitBranch,
  ListChecks,
  Users2,
  Link2,
  Folder,
  BarChart3,
  Clipboard,
  LogOut,
} from 'lucide-react';

interface NavSection {
  section: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | boolean;
}

const navSections: NavSection[] = [
  {
    section: 'ATENDIMENTO',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
      { label: 'Conversas', href: '/dashboard/conversas', icon: <MessageSquare size={16} />, badge: 37 },
      { label: 'Contatos', href: '/dashboard/contatos', icon: <Users size={16} /> },
      { label: 'Kanban', href: '/dashboard/kanban', icon: <Kanban size={16} /> },
      { label: 'Pipeline CRM', href: '/dashboard/pipeline', icon: <TrendingUp size={16} /> },
    ],
  },
  {
    section: 'UTILITÁRIOS',
    items: [
      { label: 'Etiquetas', href: '/dashboard/tags', icon: <Tag size={16} /> },
      { label: 'Respostas Rápidas', href: '/dashboard/respostas', icon: <Zap size={16} /> },
    ],
  },
  {
    section: 'AGENDA',
    items: [
      { label: 'Calendário', href: '/dashboard/calendario', icon: <Calendar size={16} /> },
      { label: 'Follow-ups', href: '/dashboard/followups', icon: <ArrowRightCircle size={16} /> },
      { label: 'Tarefas', href: '/dashboard/tarefas', icon: <CheckSquare size={16} /> },
    ],
  },
  {
    section: 'AUTOMAÇÃO & IA',
    items: [
      { label: 'Estratégias', href: '/dashboard/estrategias', icon: <Lightbulb size={16} /> },
      { label: 'Portal das IAs', href: '/dashboard/portal-ias', icon: <Grid size={16} /> },
      { label: 'FlowBuilder', href: '/dashboard/flowbuilder', icon: <Network size={16} /> },
      { label: 'Webhooks / Triggers', href: '/dashboard/webhooks', icon: <GitBranch size={16} /> },
    ],
  },
  {
    section: 'GESTÃO',
    items: [
      { label: 'Filas', href: '/dashboard/filas', icon: <ListChecks size={16} /> },
      { label: 'Equipe', href: '/dashboard/equipe', icon: <Users2 size={16} /> },
      { label: 'Conexões', href: '/dashboard/conexoes', icon: <Link2 size={16} /> },
      { label: 'Arquivos', href: '/dashboard/arquivos', icon: <Folder size={16} /> },
    ],
  },
  {
    section: 'RELATÓRIOS',
    items: [
      { label: 'Indicadores', href: '/dashboard/indicadores', icon: <BarChart3 size={16} /> },
    ],
  },
  {
    section: 'CLÍNICA',
    items: [
      { label: 'Pedido de Exames', href: '/dashboard/pedidos-exames', icon: <Clipboard size={16} />, badge: 0 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <aside className="w-[214px] bg-[#132636] border-r border-[#1e3d54] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-3.5 py-4.5 border-b border-[#1e3d54] mb-2 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#c9943a] to-[#e8b86d] flex items-center justify-center text-sm font-black text-[#0d1f2d]">
          P
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-black tracking-tighter bg-gradient-to-r from-[#c9943a] to-[#e8b86d] bg-clip-text text-transparent truncate">
            ProClinic
          </div>
          <div className="text-[9.5px] text-[rgba(255,255,255,0.3)] leading-none whitespace-nowrap">
            Inteligência Comercial
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-1 space-y-1">
        {navSections.map((section, idx) => (
          <div key={section.section}>
            <div className="text-[9px] font-bold tracking-[0.8px] text-[rgba(255,255,255,0.2)] uppercase px-2.5 py-2 mt-1">
              {section.section}
            </div>
            <div className="space-y-0.5 mb-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.25 px-2.5 py-2.375 rounded-[10px] cursor-pointer text-[12.5px] font-medium transition-all ${
                      isActive
                        ? 'bg-[rgba(255,255,255,0.08)] text-[#c9943a]'
                        : 'text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.88)]'
                    }`}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className="flex-1 truncate">{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <div className="bg-[#c9943a] text-[#0d1f2d] rounded-full min-w-[18px] h-4 flex items-center justify-center text-[9px] font-black px-1 flex-shrink-0">
                        {item.badge}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
            {idx < navSections.length - 1 && (
              <div className="w-[calc(100%-20px)] h-px bg-[#1e3d54] mx-2.5 my-1" />
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#1e3d54] p-1.5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.25 px-2.5 py-2.375 text-[12.5px] font-medium rounded-lg text-[rgba(231,76,60,0.5)] hover:text-[#e74c3c] hover:bg-[rgba(231,76,60,0.08)] transition-all"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

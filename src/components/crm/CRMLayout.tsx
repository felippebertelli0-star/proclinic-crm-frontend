'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, MessageCircle, Users, Grid3x3, TrendingUp, Tag, Zap, Calendar, RotateCw, CheckSquare, Cog, Brain, Sliders, List, Link, Folder, BarChart3, ClipboardList, LogOut } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Conversas } from './pages/Conversas';
import { Contatos } from './pages/Contatos';
import { Kanban } from './pages/Kanban';
import { Pipeline } from './pages/Pipeline';
import { Calendario } from './pages/Calendario';
import { Etiquetas } from './pages/Etiquetas';
import { Respostas } from './pages/Respostas';
import { Followups } from './pages/Followups';
import { Estrategias } from './pages/Estrategias';
import { PortalIas } from './pages/PortalIas';
import { FlowBuilder } from './pages/FlowBuilder';
import { Webhooks } from './pages/Webhooks';
import { Filas } from './pages/Filas';
import { Equipe } from './pages/Equipe';
import { Conexoes } from './pages/Conexoes';
import { Arquivos } from './pages/Arquivos';
import { Indicadores } from './pages/Indicadores';
import { Configuracoes } from './pages/Configuracoes';
import { Tarefas } from './pages/Tarefas';
import { PedidoExames } from './pages/PedidoExames';

type PageType = 'sair' | 'dashboard' | 'conversas' | 'contatos' | 'kanban' | 'pipeline' | 'calendario' | 'followups' | 'tarefas' | 'etiquetas' | 'respostas' | 'estrategias' | 'portal_ias' | 'flowbuilder' | 'webhooks' | 'filas' | 'equipe' | 'conexoes' | 'arquivos' | 'indicadores' | 'pedido_exames' | 'configuracoes';

const MENU_STRUCTURE = {
  atendimento: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
    { id: 'conversas', label: 'Conversas', icon: MessageCircle, badge: 97 },
    { id: 'contatos', label: 'Contatos', icon: Users, badge: undefined },
    { id: 'kanban', label: 'Kanban', icon: Grid3x3, badge: undefined },
    { id: 'pipeline', label: 'Pipeline CRM', icon: TrendingUp, badge: undefined },
  ],
  utilitarios: [
    { id: 'etiquetas', label: 'Etiquetas', icon: Tag, badge: undefined },
    { id: 'respostas', label: 'Respostas Rápidas', icon: Zap, badge: undefined },
  ],
  agenda: [
    { id: 'calendario', label: 'Calendário', icon: Calendar, badge: undefined },
    { id: 'followups', label: 'Follow-ups', icon: RotateCw, badge: undefined },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare, badge: undefined },
  ],
  automacao: [
    { id: 'estrategias', label: 'Estratégias', icon: Cog, badge: undefined },
    { id: 'portal_ias', label: 'Portal das IAs', icon: Brain, badge: undefined },
    { id: 'flowbuilder', label: 'FlowBuilder', icon: Sliders, badge: undefined },
    { id: 'webhooks', label: 'Webhooks / Triggers', icon: Zap, badge: undefined },
  ],
  gestao: [
    { id: 'filas', label: 'Filas', icon: List, badge: undefined },
    { id: 'equipe', label: 'Equipe', icon: Users, badge: undefined },
    { id: 'conexoes', label: 'Conexões', icon: Link, badge: undefined },
    { id: 'arquivos', label: 'Arquivos', icon: Folder, badge: undefined },
  ],
  relatorios: [
    { id: 'indicadores', label: 'Indicadores', icon: BarChart3, badge: undefined },
  ],
  clinica: [
    { id: 'pedido_exames', label: 'Pedido de Exames', icon: ClipboardList, badge: undefined },
  ],
};

const FOOTER_MENU = [
  { id: 'configuracoes', label: 'Configurações', icon: Cog },
  { id: 'sair', label: 'Sair', icon: LogOut },
];

const PAGE_MAPPING: Record<PageType, React.ComponentType> = {
  dashboard: Dashboard,
  conversas: Conversas,
  contatos: Contatos,
  kanban: Kanban,
  pipeline: Pipeline,
  calendario: Calendario,
  etiquetas: Etiquetas,
  respostas: Respostas,
  followups: Followups,
  tarefas: Tarefas,
  estrategias: Estrategias,
  portal_ias: PortalIas,
  flowbuilder: FlowBuilder,
  webhooks: Webhooks,
  filas: Filas,
  equipe: Equipe,
  conexoes: Conexoes,
  arquivos: Arquivos,
  indicadores: Indicadores,
  pedido_exames: PedidoExames,
  configuracoes: Configuracoes,
  sair: () => <div style={{ padding: '32px', color: '#7a96aa' }}>Saindo...</div>,
};

export function CRMLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { usuario } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const menuScrollRef = useRef<HTMLDivElement>(null);

  // Formatar data/hora do último login
  const formatarUltimoLogin = (dataString?: string) => {
    if (!dataString) return 'Primeiro acesso';

    try {
      const data = new Date(dataString);
      const agora = new Date();
      const diffMs = agora.getTime() - data.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Agora mesmo';
      if (diffMins < 60) return `${diffMins}m atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays === 1) return 'Ontem';
      if (diffDays < 7) return `${diffDays}d atrás`;

      // Formato: DD/MM/YYYY HH:MM
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, '0');
      const mins = String(data.getMinutes()).padStart(2, '0');

      return `${dia}/${mes}/${ano} ${horas}:${mins}`;
    } catch {
      return dataString;
    }
  };

  useEffect(() => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    // Detectar a página atual pela URL
    const pageName = pathname?.split('/')[1] || 'dashboard';
    if (pageName && pageName !== 'admin') {
      setCurrentPage(pageName as PageType);
    }
  }, [pathname]);

  const handleNavigation = (pageId: string) => {
    const id = pageId as PageType;
    setCurrentPage(id);
    
    // Navegar para a URL real
    if (id === 'sair') {
      console.log('Logout acionado');
      return;
    }
    
    router.push(`/${id}`);
  };

  const renderPage = () => {
    const PageComponent = PAGE_MAPPING[currentPage];
    if (PageComponent) {
      return <PageComponent />;
    }
    return <div style={{ padding: '32px', color: '#7a96aa' }}>Página em desenvolvimento: {currentPage}</div>;
  };

  const SidebarSection = ({ title, items }: { title: string; items: any[] }) => {
    return (
      <>
        {!sidebarCollapsed && (
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 10px', marginTop: title === 'ATENDIMENTO' ? 0 : '12px', marginBottom: '4px' }}>
            {title}
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => handleNavigation(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px', borderRadius: '8px', border: 'none', background: currentPage === item.id ? 'rgba(201, 148, 58, 0.1)' : 'transparent', color: currentPage === item.id ? '#c9943a' : 'rgba(255, 255, 255, 0.5)', fontSize: '13px', fontWeight: currentPage === item.id ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', height: '36px', marginBottom: '2px' }} title={sidebarCollapsed ? item.label : ''} onMouseEnter={(e) => { if (currentPage !== item.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)'; }} onMouseLeave={(e) => { if (currentPage !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <>
                <span>{item.label}</span>
                {item.badge && <span style={{ marginLeft: 'auto', background: '#e74c3c', color: '#ffffff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '8px', minWidth: '18px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>}
              </>}
            </button>
          );
        })}
      </>
    );
  };

  const SidebarButton = ({ item }: { item: any }) => {
    const Icon = item.icon;
    return (
      <button onClick={() => handleNavigation(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px', borderRadius: '8px', border: 'none', background: currentPage === item.id ? 'rgba(201, 148, 58, 0.1)' : 'transparent', color: currentPage === item.id ? '#c9943a' : item.id === 'sair' ? '#e74c3c' : 'rgba(255, 255, 255, 0.5)', fontSize: '13px', fontWeight: currentPage === item.id ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', height: '36px', marginBottom: '2px' }} title={sidebarCollapsed ? item.label : ''} onMouseEnter={(e) => { if (currentPage !== item.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)'; }} onMouseLeave={(e) => { if (currentPage !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
        <Icon size={18} style={{ flexShrink: 0 }} />
        {!sidebarCollapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0d1f2d', color: '#e8edf2', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      {/* HEADER TOP */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: '#0a1520',
        borderBottom: '1px solid #1e3d54',
        height: '60px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9943a' }}>
            👤 {usuario?.nome || 'Usuário'}
          </div>
          <div style={{ fontSize: '11px', color: '#7a96aa' }}>
            🕐 Último acesso: {formatarUltimoLogin((usuario as any)?.ultimoAcesso)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#7a96aa', display: 'flex', gap: '8px', alignItems: 'center' }}>
            🏥 <span style={{ color: '#e8edf2' }}>Clínica Dra. Andressa Barbarotti</span>
          </div>

          {/* STATUS DE CONEXÃO */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* WhatsApp */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#2ecc71',
                  boxShadow: '0 0 4px rgba(46, 204, 113, 0.5)',
                }}
              />
              WhatsApp Conectado
            </div>

            {/* Instagram */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#e1306c', fontWeight: 600 }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#e1306c',
                  boxShadow: '0 0 4px rgba(225, 48, 108, 0.5)',
                }}
              />
              Instagram Conectado
            </div>
          </div>

          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#c9943a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d1f2d', fontWeight: 700, fontSize: '14px' }}>
            H
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', background: '#0d1f2d', color: '#e8edf2' }}>
      {/* SIDEBAR */}
      <div style={{ width: sidebarCollapsed ? '70px' : '320px', background: '#0a1520', borderRight: '1px solid #1e3d54', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', overflow: 'hidden' }}>
        {/* LOGO */}
        <div style={{ padding: '16px 12px', borderBottom: '1px solid #1e3d54', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #c9943a, #e8b86d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#0d1f2d', flexShrink: 0 }}>P</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, background: 'linear-gradient(135deg, #c9943a, #e8b86d)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ProClinic</div>
              <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.3)', fontWeight: 500 }}>Inteligência Comercial</div>
            </div>
          )}
        </div>

        {/* MENU */}
        <div ref={menuScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '4px', scrollbarWidth: 'none' }}>
          <SidebarSection title="ATENDIMENTO" items={MENU_STRUCTURE.atendimento} />
          <SidebarSection title="UTILITÁRIOS" items={MENU_STRUCTURE.utilitarios} />
          <SidebarSection title="AGENDA" items={MENU_STRUCTURE.agenda} />
          <SidebarSection title="AUTOMAÇÃO & IA" items={MENU_STRUCTURE.automacao} />
          <SidebarSection title="GESTÃO" items={MENU_STRUCTURE.gestao} />
          <SidebarSection title="RELATÓRIOS" items={MENU_STRUCTURE.relatorios} />
          <SidebarSection title="CLÍNICA" items={MENU_STRUCTURE.clinica} />
        </div>

        {/* FOOTER */}
        <div style={{ padding: '12px 6px', borderTop: '1px solid #1e3d54', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {FOOTER_MENU.map((item) => <SidebarButton key={item.id} item={item} />)}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderPage()}
      </div>
      </div>
    </div>
  );
}

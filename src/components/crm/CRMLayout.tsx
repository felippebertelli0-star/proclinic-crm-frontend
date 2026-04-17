'use client';

import { useState, useRef, useEffect } from 'react';
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
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: undefined },
    { id: 'conversas', label: 'Conversas', icon: '💬', badge: 97 },
    { id: 'contatos', label: 'Contatos', icon: '👥', badge: undefined },
    { id: 'kanban', label: 'Kanban', icon: '🎯', badge: undefined },
    { id: 'pipeline', label: 'Pipeline CRM', icon: '📈', badge: undefined },
  ],
  utilitarios: [
    { id: 'etiquetas', label: 'Etiquetas', icon: '🏷️', badge: undefined },
    { id: 'respostas', label: 'Respostas Rápidas', icon: '⚡', badge: undefined },
  ],
  agenda: [
    { id: 'calendario', label: 'Calendário', icon: '📅', badge: undefined },
    { id: 'followups', label: 'Follow-ups', icon: '↩️', badge: undefined },
    { id: 'tarefas', label: 'Tarefas', icon: '✓', badge: undefined },
  ],
  automacao: [
    { id: 'estrategias', label: 'Estratégias', icon: '🎯', badge: undefined },
    { id: 'portal_ias', label: 'Portal das IAs', icon: '🤖', badge: undefined },
    { id: 'flowbuilder', label: 'FlowBuilder', icon: '⚙️', badge: undefined },
    { id: 'webhooks', label: 'Webhooks / Triggers', icon: '🔗', badge: undefined },
  ],
  gestao: [
    { id: 'filas', label: 'Filas', icon: '📋', badge: undefined },
    { id: 'equipe', label: 'Equipe', icon: '👨‍💼', badge: undefined },
    { id: 'conexoes', label: 'Conexões', icon: '🔌', badge: undefined },
    { id: 'arquivos', label: 'Arquivos', icon: '📁', badge: undefined },
  ],
  relatorios: [
    { id: 'indicadores', label: 'Indicadores', icon: '📊', badge: undefined },
  ],
  clinica: [
    { id: 'pedido_exames', label: 'Pedido de Exames', icon: '🏥', badge: undefined },
  ],
};

const FOOTER_MENU = [
  { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
  { id: 'sair', label: 'Sair', icon: '🚪' },
];

export function CRMLayout() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const menuScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollTop = 0;
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'conversas': return <Conversas />;
      case 'contatos': return <Contatos />;
      case 'kanban': return <Kanban />;
      case 'pipeline': return <Pipeline />;
      case 'calendario': return <Calendario />;
      case 'etiquetas': return <Etiquetas />;
      case 'respostas': return <Respostas />;
      case 'followups': return <Followups />;
      case 'tarefas': return <Tarefas />;
      case 'estrategias': return <Estrategias />;
      case 'portal_ias': return <PortalIas />;
      case 'flowbuilder': return <FlowBuilder />;
      case 'webhooks': return <Webhooks />;
      case 'filas': return <Filas />;
      case 'equipe': return <Equipe />;
      case 'conexoes': return <Conexoes />;
      case 'arquivos': return <Arquivos />;
      case 'indicadores': return <Indicadores />;
      case 'pedido_exames': return <PedidoExames />;
      case 'configuracoes': return <Configuracoes />;
      case 'sair': {
        console.log('Logout acionado');
        return <div style={{ padding: '32px', color: '#7a96aa' }}>Saindo...</div>;
      }
      default: return <div style={{ padding: '32px', color: '#7a96aa' }}>Página em desenvolvimento: {currentPage}</div>;
    }
  };

  const SidebarSection = ({ title, items }: { title: string; items: any[] }) => (
    <>
      {!sidebarCollapsed && (
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 10px', marginTop: title === 'ATENDIMENTO' ? 0 : '12px', marginBottom: '4px' }}>
          {title}
        </div>
      )}
      {items.map((item) => (
        <button key={item.id} onClick={() => setCurrentPage(item.id as PageType)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px', borderRadius: '10px', border: 'none', background: currentPage === item.id ? 'rgba(201, 148, 58, 0.15)' : 'transparent', color: currentPage === item.id ? '#c9943a' : '#7a96aa', fontSize: '13px', fontWeight: currentPage === item.id ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', height: '36px' }} title={sidebarCollapsed ? item.label : ''}>
          <span style={{ fontSize: '16px', minWidth: '16px' }}>{item.icon}</span>
          {!sidebarCollapsed && <>
            <span>{item.label}</span>
            {item.badge && <span style={{ marginLeft: 'auto', background: '#c9943a', color: '#0d1f2d', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '10px', minWidth: '20px', textAlign: 'center' }}>{item.badge}</span>}
          </>}
        </button>
      ))}
    </>
  );

  const SidebarButton = ({ item }: { item: any }) => (
    <button onClick={() => setCurrentPage(item.id as PageType)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px', borderRadius: '10px', border: 'none', background: currentPage === item.id ? 'rgba(201, 148, 58, 0.15)' : 'transparent', color: currentPage === item.id ? '#c9943a' : item.id === 'sair' ? '#e74c3c' : '#7a96aa', fontSize: '13px', fontWeight: currentPage === item.id ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', height: '36px' }} title={sidebarCollapsed ? item.label : ''}>
      <span style={{ fontSize: '16px', minWidth: '16px' }}>{item.icon}</span>
      {!sidebarCollapsed && <span>{item.label}</span>}
    </button>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d1f2d', color: '#e8edf2', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      {/* SIDEBAR */}
      <div style={{ width: sidebarCollapsed ? '70px' : '280px', background: '#0a1520', borderRight: '1px solid #1e3d54', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', overflow: 'hidden' }}>
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
        <div ref={menuScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '4px', scrollbarWidth: 'none', scrollBehavior: 'smooth' }}>
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
  );
}

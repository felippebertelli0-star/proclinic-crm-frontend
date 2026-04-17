'use client';

import { useState } from 'react';
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

type PageType = 'dashboard' | 'conversas' | 'contatos' | 'kanban' | 'pipeline' | 'calendario' | 'followups' | 'tarifas' | 'etiquetas' | 'respostas' | 'estrategias' | 'portal_ias' | 'flowbuilder' | 'webhooks' | 'filas' | 'equipe' | 'conexoes' | 'arquivos' | 'indicadores' | 'configuracoes';

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
  ],
  automacao: [
    { id: 'estrategias', label: 'Estratégias', icon: '🎯', badge: undefined },
    { id: 'portal_ias', label: 'Portal das IAs', icon: '🤖', badge: undefined },
    { id: 'flowbuilder', label: 'FlowBuilder', icon: '⚙️', badge: undefined },
    { id: 'webhooks', label: 'Webhooks / Triggers', icon: '🔗', badge: undefined },
  ],
};

const FOOTER_MENU = [
  { id: 'filas', label: 'Filas', icon: '📋' },
  { id: 'equipe', label: 'Equipe', icon: '👨‍💼' },
  { id: 'conexoes', label: 'Conexões', icon: '🔌' },
  { id: 'arquivos', label: 'Arquivos', icon: '📁' },
  { id: 'indicadores', label: 'Indicadores', icon: '📊' },
  { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
];

export function CRMLayout() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      case 'estrategias': return <Estrategias />;
      case 'portal_ias': return <PortalIas />;
      case 'flowbuilder': return <FlowBuilder />;
      case 'webhooks': return <Webhooks />;
      case 'filas': return <Filas />;
      case 'equipe': return <Equipe />;
      case 'conexoes': return <Conexoes />;
      case 'arquivos': return <Arquivos />;
      case 'indicadores': return <Indicadores />;
      case 'configuracoes': return <Configuracoes />;
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1f2d', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: sidebarCollapsed ? '70px' : '214px', background: '#132636', borderRight: '1px solid #1e3d54', padding: '20px 0', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden' }}>
        <div style={{ padding: '0 15px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: '#e8edf2' }}>
          <span style={{ fontSize: '24px', background: 'linear-gradient(135deg, #c9943a, #e8b86d, #c9943a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>P</span>
          {!sidebarCollapsed && <><span>ProClinic</span><div style={{ fontSize: '10px', color: '#7a96aa', fontWeight: 600, marginTop: '4px' }}>Inteligência Comercial</div></> }
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0px', padding: '0 8px' }}>
          <SidebarSection title="ATENDIMENTO" items={MENU_STRUCTURE.atendimento} />
          <SidebarSection title="UTILITÁRIOS" items={MENU_STRUCTURE.utilitarios} />
          <SidebarSection title="AGENDA" items={MENU_STRUCTURE.agenda} />
          <SidebarSection title="AUTOMAÇÃO & IA" items={MENU_STRUCTURE.automacao} />
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid #1e3d54', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {!sidebarCollapsed && <div style={{ fontSize: '9px', fontWeight: 700, color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 10px', marginBottom: '4px' }}>GESTÃO</div>}
          {FOOTER_MENU.map((item) => (
            <button key={item.id} onClick={() => setCurrentPage(item.id as PageType)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px', borderRadius: '10px', border: 'none', background: currentPage === item.id ? 'rgba(201, 148, 58, 0.15)' : 'transparent', color: currentPage === item.id ? '#c9943a' : '#7a96aa', fontSize: '13px', fontWeight: currentPage === item.id ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', height: '36px' }} title={sidebarCollapsed ? item.label : ''}>
              <span style={{ fontSize: '16px', minWidth: '16px' }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: '#0d1f2d', borderBottom: '1px solid #1e3d54', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '58px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', color: '#c9943a', fontSize: '20px', cursor: 'pointer' }}>☰</button>
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#e8edf2', margin: 0 }}>ProClinic — Inteligência Comercial</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
            <span style={{ color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '4px' }}>🟢 Clínica Dra. Andressa Barbarotti</span>
            <span style={{ color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '4px' }}>🟢 WhatsApp Conectado</span>
            <span style={{ color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '4px' }}>🟢 Instagram Conectado</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#c9943a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#0d1f2d', cursor: 'pointer' }}>H</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', background: '#0d1f2d' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

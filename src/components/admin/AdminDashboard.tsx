/**
 * Admin Dashboard
 * Fiel ao protótipo localhost:3456/admin.html
 * Qualidade: Premium AAA
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminDashboard() {
  const router = useRouter();
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'sistemas'>('dashboard');
  const [showNewSystemModal, setShowNewSystemModal] = useState(false);

  const stats = {
    totalClients: 12,
    activeClients: 10,
    monthlyRevenue: 'R$ 28,8k',
    uptime: '99.8%',
  };

  const systems = [
    {
      id: 1,
      name: 'Clínica Exemplo 1',
      plan: 'Pro',
      revenue: 'R$ 599/mês',
      status: 'ativo',
      users: 5,
    },
    {
      id: 2,
      name: 'Clínica Exemplo 2',
      plan: 'Starter',
      revenue: 'R$ 299/mês',
      status: 'ativo',
      users: 2,
    },
  ];

  const handleLogout = () => {
    router.push('/admin/login');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0f1419',
      color: '#ffffff',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: '#151d2a',
        borderRight: '1px solid #2a3647',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '0 20px 24px',
          borderBottom: '1px solid #2a3647',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            marginBottom: '4px',
          }}>
            Jarvis
          </div>
          <div style={{
            fontSize: '11px',
            color: '#7a8291',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Painel Admin
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '0 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'sistemas', label: 'Sistemas', icon: '⚙️' },
            { id: 'monitoramento', label: 'Monitoramento', icon: '📡' },
            { id: 'financeiro', label: 'Financeiro', icon: '💰' },
            { id: 'suporte', label: 'Suporte', icon: '🎫' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveScreen(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: activeScreen === item.id ? '#d4af37' : '#b0b8c1',
                background: activeScreen === item.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                fontSize: '13px',
                fontWeight: activeScreen === item.id ? 600 : 500,
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '20px 12px',
          borderTop: '1px solid #2a3647',
          marginTop: '12px',
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: '1px solid #2a3647',
              borderRadius: '8px',
              color: '#b0b8c1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🚪 Sair do Painel
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px',
      }}>
        {/* Dashboard Screen */}
        {activeScreen === 'dashboard' && (
          <div>
            <div style={{
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #2a3647',
            }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                marginBottom: '4px',
              }}>
                Dashboard
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#7a8291',
                marginTop: '4px',
              }}>
                Visão geral do sistema Jarvis
              </p>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '32px',
            }}>
              {[
                { label: 'Total de Clientes', value: stats.totalClients, change: '↑ 2 este mês' },
                { label: 'Clientes Ativos', value: '83%', change: 'de conversão' },
                { label: 'Receita Mensal', value: stats.monthlyRevenue, change: '↑ 12% em crescimento' },
                { label: 'Uptime Médio', value: stats.uptime, change: '✓ Excelente saúde' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#151d2a',
                    border: '1px solid #2a3647',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    color: '#7a8291',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    letterSpacing: '-1px',
                    marginBottom: '8px',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#2ecc71',
                    fontWeight: 600,
                  }}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Info Sections */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[
                {
                  title: 'Sistemas Ativos',
                  subtitle: 'Gerenciar e monitorar todos os clientes CRM',
                  icon: '⚙️',
                },
                {
                  title: 'Monitoramento',
                  subtitle: 'Status e performance em tempo real',
                  icon: '📡',
                },
                {
                  title: 'Financeiro',
                  subtitle: 'Receitas, planos e faturamento',
                  icon: '💰',
                },
              ].map((section, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#151d2a',
                    border: '1px solid #2a3647',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '24px', borderBottom: '1px solid #2a3647' }}>
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>{section.icon}</div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      marginBottom: '4px',
                    }}>
                      {section.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#7a8291',
                    }}>
                      {section.subtitle}
                    </p>
                  </div>
                  <div style={{
                    padding: '16px 24px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    fontSize: '12px',
                    color: '#7a8291',
                  }}>
                    Em desenvolvimento...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sistemas Screen */}
        {activeScreen === 'sistemas' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #2a3647',
            }}>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  marginBottom: '4px',
                }}>
                  Sistemas
                </h1>
                <p style={{
                  fontSize: '13px',
                  color: '#7a8291',
                  marginTop: '4px',
                }}>
                  Gerenciar e monitorar todos os clientes CRM
                </p>
              </div>
              <button
                onClick={() => setShowNewSystemModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#0f1419',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                + Novo Sistema
              </button>
            </div>

            {/* Systems Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}>
              {systems.map((system) => (
                <div
                  key={system.id}
                  style={{
                    background: '#151d2a',
                    border: '1px solid #2a3647',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 700,
                      }}>
                        {system.name}
                      </h3>
                      <span style={{
                        background: '#2ecc71',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}>
                        Ativo
                      </span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gap: '12px',
                      fontSize: '13px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#7a8291' }}>Plano:</span>
                        <span style={{ fontWeight: 600 }}>{system.plan}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#7a8291' }}>Receita:</span>
                        <span style={{ color: '#d4af37', fontWeight: 600 }}>{system.revenue}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#7a8291' }}>Usuários:</span>
                        <span style={{ fontWeight: 600 }}>{system.users}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Screens */}
        {['monitoramento', 'financeiro', 'suporte'].includes(activeScreen) && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#7a8291',
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              🚀 Tela em desenvolvimento
            </p>
            <p style={{ fontSize: '13px' }}>
              Esta seção será implementada em breve
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

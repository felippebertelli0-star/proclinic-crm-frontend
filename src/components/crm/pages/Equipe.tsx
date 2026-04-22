'use client';

import { useState, useMemo, useEffect } from 'react';
import { useEquipeStore } from '@/store/equipeStore';
import { useEquipeSync } from '@/hooks/useEquipeSync';
import { CreateMembroModal } from './Equipe/CreateMembroModal';
import { Ticket, MessageCircle, Clock, Briefcase, Calendar, CheckCircle, XCircle, Send, Edit2 } from 'lucide-react';

export function Equipe() {
  const membros = useEquipeStore((state) => state.membros);
  const addMembro = useEquipeStore((state) => state.addMembro);
  const hydrate = useEquipeStore((state) => state.hydrate);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Carrega dados do localStorage ao montar
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Mock data para sincronização (substituir por dados reais do API)
  const conversasMock = useMemo(() => [], []);
  const opportunitiesMock = useMemo(() => [], []);

  // Sincronizar com conversas e pipeline
  useEquipeSync(conversasMock, opportunitiesMock);

  const handleCreateMembro = (novoMembro: any) => {
    const id = membros.length > 0 ? Math.max(...membros.map((m) => m.id)) + 1 : 1;
    addMembro({
      ...novoMembro,
      id,
      conversas: 0,
      status: 'Offline',
    });
    setCreateModalOpen(false);
    console.log('[EQUIPE] ✓ Novo membro criado:', novoMembro.nome);
  };

  return (
    <div
      style={{
        padding: '24px',
        background: '#0d1f2d',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'auto',
        scrollbarGutter: 'stable',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Equipe</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#c9943a',
            color: '#0d1f2d',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease-out',
            flexShrink: 0,
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d9a344';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 148, 58, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#c9943a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➕ Cadastrar Membro
        </button>
      </div>

      {/* Grid de Membros */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {membros.map((membro) => (
          <div
            key={membro.id}
            style={{
              background: 'rgba(25, 45, 65, 0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(90, 120, 140, 0.3)',
              borderRadius: '14px',
              padding: '16px 28px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              minHeight: '72px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 30px rgba(0, 0, 0, 0.4)`;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.5)';
              e.currentTarget.style.background = 'rgba(25, 45, 65, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 2px 8px rgba(0, 0, 0, 0.2)`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)';
              e.currentTarget.style.background = 'rgba(25, 45, 65, 0.5)';
            }}
          >

            {/* Content Wrapper */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'flex-start' }}>
              {/* Header: Avatar + Nome + Status + Métricas */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {/* Avatar + Nome + Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, width: '220px', minWidth: '220px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: membro.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: `0 2px 6px ${membro.avatarColor}25`,
                    border: 'none',
                  }}
                >
                  {membro.nome[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: '#e8edf2', letterSpacing: '-0.3px' }}>
                    {membro.nome}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '8px', fontWeight: 500 }}>
                    {membro.cargo}
                  </div>
                  {/* Status Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase',
                      background:
                        membro.status === 'Online'
                          ? 'rgba(46, 204, 113, 0.12)'
                          : membro.status === 'Ausente'
                          ? 'rgba(243, 156, 18, 0.12)'
                          : 'rgba(120, 130, 140, 0.12)',
                      color:
                        membro.status === 'Online'
                          ? '#2ecc71'
                          : membro.status === 'Ausente'
                          ? '#f39c12'
                          : '#7a96aa',
                      border:
                        membro.status === 'Online'
                          ? '1px solid rgba(46, 204, 113, 0.3)'
                          : membro.status === 'Ausente'
                          ? '1px solid rgba(243, 156, 18, 0.3)'
                          : '1px solid rgba(120, 130, 140, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background:
                          membro.status === 'Online'
                            ? '#2ecc71'
                            : membro.status === 'Ausente'
                            ? '#f39c12'
                            : '#7a96aa',
                      }}
                    />
                    {membro.status === 'Online' ? 'Online' : membro.status === 'Ausente' ? 'Ausente' : 'Offline'}
                  </div>
                </div>
                </div>

                {/* Métricas Principais */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexShrink: 0,
                    width: 'auto',
                    minWidth: '280px',
                    alignItems: 'center',
                    height: '100%',
                  }}
              >
                {[
                  { label: 'Tickets', value: membro.tickets || 0, Icon: Ticket },
                  { label: 'Conversas', value: membro.conversas || 0, Icon: MessageCircle },
                  { label: 'TMR', value: membro.tmr || '0 min', Icon: Clock },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    style={{
                      background: 'rgba(30, 61, 84, 0.4)',
                      border: '1px solid #2a4a63',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      transition: 'all 0.3s ease',
                      minWidth: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '100%',
                      minHeight: '52px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(30, 61, 84, 0.6)';
                      e.currentTarget.style.borderColor = '#3a6a93';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(30, 61, 84, 0.4)';
                      e.currentTarget.style.borderColor = '#2a4a63';
                    }}
                  >
                    {/* Topo: Ícone + Label */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'center',
                      }}
                    >
                      <metric.Icon size={14} style={{ color: '#c9943a', flexShrink: 0 }} />
                      <div
                        style={{
                          fontSize: '8px',
                          color: '#7a96aa',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.4px',
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                    {/* Meio: Número centralizado */}
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#c9943a', letterSpacing: '-0.5px' }}>
                      {metric.value}
                    </div>
                  </div>
                ))}
                </div>
              </div>

              {/* Mini Pipeline Indicator */}
              {membro.pipelineStats && (
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexShrink: 0,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    marginLeft: '0px',
                  }}
                >
                  {[
                    { value: membro.pipelineStats.negociacao, Icon: Briefcase, title: 'Negociação' },
                    { value: membro.pipelineStats.agendou, Icon: Calendar, title: 'Agendou' },
                    { value: membro.pipelineStats.convertido, Icon: CheckCircle, title: 'Convertido' },
                    { value: membro.pipelineStats.naoAgendou, Icon: XCircle, title: 'Não Agendou' },
                  ].map((stage, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        minWidth: '38px',
                      }}
                      title={stage.title}
                    >
                      <stage.Icon size={18} style={{ color: '#7a96aa' }} />
                      <span style={{ fontWeight: 700, color: '#e8edf2', fontSize: '11px' }}>{stage.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botões */}
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0, marginLeft: 'auto', justifyContent: 'flex-end' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #2a4a63',
                    background: 'rgba(42, 74, 99, 0.3)',
                    color: '#7a96aa',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    letterSpacing: '0.3px',
                    flex: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7a96aa';
                    e.currentTarget.style.color = '#e8edf2';
                    e.currentTarget.style.background = 'rgba(42, 74, 99, 0.6)';
                    e.currentTarget.style.boxShadow = `0 8px 16px rgba(0, 0, 0, 0.2)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2a4a63';
                    e.currentTarget.style.color = '#7a96aa';
                    e.currentTarget.style.background = 'rgba(42, 74, 99, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Send size={16} />
                  Mensagem
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #2a4a63',
                    background: 'rgba(42, 74, 99, 0.3)',
                    color: '#7a96aa',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    letterSpacing: '0.3px',
                    flex: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7a96aa';
                    e.currentTarget.style.color = '#e8edf2';
                    e.currentTarget.style.background = 'rgba(42, 74, 99, 0.6)';
                    e.currentTarget.style.boxShadow = `0 8px 16px rgba(0, 0, 0, 0.2)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2a4a63';
                    e.currentTarget.style.color = '#7a96aa';
                    e.currentTarget.style.background = 'rgba(42, 74, 99, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Edit2 size={16} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro */}
      <CreateMembroModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateMembro}
      />
    </div>
  );
}

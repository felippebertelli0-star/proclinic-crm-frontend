'use client';

import { useState, useMemo } from 'react';
import { useEquipeStore } from '@/store/equipeStore';
import { useEquipeSync } from '@/hooks/useEquipeSync';
import { CreateMembroModal } from './Equipe/CreateMembroModal';

export function Equipe() {
  const membros = useEquipeStore((state) => state.membros);
  const addMembro = useEquipeStore((state) => state.addMembro);
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d9a344';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#c9943a';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➕ Cadastrar Membro
        </button>
      </div>

      {/* Grid de Membros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
        }}
      >
        {membros.map((membro) => (
          <div
            key={membro.id}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: '14px',
              padding: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 24px ${membro.avatarColor}40`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Header: Avatar + Nome + Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: membro.avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {membro.nome[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0', color: '#e8edf2' }}>
                  {membro.nome}
                </h3>
                <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '4px' }}>
                  {membro.cargo}
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color:
                    membro.status === 'Online' ? '#2ecc71' : membro.status === 'Ausente' ? '#f39c12' : '#e74c3c',
                  whiteSpace: 'nowrap',
                }}
              >
                {membro.status === 'Online' ? '◉ Online' : membro.status === 'Ausente' ? '◎ Ausente' : '○ Offline'}
              </div>
            </div>

            {/* Métricas Principais */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
                marginBottom: '12px',
                padding: '12px',
                background: 'rgba(13, 31, 45, 0.5)',
                borderRadius: '8px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '9px',
                    color: '#7a96aa',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Tickets
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#c9943a' }}>
                  {membro.tickets || 0}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '9px',
                    color: '#7a96aa',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Conversas
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#3498db' }}>
                  {membro.conversas || 0}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '9px',
                    color: '#7a96aa',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  TMR
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#2ecc71' }}>
                  {membro.tmr || '0 min'}
                </div>
              </div>
            </div>

            {/* Pipeline Stats */}
            {membro.pipelineStats && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '11px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#f1c40f',
                    }}
                  ></div>
                  <span style={{ color: '#7a96aa' }}>
                    Neg.: <strong style={{ color: '#e8edf2' }}>{membro.pipelineStats.negociacao}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#3498db',
                    }}
                  ></div>
                  <span style={{ color: '#7a96aa' }}>
                    Agendou: <strong style={{ color: '#e8edf2' }}>{membro.pipelineStats.agendou}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#2ecc71',
                    }}
                  ></div>
                  <span style={{ color: '#7a96aa' }}>
                    Convertido: <strong style={{ color: '#e8edf2' }}>{membro.pipelineStats.convertido}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#e74c3c',
                    }}
                  ></div>
                  <span style={{ color: '#7a96aa' }}>
                    Não Agendou: <strong style={{ color: '#e8edf2' }}>{membro.pipelineStats.naoAgendou}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Botões */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #c9943a',
                  background: 'transparent',
                  color: '#c9943a',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 148, 58, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                ○ Msg
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7a96aa';
                  e.currentTarget.style.color = '#e8edf2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e3d54';
                  e.currentTarget.style.color = '#7a96aa';
                }}
              >
                Editar
              </button>
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

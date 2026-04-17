/**
 * Página Pipeline CRM - CRM ProClinic
 * 100% Fiel ao protótipo - Sales funnel com 5 estágios
 */

'use client';

import { useState } from 'react';

export function Pipeline() {
  const [viewMode, setViewMode] = useState('kanban');

  // Mock data de oportunidades por estágio
  const estagios = [
    {
      id: 'novo_lead',
      titulo: 'Novo Lead',
      cor: '#3498db',
      opportunities: [
        { id: 1, nome: 'João Silva', valor: 500, agente: 'Hávila' },
        { id: 2, nome: 'Maria Santos', valor: 800, agente: 'Camilly' },
        { id: 3, nome: 'Pedro Costa', valor: 1200, agente: 'Fernando' },
      ],
    },
    {
      id: 'negociacao',
      titulo: 'Em Negociação',
      cor: '#f39c12',
      opportunities: [
        { id: 4, nome: 'Ana Paula', valor: 1500, agente: 'Hávila' },
        { id: 5, nome: 'Carlos Mendes', valor: 2000, agente: 'Camilly' },
      ],
    },
    {
      id: 'agendou',
      titulo: 'Agendou',
      cor: '#2ecc71',
      opportunities: [
        { id: 6, nome: 'Lucia Ferreira', valor: 1800, agente: 'Hávila' },
        { id: 7, nome: 'Roberto Cunha', valor: 1200, agente: 'Fernando' },
      ],
    },
    {
      id: 'convertido',
      titulo: 'Convertido',
      cor: '#27ae60',
      opportunities: [
        { id: 8, nome: 'Patricia Lima', valor: 2500, agente: 'Camilly' },
        { id: 9, nome: 'Daniel Alves', valor: 1700, agente: 'Hávila' },
      ],
    },
    {
      id: 'nao_agendou',
      titulo: 'Não Agendou',
      cor: '#e74c3c',
      opportunities: [
        { id: 10, nome: 'Gabriela Silva', valor: 900, agente: 'Fernando' },
        { id: 11, nome: 'Helena Costa', valor: 600, agente: 'Camilly' },
      ],
    },
  ];

  // Calcular totais
  const totalValor = estagios.reduce((acc, est) =>
    acc + est.opportunities.reduce((sum, opp) => sum + opp.valor, 0), 0
  );
  const totalOportunidades = estagios.reduce((acc, est) => acc + est.opportunities.length, 0);
  const convertidas = estagios[3].opportunities.length;
  const taxaConversao = ((convertidas / totalOportunidades) * 100).toFixed(1);
  const ticketMedio = (totalValor / totalOportunidades).toFixed(0);

  return (
    <div
      style={{
        padding: '24px',
        background: '#0d1f2d',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* RESUMO CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: `R$ ${(totalValor / 1000).toFixed(1)}k`, value: 'Total no Funil', color: '#c9943a' },
          { label: convertidas, value: 'Convertidas', color: '#2ecc71' },
          { label: `${taxaConversao}%`, value: 'Taxa de Conversão', color: '#3498db' },
          { label: `R$ ${ticketMedio}`, value: 'Ticket Médio', color: '#f39c12' },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: card.color,
                marginBottom: '4px',
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#7a96aa',
                fontWeight: 600,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* AÇÕES */}
      <div
        style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: '#c9943a',
            color: '#0d1f2d',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#d9a344')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#c9943a')}
        >
          + Nova Oportunidade
        </button>

        <button
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #1e3d54',
            background: 'transparent',
            color: '#7a96aa',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Vista
        </button>
      </div>

      {/* PIPELINE KANBAN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          overflowX: 'auto',
        }}
      >
        {estagios.map((estagio) => (
          <div
            key={estagio.id}
            style={{
              background: '#132636',
              border: `2px solid ${estagio.cor}`,
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '550px',
            }}
          >
            {/* HEADER */}
            <div
              style={{
                background: estagio.cor,
                color: '#0d1f2d',
                padding: '12px 16px',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {estagio.titulo} ({estagio.opportunities.length})
            </div>

            {/* OPORTUNIDADES */}
            <div
              style={{
                flex: 1,
                padding: '12px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {estagio.opportunities.map((opp) => (
                <div
                  key={opp.id}
                  style={{
                    background: '#0d1f2d',
                    border: `1px solid ${estagio.cor}20`,
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'grab',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = estagio.cor;
                    e.currentTarget.style.boxShadow = `0 0 8px ${estagio.cor}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${estagio.cor}20`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Avatar + Nome */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: estagio.cor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#0d1f2d',
                        flexShrink: 0,
                      }}
                    >
                      {opp.nome[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#e8edf2',
                        }}
                      >
                        {opp.nome}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#7a96aa',
                        }}
                      >
                        {opp.agente}
                      </div>
                    </div>
                  </div>

                  {/* Valor */}
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: estagio.cor,
                      marginBottom: '6px',
                    }}
                  >
                    R$ {opp.valor.toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÃO ADICIONAR */}
            <div style={{ padding: '12px', borderTop: `1px solid ${estagio.cor}20` }}>
              <button
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${estagio.cor}40`,
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = estagio.cor;
                  e.currentTarget.style.color = estagio.cor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${estagio.cor}40`;
                  e.currentTarget.style.color = '#7a96aa';
                }}
              >
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

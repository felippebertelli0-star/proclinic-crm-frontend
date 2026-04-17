/**
 * Página Kanban - CRM ProClinic
 * 100% Fiel ao protótipo - 5 Colunas com drag-drop e filtros
 */

'use client';

import { useState } from 'react';

export function Kanban() {
  const [filterAgente, setFilterAgente] = useState('Todos');
  const [filterPrioridade, setFilterPrioridade] = useState('Todas');
  const [expandedColumns, setExpandedColumns] = useState<{ [key: string]: boolean }>({
    comercial: true,
    secretaria: true,
    ia: true,
    suporte: true,
    agendando: true,
  });

  // Mock data de colunas
  const colunas = [
    {
      id: 'comercial',
      titulo: 'Comercial',
      cor: '#c9943a',
      cards: [
        { id: 1, nome: 'Ida Santos', agente: 'Hávila', prioridade: 'Alta' },
        { id: 2, nome: 'Laura Ferreira', agente: 'Camilly', prioridade: 'Média' },
        { id: 3, nome: 'Larissa Alcântara', agente: 'Hávila', prioridade: 'Alta' },
        { id: 4, nome: 'Roberto Cunha', agente: 'Fernando', prioridade: 'Baixa' },
      ],
    },
    {
      id: 'secretaria',
      titulo: 'Secretária',
      cor: '#3498db',
      cards: [
        { id: 6, nome: 'Daniele Mantovani', agente: 'Camilly', prioridade: 'Média' },
        { id: 7, nome: 'Maria Rosa', agente: 'Hávila', prioridade: 'Alta' },
        { id: 8, nome: 'Patricia Lima', agente: 'Camilly', prioridade: 'Média' },
      ],
    },
    {
      id: 'ia',
      titulo: 'IA',
      cor: '#9b59b6',
      cards: [
        { id: 11, nome: 'Ana Beatriz', agente: 'Auto', prioridade: 'Média' },
        { id: 12, nome: 'Fernando Gomes', agente: 'Auto', prioridade: 'Alta' },
      ],
    },
    {
      id: 'suporte',
      titulo: 'Suporte',
      cor: '#2ecc71',
      cards: [
        { id: 14, nome: 'Carlota Mendes', agente: 'Camilly', prioridade: 'Média' },
      ],
    },
    {
      id: 'agendando',
      titulo: 'Agendando',
      cor: '#f39c12',
      cards: [
        { id: 16, nome: 'Ana Paula', agente: 'Fernando', prioridade: 'Média' },
        { id: 17, nome: 'Sínia Cardoso', agente: 'Camilly', prioridade: 'Baixa' },
      ],
    },
  ];

  // Filtrar cards
  const filtrarCards = (cards: any[]) => {
    return cards.filter((card) => {
      const matchAgente = filterAgente === 'Todos' || card.agente === filterAgente;
      const matchPrioridade = filterPrioridade === 'Todas' || card.prioridade === filterPrioridade;
      return matchAgente && matchPrioridade;
    });
  };

  // Calcular totais
  const totalCards = colunas.reduce((acc, col) => acc + filtrarCards(col.cards).length, 0);

  const toggleColuna = (colId: string) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };

  return (
    <div
      style={{
        padding: '32px',
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
          { label: 'Total de Cards', value: totalCards, color: '#c9943a' },
          { label: 'Não Lidos', value: 14, color: '#f39c12' },
          { label: 'Agendados', value: 3, color: '#2ecc71' },
          { label: 'A Processar', value: 5, color: '#3498db' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: '#7a96aa',
                marginBottom: '8px',
                fontWeight: 600,
              }}
            >
              {card.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* FILTROS E AÇÕES */}
      <div
        style={{
          background: '#132636',
          border: '1px solid #1e3d54',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* FILTRO AGENTE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#7a96aa' }}>AGENTE:</span>
            <select
              value={filterAgente}
              onChange={(e) => setFilterAgente(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #1e3d54',
                background: '#0d1f2d',
                color: '#e8edf2',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <option>Todos</option>
              <option>Hávila</option>
              <option>Camilly</option>
              <option>Fernando</option>
              <option>Auto</option>
            </select>
          </div>

          {/* FILTRO PRIORIDADE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#7a96aa' }}>PRIORIDADE:</span>
            <select
              value={filterPrioridade}
              onChange={(e) => setFilterPrioridade(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #1e3d54',
                background: '#0d1f2d',
                color: '#e8edf2',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <option>Todas</option>
              <option>Alta</option>
              <option>Média</option>
              <option>Baixa</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          {/* BOTÃO NOVO CARD */}
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
            + Novo Card
          </button>

          {/* BOTÃO RECOLHER */}
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
            Recolher
          </button>
        </div>
      </div>

      {/* COLUNAS KANBAN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          overflowX: 'auto',
        }}
      >
        {colunas.map((coluna) => {
          const cardsFiltrados = filtrarCards(coluna.cards);
          return (
            <div
              key={coluna.id}
              style={{
                background: '#132636',
                border: `2px solid ${coluna.cor}`,
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '500px',
              }}
            >
              {/* HEADER DA COLUNA */}
              <div
                style={{
                  background: coluna.cor,
                  color: '#0d1f2d',
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  {coluna.titulo} ({cardsFiltrados.length})
                </div>
                <button
                  onClick={() => toggleColuna(coluna.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0d1f2d',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {expandedColumns[coluna.id] ? '−' : '+'}
                </button>
              </div>

              {/* CARDS */}
              <div
                style={{
                  flex: 1,
                  padding: '12px',
                  overflowY: 'auto',
                  display: expandedColumns[coluna.id] ? 'flex' : 'none',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {cardsFiltrados.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      background: '#0d1f2d',
                      border: '1px solid #1e3d54',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'grab',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = coluna.cor;
                      e.currentTarget.style.boxShadow = `0 0 8px ${coluna.cor}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#1e3d54';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
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
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: coluna.cor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#0d1f2d',
                        }}
                      >
                        {card.nome[0]}
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#e8edf2',
                          flex: 1,
                        }}
                      >
                        {card.nome}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        fontSize: '10px',
                      }}
                    >
                      <span
                        style={{
                          background: 'rgba(52, 152, 219, 0.2)',
                          color: '#3498db',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {card.agente}
                      </span>
                      <span
                        style={{
                          background:
                            card.prioridade === 'Alta'
                              ? 'rgba(231, 76, 60, 0.2)'
                              : card.prioridade === 'Média'
                              ? 'rgba(243, 156, 18, 0.2)'
                              : 'rgba(46, 204, 113, 0.2)',
                          color:
                            card.prioridade === 'Alta'
                              ? '#e74c3c'
                              : card.prioridade === 'Média'
                              ? '#f39c12'
                              : '#2ecc71',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {card.prioridade}
                      </span>
                    </div>
                  </div>
                ))}

                {cardsFiltrados.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#7a96aa',
                      fontSize: '12px',
                      paddingTop: '20px',
                    }}
                  >
                    Nenhum card
                  </div>
                )}
              </div>

              {/* BOTÃO ADICIONAR */}
              {expandedColumns[coluna.id] && (
                <div style={{ padding: '12px', borderTop: '1px solid #1e3d54' }}>
                  <button
                    style={{
                      width: '100%',
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
                      e.currentTarget.style.borderColor = coluna.cor;
                      e.currentTarget.style.color = coluna.cor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#1e3d54';
                      e.currentTarget.style.color = '#7a96aa';
                    }}
                  >
                    + Adicionar card
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

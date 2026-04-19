/**
 * Página Kanban - CRM ProClinic
 * 100% Fiel ao protótipo - 5 Colunas com drag-drop e filtros
 */

'use client';

import { useState } from 'react';
import { useEquipeStore } from '@/store/equipeStore';
import { User, Clock, Zap, Eye, MessageSquare, LayoutGrid, Plus, Minus } from 'lucide-react';

export function Kanban() {
  const [filterAgente, setFilterAgente] = useState('Todos');
  const [filterPrioridade, setFilterPrioridade] = useState('Todas');
  const [selectedMembro, setSelectedMembro] = useState<string | null>(null);
  const [modalEspiarVisivel, setModalEspiarVisivel] = useState(false);
  const [conversaSelecionada, setConversaSelecionada] = useState<any>(null);
  const membros = useEquipeStore((state) => state.membros);

  const getMembroByNome = (nome: string) => {
    return membros.find((m) => m.nome === nome);
  };

  const [expandedColumns, setExpandedColumns] = useState<{ [key: string]: boolean }>({
    comercial: true,
    secretaria: true,
    ia: true,
    suporte: true,
    agendando: true,
  });

  // Mapa de cores para origens (sutil e delicado)
  const corigenMap: { [key: string]: { bg: string; text: string } } = {
    'Tráfego Pago': { bg: 'rgba(52, 152, 219, 0.08)', text: '#3498db' },
    'Orgânico': { bg: 'rgba(46, 204, 113, 0.08)', text: '#2ecc71' },
    'Indicação': { bg: 'rgba(201, 148, 58, 0.08)', text: '#c9943a' },
    'Direto': { bg: 'rgba(155, 89, 182, 0.08)', text: '#9b59b6' },
  };

  // Mock data de colunas
  const colunas = [
    {
      id: 'comercial',
      titulo: 'Comercial',
      cor: '#c9943a',
      cards: [
        { id: 1, nome: 'Ida Santos', agente: 'Hávila Rodrigues', prioridade: 'Alta', origem: 'Tráfego Pago', tempo: '2h 15m' },
        { id: 2, nome: 'Laura Ferreira', agente: 'Camilly Nunes', prioridade: 'Média', origem: 'Orgânico', tempo: '1h 30m' },
        { id: 3, nome: 'Larissa Alcântara', agente: 'Hávila Rodrigues', prioridade: 'Alta', origem: 'Indicação', tempo: '45m' },
        { id: 4, nome: 'Roberto Cunha', agente: 'Fernando Silva', prioridade: 'Baixa', origem: 'Direto', tempo: '3h' },
      ],
    },
    {
      id: 'secretaria',
      titulo: 'Secretária',
      cor: '#3498db',
      cards: [
        { id: 6, nome: 'Daniele Mantovani', agente: 'Camilly Nunes', prioridade: 'Média', origem: 'Tráfego Pago', tempo: '1h 45m' },
        { id: 7, nome: 'Maria Rosa', agente: 'Hávila Rodrigues', prioridade: 'Alta', origem: 'Orgânico', tempo: '50m' },
        { id: 8, nome: 'Patricia Lima', agente: 'Camilly Nunes', prioridade: 'Média', origem: 'Indicação', tempo: '2h 20m' },
      ],
    },
    {
      id: 'ia',
      titulo: 'IA',
      cor: '#9b59b6',
      cards: [
        { id: 11, nome: 'Ana Beatriz', agente: 'Luana Costa', prioridade: 'Média', origem: 'Orgânico', tempo: '1h 10m' },
        { id: 12, nome: 'Fernando Gomes', agente: 'Fernando Silva', prioridade: 'Alta', origem: 'Direto', tempo: '35m' },
      ],
    },
    {
      id: 'suporte',
      titulo: 'Suporte',
      cor: '#2ecc71',
      cards: [
        { id: 14, nome: 'Carlota Mendes', agente: 'Camilly Nunes', prioridade: 'Média', origem: 'Tráfego Pago', tempo: '2h 5m' },
      ],
    },
    {
      id: 'agendando',
      titulo: 'Agendando',
      cor: '#f39c12',
      cards: [
        { id: 16, nome: 'Ana Paula', agente: 'Fernando Silva', prioridade: 'Média', origem: 'Indicação', tempo: '1h 25m' },
        { id: 17, nome: 'Sínia Cardoso', agente: 'Camilly Nunes', prioridade: 'Baixa', origem: 'Direto', tempo: '55m' },
      ],
    },
  ];

  // Filtrar cards
  const filtrarCards = (cards: any[]) => {
    return cards.filter((card) => {
      const matchAgente = filterAgente === 'Todos' || card.agente === filterAgente;
      const matchPrioridade = filterPrioridade === 'Todas' || card.prioridade === filterPrioridade;
      const matchMembro = selectedMembro === null || card.agente === selectedMembro;
      return matchAgente && matchPrioridade && matchMembro;
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
          { label: 'Total de Cards', value: totalCards, color: '#c9943a' },
          { label: 'Não Lidos', value: 14, color: '#f39c12' },
          { label: 'Agendados', value: 3, color: '#2ecc71' },
          { label: 'A Processar', value: 5, color: '#3498db' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: '#132636',
              border: `2px solid ${card.color}30`,
              borderRadius: '10px',
              padding: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.15s ease-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.color;
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${card.color}15`;
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${card.color}30`;
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: '#7a96aa',
                marginBottom: '4px',
                fontWeight: 600,
              }}
            >
              {card.label}
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: card.color }}>
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
              <option>Hávila Rodrigues</option>
              <option>Camilly Nunes</option>
              <option>Fernando Silva</option>
              <option>Luana Costa</option>
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
          gap: '0px',
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
                borderRadius: '0px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '420px',
                minWidth: '220px',
                maxWidth: '250px',
                boxShadow: 'none',
                transition: 'all 0.15s ease-out',
              }}
            >
              {/* HEADER DA COLUNA */}
              <div
                style={{
                  background: '#0d1f2d',
                  color: coluna.cor,
                  padding: '10px 14px',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'none',
                  borderTop: `4px solid ${coluna.cor}`,
                  borderRadius: '12px 12px 0 0',
                  gap: '8px',
                  letterSpacing: '0.3px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: 1,
                  }}
                >
                  <LayoutGrid size={14} style={{ flexShrink: 0, color: coluna.cor }} />
                  <span style={{ fontSize: '12px' }}>
                    {coluna.titulo}
                  </span>
                  <span
                    style={{
                      background: 'transparent',
                      color: coluna.cor,
                      border: `2px solid ${coluna.cor}40`,
                      borderRadius: '6px',
                      padding: '1px 6px',
                      fontSize: '11px',
                      fontWeight: 900,
                      minWidth: '28px',
                      textAlign: 'center',
                      transition: 'all 0.2s ease-out',
                    }}
                  >
                    {cardsFiltrados.length}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${coluna.cor}50`,
                      color: coluna.cor,
                      cursor: 'pointer',
                      padding: '5px 5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '5px',
                      transition: 'all 0.2s ease-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${coluna.cor}15`;
                      e.currentTarget.style.borderColor = coluna.cor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = `${coluna.cor}50`;
                    }}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => toggleColuna(coluna.id)}
                    style={{
                      background: 'transparent',
                      border: `1.5px solid ${coluna.cor}50`,
                      color: coluna.cor,
                      cursor: 'pointer',
                      padding: '5px 5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '5px',
                      transition: 'all 0.2s ease-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${coluna.cor}15`;
                      e.currentTarget.style.borderColor = coluna.cor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = `${coluna.cor}50`;
                    }}
                  >
                    {expandedColumns[coluna.id] ? <Minus size={14} /> : <Plus size={14} />}
                  </button>
                </div>
              </div>

              {/* CARDS OR AGENTES */}
              {expandedColumns[coluna.id] ? (
                <div
                  style={{
                    flex: 1,
                    padding: '8px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {cardsFiltrados.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    style={{
                      background: '#1a2f3f',
                      padding: '8px',
                      cursor: 'grab',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      borderLeft: `4px solid ${coluna.cor}`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease-out',
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `
                        0 16px 48px rgba(0, 0, 0, 0.7),
                        0 0 24px ${coluna.cor}30,
                        inset 0 1px 0 rgba(255, 255, 255, 0.08)
                      `;
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {/* Avatar + Nome + Status */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        position: 'relative',
                      }}
                    >
                      {/* Avatar Premium */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: `linear-gradient(135deg, ${coluna.cor} 0%, ${coluna.cor}dd 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 800,
                          color: '#fff',
                          flexShrink: 0,
                          boxShadow: `
                            0 4px 10px ${coluna.cor}40,
                            inset 0 1px 2px rgba(255, 255, 255, 0.2),
                            inset 0 -2px 4px rgba(0, 0, 0, 0.3)
                          `,
                          border: `1.5px solid ${coluna.cor}`,
                        }}
                      >
                        {card.nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                      </div>

                      {/* Nome + Origem */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#ffffff',
                            marginBottom: '2px',
                            lineHeight: '1.2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.2px',
                          }}
                        >
                          {card.nome}
                        </div>
                        {(card.origem || card.agente || card.tempo) && (
                          <div
                            style={{
                              fontSize: '9px',
                              color: '#7a96aa',
                              marginBottom: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {card.origem && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Zap size={9} style={{ flexShrink: 0, color: '#c9943a' }} />
                                <span style={{ color: '#c9943a' }}>{card.origem}</span>
                              </div>
                            )}

                            {card.agente && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <User size={9} style={{ flexShrink: 0, color: '#3498db' }} />
                                <span style={{ color: '#3498db' }}>{card.agente}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status Indicator - Animado */}
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: card.prioridade === 'Alta' ? '#ff6b6b' : card.prioridade === 'Média' ? '#ffa940' : '#52c41a',
                          flexShrink: 0,
                          boxShadow: `0 0 4px ${card.prioridade === 'Alta' ? '#ff6b6b' : card.prioridade === 'Média' ? '#ffa940' : '#52c41a'}60`,
                          border: `1px solid #0d1f2d`,
                          marginTop: '2px',
                        }}
                      />
                    </div>

                    {/* Tag/Badge Premium - Dinâmica por Prioridade */}
                    <div
                      style={{
                        display: 'inline-block',
                        background:
                          card.prioridade === 'Alta'
                            ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 85, 85, 0.08) 100%)'
                            : card.prioridade === 'Média'
                            ? 'linear-gradient(135deg, rgba(255, 169, 64, 0.15) 0%, rgba(255, 152, 0, 0.08) 100%)'
                            : 'linear-gradient(135deg, rgba(82, 196, 26, 0.15) 0%, rgba(95, 200, 30, 0.08) 100%)',
                        backdropFilter: 'blur(10px)',
                        border:
                          card.prioridade === 'Alta'
                            ? '0.75px solid rgba(255, 107, 107, 0.5)'
                            : card.prioridade === 'Média'
                            ? '0.75px solid rgba(255, 169, 64, 0.5)'
                            : '0.75px solid rgba(82, 196, 26, 0.5)',
                        color:
                          card.prioridade === 'Alta'
                            ? '#ff6b6b'
                            : card.prioridade === 'Média'
                            ? '#ffa940'
                            : '#52c41a',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '8px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2px',
                        width: 'fit-content',
                        transition: 'all 0.2s ease-out',
                        boxShadow:
                          card.prioridade === 'Alta'
                            ? 'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 0 4px rgba(255, 107, 107, 0.12)'
                            : card.prioridade === 'Média'
                            ? 'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 0 4px rgba(255, 169, 64, 0.12)'
                            : 'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 0 4px rgba(82, 196, 26, 0.12)',
                      }}
                    >
                      {card.prioridade === 'Alta' ? 'RETORNO' : card.prioridade === 'Média' ? 'ACOMP.' : 'AGENDADO'}
                    </div>

                    {/* Divisor Premium com Gradiente */}
                    <div
                      style={{
                        height: '1px',
                        background: `linear-gradient(90deg, ${coluna.cor}30, transparent, ${coluna.cor}30)`,
                      }}
                    />

                    {/* Ações - Abrir e Espiar */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '5px',
                        paddingTop: '3px',
                      }}
                    >
                      <button
                        onClick={() => {
                          // Navegar para a conversa
                          console.log('Abrindo ticket:', card.id);
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: `1px solid ${coluna.cor}80`,
                          background: `${coluna.cor}15`,
                          color: coluna.cor,
                          fontSize: '9px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${coluna.cor}25`;
                          e.currentTarget.style.borderColor = coluna.cor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${coluna.cor}15`;
                          e.currentTarget.style.borderColor = `${coluna.cor}80`;
                        }}
                      >
                        <MessageSquare size={10} />
                        Abrir
                      </button>

                      <button
                        onClick={() => {
                          setConversaSelecionada(card);
                          setModalEspiarVisivel(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px 6px',
                          borderRadius: '5px',
                          border: '1px solid #1e3d54',
                          background: 'transparent',
                          color: '#7a96aa',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#c9943a';
                          e.currentTarget.style.borderColor = '#c9943a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#7a96aa';
                          e.currentTarget.style.borderColor = '#1e3d54';
                        }}
                        title="Espiar conversa"
                      >
                        <Eye size={12} />
                      </button>
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
              ) : (
                // RECOLHIDO - Mostrar equipe como chips horizontais
                <div
                  style={{
                    flex: 1,
                    padding: '12px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Label EQUIPE */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#7a96aa',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                    }}
                  >
                    EQUIPE:
                  </div>

                  {/* Chips de membros - Horizontal */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    {membros.map((membro) => (
                      <button
                        key={membro.id}
                        onClick={() => setSelectedMembro(selectedMembro === membro.nome ? null : membro.nome)}
                        style={{
                          background: selectedMembro === membro.nome ? coluna.cor : 'transparent',
                          border: selectedMembro === membro.nome ? `1px solid ${coluna.cor}` : `1px solid ${coluna.cor}60`,
                          borderRadius: '20px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: selectedMembro === membro.nome ? '#0d1f2d' : coluna.cor,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-out',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = coluna.cor + '20';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = selectedMembro === membro.nome ? coluna.cor : 'transparent';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {membro.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

      {/* MODAL ESPIAR CONVERSA */}
      {modalEspiarVisivel && conversaSelecionada && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setModalEspiarVisivel(false)}
        >
          <div
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e8edf2', margin: 0 }}>
                {conversaSelecionada.nome}
              </h2>
              <button
                onClick={() => setModalEspiarVisivel(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7a96aa',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Info Conversa */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#0d1f2d', borderRadius: '8px', border: '1px solid #1e3d54' }}>
                <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '4px' }}>Agente</div>
                <div style={{ fontSize: '13px', color: '#e8edf2', fontWeight: 600 }}>{conversaSelecionada.agente}</div>
              </div>

              <div style={{ padding: '12px', background: '#0d1f2d', borderRadius: '8px', border: '1px solid #1e3d54' }}>
                <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '4px' }}>Origem</div>
                <div style={{ fontSize: '13px', color: '#c9943a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} /> {conversaSelecionada.origem}
                </div>
              </div>

              <div style={{ padding: '12px', background: '#0d1f2d', borderRadius: '8px', border: '1px solid #1e3d54' }}>
                <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '4px' }}>Prioridade</div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color:
                      conversaSelecionada.prioridade === 'Alta'
                        ? '#ff6b6b'
                        : conversaSelecionada.prioridade === 'Média'
                        ? '#ffa940'
                        : '#52c41a',
                  }}
                >
                  {conversaSelecionada.prioridade}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  console.log('Abrindo ticket completo:', conversaSelecionada.id);
                  setModalEspiarVisivel(false);
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e8b86d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#c9943a';
                }}
              >
                Abrir Conversa
              </button>
              <button
                onClick={() => setModalEspiarVisivel(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c9943a';
                  e.currentTarget.style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e3d54';
                  e.currentTarget.style.color = '#7a96aa';
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Página de Contatos - CRM ProClinic
 * 100% Fiel ao protótipo - Tabela de contatos com filtros
 */

'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, Users, BarChart3 } from 'lucide-react';

export function Contatos() {
  const [filterCanal, setFilterCanal] = useState('Todos os canais');
  const [filterPipeline, setFilterPipeline] = useState('Todos os pipelines');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data de resumo
  const resumo = [
    { label: 'Hoje', value: 5, color: '#c9943a', isTotal: false },
    { label: 'Esta Semana', value: 8, color: '#c9943a', isTotal: false },
    { label: 'Este Mês', value: 8, color: '#c9943a', isTotal: false },
    { label: 'Total', value: 8, color: '#c9943a', isTotal: true },
  ];

  // ============ FORMATADOR DE DATA E HORA ============
  const formatarUltimaInteracao = (dataHora: string) => {
    const [data, hora] = dataHora.split(' ');
    const [ano, mes, dia] = data.split('-');

    // Obter data de hoje
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    if (data === hojeFormatado) {
      return `Hoje, ${hora}`;
    } else {
      return `${dia}/${mes}/${ano} ${hora}`;
    }
  };

  // Mock data de contatos com badges e cores de avatar
  const contatos = [
    { id: 1, nome: 'Ida Santos', whatsapp: '(11) 99999-0001', email: 'ida@email.com', ultimaInteracao: '2026-04-18 10:30', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#e91e63' },
    { id: 2, nome: 'Daniele Mantovani', whatsapp: '(11) 99999-0002', email: 'daniele@email.com', ultimaInteracao: '2026-04-16 15:45', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#9c27b0' },
    { id: 3, nome: 'Maria Rosa', whatsapp: '(11) 99999-0003', email: 'maria@email.com', ultimaInteracao: '2026-04-15 09:20', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#673ab7' },
    { id: 4, nome: 'Laura Ferreira', whatsapp: '(11) 99999-0004', email: 'laura@email.com', ultimaInteracao: '2026-04-14 14:10', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#3f51b5' },
    { id: 5, nome: 'Patricia Lima', whatsapp: '(11) 99999-0005', email: 'patricia@email.com', ultimaInteracao: '2026-04-13 11:55', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#2196f3' },
    { id: 6, nome: 'Ana Beatriz', whatsapp: '(11) 99999-0006', email: 'ana@email.com', ultimaInteracao: '2026-04-12 16:30', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#00bcd4' },
    { id: 7, nome: 'Larissa Alcântara', whatsapp: '(11) 99999-0007', email: 'larissa@email.com', ultimaInteracao: '2026-04-11 13:15', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#009688' },
    { id: 8, nome: 'Carlota Mendes', whatsapp: '(11) 99999-0008', email: 'carlota@email.com', ultimaInteracao: '2026-04-10 10:45', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#4caf50' },
  ];

  // Filtrar contatos
  const contatosFiltrados = contatos.filter((c) => {
    const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.whatsapp.includes(searchTerm) ||
                       c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div style={{
      padding: '24px',
      background: '#0d1f2d',
      minHeight: '100vh',
      color: '#e8edf2',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* HEADER COM TÍTULO E BOTÕES */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        gap: '16px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Contatos</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* BOTÃO IMPORTAR/EXPORTAR */}
          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: 'transparent',
              color: '#7a96aa',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↙ Importar / Exportar
          </button>
          {/* BOTÃO ADICIONAR */}
          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#c9943a',
              color: '#0d1f2d',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d9a344'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#c9943a'}
          >
            + Adicionar Contato
          </button>
        </div>
      </div>

      {/* RESUMO CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {resumo.map((card) => (
          <div
            key={card.label}
            style={{
              background: `linear-gradient(135deg, ${card.color}33, #132636)`,
              border: `2px solid ${card.color}BF`,
              borderRadius: '14px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 12px ${card.color}33`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* ÍCONE SVG MINIMALISTA PREMIUM AAA - COLORIDO */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: card.color,
            }}>
              {card.label === 'Hoje' && <Calendar size={28} strokeWidth={1.5} />}
              {card.label === 'Esta Semana' && <BarChart3 size={28} strokeWidth={1.5} />}
              {card.label === 'Este Mês' && <TrendingUp size={28} strokeWidth={1.5} />}
              {card.label === 'Total' && <Users size={28} strokeWidth={1.5} />}
            </div>
            {/* CONTEÚDO - ABAIXO DO ÍCONE */}
            <div style={{ width: '100%' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#9ca3af',
                marginBottom: '2px',
                lineHeight: '1',
                letterSpacing: '-0.5px',
                WebkitFontSmoothing: 'antialiased',
              }}>
                {card.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '4px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                WebkitFontSmoothing: 'antialiased',
              }}>
                {card.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#9ca3af',
                fontWeight: 500,
                letterSpacing: '0.2px',
                WebkitFontSmoothing: 'antialiased',
              }}>
                {card.label === 'Hoje' && '↳ Novos contatos'}
                {card.label === 'Esta Semana' && '↳ Últimos 7 dias'}
                {card.label === 'Este Mês' && '↳ Mês atual'}
                {card.label === 'Total' && '↳ Todos os contatos'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTROS E AÇÕES */}
      <div style={{
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
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* FILTRO CANAL */}
          <select
            value={filterCanal}
            onChange={(e) => setFilterCanal(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#0d1f2d',
              color: '#e8edf2',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <option>Todos os canais</option>
            <option>WhatsApp</option>
            <option>Instagram</option>
            <option>Email</option>
          </select>

          {/* FILTRO PIPELINE */}
          <select
            value={filterPipeline}
            onChange={(e) => setFilterPipeline(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#0d1f2d',
              color: '#e8edf2',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <option>Todos os pipelines</option>
            <option>Comercial</option>
            <option>Follow-up</option>
            <option>Suporte</option>
          </select>

          {/* BUSCA */}
          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#0d1f2d',
              color: '#e8edf2',
              fontSize: '12px',
              minWidth: '200px',
            }}
          />
        </div>
      </div>

      {/* TABELA DE CONTATOS */}
      <div style={{
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        overflow: 'hidden',
        maxHeight: '600px',
        overflowY: 'auto',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e3d54', background: '#0d1f2d' }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                NOME
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                WHATSAPP / HANDLE
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                EMAIL
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                ÚLTIMA INTERAÇÃO
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                STATUS
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'center',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {contatosFiltrados.map((contato) => (
              <tr key={contato.id} style={{ borderBottom: '1px solid #1e3d54' }}>
                <td style={{ padding: '12px 16px', color: '#e8edf2', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `${contato.avatarColor}33`,
                      border: `2px solid ${contato.avatarColor}B3`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      flexShrink: 0,
                      color: '#e8b86d',
                      marginTop: '2px',
                    }}>
                      {contato.nome[0]}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#e8edf2', lineHeight: '1.2' }}>{contato.nome}</span>
                      <span style={{
                        fontSize: '9px',
                        color: contato.badgeColor,
                        fontWeight: 600,
                        backgroundColor: `${contato.badgeColor}26`,
                        border: `0.5px solid ${contato.badgeColor}99`,
                        padding: '2px 6px',
                        borderRadius: '8px',
                        display: 'inline-block',
                        width: 'fit-content',
                      }}>
                        ● {contato.badge}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{contato.whatsapp}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{contato.email}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa', fontSize: '12px' }}>
                  {formatarUltimaInteracao(contato.ultimaInteracao)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: '#2ecc7133',
                    border: '1px solid #2ecc71A6',
                    color: '#2ecc71',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'default',
                  }}>
                    ✓ {contato.status}
                  </button>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00d4ff';
                        e.currentTarget.style.borderColor = '#00d4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                      style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21l1.65-3.66a9 9 0 1 1 14.142-14.142A9 9 0 0 1 3.21 21z" />
                        <line x1="9" y1="10" x2="15" y2="10" />
                        <line x1="9" y1="14" x2="13" y2="14" />
                      </svg>
                    </button>
                    <button
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00d4ff';
                        e.currentTarget.style.borderColor = '#00d4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                      style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00d4ff';
                        e.currentTarget.style.borderColor = '#00d4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                      style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {contatosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#7a96aa',
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Nenhum contato encontrado</div>
          <div style={{ fontSize: '12px' }}>Tente ajustar os filtros ou criar um novo contato</div>
        </div>
      )}
    </div>
  );
}

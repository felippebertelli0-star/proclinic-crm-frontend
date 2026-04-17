/**
 * Página de Contatos - CRM ProClinic
 * 100% Fiel ao protótipo - Tabela de contatos com filtros
 */

'use client';

import { useState } from 'react';

export function Contatos() {
  const [filterCanal, setFilterCanal] = useState('Todos os canais');
  const [filterPipeline, setFilterPipeline] = useState('Todos os pipelines');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data de resumo
  const resumo = [
    { label: 'Hoje', value: 5, color: '#3498db' },
    { label: 'Esta Semana', value: 8, color: '#2ecc71' },
    { label: 'Este Mês', value: 8, color: '#f39c12' },
    { label: 'Total', value: 8, color: '#c9943a' },
  ];

  // Mock data de contatos
  const contatos = [
    { id: 1, nome: 'Ida Santos', whatsapp: '(11) 99999-0001', email: 'ida@email.com', ultimaInteracao: '2026-04-17 10:30', status: 'Vivo' },
    { id: 2, nome: 'Daniele Mantovani', whatsapp: '(11) 99999-0002', email: 'daniele@email.com', ultimaInteracao: '2026-04-16 15:45', status: 'Vivo' },
    { id: 3, nome: 'Maria Rosa', whatsapp: '(11) 99999-0003', email: 'maria@email.com', ultimaInteracao: '2026-04-15 09:20', status: 'Vivo' },
    { id: 4, nome: 'Laura Ferreira', whatsapp: '(11) 99999-0004', email: 'laura@email.com', ultimaInteracao: '2026-04-14 14:10', status: 'Vivo' },
    { id: 5, nome: 'Patricia Lima', whatsapp: '(11) 99999-0005', email: 'patricia@email.com', ultimaInteracao: '2026-04-13 11:55', status: 'Vivo' },
    { id: 6, nome: 'Ana Beatriz', whatsapp: '(11) 99999-0006', email: 'ana@email.com', ultimaInteracao: '2026-04-12 16:30', status: 'Vivo' },
    { id: 7, nome: 'Larissa Alcântara', whatsapp: '(11) 99999-0007', email: 'larissa@email.com', ultimaInteracao: '2026-04-11 13:15', status: 'Vivo' },
    { id: 8, nome: 'Carlota Mendes', whatsapp: '(11) 99999-0008', email: 'carlota@email.com', ultimaInteracao: '2026-04-10 10:45', status: 'Vivo' },
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
      {/* RESUMO CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {resumo.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#132636',
              border: '1px solid #1e3d54',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '8px', fontWeight: 600 }}>{card.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>{card.value}</div>
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

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          {/* BOTÃO ADICIONAR */}
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
            onMouseEnter={(e) => e.currentTarget.style.background = '#d9a344'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#c9943a'}
          >
            + Adicionar Contato
          </button>

          {/* BOTÃO IMPORTAR/EXPORTAR */}
          <button
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: 'transparent',
              color: '#7a96aa',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            📥 Importar / Exportar
          </button>
        </div>
      </div>

      {/* TABELA DE CONTATOS */}
      <div style={{
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        overflow: 'hidden',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#c9943a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {contato.nome[0]}
                    </div>
                    <span>{contato.nome}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{contato.whatsapp}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{contato.email}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa', fontSize: '12px' }}>
                  {contato.ultimaInteracao}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#2ecc71',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    🟢 {contato.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#c9943a',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}>
                      👁️
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#c9943a',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}>
                      ✏️
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}>
                      🗑️
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

/**
 * Página de Conversas - CRM ProClinic
 * 100% Fiel ao protótipo - Chat interface com sidebar
 */

'use client';

import { useState } from 'react';

export function Conversas() {
  const [selectedConversa, setSelectedConversa] = useState(0);
  const [mensagens, setMensagens] = useState<Array<{ tipo: 'enviada' | 'recebida'; texto: string; hora: string }>>([
    { tipo: 'recebida', texto: 'Olá! Tudo bem? Gostaria de agendar uma consulta', hora: '10:30' },
    { tipo: 'enviada', texto: 'Olá! Tudo bem sim! Claro, qual seria melhor para você?', hora: '10:32' },
    { tipo: 'recebida', texto: 'Gostaria de próxima quarta, se possível à tarde', hora: '10:35' },
  ]);
  const [novaMensagem, setNovaMensagem] = useState('');

  // Mock data de conversas
  const conversas = [
    { id: 1, nome: 'Ida Santos', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '10:30', badge: 0 },
    { id: 2, nome: 'Daniele Mantovani', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '09:15', badge: 0 },
    { id: 3, nome: 'Maria Rosa', status: 'aguardando', canal: 'INSTAGRAM', categoria: 'FOLLOW-UP', hora: '08:45', badge: 2 },
    { id: 4, nome: 'Laura Ferreira', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '07:20', badge: 0 },
  ];

  const conversa = conversas[selectedConversa];

  const handleEnviarMensagem = () => {
    if (novaMensagem.trim()) {
      const agora = new Date();
      const hora = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
      setMensagens([...mensagens, { tipo: 'enviada', texto: novaMensagem, hora }]);
      setNovaMensagem('');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d1f2d', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* SIDEBAR - LISTA DE CONVERSAS */}
      <div style={{
        width: '320px',
        background: '#0d1f2d',
        borderRight: '1px solid #1e3d54',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* HEADER COM BUSCA */}
        <div style={{ padding: '16px', borderBottom: '1px solid #1e3d54' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['Atendendo', 'Aguardando'].map((status) => (
              <button key={status} style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #1e3d54',
                background: 'transparent',
                color: '#7a96aa',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {status}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar conversa ou ticket..."
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#e8edf2',
              fontSize: '12px',
            }}
          />
        </div>

        {/* LISTA DE CONVERSAS */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversas.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversa(index)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #1e3d54',
                cursor: 'pointer',
                background: selectedConversa === index ? 'rgba(201, 148, 58, 0.1)' : 'transparent',
                borderLeft: selectedConversa === index ? '3px solid #c9943a' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
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
                    {conv.nome[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.nome}
                    </div>
                    <div style={{ fontSize: '11px', color: '#7a96aa' }}>{conv.hora}</div>
                  </div>
                </div>
                {conv.badge > 0 && (
                  <div style={{
                    background: '#c9943a',
                    color: '#0d1f2d',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}>
                    {conv.badge}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(52, 152, 219, 0.2)',
                  color: '#3498db',
                }}>
                  {conv.canal}
                </span>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(201, 148, 58, 0.2)',
                  color: '#c9943a',
                }}>
                  {conv.categoria}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL PRINCIPAL - CONVERSA */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #1e3d54',
      }}>
        {/* HEADER DA CONVERSA */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1e3d54',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: '#e8edf2' }}>
              {conversa.nome}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(52, 152, 219, 0.2)',
                color: '#3498db',
              }}>
                {conversa.canal}
              </span>
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(201, 148, 58, 0.2)',
                color: '#c9943a',
              }}>
                {conversa.categoria}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '18px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c9943a' }}>⋮</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c9943a' }}>🔗</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c9943a' }}>⊙</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c9943a' }}>✕</button>
          </div>
        </div>

        {/* HISTÓRICO DE MENSAGENS */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {mensagens.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.tipo === 'enviada' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '60%',
                padding: '12px 16px',
                borderRadius: '8px',
                background: msg.tipo === 'enviada' ? '#c9943a' : '#1e3d54',
                color: msg.tipo === 'enviada' ? '#0d1f2d' : '#e8edf2',
                fontSize: '13px',
                lineHeight: '1.5',
              }}>
                {msg.texto}
                <div style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  opacity: 0.7,
                }}>
                  {msg.hora}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT DE MENSAGEM */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #1e3d54',
          display: 'flex',
          gap: '12px',
        }}>
          <input
            type="text"
            placeholder="Escreva uma mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#e8edf2',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleEnviarMensagem}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#c9943a',
              color: '#0d1f2d',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

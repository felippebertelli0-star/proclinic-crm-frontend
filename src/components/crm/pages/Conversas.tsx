/**
 * Página de Conversas - CRM ProClinic
 * 100% Fiel ao protótipo - Chat interface com sidebar interativo
 */

'use client';

import { useState } from 'react';

export function Conversas() {
  const [selectedConversa, setSelectedConversa] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'atendendo' | 'aguardando'>('todos');
  const [busca, setBusca] = useState('');
  const [mensagens, setMensagens] = useState<Array<{ tipo: 'enviada' | 'recebida'; texto: string; hora: string }>>([
    { tipo: 'recebida', texto: 'Olá! Tudo bem? Gostaria de agendar uma consulta', hora: '10:30' },
    { tipo: 'enviada', texto: 'Olá! Tudo bem sim! Claro, qual seria melhor para você?', hora: '10:32' },
    { tipo: 'recebida', texto: 'Gostaria de próxima quarta, se possível à tarde', hora: '10:35' },
  ]);
  const [novaMensagem, setNovaMensagem] = useState('');

  // Mock data de conversas expandido
  const todasAsConversas = [
    { id: 1, nome: 'Ida Santos', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '10:30', badge: 0, mensagem: 'Gostaria de próxima quarta...' },
    { id: 2, nome: 'Daniele Mantovani', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '09:15', badge: 0, mensagem: 'Obrigada pela resposta!' },
    { id: 3, nome: 'Maria Rosa', status: 'aguardando', canal: 'INSTAGRAM', categoria: 'FOLLOW-UP', hora: '08:45', badge: 2, mensagem: 'Você poderia confirmar?' },
    { id: 4, nome: 'Laura Ferreira', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '07:20', badge: 0, mensagem: 'Perfeito, até lá!' },
    { id: 5, nome: 'Pedro Silva', status: 'aguardando', canal: 'WHATSAPP', categoria: 'SUPORTE', hora: '06:50', badge: 1, mensagem: 'Preciso de ajuda com meu agendamento' },
    { id: 6, nome: 'Carolina Lima', status: 'atendendo', canal: 'INSTAGRAM', categoria: 'COMERCIAL', hora: '05:30', badge: 0, mensagem: 'Adorei o atendimento!' },
    { id: 7, nome: 'Lucas Alves', status: 'aguardando', canal: 'WHATSAPP', categoria: 'FOLLOW-UP', hora: '04:15', badge: 3, mensagem: 'Quando será possível?' },
    { id: 8, nome: 'Beatriz Costa', status: 'atendendo', canal: 'WHATSAPP', categoria: 'COMERCIAL', hora: '03:00', badge: 0, mensagem: 'Muito obrigada pela atenção' },
  ];

  // Filtrar conversas
  const conversas = todasAsConversas.filter(conv => {
    const matchStatus = filtroStatus === 'todos' || conv.status === filtroStatus;
    const matchBusca = conv.nome.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const conversa = conversas[selectedConversa] || todasAsConversas[0];
  const totalConversas = todasAsConversas.length;
  const totalAtendendo = todasAsConversas.filter(c => c.status === 'atendendo').length;
  const totalAguardando = todasAsConversas.filter(c => c.status === 'aguardando').length;

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
        overflowY: 'hidden',
      }}>
        {/* HEADER COM BUSCA */}
        <div style={{ padding: '16px', borderBottom: '1px solid #1e3d54', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {[
              { id: 'todos', label: 'Todos', count: totalConversas },
              { id: 'atendendo', label: 'Atendendo', count: totalAtendendo },
              { id: 'aguardando', label: 'Aguardando', count: totalAguardando },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFiltroStatus(btn.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: filtroStatus === btn.id ? '1px solid #c9943a' : '1px solid #1e3d54',
                  background: filtroStatus === btn.id ? 'rgba(201, 148, 58, 0.1)' : 'transparent',
                  color: filtroStatus === btn.id ? '#c9943a' : '#7a96aa',
                  fontSize: '11px',
                  fontWeight: filtroStatus === btn.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (filtroStatus !== btn.id) {
                    (e.currentTarget as HTMLElement).style.borderColor = '#3a5f7d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filtroStatus !== btn.id) {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                  }
                }}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="⊙ Buscar conversa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#e8edf2',
              fontSize: '12px',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(201, 148, 58, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          />
        </div>

        {/* LISTA DE CONVERSAS */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {conversas.length > 0 ? (
            conversas.map((conv, index) => {
              const isSelected = selectedConversa === index;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversa(index)}
                  style={{
                    padding: '12px 12px',
                    borderBottom: '1px solid #1e3d54',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(201, 148, 58, 0.1)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #c9943a' : '3px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #c9943a, #e8b86d)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0d1f2d',
                        flexShrink: 0,
                      }}>
                        {conv.nome[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                            {conv.nome}
                          </div>
                          <div style={{ fontSize: '10px', color: '#7a96aa', flexShrink: 0 }}>{conv.hora}</div>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#7a96aa',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '6px',
                        }}>
                          {conv.mensagem}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(52, 152, 219, 0.2)',
                            color: '#3498db',
                            fontWeight: 500,
                          }}>
                            {conv.canal === 'WHATSAPP' ? '💬' : '📸'} {conv.canal}
                          </span>
                          <span style={{
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(201, 148, 58, 0.2)',
                            color: '#c9943a',
                            fontWeight: 500,
                          }}>
                            {conv.categoria}
                          </span>
                        </div>
                      </div>
                    </div>
                    {conv.badge > 0 && (
                      <div style={{
                        background: '#e74c3c',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '4px 8px',
                        borderRadius: '10px',
                        minWidth: '20px',
                        textAlign: 'center',
                        flexShrink: 0,
                        marginLeft: '8px',
                      }}>
                        {conv.badge}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: '#7a96aa' }}>
              <div style={{ fontSize: '13px', marginBottom: '8px' }}>Nenhuma conversa encontrada</div>
              <div style={{ fontSize: '11px' }}>Tente mudar os filtros ou a busca</div>
            </div>
          )}
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
          background: 'rgba(19, 38, 54, 0.5)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#e8edf2' }}>
                {conversa.nome}
              </h2>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: conversa.status === 'atendendo' ? '#2ecc71' : '#f39c12',
                flexShrink: 0,
              }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(52, 152, 219, 0.2)',
                color: '#3498db',
                fontWeight: 500,
              }}>
                {conversa.canal === 'WHATSAPP' ? '💬 WhatsApp' : '📸 Instagram'}
              </span>
              <span style={{
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(201, 148, 58, 0.2)',
                color: '#c9943a',
                fontWeight: 500,
              }}>
                {conversa.categoria}
              </span>
              <span style={{
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: conversa.status === 'atendendo' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(243, 156, 18, 0.2)',
                color: conversa.status === 'atendendo' ? '#2ecc71' : '#f39c12',
                fontWeight: 500,
              }}>
                {conversa.status === 'atendendo' ? '● Atendendo' : '● Aguardando'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { icon: '⋮', label: 'Menu' },
              { icon: '↗', label: 'Compartilhar' },
              { icon: '⊙', label: 'Info' },
              { icon: '✕', label: 'Fechar' },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => { /* Action handler */ }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7a96aa',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                }}
                title={btn.label}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                  (e.currentTarget as HTMLElement).style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>

        {/* HISTÓRICO DE MENSAGENS */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'linear-gradient(180deg, #0a1520 0%, #0d1f2d 100%)',
        }}>
          {mensagens.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.tipo === 'enviada' ? 'flex-end' : 'flex-start',
                animation: 'slideIn 0.3s ease-out',
              }}
            >
              <div style={{
                maxWidth: '65%',
                padding: '12px 16px',
                borderRadius: msg.tipo === 'enviada' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.tipo === 'enviada' ? 'linear-gradient(135deg, #c9943a, #e8b86d)' : '#1e3d54',
                color: msg.tipo === 'enviada' ? '#0d1f2d' : '#e8edf2',
                fontSize: '13px',
                lineHeight: '1.5',
                boxShadow: msg.tipo === 'enviada' ? '0 2px 8px rgba(201, 148, 58, 0.2)' : '0 1px 4px rgba(0, 0, 0, 0.3)',
                wordBreak: 'break-word',
              }}>
                <div>{msg.texto}</div>
                <div style={{
                  fontSize: '11px',
                  marginTop: '6px',
                  opacity: 0.8,
                  fontWeight: 500,
                }}>
                  {msg.hora}
                  {msg.tipo === 'enviada' && ' ✓'}
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
          background: 'rgba(19, 38, 54, 0.5)',
          backdropFilter: 'blur(10px)',
        }}>
          <input
            type="text"
            placeholder="↗ Escreva uma mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
            style={{
              flex: 1,
              padding: '11px 14px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#e8edf2',
              fontSize: '13px',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(201, 148, 58, 0.1)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleEnviarMensagem}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: novaMensagem.trim() ? '#c9943a' : 'rgba(201, 148, 58, 0.4)',
              color: '#0d1f2d',
              fontSize: '13px',
              fontWeight: 600,
              cursor: novaMensagem.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              opacity: novaMensagem.trim() ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (novaMensagem.trim()) {
                (e.currentTarget as HTMLElement).style.background = '#e8b86d';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (novaMensagem.trim()) {
                (e.currentTarget as HTMLElement).style.background = '#c9943a';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

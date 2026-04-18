/**
 * Página de Conversas - CRM ProClinic
 * 100% Fiel ao protótipo original - Conversas & Tickets
 */

'use client';

import { useState } from 'react';
import { X, RefreshCw, Calendar, DollarSign, FileText, Paperclip, Zap, BarChart3, User, Mic, Send, Smile, Clock, Eye } from 'lucide-react';

export function Conversas() {
  const [selectedConversa, setSelectedConversa] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<'atendendo' | 'aguardando'>('atendendo');
  const [busca, setBusca] = useState('');
  const [activeTab, setActiveTab] = useState<'ativa' | 'tags'>('ativa');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [conversaModal, setConversaModal] = useState<any>(null);
  const [conversas, setConversas] = useState([
    {
      id: 87439, nome: 'Ida Santos', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '1 min',
      origem: 'Trafego Pago', tags: ['WHATSAPP', 'IA ATIVA'], unread: 0, preview: 'Havila deu oi...'
    },
    {
      id: 87443, nome: 'Marina Costa', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '2 min',
      origem: 'Organic', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 0, preview: 'Primeira vez aqui'
    },
    {
      id: 87444, nome: 'Carlos Silva', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '3 min',
      origem: 'Trafego Pago', tags: ['WHATSAPP', 'RETORNO'], unread: 0, preview: 'Qual o status?'
    },
    {
      id: 87445, nome: 'Ana Martins', status: 'atendendo', canal: 'INSTAGRAM',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '4 min',
      origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 0, preview: 'Gostei do seu trabalho'
    },
    {
      id: 87446, nome: 'João Pereira', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '6 min',
      origem: 'Indicação', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 0, preview: 'Pode agendar?'
    },
    {
      id: 87440, nome: 'Sandra Oliveira', status: 'aguardando', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '5 min',
      origem: 'Trafego Pago', tags: ['WHATSAPP', 'NOVO LEAD', 'IA ATIVA'], unread: 1, preview: 'Aguardando atendente...'
    },
    {
      id: 87441, nome: 'Patricia Mendes', status: 'aguardando', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '12 min',
      origem: 'Indicação', tags: ['WHATSAPP', 'RETORNO'], unread: 2, preview: 'Oi, jai foi paciente antes...'
    },
    {
      id: 87442, nome: 'Roberta Lima', status: 'aguardando', canal: 'INSTAGRAM',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '25 min',
      origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 3, preview: 'Preciso de orçamento...'
    },
  ]);

  // Função para gerar cor de tag baseada no tipo
  const getTagColor = (tag: string) => {
    const tagColors: Record<string, { bg: string; color: string }> = {
      'Trabalho Pago': { bg: '#c9943a', color: '#0d1f2d' },
      'IA': { bg: '#9b59b6', color: '#ffffff' },
      'IA ATIVA': { bg: '#9b59b6', color: '#ffffff' },
      'WHATSAPP': { bg: '#3498db', color: '#ffffff' },
      'NOVO LEAD': { bg: '#2ecc71', color: '#ffffff' },
      'INSTAGRAM': { bg: '#e1306c', color: '#ffffff' },
      'Instagram Orgânico': { bg: '#e1306c', color: '#ffffff' },
      'ORÇAMENTO': { bg: '#f39c12', color: '#ffffff' },
      'RETORNO': { bg: '#f39c12', color: '#ffffff' },
      'Indicação': { bg: '#2ecc71', color: '#ffffff' },
    };
    return tagColors[tag] || { bg: 'rgba(201, 148, 58, 0.3)', color: '#c9943a' };
  };


  // Mensagens com sistema de tickets/eventos
  const mensagensPrototipo = [
    { tipo: 'evento', data: '07/04/2026' },
    { tipo: 'recebida', nome: 'Sim', hora: '18:29', texto: '' },
    { tipo: 'enviada', hora: '18:30', texto: 'A transferência para a Havila já foi iniciada. Ela em breve dará continuidade ao seu atendimento. Agradeco o seu contato, Iida!' },
    { tipo: 'sistema', hora: '18:30', texto: 'Comunicação Interna — Havila executou: "status":"open","userid":204' },
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Odili', hora: '09:24', texto: 'Bom dia! Tudo bem? 😊\n\nMeu nome é Havila, sou responsável pelos agendamentos da Dra. Andressa Barbarotti e a partir de agora vou cuidar do seu atendimento.' },
    { tipo: 'sistema', hora: '09:25', texto: 'Ticket devolvido para a fila da IA — humano saiu do atendimento' },
  ];

  // Filtrar conversas por status
  const conversasFiltradas = conversas.filter(conv => {
    const matchStatus = filtroStatus === 'atendendo' ? conv.status === 'atendendo' : conv.status === 'aguardando';
    const matchBusca = conv.nome.toLowerCase().includes(busca.toLowerCase()) || String(conv.id).includes(busca);
    return matchStatus && matchBusca;
  });

  const conversa = conversasFiltradas[selectedConversa];
  const totalAtendendo = conversas.filter(c => c.status === 'atendendo').length;
  const totalAguardando = conversas.filter(c => c.status === 'aguardando').length;

  // ============ FUNÇÕES DE NEGÓCIO ============
  const abrirEspiar = (conv: any) => {
    setConversaModal(conv);
    setModalVisible(true);
  };

  const fecharEspiar = () => {
    setModalVisible(false);
    setConversaModal(null);
  };

  const aceitarConversa = (convId: number) => {
    setConversas(conversas.map(conv =>
      conv.id === convId ? { ...conv, status: 'atendendo', unread: 0 } : conv
    ));
    // Reset seleção
    setSelectedConversa(0);
  };

  const finalizarConversa = (convId: number) => {
    setConversas(conversas.filter(conv => conv.id !== convId));
    setSelectedConversa(0);
  };

  const diminuirNotificacao = (convId: number) => {
    setConversas(conversas.map(conv =>
      conv.id === convId ? { ...conv, unread: 0 } : conv
    ));
  };

  const handleEnviarMensagem = () => {
    if (novaMensagem.trim()) {
      // Mock: adiciona mensagem
      setNovaMensagem('');
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', background: '#0d1f2d', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* SIDEBAR - LISTA DE CONVERSAS */}
      <div style={{
        width: '320px',
        background: '#0d1f2d',
        borderRight: '1px solid #1e3d54',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
      }}>
        {/* TÍTULO */}
        <div style={{ padding: '16px', borderBottom: '1px solid #1e3d54', flexShrink: 0 }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#e8edf2' }}>
            Conversas
          </h2>

          {/* FILTROS - SÓ ATENDENDO E AGUARDANDO */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {[
              { id: 'atendendo', label: 'Atendendo', count: totalAtendendo },
              { id: 'aguardando', label: 'Aguardando', count: totalAguardando },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFiltroStatus(btn.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: filtroStatus === btn.id ? '#c9943a' : 'transparent',
                  color: filtroStatus === btn.id ? '#0d1f2d' : '#c9943a',
                  fontSize: '12px',
                  fontWeight: filtroStatus === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Buscar contato ou ticket..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#e8edf2',
              fontSize: '12px',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
            }}
          />
        </div>

        {/* FILA DA IA - APENAS EM AGUARDANDO */}
        {filtroStatus === 'aguardando' && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e3d54', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{
                padding: '6px 8px',
                borderRadius: '6px',
                background: 'rgba(155, 89, 182, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Zap size={14} color="#9b59b6" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#e8edf2', marginBottom: '2px' }}>Fila da IA</div>
                <div style={{ fontSize: '11px', color: '#7a96aa' }}>Leads sendo atendidos automaticamente</div>
              </div>
            </div>
          </div>
        )}

        {/* LISTA DE CONVERSAS */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {conversasFiltradas.length > 0 ? (
            conversasFiltradas.map((conv, index) => {
              const isSelected = selectedConversa === index;
              const isAguardando = filtroStatus === 'aguardando';

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    // Bloqueio: em aguardando só pode clicar no olho
                    if (!isAguardando) {
                      setSelectedConversa(index);
                      diminuirNotificacao(conv.id);
                    }
                  }}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #1e3d54',
                    cursor: isAguardando ? 'default' : 'pointer',
                    background: isSelected && !isAguardando ? '#1e3d54' : 'transparent',
                    opacity: isAguardando ? 0.85 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isAguardando) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isAguardando) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flex: 1 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: '2px solid #c9943a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#c9943a',
                        flexShrink: 0,
                      }}>
                        {conv.nome[0].toUpperCase()}{conv.nome[1].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#e8edf2' }}>
                            {conv.nome}
                          </div>
                          {conv.unread > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirEspiar(conv);
                                }}
                                style={{
                                  opacity: 0.5,
                                  cursor: 'pointer',
                                  transition: 'opacity 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  color: '#7a96aa',
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLElement).style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLElement).style.opacity = '0.5';
                                }}
                              >
                                <Eye size={14} />
                              </button>
                              <div style={{
                                background: '#e74c3c',
                                color: '#ffffff',
                                fontSize: '9px',
                                fontWeight: 800,
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                                {conv.unread}
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {conv.hora}
                        </div>
                        <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '4px', lineHeight: '1.3' }}>
                          {conv.preview}
                        </div>
                        <div style={{ fontSize: '10px', color: '#c9943a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ● {conv.origem}
                        </div>
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                          {conv.tags.map((tag, i) => {
                            const colors = getTagColor(tag);
                            return (
                              <span key={i} style={{
                                fontSize: '8px',
                                padding: '2px 5px',
                                borderRadius: '3px',
                                background: colors.bg,
                                color: colors.color,
                                fontWeight: 600,
                              }}>
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {isAguardando && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            aceitarConversa(conv.id);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '2px',
                            border: 'none',
                            background: '#2ecc71',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '0.85';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '1';
                          }}
                        >
                          ACEITAR
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            finalizarConversa(conv.id);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '2px',
                            border: 'none',
                            background: '#e74c3c',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '0.85';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '1';
                          }}
                        >
                          FINALIZAR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: '#7a96aa' }}>
              <div style={{ fontSize: '13px' }}>Nenhuma conversa encontrada</div>
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
            <h2 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#e8edf2' }}>
              {conversa.nome} - #{conversa.id}
            </h2>
            <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '8px' }}>
              Atribuído à 🤖 IA · {conversa.atribuidoA.split(' - ')[1]} · {conversa.data}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            {/* ACTION BUTTONS */}
            {[
              { Icon: X, label: 'Fechar Ticket' },
              { Icon: RefreshCw, label: 'Devolver para a IA' },
              { Icon: User, label: 'Transferir Ticket' },
              { Icon: Calendar, label: 'Agendar Mensagem' },
              { Icon: DollarSign, label: 'Nova Oportunidade' },
              { Icon: FileText, label: 'Nota Interna' },
              { Icon: Paperclip, label: 'Anexar Arquivo' },
              { Icon: Zap, label: 'Respostas Rápidas' },
              { Icon: BarChart3, label: 'Histórico' },
              { Icon: User, label: 'Info do Contato' },
            ].map(({ Icon, label }, i) => (
              <button
                key={i}
                title={label}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7a96aa',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                  (e.currentTarget as HTMLElement).style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* TABS E BUSCA */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '12px 24px',
          borderBottom: '1px solid #1e3d54',
          background: 'rgba(19, 38, 54, 0.3)',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Incluir etiqueta"
            style={{
              padding: '8px 12px',
              border: '1px solid #1e3d54',
              borderRadius: '6px',
              background: 'rgba(13, 31, 45, 0.5)',
              color: '#e8edf2',
              fontSize: '12px',
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.2s',
              flex: 1,
              maxWidth: '300px',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
              (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
              (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
            }}
          />
        </div>

        {/* HISTÓRICO DE MENSAGENS / TIMELINE */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'linear-gradient(180deg, #0a1520 0%, #0d1f2d 100%)',
          justifyContent: 'flex-end',
        }}>
          {mensagensPrototipo.map((msg: any, index) => {
            if (msg.tipo === 'evento') {
              return (
                <div key={index} style={{ textAlign: 'center', margin: '16px 0 8px 0', color: '#7a96aa', fontSize: '12px', fontWeight: 600 }}>
                  {msg.data}
                </div>
              );
            }
            if (msg.tipo === 'sistema') {
              return (
                <div key={index} style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '1px dashed #1e3d54',
                  background: 'transparent',
                  color: '#c9943a',
                  fontSize: '12px',
                  marginTop: '8px',
                }}>
                  📋 {msg.texto}
                  <div style={{ fontSize: '10px', color: '#7a96aa', marginTop: '4px' }}>{msg.hora}</div>
                </div>
              );
            }
            if (msg.tipo === 'recebida') {
              return (
                <div key={index} style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px solid #c9943a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#c9943a',
                    flexShrink: 0,
                  }}>
                    {msg.nome[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#e8edf2', marginBottom: '2px' }}>{msg.nome}</div>
                    <div style={{
                      maxWidth: '500px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e3d54',
                      color: '#e8edf2',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                    }}>
                      {msg.texto}
                    </div>
                    <div style={{ fontSize: '10px', color: '#7a96aa', marginTop: '4px' }}>{msg.hora}</div>
                  </div>
                </div>
              );
            }
            if (msg.tipo === 'enviada') {
              return (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    maxWidth: '550px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#2c5282',
                    color: '#e8edf2',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                  }}>
                    {msg.texto}
                    <div style={{ fontSize: '10px', color: 'rgba(232, 237, 242, 0.7)', marginTop: '4px', textAlign: 'right' }}>
                      {msg.hora} ✓✓
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* INPUT DE MENSAGEM */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #1e3d54',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: 'rgba(19, 38, 54, 0.5)',
        }}>
          {/* EMOJI PICKER */}
          <button style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#7a96aa',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#c9943a';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#7a96aa';
          }}>
            <Smile size={18} />
          </button>

          {/* MIC BUTTON */}
          <button style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#7a96aa',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#c9943a';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#7a96aa';
          }}>
            <Mic size={18} />
          </button>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #1e3d54',
              background: '#132636',
              color: '#e8edf2',
              fontSize: '13px',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
            }}
          />

          {/* ACTION BUTTON */}
          <button
            onClick={handleEnviarMensagem}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: novaMensagem.trim() ? '#c9943a' : '#7a96aa',
              fontSize: '16px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (novaMensagem.trim()) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* MODAL DE ESPIAR - POP-UP */}
      {modalVisible && conversaModal && (
        <div
          onClick={fecharEspiar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              background: '#0d1f2d',
              borderRadius: '12px',
              border: '1px solid #1e3d54',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* MODAL HEADER */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #1e3d54',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#e8edf2' }}>
                  {conversaModal.nome} - #{conversaModal.id}
                </h3>
                <div style={{ fontSize: '11px', color: '#7a96aa' }}>
                  Espiar conversa • {conversaModal.unread > 0 ? `${conversaModal.unread} mensagens não lidas` : 'Sem notificações'}
                </div>
              </div>
              <button
                onClick={fecharEspiar}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7a96aa',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                  (e.currentTarget as HTMLElement).style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL MESSAGES */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifyContent: 'flex-end',
            }}>
              {mensagensPrototipo.map((msg: any, index) => {
                if (msg.tipo === 'evento') {
                  return (
                    <div key={index} style={{ textAlign: 'center', margin: '16px 0 8px 0', color: '#7a96aa', fontSize: '11px', fontWeight: 600 }}>
                      {msg.data}
                    </div>
                  );
                }
                if (msg.tipo === 'sistema') {
                  return (
                    <div key={index} style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px dashed #1e3d54',
                      background: 'transparent',
                      color: '#c9943a',
                      fontSize: '11px',
                      marginTop: '8px',
                    }}>
                      📋 {msg.texto}
                      <div style={{ fontSize: '9px', color: '#7a96aa', marginTop: '4px' }}>{msg.hora}</div>
                    </div>
                  );
                }
                if (msg.tipo === 'recebida') {
                  return (
                    <div key={index} style={{ display: 'flex', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: '2px solid #c9943a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#c9943a',
                        flexShrink: 0,
                      }}>
                        {msg.nome[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#e8edf2', marginBottom: '2px' }}>{msg.nome}</div>
                        <div style={{
                          maxWidth: '400px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          background: '#1e3d54',
                          color: '#e8edf2',
                          fontSize: '12px',
                          lineHeight: '1.4',
                        }}>
                          {msg.texto}
                        </div>
                        <div style={{ fontSize: '9px', color: '#7a96aa', marginTop: '3px' }}>{msg.hora}</div>
                      </div>
                    </div>
                  );
                }
                if (msg.tipo === 'enviada') {
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{
                        maxWidth: '400px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#2c5282',
                        color: '#e8edf2',
                        fontSize: '12px',
                        lineHeight: '1.4',
                      }}>
                        {msg.texto}
                        <div style={{ fontSize: '9px', color: 'rgba(232, 237, 242, 0.7)', marginTop: '3px', textAlign: 'right' }}>
                          {msg.hora} ✓✓
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            {/* MODAL FOOTER - INFO */}
            <div style={{
              padding: '12px 24px',
              borderTop: '1px solid #1e3d54',
              background: 'rgba(19, 38, 54, 0.3)',
              fontSize: '11px',
              color: '#7a96aa',
            }}>
              ℹ️ Você está espiando esta conversa. A notificação continua ativa. Feche para voltar.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

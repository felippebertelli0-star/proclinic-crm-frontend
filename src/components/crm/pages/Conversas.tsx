/**
 * Página de Conversas - CRM ProClinic
 * 100% Fiel ao protótipo original - Conversas & Tickets
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Calendar, DollarSign, FileText, Paperclip, Zap, BarChart3, User, Mic, Send, Smile, Clock, Eye } from 'lucide-react';

export function Conversas() {
  const [selectedConversa, setSelectedConversa] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<'atendendo' | 'aguardando' | 'fechadas'>('atendendo');
  const [busca, setBusca] = useState('');
  const [activeTab, setActiveTab] = useState<'ativa' | 'tags'>('ativa');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [conversaModal, setConversaModal] = useState<any>(null);
  const [gravando, setGravando] = useState(false);
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const [historicoMensagens, setHistoricoMensagens] = useState<any[]>([]);
  const [confirmFinalizarVisible, setConfirmFinalizarVisible] = useState(false);
  const [conversaParaFinalizar, setConversaParaFinalizar] = useState<number | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const [conversas, setConversas] = useState<any>([
    {
      id: 87439, nome: 'Ida Santos', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '1 min',
      origem: 'Trafego Pago', tags: ['WHATSAPP', 'IA ATIVA'], unread: 2, preview: 'Havila deu oi...'
    },
    {
      id: 87443, nome: 'Marina Costa', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '2 min',
      origem: 'Organic', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 1, preview: 'Primeira vez aqui'
    },
    {
      id: 87444, nome: 'Carlos Silva', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '3 min',
      origem: 'Trafego Pago', tags: ['WHATSAPP', 'RETORNO'], unread: 0, preview: 'Qual o status?'
    },
    {
      id: 87445, nome: 'Ana Martins', status: 'atendendo', canal: 'INSTAGRAM',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '4 min',
      origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 3, preview: 'Gostei do seu trabalho'
    },
    {
      id: 87446, nome: 'João Pereira', status: 'atendendo', canal: 'WHATSAPP',
      atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '6 min',
      origem: 'Indicação', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 1, preview: 'Pode agendar?'
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

  // Filtrar conversas por status E ORDENAR: com notificações primeiro
  const conversasFiltradas = conversas
    .filter((conv: any) => {
      const matchStatus = filtroStatus === 'atendendo' ? conv.status === 'atendendo' :
                         filtroStatus === 'aguardando' ? conv.status === 'aguardando' :
                         conv.status === 'fechadas';
      const matchBusca = conv.nome.toLowerCase().includes(busca.toLowerCase()) || String(conv.id).includes(busca);
      return matchStatus && matchBusca;
    })
    .sort((a: any, b: any) => {
      // Conversas aceitas recentemente ficam no topo em "atendendo"
      if (filtroStatus === 'atendendo') {
        const aAceitado = a.aceitadoEm || 0;
        const bAceitado = b.aceitadoEm || 0;
        if (aAceitado > 0 || bAceitado > 0) return (bAceitado || 0) - (aAceitado || 0);
      }
      // Conversas com notificações sobem para o topo
      if (a.unread > 0 && b.unread === 0) return -1;
      if (a.unread === 0 && b.unread > 0) return 1;
      return 0;
    });

  // Resetar seleção quando mudar filtro
  const validSelectedConversa = selectedConversa < conversasFiltradas.length ? selectedConversa : 0;
  const conversa = conversasFiltradas[validSelectedConversa];
  const totalAtendendo = conversas.filter((c: any) => c.status === 'atendendo').length;
  const totalAguardando = conversas.filter((c: any) => c.status === 'aguardando').length;
  const totalFechadas = conversas.filter((c: any) => c.status === 'fechadas').length;

  // Handler para mudar filtro e resetar seleção
  const handleFiltroChange = (status: 'atendendo' | 'aguardando' | 'fechadas') => {
    setFiltroStatus(status);
    setSelectedConversa(0);
  };

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
    // Atualizar status e adicionar timestamp para ordenação
    const novasConversas = conversas.map((conv: any) =>
      conv.id === convId
        ? { ...conv, status: 'atendendo', unread: 0, aceitadoEm: Date.now() }
        : conv
    );
    setConversas(novasConversas);

    // Mudar filtro para "atendendo" automaticamente
    setFiltroStatus('atendendo');

    // Encontrar a posição da conversa aceita na lista filtrada e selecionar
    setTimeout(() => {
      const conversasAtendendo = novasConversas
        .filter((conv: any) => conv.status === 'atendendo')
        .sort((a: any, b: any) => {
          // Conversas aceitas recentemente ficam no topo
          const aAceitado = a.aceitadoEm || 0;
          const bAceitado = b.aceitadoEm || 0;
          if (aAceitado > 0 || bAceitado > 0) return (bAceitado || 0) - (aAceitado || 0);
          // Fallback para ordenação por notificações
          if (a.unread > 0 && b.unread === 0) return -1;
          if (a.unread === 0 && b.unread > 0) return 1;
          return 0;
        });

      const indexSelecionada = conversasAtendendo.findIndex((conv: any) => conv.id === convId);
      setSelectedConversa(indexSelecionada >= 0 ? indexSelecionada : 0);
    }, 0);
  };

  const abrirConfirmFinalizar = (convId: number) => {
    // Mostrar modal de confirmação
    setConversaParaFinalizar(convId);
    setConfirmFinalizarVisible(true);
  };

  const confirmarFinalizar = () => {
    // Realmente finalizar a conversa
    if (conversaParaFinalizar) {
      setConversas(conversas.map((conv: any) =>
        conv.id === conversaParaFinalizar ? { ...conv, status: 'fechadas' } : conv
      ));
      setSelectedConversa(0);
    }
    // Fechar o modal
    setConfirmFinalizarVisible(false);
    setConversaParaFinalizar(null);
  };

  const cancelarFinalizar = () => {
    // Fechar o modal sem fazer nada
    setConfirmFinalizarVisible(false);
    setConversaParaFinalizar(null);
  };

  const finalizarConversa = (convId: number) => {
    // Abrir popup de confirmação em vez de finalizar direto
    abrirConfirmFinalizar(convId);
  };

  const diminuirNotificacao = (convId: number) => {
    setConversas(conversas.map((conv: any) =>
      conv.id === convId ? { ...conv, unread: 0 } : conv
    ));
  };

  // ============ GRAVAÇÃO DE ÁUDIO ============
  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duracao = tempoGravacao; // Duração em segundos
        console.log('🎙️ Áudio gravado:', audioBlob, 'Duração:', duracao, 's');
        // Armazenar áudio com metadados em JSON
        const audioData = {
          tipo: 'audio',
          duracao: duracao,
          tamanho: Math.round(audioBlob.size / 1024),
        };
        setNovaMensagem(JSON.stringify(audioData));
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setTempoGravacao(0);
        clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setGravando(true);
      setTempoGravacao(0);

      // Timer para contar tempo de gravação
      timerRef.current = setInterval(() => {
        setTempoGravacao(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('❌ Erro ao acessar microfone:', error);
      alert('Permissão de microfone negada ou microfone não disponível');
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setGravando(false);
      clearInterval(timerRef.current);
    }
  };

  const enviarAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setGravando(false);
    clearInterval(timerRef.current);

    // Aguarda um momento para o arquivo ser processado
    setTimeout(() => {
      handleEnviarMensagem();
    }, 100);
  };

  const cancelarGravacao = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.abort();
      setGravando(false);
      setTempoGravacao(0);
      clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Formatar tempo em MM:SS
  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  // ============ EMOJIS ============
  const emojisPopulares = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '✨', '👏', '💯', '😍', '🤔', '😎', '💪', '🚀', '⭐', '🌟', '😢', '😡', '🤗', '👋'];

  const adicionarEmoji = (emoji: string) => {
    setNovaMensagem(novaMensagem + emoji);
    setEmojiMenuVisible(false);
  };

  const handleEnviarMensagem = () => {
    if (novaMensagem.trim()) {
      // Detectar se é áudio (JSON com tipo 'audio')
      let isAudio = false;
      let audioMetadata = null;
      try {
        const parsed = JSON.parse(novaMensagem);
        if (parsed.tipo === 'audio') {
          isAudio = true;
          audioMetadata = parsed;
        }
      } catch (e) {
        // Não é JSON, é uma mensagem de texto normal
      }

      // Adiciona mensagem ao histórico
      const novaMens = {
        tipo: 'enviada',
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        ...(isAudio ? {
          audio: true,
          duracao: audioMetadata.duracao,
          tamanho: audioMetadata.tamanho,
        } : {
          texto: novaMensagem,
        }),
      };

      setHistoricoMensagens([...historicoMensagens, novaMens]);
      console.log('📤 Mensagem enviada:', isAudio ? 'Áudio' : novaMensagem);

      // Aqui você faria a requisição para enviar via API
      // Por enquanto, apenas limpa o input e mostra no console

      // Feedback visual: limpar input
      setNovaMensagem('');

      // Parar gravação se estiver em andamento
      if (gravando) {
        pararGravacao();
      }
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

          {/* FILTROS - ATENDENDO, AGUARDANDO E FECHADAS */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {[
              { id: 'atendendo', label: 'Atendendo', count: totalAtendendo },
              { id: 'aguardando', label: 'Aguardando', count: totalAguardando },
              { id: 'fechadas', label: 'Fechadas', count: totalFechadas },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleFiltroChange(btn.id as any)}
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
            conversasFiltradas.map((conv: any, index: number) => {
              const isSelected = validSelectedConversa === index;
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
                          {/* Eye icon sempre visível no atendendo, ou quando há notificações no aguardando */}
                          {(!isAguardando || conv.unread > 0) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirEspiar(conv);
                                }}
                                style={{
                                  opacity: conv.unread > 0 ? 0.5 : 0.3,
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
                                  (e.currentTarget as HTMLElement).style.opacity = conv.unread > 0 ? '0.5' : '0.3';
                                }}
                              >
                                <Eye size={14} />
                              </button>
                              {conv.unread > 0 && (
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
                              )}
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
                          {conv.tags.map((tag: string, i: number) => {
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
        {conversa ? (
          <>
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
          {[...mensagensPrototipo, ...historicoMensagens].map((msg: any, index) => {
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
              // Renderizar áudio ou texto normal
              if (msg.audio) {
                const duracao = msg.duracao;
                const minutos = Math.floor(duracao / 60);
                const segundos = duracao % 60;
                const tempoFormatado = `${minutos}:${String(segundos).padStart(2, '0')}`;

                return (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '8px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      maxWidth: '220px',
                      padding: '8px 14px',
                      borderRadius: '18px',
                      background: '#2c5282',
                      color: '#e8edf2',
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '16px',
                      }}>
                        ▶️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>Áudio</div>
                        <div style={{ fontSize: '11px', color: 'rgba(232, 237, 242, 0.8)' }}>{tempoFormatado}</div>
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(232, 237, 242, 0.7)', whiteSpace: 'nowrap' }}>
                        {msg.hora} ✓✓
                      </div>
                    </div>
                  </div>
                );
              }

              // Mensagem de texto normal
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

        {/* GRAVAÇÃO DE ÁUDIO - BANNER */}
        {gravando && (
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid rgba(231, 76, 60, 0.3)',
            background: 'rgba(231, 76, 60, 0.1)',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#e74c3c',
                animation: 'pulse 1s infinite',
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#e74c3c' }}>
                  🎙️ Gravando áudio...
                </div>
                <div style={{ fontSize: '12px', color: '#e8edf2', fontWeight: 600 }}>
                  {formatarTempo(tempoGravacao)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={cancelarGravacao}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: '1px solid #7a96aa',
                  color: '#7a96aa',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(122, 150, 170, 0.1)';
                  (e.currentTarget as HTMLElement).style.borderColor = '#e8edf2';
                  (e.currentTarget as HTMLElement).style.color = '#e8edf2';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = '#7a96aa';
                  (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={enviarAudio}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: '#e74c3c',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#c0392b';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#e74c3c';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* INPUT DE MENSAGEM */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #1e3d54',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: 'rgba(19, 38, 54, 0.5)',
          position: 'relative',
        }}>
          {/* EMOJI PICKER */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setEmojiMenuVisible(!emojiMenuVisible)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: emojiMenuVisible ? 'rgba(201, 148, 58, 0.15)' : 'transparent',
                border: emojiMenuVisible ? '1px solid #c9943a' : 'none',
                cursor: 'pointer',
                color: emojiMenuVisible ? '#c9943a' : '#7a96aa',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (!emojiMenuVisible) {
                  (e.currentTarget as HTMLElement).style.color = '#c9943a';
                }
              }}
              onMouseLeave={(e) => {
                if (!emojiMenuVisible) {
                  (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                }
              }}
            >
              <Smile size={18} />
            </button>

            {/* EMOJI MENU FLUTUANTE */}
            {emojiMenuVisible && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #0a1520 0%, #0d1f2d 100%)',
                  border: '1px solid rgba(201, 148, 58, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                  zIndex: 100,
                  minWidth: '260px',
                }}
              >
                {emojisPopulares.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => adicionarEmoji(emoji)}
                    style={{
                      fontSize: '24px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.3)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MIC BUTTON */}
          <button
            onClick={() => {
              if (!gravando) {
                iniciarGravacao();
              } else {
                pararGravacao();
              }
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: gravando ? 'rgba(231, 76, 60, 0.2)' : 'transparent',
              border: gravando ? '1px solid #e74c3c' : 'none',
              cursor: 'pointer',
              color: gravando ? '#e74c3c' : '#7a96aa',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: gravando ? 'pulse 1s infinite' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!gravando) {
                (e.currentTarget as HTMLElement).style.color = '#c9943a';
              }
            }}
            onMouseLeave={(e) => {
              if (!gravando) {
                (e.currentTarget as HTMLElement).style.color = '#7a96aa';
              }
            }}
          >
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
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7a96aa',
            fontSize: '14px',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>💬</div>
            <div>Selecione uma conversa para começar</div>
          </div>
        )}
      </div>

      {/* MODAL DE ESPIAR - POP-UP PREMIUM */}
      {modalVisible && conversaModal && (
        <div
          onClick={fecharEspiar}
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
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '680px',
              maxHeight: '85vh',
              background: 'linear-gradient(135deg, #0a1520 0%, #0d1f2d 100%)',
              borderRadius: '14px',
              border: '1px solid rgba(201, 148, 58, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(201, 148, 58, 0.1)',
            }}
          >
            {/* MODAL HEADER - PREMIUM */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(30, 61, 84, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(13, 31, 45, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #c9943a, #e8b86d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0d1f2d',
                  flexShrink: 0,
                }}>
                  {conversaModal.nome[0]}{conversaModal.nome[1]}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#e8edf2' }}>
                    {conversaModal.nome}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: conversaModal.unread > 0 ? '#e74c3c' : '#2ecc71', fontWeight: 600 }}>●</span>
                    {conversaModal.unread > 0 ? `${conversaModal.unread} mensagens não lidas` : 'Sem notificações'}
                  </div>
                </div>
              </div>
              <button
                onClick={fecharEspiar}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
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
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#7a96aa';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL MESSAGES AREA */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              justifyContent: 'flex-end',
              background: 'linear-gradient(180deg, #0d1f2d 0%, #0a1520 100%)',
            }}>
              {[...mensagensPrototipo, ...historicoMensagens].map((msg: any, index) => {
                if (msg.tipo === 'evento') {
                  return (
                    <div key={index} style={{ textAlign: 'center', margin: '20px 0 10px 0', color: '#7a96aa', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                      {msg.data}
                    </div>
                  );
                }
                if (msg.tipo === 'sistema') {
                  return (
                    <div key={index} style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 148, 58, 0.2)',
                      background: 'rgba(201, 148, 58, 0.08)',
                      color: '#c9943a',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      marginTop: '6px',
                    }}>
                      📋 {msg.texto}
                      <div style={{ fontSize: '10px', color: '#7a96aa', marginTop: '6px', fontWeight: 500 }}>{msg.hora}</div>
                    </div>
                  );
                }
                if (msg.tipo === 'recebida') {
                  return (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(201, 148, 58, 0.3), rgba(232, 184, 109, 0.2))',
                        border: '1px solid rgba(201, 148, 58, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#c9943a',
                        flexShrink: 0,
                      }}>
                        {msg.nome[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#e8edf2', marginBottom: '4px' }}>{msg.nome}</div>
                        <div style={{
                          maxWidth: '420px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgba(30, 61, 84, 0.6), rgba(30, 61, 84, 0.3))',
                          border: '1px solid rgba(30, 61, 84, 0.8)',
                          color: '#e8edf2',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          backdropFilter: 'blur(10px)',
                        }}>
                          {msg.texto}
                        </div>
                        <div style={{ fontSize: '10px', color: '#7a96aa', marginTop: '4px', fontWeight: 500 }}>{msg.hora}</div>
                      </div>
                    </div>
                  );
                }
                if (msg.tipo === 'enviada') {
                  // Renderizar áudio ou texto normal
                  if (msg.audio) {
                    const duracao = msg.duracao;
                    const minutos = Math.floor(duracao / 60);
                    const segundos = duracao % 60;
                    const tempoFormatado = `${minutos}:${String(segundos).padStart(2, '0')}`;

                    return (
                      <div key={index} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          maxWidth: '240px',
                          padding: '10px 14px',
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, rgba(44, 82, 130, 0.8), rgba(44, 82, 130, 0.5))',
                          border: '1px solid rgba(52, 110, 165, 0.5)',
                          color: '#e8edf2',
                        }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '18px',
                          }}>
                            ▶️
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>Áudio</div>
                            <div style={{ fontSize: '11px', color: 'rgba(232, 237, 242, 0.85)' }}>{tempoFormatado}</div>
                          </div>
                          <div style={{ fontSize: '9px', color: 'rgba(232, 237, 242, 0.7)', whiteSpace: 'nowrap', textAlign: 'right' }}>
                            <div>{msg.hora}</div>
                            <div>✓✓</div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Mensagem de texto normal
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{
                        maxWidth: '420px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(44, 82, 130, 0.7), rgba(44, 82, 130, 0.4))',
                        border: '1px solid rgba(52, 110, 165, 0.5)',
                        color: '#e8edf2',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        backdropFilter: 'blur(10px)',
                      }}>
                        {msg.texto}
                        <div style={{ fontSize: '10px', color: 'rgba(232, 237, 242, 0.7)', marginTop: '6px', textAlign: 'right', fontWeight: 500 }}>
                          {msg.hora} ✓✓
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            {/* MODAL FOOTER - INFO BANNER */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid rgba(30, 61, 84, 0.5)',
              background: 'rgba(155, 89, 182, 0.1)',
              fontSize: '12px',
              color: '#9b59b6',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.3px',
            }}>
              <Eye size={16} />
              Você está espiando • Notificação continua ativa • Feche para voltar
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO PARA FINALIZAR CONVERSA */}
      {confirmFinalizarVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#0a1520',
            borderRadius: '12px',
            border: '1px solid #1e3d54',
            padding: '32px',
            minWidth: '380px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* CABEÇALHO DO MODAL */}
            <div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: '#e8edf2',
              }}>
                Encerrar Conversa?
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#7a96aa',
                lineHeight: '1.5',
              }}>
                Tem certeza que deseja encerrar esta conversa? A conversa será movida para a área de "Conversas Fechadas" e poderá ser consultada depois.
              </p>
            </div>

            {/* BOTÕES */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={cancelarFinalizar}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(30, 61, 84, 0.3)';
                  (e.currentTarget as HTMLElement).style.borderColor = '#7a96aa';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                }}
              >
                Não, continuar
              </button>
              <button
                onClick={confirmarFinalizar}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#e74c3c',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#c0392b';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#e74c3c';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                Sim, encerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

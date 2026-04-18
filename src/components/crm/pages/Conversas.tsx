/**
 * Página de Conversas - CRM ProClinic
 * 100% Fiel ao protótipo original - Conversas & Tickets
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Calendar, DollarSign, FileText, Paperclip, Zap, BarChart3, User, Mic, Send, Smile, Clock, Eye } from 'lucide-react';

// ============ ESTILOS PREMIUM AAA ============
const PREMIUM_STYLES = {
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #c9943a 0%, #e8b86d 100%)',
  gradientDark: 'linear-gradient(135deg, #0a1520 0%, #132636 100%)',

  // Shadows Premium
  shadowSm: '0 2px 8px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 16px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.6)',
  shadowXl: '0 16px 48px rgba(0, 0, 0, 0.8)',

  // Colors
  colorGold: '#c9943a',
  colorGoldLight: '#e8b86d',
  colorText: '#e8edf2',
  colorTextSecondary: '#7a96aa',
  colorBorder: '#1e3d54',
  colorBg: '#0a1520',

  // Transitions
  transitionFast: 'all 0.15s ease-out',
  transitionMedium: 'all 0.25s ease-out',
  transitionSlow: 'all 0.35s ease-out',
};

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
  const [transferirModalVisible, setTransferirModalVisible] = useState(false);
  const [buscaMembro, setBuscaMembro] = useState('');
  const [membroSelecionado, setMembroSelecionado] = useState<any>(null);
  const [filaSelecionada, setFilaSelecionada] = useState<string | null>(null);
  const [agendarModalVisible, setAgendarModalVisible] = useState(false);
  const [mensagemAgendada, setMensagemAgendada] = useState('');
  const [conexaoSelecionada, setConexaoSelecionada] = useState<string | null>(null);
  const [filaSelecionadaAgenda, setFilaSelecionadaAgenda] = useState<string | null>(null);
  const [dataHoraAgendamento, setDataHoraAgendamento] = useState('');
  const [arquivoAnexado, setArquivoAnexado] = useState<File | null>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [oportunidadeModalVisible, setOportunidadeModalVisible] = useState(false);
  const [contatos, setContatos] = useState<any[]>([]);
  const [contatoOportunidade, setContatoOportunidade] = useState<string | null>(null);
  const [tagsOportunidade, setTagsOportunidade] = useState('');
  const [etapaOportunidade, setEtapaOportunidade] = useState<string | null>(null);
  const [itemUnico, setItemUnico] = useState(true);
  const [produtoOportunidade, setProdutoOportunidade] = useState<string | null>(null);
  const [valorOportunidade, setValorOportunidade] = useState('');
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [notaInternaVisivel, setNotaInternaVisivel] = useState(false);
  const [notaInternaTexto, setNotaInternaTexto] = useState('');
  const [notasInternas, setNotasInternas] = useState<Record<number, string>>({});
  const [respostasRapidasVisivel, setRespostasRapidasVisivel] = useState(false);
  const [historicoVisivel, setHistoricoVisivel] = useState(false);
  const [infoContatoVisivel, setInfoContatoVisivel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // ============ DADOS DE MEMBROS E FILAS ============
  const membros = [
    { id: 1, nome: 'Havila Rodrigues', role: 'SDR / Atendente', tickets: 42, status: 'online' },
    { id: 2, nome: 'Camiliy Nunes', role: 'SDR / Atendente', tickets: 38, status: 'online' },
    { id: 3, nome: 'IA Hávila', role: 'Agente IA', tickets: 87, status: 'online' },
    { id: 4, nome: 'IA Camiliy', role: 'Agente IA', tickets: 61, status: 'online' },
    { id: 5, nome: 'Dra. Andressa', role: 'Médica Responsável', tickets: 0, status: 'ausente' },
    { id: 6, nome: 'Luana Silva', role: 'Recepcionista', tickets: 12, status: 'offline' },
  ];

  const filas = [
    { id: 1, nome: 'Fila Geral' },
    { id: 2, nome: 'Fila de Agendamentos' },
    { id: 3, nome: 'Fila de Suporte' },
    { id: 4, nome: 'Fila VIP' },
    { id: 5, nome: 'Fila de Retorno' },
  ];

  const conexoesAtivas = [
    { id: 1, nome: 'WhatsApp Oficial', tipo: 'whatsapp', ativa: true },
    { id: 2, nome: 'Instagram DM', tipo: 'instagram', ativa: true },
    { id: 3, nome: 'Telegram', tipo: 'telegram', ativa: true },
  ];

  // ============ DADOS DO PIPELINE ============
  const etapasPipeline = [
    { id: 1, nome: 'Novo Lead', emoji: '🎯', cor: '#3498db' },
    { id: 2, nome: 'Contato Realizado', emoji: '📞', cor: '#2ecc71' },
    { id: 3, nome: 'Proposta Enviada', emoji: '📄', cor: '#f39c12' },
    { id: 4, nome: 'Negociação', emoji: '💰', cor: '#e74c3c' },
    { id: 5, nome: 'Fechado', emoji: '✅', cor: '#27ae60' },
  ];

  const produtosServicos = [
    { id: 1, nome: 'Consulta Inicial' },
    { id: 2, nome: 'Tratamento Básico' },
    { id: 3, nome: 'Pacote Premium' },
    { id: 4, nome: 'Acompanhamento Mensal' },
    { id: 5, nome: 'Consultoria Especial' },
  ];

  const tagsCRM = ['lead-quente', 'agendamento', 'plano-saúde', 'desconto-30', 'vip', 'retorno', 'novo-cliente'];

  // Inicializar contatos a partir das conversas
  const contatosDisponiveis = conversas.map((conv: any) => ({
    id: conv.id,
    nome: conv.nome,
    canal: conv.canal,
  }));

  // ============ RESPOSTAS RÁPIDAS ============
  const respostasRapidas = [
    {
      id: 1,
      gatilho: 'Boas-vindas',
      titulo: 'Boas-vindas',
      mensagem: 'Olá! Bem-vindo(a) à Clínica Dra. Andressa Barbarotti 😊 Em que posso ajudar você?',
    },
    {
      id: 2,
      gatilho: 'Confirmação de consulta',
      titulo: 'Confirmação de consulta',
      mensagem: 'Sua consulta está confirmada! Qualquer dúvida, estou à disposição.',
    },
    {
      id: 3,
      gatilho: 'Solicitar CPF',
      titulo: 'Solicitar CPF',
      mensagem: 'Para verificarmos a cobertura do seu plano, pode me informar seu CPF?',
    },
    {
      id: 4,
      gatilho: 'Horários disponíveis',
      titulo: 'Horários disponíveis',
      mensagem: 'Temos disponibilidade nos seguintes horários:\n\n📅 Segunda a sexta: 8h às 18h\n📅 Sábado: 8h às 12h\n\nQual hora melhor para você?',
    },
    {
      id: 5,
      gatilho: 'Valores e formas de pagamento',
      titulo: 'Valores e formas de pagamento',
      mensagem: 'Oferecemos as seguintes formas de pagamento:\n\n💳 Cartão de crédito\n💳 Débito\n🏦 Pix\n💰 Dinheiro\n📋 Parcelado (até 12x)\n\nDeseja mais informações sobre valores?',
    },
    {
      id: 6,
      gatilho: 'Localização',
      titulo: 'Localização da clínica',
      mensagem: '📍 Clínica Dra. Andressa Barbarotti\nRua das Flores, 123 - Centro\nTelefone: (11) 9999-9999\n\nEspero você em breve! 😊',
    },
    {
      id: 7,
      gatilho: 'Agradecimento final',
      titulo: 'Agradecimento final',
      mensagem: 'Obrigada por escolher nossa clínica! Qualquer dúvida, é só chamar. Tenha um ótimo dia! 🌟',
    },
    {
      id: 8,
      gatilho: 'Reagendamento',
      titulo: 'Reagendamento de consulta',
      mensagem: 'Sua consulta foi cancelada. Gostaria de agendar uma nova data? Temos vários horários disponíveis!',
    },
  ];

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

  const reabrirConversa = (convId: number) => {
    // Reabrir conversa e mover para atendendo
    const novasConversas = conversas.map((conv: any) =>
      conv.id === convId
        ? { ...conv, status: 'atendendo', unread: 0, aceitadoEm: Date.now() }
        : conv
    );
    setConversas(novasConversas);

    // Mudar filtro para "atendendo" automaticamente
    setFiltroStatus('atendendo');

    // Encontrar a posição da conversa reabierta na lista filtrada e selecionar
    setTimeout(() => {
      const conversasAtendendo = novasConversas
        .filter((conv: any) => conv.status === 'atendendo')
        .sort((a: any, b: any) => {
          // Conversas aceitas/reabertas recentemente ficam no topo
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

  const devolverParaIA = (convId: number) => {
    // Devolver conversa para a IA - mover status para aguardando
    const novasConversas = conversas.map((conv: any) =>
      conv.id === convId
        ? { ...conv, status: 'aguardando', unread: 0 }
        : conv
    );
    setConversas(novasConversas);

    // Mudar filtro para "aguardando" automaticamente
    setFiltroStatus('aguardando');

    // Resetar seleção
    setSelectedConversa(0);
  };

  const abrirTransferirModal = () => {
    setTransferirModalVisible(true);
    setBuscaMembro('');
    setMembroSelecionado(null);
    setFilaSelecionada(null);
  };

  const fecharTransferirModal = () => {
    setTransferirModalVisible(false);
    setMembroSelecionado(null);
    setFilaSelecionada(null);
    setBuscaMembro('');
  };

  const transferirTicket = () => {
    // Prioridade: SEMPRE membro se selecionado
    if (!conversa || (!membroSelecionado && !filaSelecionada)) {
      alert('Por favor, selecione um membro ou fila para transferir');
      return;
    }

    // Debug: verificar o que está selecionado
    console.log('Membro selecionado:', membroSelecionado);
    console.log('Fila selecionada:', filaSelecionada);

    // Atualizar a conversa com a nova atribuição
    const novasConversas = conversas.map((conv: any) =>
      conv.id === conversa.id
        ? {
            ...conv,
            atribuidoA: membroSelecionado ? membroSelecionado.nome : filaSelecionada,
          }
        : conv
    );
    setConversas(novasConversas);
    fecharTransferirModal();
  };

  const membrosFiltrados = membros.filter((m: any) =>
    m.nome.toLowerCase().includes(buscaMembro.toLowerCase())
  );

  const diminuirNotificacao = (convId: number) => {
    setConversas(conversas.map((conv: any) =>
      conv.id === convId ? { ...conv, unread: 0 } : conv
    ));
  };

  const abrirAgendarModal = () => {
    setAgendarModalVisible(true);
    setMensagemAgendada('');
    setConexaoSelecionada(null);
    setFilaSelecionadaAgenda(null);
    setDataHoraAgendamento('');
    setArquivoAnexado(null);
  };

  const fecharAgendarModal = () => {
    setAgendarModalVisible(false);
    setMensagemAgendada('');
    setConexaoSelecionada(null);
    setFilaSelecionadaAgenda(null);
    setDataHoraAgendamento('');
    setArquivoAnexado(null);
  };

  const handleAnexarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoAnexado(file);
    }
  };

  const salvarAgendamento = () => {
    if (!mensagemAgendada.trim()) {
      alert('Por favor, escreva uma mensagem');
      return;
    }
    if (!conexaoSelecionada) {
      alert('Por favor, selecione uma conexão');
      return;
    }
    if (!dataHoraAgendamento) {
      alert('Por favor, selecione uma data e hora');
      return;
    }

    if (conversa) {
      const novoAgendamento = {
        id: Date.now(),
        conversaId: conversa.id,
        conversaNome: conversa.nome,
        mensagem: mensagemAgendada,
        conexao: conexaoSelecionada,
        fila: filaSelecionadaAgenda,
        dataHora: dataHoraAgendamento,
        arquivo: arquivoAnexado?.name || null,
        status: 'agendado',
        criadoEm: new Date().toISOString(),
      };

      setAgendamentos([...agendamentos, novoAgendamento]);
      fecharAgendarModal();
      alert('Mensagem agendada com sucesso! Ela aparecerá no Calendário na data e hora especificadas.');
    }
  };

  const abrirOportunidadeModal = () => {
    setOportunidadeModalVisible(true);
    setContatoOportunidade(conversa?.id.toString() || null);
    setTagsOportunidade('');
    setEtapaOportunidade('1');
    setItemUnico(true);
    setProdutoOportunidade(null);
    setValorOportunidade('');
    setInformacoesAdicionais('');
  };

  const fecharOportunidadeModal = () => {
    setOportunidadeModalVisible(false);
    setContatoOportunidade(null);
    setTagsOportunidade('');
    setEtapaOportunidade(null);
    setItemUnico(true);
    setProdutoOportunidade(null);
    setValorOportunidade('');
    setInformacoesAdicionais('');
  };

  const salvarOportunidade = () => {
    if (!contatoOportunidade) {
      alert('Por favor, selecione um contato');
      return;
    }
    if (!etapaOportunidade) {
      alert('Por favor, selecione uma etapa do funil');
      return;
    }
    if (!produtoOportunidade || produtoOportunidade.trim() === '') {
      alert('Por favor, selecione ou digite um produto/serviço');
      return;
    }
    if (!valorOportunidade || parseFloat(valorOportunidade) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    const contatoNome = contatosDisponiveis.find((c: any) => c.id.toString() === contatoOportunidade)?.nome;
    const etapaNome = etapasPipeline.find((e: any) => e.id.toString() === etapaOportunidade)?.nome;

    const novaOportunidade = {
      id: Date.now(),
      contatoId: contatoOportunidade,
      contatoNome: contatoNome,
      tags: tagsOportunidade,
      etapa: etapaOportunidade,
      etapaNome: etapaNome,
      itemUnico: itemUnico,
      produto: produtoOportunidade,
      valor: parseFloat(valorOportunidade),
      informacoes: informacoesAdicionais,
      status: 'ativa',
      criadoEm: new Date().toISOString(),
      dataUltimaAtualizacao: new Date().toISOString(),
    };

    setOportunidades([...oportunidades, novaOportunidade]);
    fecharOportunidadeModal();
    alert('✅ Oportunidade criada com sucesso! Aparecerá automaticamente na etapa "' + etapaNome + '" do Pipeline.');
  };

  // ============ NOTA INTERNA ============
  const abrirNotaInterna = () => {
    if (conversa) {
      setNotaInternaVisivel(true);
      setNotaInternaTexto(notasInternas[conversa.id] || '');
    }
  };

  const fecharNotaInterna = () => {
    setNotaInternaVisivel(false);
    setNotaInternaTexto('');
  };

  const salvarNotaInterna = () => {
    if (conversa) {
      setNotasInternas({
        ...notasInternas,
        [conversa.id]: notaInternaTexto,
      });
      fecharNotaInterna();
    }
  };

  // ============ ANEXAR ARQUIVO ============
  const handleAnexarArquivoClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        // Simular envio do arquivo como mensagem
        const novaMsg = {
          tipo: 'enviada',
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          arquivo: true,
          nomeArquivo: file.name,
          tamanho: Math.round(file.size / 1024),
          tipo_arquivo: file.type.split('/')[0], // 'image', 'document', 'video', etc
        };
        setHistoricoMensagens([...historicoMensagens, novaMsg]);
      }
    };
    fileInput.click();
  };

  // ============ RESPOSTAS RÁPIDAS ============
  const abrirRespostasRapidas = () => {
    setRespostasRapidasVisivel(true);
  };

  const fecharRespostasRapidas = () => {
    setRespostasRapidasVisivel(false);
  };

  const selecionarRespostaRapida = (mensagem: string) => {
    setNovaMensagem(mensagem);
    fecharRespostasRapidas();
  };

  // ============ HISTÓRICO DO TICKET ============
  const abrirHistorico = () => {
    setHistoricoVisivel(true);
  };

  const fecharHistorico = () => {
    setHistoricoVisivel(false);
  };

  // ============ INFO DO CONTATO ============
  const abrirInfoContato = () => {
    setInfoContatoVisivel(true);
  };

  const fecharInfoContato = () => {
    setInfoContatoVisivel(false);
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
              const isFechadas = filtroStatus === 'fechadas';

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
                              {/* Tempo entre olho e notificação */}
                              <span style={{ fontSize: '9px', color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Clock size={11} />
                                {conv.hora}
                              </span>
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
                        {/* Atribuído a - com cor diferente (roxo/vermelho) */}
                        <div style={{ fontSize: '10px', color: '#9b59b6', fontWeight: 600, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          👤 {conv.atribuidoA}
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
                    {isFechadas && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            reabrirConversa(conv.id);
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
                          REABRIR
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
              Atribuído à {membros.some((m: any) => m.nome === conversa.atribuidoA) ? '👤' : '📁'} {conversa.atribuidoA} · {conversa.data}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            {/* ACTION BUTTONS */}
            {[
              { Icon: X, label: 'Fechar Ticket', action: 'fechar' },
              { Icon: RefreshCw, label: 'Devolver para a IA', action: 'devolver' },
              { Icon: User, label: 'Transferir Ticket', action: 'transferir' },
              { Icon: Calendar, label: 'Agendar Mensagem', action: 'agendar' },
              { Icon: DollarSign, label: 'Nova Oportunidade', action: 'oportunidade' },
              { Icon: FileText, label: 'Nota Interna', action: 'nota_interna' },
              { Icon: Paperclip, label: 'Anexar Arquivo', action: 'anexar_arquivo' },
              { Icon: Zap, label: 'Respostas Rápidas', action: 'respostas_rapidas' },
              { Icon: BarChart3, label: 'Histórico', action: 'historico' },
              { Icon: User, label: 'Info do Contato', action: 'info_contato' },
            ].map(({ Icon, label, action }, i) => (
              <button
                key={i}
                title={label}
                onClick={(e) => {
                  e.stopPropagation();
                  if (action === 'fechar' && conversa) {
                    finalizarConversa(conversa.id);
                  } else if (action === 'devolver' && conversa) {
                    devolverParaIA(conversa.id);
                  } else if (action === 'transferir') {
                    abrirTransferirModal();
                  } else if (action === 'agendar') {
                    abrirAgendarModal();
                  } else if (action === 'oportunidade') {
                    abrirOportunidadeModal();
                  } else if (action === 'nota_interna') {
                    abrirNotaInterna();
                  } else if (action === 'anexar_arquivo') {
                    handleAnexarArquivoClick();
                  } else if (action === 'respostas_rapidas') {
                    abrirRespostasRapidas();
                  } else if (action === 'historico') {
                    abrirHistorico();
                  } else if (action === 'info_contato') {
                    abrirInfoContato();
                  }
                }}
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

        {/* CAMPO DE NOTA INTERNA */}
        {notaInternaVisivel && (
          <div style={{
            background: 'rgba(201, 148, 58, 0.08)',
            borderTop: '2px solid #c9943a',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9943a' }}>📝 Nota Interna</div>
              <div style={{ fontSize: '11px', color: '#7a96aa' }}>— não enviada ao contato</div>
            </div>
            <textarea
              value={notaInternaTexto}
              onChange={(e) => setNotaInternaTexto(e.target.value)}
              placeholder="Digite uma nota interna para esta conversa..."
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #1e3d54',
                background: '#132636',
                color: '#e8edf2',
                fontSize: '13px',
                resize: 'vertical',
                minHeight: '60px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                (e.currentTarget as HTMLElement).style.background = 'rgba(19, 38, 54, 0.8)';
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                (e.currentTarget as HTMLElement).style.background = '#132636';
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={fecharNotaInterna}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(30, 61, 84, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarNotaInterna}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#e8b86d';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#c9943a';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                💾 Salvar Nota
              </button>
            </div>
          </div>
        )}

        {/* PAINEL DE RESPOSTAS RÁPIDAS */}
        {respostasRapidasVisivel && (
          <div style={{
            background: 'rgba(19, 38, 54, 0.9)',
            borderTop: '1px solid #1e3d54',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#c9943a' }}>⚡ Respostas Rápidas</div>
              <button
                onClick={fecharRespostasRapidas}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#7a96aa',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {respostasRapidas.map((resposta: any) => (
                <button
                  key={resposta.id}
                  onClick={() => selecionarRespostaRapida(resposta.mensagem)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #1e3d54',
                    background: 'rgba(201, 148, 58, 0.05)',
                    color: '#e8edf2',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.05)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#c9943a' }}>
                    {resposta.titulo}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#7a96aa',
                    lineHeight: '1.4',
                    whiteSpace: 'normal',
                    textAlign: 'left',
                  }}>
                    {resposta.mensagem.substring(0, 60)}
                    {resposta.mensagem.length > 60 ? '...' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
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

      {/* MODAL DE TRANSFERÊNCIA */}
      {transferirModalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            background: PREMIUM_STYLES.gradientDark,
            borderRadius: '16px',
            border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            padding: '32px',
            minWidth: '450px',
            maxHeight: '80vh',
            boxShadow: PREMIUM_STYLES.shadowXl,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto',
          }}>
            {/* HEADER PREMIUM */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: PREMIUM_STYLES.gradientPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={20} style={{ color: '#0d1f2d' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: PREMIUM_STYLES.colorText }}>
                    Transferir Ticket
                  </h3>
                  <p style={{ margin: 0, fontSize: '11px', color: PREMIUM_STYLES.colorTextSecondary, marginTop: '2px' }}>
                    Escolha um membro da equipe
                  </p>
                </div>
              </div>
              <button
                onClick={fecharTransferirModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: PREMIUM_STYLES.colorTextSecondary,
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '4px 8px',
                  transition: PREMIUM_STYLES.transitionFast,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                  (e.currentTarget as HTMLElement).style.color = PREMIUM_STYLES.colorGold;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = PREMIUM_STYLES.colorTextSecondary;
                }}
              >
                ✕
              </button>
            </div>

            {/* TRANSFERIR PARA MEMBRO PREMIUM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{
                fontSize: '11px',
                fontWeight: 700,
                color: PREMIUM_STYLES.colorGold,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                opacity: 0.9,
              }}>
                👤 Transferir para membro
              </label>
              <input
                type="text"
                placeholder="Buscar membro..."
                value={buscaMembro}
                onChange={(e) => setBuscaMembro(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
                  background: 'rgba(19, 38, 54, 0.6)',
                  color: PREMIUM_STYLES.colorText,
                  fontSize: '13px',
                  outline: 'none',
                  transition: PREMIUM_STYLES.transitionFast,
                  boxShadow: `inset 0 2px 8px rgba(0, 0, 0, 0.2)`,
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

              {/* LISTA DE MEMBROS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {membrosFiltrados.map((membro: any) => (
                  <button
                    key={membro.id}
                    onClick={() => {
                      setMembroSelecionado(membro);
                      setFilaSelecionada(null);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: membroSelecionado?.id === membro.id ? '1px solid #c9943a' : '1px solid transparent',
                      background: membroSelecionado?.id === membro.id ? 'rgba(201, 148, 58, 0.1)' : 'rgba(30, 61, 84, 0.3)',
                      color: '#e8edf2',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (membroSelecionado?.id !== membro.id) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(30, 61, 84, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (membroSelecionado?.id !== membro.id) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(30, 61, 84, 0.3)';
                      }
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2' }}>{membro.nome}</div>
                      <div style={{ fontSize: '11px', color: '#7a96aa' }}>
                        {membro.role} · {membro.tickets} tickets
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 700,
                        background: membro.status === 'online' ? 'rgba(46, 204, 113, 0.2)' : membro.status === 'ausente' ? 'rgba(243, 156, 18, 0.2)' : 'rgba(122, 150, 170, 0.2)',
                        color: membro.status === 'online' ? '#2ecc71' : membro.status === 'ausente' ? '#f39c12' : '#7a96aa',
                        textTransform: 'capitalize',
                      }}
                    >
                      {membro.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVISOR */}
            <div style={{ height: '1px', background: 'rgba(30, 61, 84, 0.5)' }} />

            {/* TRANSFERIR PARA FILA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Transferir para fila
              </label>
              <select
                value={filaSelecionada || ''}
                onChange={(e) => {
                  setFilaSelecionada(e.target.value || null);
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
                }}
              >
                <option value="">Selecionar fila...</option>
                {filas.map((fila: any) => (
                  <option key={fila.id} value={fila.nome}>
                    {fila.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* BOTÕES */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={fecharTransferirModal}
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
                Cancelar
              </button>
              <button
                onClick={transferirTicket}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#e8b86d';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#c9943a';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                Transferir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AGENDAMENTO DE MENSAGEM */}
      {agendarModalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
        }}>
          <div style={{
            background: PREMIUM_STYLES.gradientDark,
            borderRadius: '16px',
            border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            padding: '0',
            minWidth: '500px',
            maxHeight: '85vh',
            boxShadow: PREMIUM_STYLES.shadowXl,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* HEADER PREMIUM COM GRADIENT */}
            <div style={{
              background: PREMIUM_STYLES.gradientPrimary,
              padding: '20px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={24} style={{ color: '#0d1f2d' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0d1f2d' }}>
                    Novo Agendamento
                  </h3>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(13, 31, 45, 0.8)', marginTop: '2px' }}>
                    Agende uma mensagem para enviar depois
                  </p>
                </div>
              </div>
              <button
                onClick={fecharAgendarModal}
                style={{
                  background: 'rgba(13, 31, 45, 0.2)',
                  border: 'none',
                  color: '#0d1f2d',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  transition: PREMIUM_STYLES.transitionFast,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.2)';
                }}
              >
                ✕
              </button>
            </div>

            {/* CONTEÚDO */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* INFORMAÇÕES DO CONTATO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👤 Informações do Contato
              </label>
              <div style={{
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid #1e3d54',
                background: 'rgba(13, 31, 45, 0.5)',
                color: '#e8edf2',
                fontSize: '13px',
              }}>
                {conversa?.nome || 'Nenhuma conversa selecionada'}
              </div>
              <div style={{ fontSize: '11px', color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ● Digite pelo menos 3 letras para buscar contatos
              </div>
            </div>

            {/* CONEXÃO E FILA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔗 Conexão e Fila
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                    CONEXÃO *
                  </label>
                  <select
                    value={conexaoSelecionada || ''}
                    onChange={(e) => setConexaoSelecionada(e.target.value || null)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #1e3d54',
                      background: 'rgba(13, 31, 45, 0.5)',
                      color: '#e8edf2',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
                    }}
                  >
                    <option value="">Selecionar...</option>
                    {conexoesAtivas.map((conexao: any) => (
                      <option key={conexao.id} value={conexao.nome}>
                        {conexao.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                    FILA
                  </label>
                  <select
                    value={filaSelecionadaAgenda || ''}
                    onChange={(e) => setFilaSelecionadaAgenda(e.target.value || null)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #1e3d54',
                      background: 'rgba(13, 31, 45, 0.5)',
                      color: '#e8edf2',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
                    }}
                  >
                    <option value="">Fila (opcional)</option>
                    {filas.map((fila: any) => (
                      <option key={fila.id} value={fila.nome}>
                        {fila.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* MENSAGEM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💬 Mensagem
              </label>
              <textarea
                value={mensagemAgendada}
                onChange={(e) => setMensagemAgendada(e.target.value)}
                placeholder="Mensagem..."
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit',
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

            {/* DATA E HORÁRIO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🕒 Data e Horário
              </label>
              <label style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, marginBottom: '-6px', display: 'block' }}>
                DATA E HORÁRIO DO ENVIO
              </label>
              <input
                type="datetime-local"
                value={dataHoraAgendamento}
                onChange={(e) => setDataHoraAgendamento(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
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

            {/* ARQUIVO ANEXADO */}
            {arquivoAnexado && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '6px',
                background: 'rgba(46, 204, 113, 0.1)',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                color: '#2ecc71',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📎 {arquivoAnexado.name}
                </div>
                <button
                  onClick={() => setArquivoAnexado(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2ecc71',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* CONFIGURAÇÕES AVANÇADAS */}
            <details style={{ cursor: 'pointer' }}>
              <summary style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#c9943a',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0',
              }}>
                ⚙️ Configurações Avançadas
              </summary>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e3d54' }}>
                <p style={{ fontSize: '12px', color: '#7a96aa', margin: 0 }}>
                  Opções avançadas para o agendamento serão adicionadas aqui.
                </p>
              </div>
            </details>

            {/* BOTÃO ANEXAR ARQUIVO */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid #1e3d54',
                background: 'transparent',
                color: '#7a96aa',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
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
              📎 ANEXAR ARQUIVO
            </button>

            {/* HIDDEN FILE INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleAnexarArquivo}
              style={{ display: 'none' }}
            />

            {/* BOTÕES */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={fecharAgendarModal}
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
                Cancelar
              </button>
              <button
                onClick={salvarAgendamento}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#e8b86d';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#c9943a';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                Adicionar
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ADICIONAR OPORTUNIDADE */}
      {oportunidadeModalVisible && (
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
          zIndex: 10002,
        }}>
          <div style={{
            background: PREMIUM_STYLES.gradientDark,
            borderRadius: '16px',
            border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            padding: '0',
            minWidth: '520px',
            maxHeight: '90vh',
            boxShadow: PREMIUM_STYLES.shadowXl,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto',
          }}>
            {/* HEADER COM FUNDO GOLD */}
            <div style={{
              background: 'linear-gradient(135deg, #c9943a, #e8b86d)',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>💰</div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: '#0d1f2d' }}>
                    Adicionar Oportunidade
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(13, 31, 45, 0.7)' }}>
                    Preencha os dados para criar uma nova oportunidade
                  </p>
                </div>
              </div>
              <button
                onClick={fecharOportunidadeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0d1f2d',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '4px 8px',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* CONTATO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                CONTATO *
              </label>
              <select
                value={contatoOportunidade || ''}
                onChange={(e) => setContatoOportunidade(e.target.value || null)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
                }}
              >
                <option value="">Selecionar contato...</option>
                {contatosDisponiveis.map((contato: any) => (
                  <option key={contato.id} value={contato.id}>
                    {contato.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* TAGS CRM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                TAGS CRM
              </label>
              <input
                type="text"
                value={tagsOportunidade}
                onChange={(e) => setTagsOportunidade(e.target.value)}
                placeholder="Ex: lead-quente, agendamento, plano-saúde..."
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
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
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {tagsCRM.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (!tagsOportunidade.includes(tag)) {
                        setTagsOportunidade(
                          tagsOportunidade ? `${tagsOportunidade}, ${tag}` : tag
                        );
                      }
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid #1e3d54',
                      background: 'rgba(201, 148, 58, 0.1)',
                      color: '#c9943a',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* ETAPA DO FUNIL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                ETAPA DO FUNIL
              </label>
              <select
                value={etapaOportunidade || ''}
                onChange={(e) => setEtapaOportunidade(e.target.value || null)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
                }}
              >
                <option value="">Selecionar etapa...</option>
                {etapasPipeline.map((etapa: any) => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.emoji} {etapa.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* ITEM ÚNICO / MÚLTIPLOS */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setItemUnico(true)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: itemUnico ? 'none' : '1px solid #1e3d54',
                  background: itemUnico ? '#c9943a' : 'transparent',
                  color: itemUnico ? '#0d1f2d' : '#7a96aa',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flex: 1,
                }}
                onMouseEnter={(e) => {
                  if (!itemUnico) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(30, 61, 84, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!itemUnico) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                📦 ITEM ÚNICO
              </button>
              <button
                onClick={() => setItemUnico(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: !itemUnico ? 'none' : '1px solid #1e3d54',
                  background: !itemUnico ? '#c9943a' : 'transparent',
                  color: !itemUnico ? '#0d1f2d' : '#7a96aa',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flex: 1,
                }}
                onMouseEnter={(e) => {
                  if (itemUnico) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(30, 61, 84, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (itemUnico) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                📦 MÚLTIPLOS ITENS
              </button>
            </div>

            {/* PRODUTO / SERVIÇO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                PRODUTO / SERVIÇO
              </label>
              <select
                value={produtoOportunidade || ''}
                onChange={(e) => setProdutoOportunidade(e.target.value || null)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.8)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.5)';
                }}
              >
                <option value="">Selecione ou digite um produto/serviço</option>
                {produtosServicos.map((produto: any) => (
                  <option key={produto.id} value={produto.nome}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* VALOR DA OPORTUNIDADE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                VALOR DA OPORTUNIDADE
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#c9943a' }}>R$</span>
                <input
                  type="number"
                  value={valorOportunidade}
                  onChange={(e) => setValorOportunidade(e.target.value)}
                  placeholder="0"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #1e3d54',
                    background: 'rgba(13, 31, 45, 0.5)',
                    color: '#e8edf2',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.2s',
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
            </div>

            {/* INFORMAÇÕES ADICIONAIS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#c9943a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                INFORMAÇÕES ADICIONAIS
              </label>
              <textarea
                value={informacoesAdicionais}
                onChange={(e) => setInformacoesAdicionais(e.target.value)}
                placeholder="Observações sobre esta oportunidade..."
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'rgba(13, 31, 45, 0.5)',
                  color: '#e8edf2',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  resize: 'vertical',
                  minHeight: '80px',
                  fontFamily: 'inherit',
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

            {/* BOTÕES */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={fecharOportunidadeModal}
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
                Cancelar
              </button>
              <button
                onClick={salvarOportunidade}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#e8b86d';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#c9943a';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE HISTÓRICO DO TICKET */}
      {historicoVisivel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10003,
        }}>
          <div style={{
            background: PREMIUM_STYLES.gradientDark,
            borderRadius: '16px',
            border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            padding: '0',
            minWidth: '480px',
            maxHeight: '70vh',
            boxShadow: PREMIUM_STYLES.shadowXl,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* HEADER PREMIUM */}
            <div style={{
              background: PREMIUM_STYLES.gradientPrimary,
              padding: '20px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>📜</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0d1f2d' }}>
                    Histórico do Ticket
                  </h3>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(13, 31, 45, 0.8)', marginTop: '2px' }}>
                    Timeline completa de eventos
                  </p>
                </div>
              </div>
              <button
                onClick={fecharHistorico}
                style={{
                  background: 'rgba(13, 31, 45, 0.2)',
                  border: 'none',
                  color: '#0d1f2d',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  transition: PREMIUM_STYLES.transitionFast,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13, 31, 45, 0.2)';
                }}
              >
                ✕
              </button>
            </div>

            {/* CONTEÚDO */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  id: 1,
                  icon: '●',
                  cor: '#2ecc71',
                  titulo: 'Ticket criado',
                  descricao: '',
                  data: '07/04/2026 · 18:22 via WhatsApp',
                },
                {
                  id: 2,
                  icon: '●',
                  cor: '#f39c12',
                  titulo: 'Atribuído a Havila',
                  descricao: '',
                  data: '07/04/2026 · 18:25 · pelo sistema',
                },
                {
                  id: 3,
                  icon: '●',
                  cor: '#3498db',
                  titulo: 'Transferido de fila: Recepção → Comercial',
                  descricao: '',
                  data: '07/04/2026 · 18:28 · por Admin',
                },
                {
                  id: 4,
                  icon: '●',
                  cor: '#f39c12',
                  titulo: 'Etiqueta aplicada: Follow-up 1',
                  descricao: '',
                  data: '08/04/2026 · 09:30 · por Havila',
                },
                {
                  id: 5,
                  icon: '●',
                  cor: '#3498db',
                  titulo: 'Nota interna adicionada',
                  descricao: '',
                  data: '08/04/2026 · 09:35 · por Havila',
                },
              ].map((evento: any) => (
                <div key={evento.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    fontSize: '16px',
                    color: evento.cor,
                    fontWeight: 700,
                    minWidth: '20px',
                  }}>
                    {evento.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2' }}>
                      {evento.titulo}
                    </div>
                    {evento.descricao && (
                      <div style={{ fontSize: '12px', color: '#7a96aa', marginTop: '4px' }}>
                        {evento.descricao}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#7a96aa', marginTop: '4px' }}>
                      {evento.data}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      )}

      {/* PAINEL LATERAL DE INFO DO CONTATO */}
      {infoContatoVisivel && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          background: PREMIUM_STYLES.gradientDark,
          borderLeft: `2px solid ${PREMIUM_STYLES.colorGold}`,
          boxShadow: PREMIUM_STYLES.shadowXl,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10002,
          overflowY: 'auto',
        }}>
          {/* HEADER PREMIUM */}
          <div style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${PREMIUM_STYLES.colorBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(201, 148, 58, 0.05)',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: PREMIUM_STYLES.colorText }}>
                Informações
              </h3>
              <p style={{ margin: 0, fontSize: '10px', color: PREMIUM_STYLES.colorTextSecondary, marginTop: '2px' }}>
                Detalhes do contato
              </p>
            </div>
            <button
              onClick={fecharInfoContato}
              style={{
                background: 'transparent',
                border: 'none',
                color: PREMIUM_STYLES.colorTextSecondary,
                cursor: 'pointer',
                fontSize: '24px',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: PREMIUM_STYLES.transitionFast,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201, 148, 58, 0.1)';
                (e.currentTarget as HTMLElement).style.color = PREMIUM_STYLES.colorGold;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = PREMIUM_STYLES.colorTextSecondary;
              }}
            >
              ✕
            </button>
          </div>

          {/* CONTEÚDO PREMIUM AAA */}
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
            {/* PROFILE SECTION PREMIUM */}
            <div style={{
              background: 'rgba(201, 148, 58, 0.08)',
              borderRadius: '14px',
              padding: '28px 24px',
              border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: PREMIUM_STYLES.shadowMd,
            }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: PREMIUM_STYLES.colorText }}>
                  {conversa?.nome}
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: PREMIUM_STYLES.colorTextSecondary, marginTop: '6px', fontWeight: 500 }}>
                  {conversa?.canal} • ID #{conversa?.id}
                </p>
              </div>
              <button style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: `2px solid ${PREMIUM_STYLES.colorGold}`,
                background: 'transparent',
                color: PREMIUM_STYLES.colorGold,
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: PREMIUM_STYLES.transitionMedium,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = PREMIUM_STYLES.gradientPrimary;
                (e.currentTarget as HTMLElement).style.color = '#0d1f2d';
                (e.currentTarget as HTMLElement).style.borderColor = PREMIUM_STYLES.colorGoldLight;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = PREMIUM_STYLES.colorGold;
                (e.currentTarget as HTMLElement).style.borderColor = PREMIUM_STYLES.colorGold;
              }}
              >
                ✏️ Editar Contato
              </button>
            </div>

            {/* INFO CARDS PREMIUM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📞', label: 'Telefone', value: '(11) 97765-3421', highlight: true },
                { icon: '🆔', label: 'LID', value: '551197765342​1', mono: true },
                { icon: '💬', label: 'JID', value: '551197765342​1@s.whatsapp.net', mono: true },
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: item.highlight ? 'linear-gradient(135deg, rgba(201, 148, 58, 0.12), rgba(232, 184, 109, 0.08))' : 'rgba(19, 38, 54, 0.6)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  border: `1px solid ${item.highlight ? 'rgba(201, 148, 58, 0.3)' : PREMIUM_STYLES.colorBorder}`,
                  transition: PREMIUM_STYLES.transitionFast,
                  cursor: 'default',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: PREMIUM_STYLES.colorGold, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: PREMIUM_STYLES.colorText,
                    fontWeight: 600,
                    fontFamily: item.mono ? 'monospace' : 'inherit',
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* TICKET INFO CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: PREMIUM_STYLES.colorGold, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📋 Informações do Ticket
              </h4>
              {[
                { icon: '🔖', label: 'Fila', value: 'Secretária' },
                { icon: '👤', label: 'Agente', value: 'Camiliy' },
                { icon: '📅', label: 'Abertura', value: '08/04/2026' },
                { icon: '⏱️', label: 'Tempo Resposta', value: '3 min' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(19, 38, 54, 0.6)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: PREMIUM_STYLES.transitionFast,
                }}>
                  <span style={{ fontSize: '14px' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: PREMIUM_STYLES.colorTextSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '12px', color: PREMIUM_STYLES.colorText, fontWeight: 600, marginTop: '2px' }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ETIQUETAS PREMIUM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: PREMIUM_STYLES.colorGold, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🏷️ Etiquetas
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: 'WHATSAPP', color: '#3498db', bgColor: 'rgba(52, 152, 219, 0.2)' },
                  { label: 'SECRETÁRIA', color: '#9b59b6', bgColor: 'rgba(155, 89, 182, 0.2)' },
                ].map((tag, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: tag.bgColor,
                    color: tag.color,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    border: `1px solid ${tag.color}33`,
                    transition: PREMIUM_STYLES.transitionFast,
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* OBSERVAÇÕES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: PREMIUM_STYLES.colorGold, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📝 Observações
              </h4>
              <textarea
                placeholder="Adicione observações sobre este contato..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${PREMIUM_STYLES.colorBorder}`,
                  background: 'rgba(19, 38, 54, 0.6)',
                  color: PREMIUM_STYLES.colorText,
                  fontSize: '12px',
                  resize: 'vertical',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: PREMIUM_STYLES.transitionFast,
                  boxShadow: `inset 0 2px 8px rgba(0, 0, 0, 0.2)`,
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = PREMIUM_STYLES.colorGold;
                  (e.currentTarget as HTMLElement).style.background = 'rgba(19, 38, 54, 0.8)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = PREMIUM_STYLES.colorBorder;
                  (e.currentTarget as HTMLElement).style.background = 'rgba(19, 38, 54, 0.6)';
                }}
              />
            </div>

            {/* ACTION BUTTON */}
            <button style={{
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              background: PREMIUM_STYLES.gradientPrimary,
              color: '#0d1f2d',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: PREMIUM_STYLES.transitionMedium,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: PREMIUM_STYLES.shadowMd,
              width: '100%',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = PREMIUM_STYLES.shadowLg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = PREMIUM_STYLES.shadowMd;
            }}
            >
              💰 Criar Oportunidade no Pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

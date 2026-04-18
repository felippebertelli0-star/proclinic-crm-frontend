/**
 * Mock Data para a página de Conversas
 * Isolado em arquivo separado para melhor performance
 */

export const CONVERSAS_INICIAIS = [
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
];

export const GRUPOS_INICIAIS = [
  {
    id: 1001, nome: 'Grupo de Consultas', canal: 'WHATSAPP',
    data: '08/04/2026', hora: '2 min', membros: ['Dra. Andressa', 'Havila Rodrigues', 'Camiliy Nunes'],
    unread: 0, preview: 'Dra. Andressa: Reunião de planejamento...'
  },
  {
    id: 1002, nome: 'Pacientes VIP', canal: 'WHATSAPP',
    data: '08/04/2026', hora: '15 min', membros: ['Havila Rodrigues', 'Camiliy Nunes', 'Luana Silva'],
    unread: 2, preview: 'Cliente: Gostaria de agendar...'
  },
  {
    id: 1003, nome: 'Suporte Administrativo', canal: 'WHATSAPP',
    data: '08/04/2026', hora: '28 min', membros: ['Dra. Andressa', 'Luana Silva'],
    unread: 0, preview: 'Luana: Documentos enviados'
  },
];

export const MEMBROS = [
  { id: 1, nome: 'Havila Rodrigues', role: 'SDR / Atendente', tickets: 42, status: 'online' },
  { id: 2, nome: 'Camiliy Nunes', role: 'SDR / Atendente', tickets: 38, status: 'online' },
  { id: 3, nome: 'IA Hávila', role: 'Agente IA', tickets: 87, status: 'online' },
  { id: 4, nome: 'IA Camiliy', role: 'Agente IA', tickets: 61, status: 'online' },
  { id: 5, nome: 'Dra. Andressa', role: 'Médica Responsável', tickets: 0, status: 'ausente' },
  { id: 6, nome: 'Luana Silva', role: 'Recepcionista', tickets: 12, status: 'offline' },
];

export const FILAS = [
  { id: 1, nome: 'Fila Geral' },
  { id: 2, nome: 'Fila de Agendamentos' },
  { id: 3, nome: 'Fila de Suporte' },
  { id: 4, nome: 'Fila VIP' },
  { id: 5, nome: 'Fila de Retorno' },
];

export const CONEXOES_ATIVAS = [
  { id: 1, nome: 'WhatsApp Oficial', tipo: 'whatsapp', ativa: true },
  { id: 2, nome: 'Instagram DM', tipo: 'instagram', ativa: true },
  { id: 3, nome: 'Telegram', tipo: 'telegram', ativa: true },
];

export const ETAPAS_PIPELINE = [
  { id: 1, nome: 'Novo Lead', emoji: '🎯', cor: '#3498db' },
  { id: 2, nome: 'Contato Realizado', emoji: '📞', cor: '#2ecc71' },
  { id: 3, nome: 'Proposta Enviada', emoji: '📄', cor: '#f39c12' },
  { id: 4, nome: 'Negociação', emoji: '💰', cor: '#e74c3c' },
  { id: 5, nome: 'Fechado', emoji: '✅', cor: '#27ae60' },
];

export const PRODUTOS_SERVICOS = [
  { id: 1, nome: 'Consulta Inicial' },
  { id: 2, nome: 'Tratamento Básico' },
  { id: 3, nome: 'Pacote Premium' },
  { id: 4, nome: 'Acompanhamento Mensal' },
  { id: 5, nome: 'Consultoria Especial' },
];

export const TAGS_CRM = ['lead-quente', 'agendamento', 'plano-saúde', 'desconto-30', 'vip', 'retorno', 'novo-cliente'];

export const RESPOSTAS_RAPIDAS = [
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

export const MENSAGENS_PROTOTIPO = [
  { tipo: 'evento', data: '07/04/2026' },
  { tipo: 'recebida', nome: 'Sim', hora: '18:29', texto: '' },
  { tipo: 'enviada', hora: '18:30', texto: 'A transferência para a Havila já foi iniciada. Ela em breve dará continuidade ao seu atendimento. Agradeco o seu contato, Iida!' },
  { tipo: 'sistema', hora: '18:30', texto: 'Comunicação Interna — Havila executou: "status":"open","userid":204' },
  { tipo: 'evento', data: '08/04/2026' },
  { tipo: 'recebida', nome: 'Odili', hora: '09:24', texto: 'Bom dia! Tudo bem? 😊\n\nMeu nome é Havila, sou responsável pelos agendamentos da Dra. Andressa Barbarotti e a partir de agora vou cuidar do seu atendimento.' },
  { tipo: 'sistema', hora: '09:25', texto: 'Ticket devolvido para a fila da IA — humano saiu do atendimento' },
];

export const TAG_COLORS: Record<string, { bg: string; color: string }> = {
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

export const DEFAULT_TAG_COLOR = { bg: 'rgba(201, 148, 58, 0.3)', color: '#c9943a' };

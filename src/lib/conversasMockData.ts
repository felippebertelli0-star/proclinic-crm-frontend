/**
 * Mock Data para a página de Conversas
 * Isolado em arquivo separado para melhor performance
 */

export const CONVERSAS_INICIAIS = [
  // ====== ATENDENDO ======
  {
    id: 87439, nome: 'Ida Santos', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '1 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'IA ATIVA'], unread: 2, preview: 'Olá! Gostaria de agendar uma consulta...',
    assunto: 'Consulta de Rotina', ticketId: '#87439'
  },
  {
    id: 87443, nome: 'Marina Costa', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '2 min',
    origem: 'Organic', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 1, preview: 'Recebi uma indicação de uma amiga...',
    assunto: 'Primeira Consulta - Indicação', ticketId: '#87443'
  },
  {
    id: 87444, nome: 'Carlos Silva', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'Havila Rodrigues', data: '08/04/2026', hora: '3 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'RETORNO'], unread: 0, preview: 'Consegui os exames! Quando posso levar?',
    assunto: 'Resultado de Exames - Agendamento', ticketId: '#87444'
  },
  {
    id: 87445, nome: 'Ana Martins', status: 'atendendo', canal: 'INSTAGRAM',
    atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '4 min',
    origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 3, preview: 'Adorei seus resultados! Preciso de orçamento...',
    assunto: 'Orçamento - Procedimento Estético', ticketId: '#87445'
  },
  {
    id: 87446, nome: 'João Pereira', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '6 min',
    origem: 'Indicação', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 1, preview: 'Meu amigo falou muito bem de você...',
    assunto: 'Consulta Inicial - Avaliação', ticketId: '#87446'
  },
  {
    id: 87447, nome: 'Beatriz Lima', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'Havila Rodrigues', data: '08/04/2026', hora: '8 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 0, preview: 'Gostaria de saber mais sobre o procedimento...',
    assunto: 'Procedimento: Clareamento Dental', ticketId: '#87447'
  },
  {
    id: 87448, nome: 'Lucas Ferreira', status: 'atendendo', canal: 'INSTAGRAM',
    atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '10 min',
    origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 2, preview: 'Encontrei seu perfil e achei incrível!',
    assunto: 'Consulta: Avaliação de Implante', ticketId: '#87448'
  },
  {
    id: 87449, nome: 'Fernanda Alves', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'Camiliy Nunes', data: '08/04/2026', hora: '12 min',
    origem: 'Indicação', tags: ['WHATSAPP', 'RETORNO'], unread: 1, preview: 'Preciso remarcar minha consulta, pode ser?',
    assunto: 'Reagendamento: Retorno Programa', ticketId: '#87449'
  },
  {
    id: 87450, nome: 'Gustavo Mendes', status: 'atendendo', canal: 'WHATSAPP',
    atribuidoA: 'IA - WhatsApp', data: '08/04/2026', hora: '14 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 3, preview: 'Qual é o preço da limpeza profissional?',
    assunto: 'Limpeza Profissional: Orçamento', ticketId: '#87450'
  },
  // ====== AGUARDANDO ======
  {
    id: 87440, nome: 'Sandra Oliveira', status: 'aguardando', canal: 'WHATSAPP',
    atribuidoA: 'Fila Geral', data: '08/04/2026', hora: '5 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'NOVO LEAD', 'IA ATIVA'], unread: 1, preview: 'Qual é o valor da consulta inicial?',
    assunto: 'Dúvida sobre Valores e Agendamento', ticketId: '#87440'
  },
  {
    id: 87441, nome: 'Patricia Mendes', status: 'aguardando', canal: 'WHATSAPP',
    atribuidoA: 'Fila de Retorno', data: '08/04/2026', hora: '12 min',
    origem: 'Indicação', tags: ['WHATSAPP', 'RETORNO'], unread: 2, preview: 'Fui paciente há 2 anos, quero marcar retorno...',
    assunto: 'Retorno: Acompanhamento Pós-Procedimento', ticketId: '#87441'
  },
  {
    id: 87442, nome: 'Roberta Lima', status: 'aguardando', canal: 'INSTAGRAM',
    atribuidoA: 'Fila de Suporte', data: '08/04/2026', hora: '25 min',
    origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 3, preview: 'Gostaria de saber sobre parcelamento...',
    assunto: 'Informações sobre Plano de Saúde', ticketId: '#87442'
  },
  {
    id: 87451, nome: 'Mariana Souza', status: 'aguardando', canal: 'WHATSAPP',
    atribuidoA: 'Fila Geral', data: '08/04/2026', hora: '30 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 1, preview: 'Tenho medo de agulha, pode fazer sem?',
    assunto: 'Dúvida: Procedimento sem Anestesia', ticketId: '#87451'
  },
  {
    id: 87452, nome: 'Rafael Costa', status: 'aguardando', canal: 'WHATSAPP',
    atribuidoA: 'Fila de Retorno', data: '08/04/2026', hora: '35 min',
    origem: 'Indicação', tags: ['WHATSAPP', 'RETORNO'], unread: 0, preview: 'Fui atendido há 3 meses, como vai meu caso?',
    assunto: 'Acompanhamento: Pós-Procedimento', ticketId: '#87452'
  },
  {
    id: 87453, nome: 'Juliana Rocha', status: 'aguardando', canal: 'INSTAGRAM',
    atribuidoA: 'Fila Geral', data: '08/04/2026', hora: '40 min',
    origem: 'Instagram Orgânico', tags: ['INSTAGRAM', 'ORÇAMENTO'], unread: 2, preview: 'Adorei o resultado da Ana Martins, quero também!',
    assunto: 'Orçamento: Mesmo Procedimento', ticketId: '#87453'
  },
  {
    id: 87454, nome: 'Pedro Oliveira', status: 'aguardando', canal: 'WHATSAPP',
    atribuidoA: 'Fila de Suporte', data: '08/04/2026', hora: '45 min',
    origem: 'Trafego Pago', tags: ['WHATSAPP', 'NOVO LEAD'], unread: 1, preview: 'Quantas sessões são necessárias?',
    assunto: 'Informação: Número de Sessões', ticketId: '#87454'
  },
];

export const GRUPOS_INICIAIS = [
  {
    id: 1001, nome: 'Grupo de Consultas', canal: 'WHATSAPP',
    data: '08/04/2026', hora: '2 min', membros: ['Dra. Andressa', 'Havila Rodrigues', 'Camiliy Nunes'],
    unread: 0, preview: 'Dra. Andressa: Alguém pode confirmar agenda de quarta?',
    assunto: 'Discussão: Confirmação de Agendas da Semana', ticketId: '#1001'
  },
  {
    id: 1002, nome: 'Pacientes VIP', canal: 'WHATSAPP',
    data: '08/04/2026', hora: '15 min', membros: ['Havila Rodrigues', 'Camiliy Nunes', 'Luana Silva'],
    unread: 1, preview: 'Cliente Vanessa: Gostaria de agendar tratamento VIP...',
    assunto: 'Atendimento VIP: Novo Cliente Premium', ticketId: '#1002'
  },
  {
    id: 1003, nome: 'Suporte Administrativo', canal: 'WHATSAPP',
    data: '08/04/2026', hora: '28 min', membros: ['Dra. Andressa', 'Luana Silva'],
    unread: 0, preview: 'Luana: Todos os documentos estão na pasta compartilhada',
    assunto: 'Documentação: Arquivos para Auditoria', ticketId: '#1003'
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

// ============ MENSAGENS POR CONVERSA ============
// Mapeia cada ID de conversa para suas mensagens específicas
export const CONVERSAS_MESSAGES: Record<number, any[]> = {
  // Ida Santos - Consulta de Rotina
  87439: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '14:32', texto: 'Olá! Gostaria de agendar uma consulta de rotina com a Dra. Andressa.' },
    { tipo: 'enviada', hora: '14:33', texto: 'Olá Ida! Bem-vindo(a) à Clínica Dra. Andressa Barbarotti 😊\n\nFicarei feliz em ajudar com seu agendamento. Que tipo de consulta você procura?' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '14:35', texto: 'Consulta de rotina mesmo, não é nada grave. Já sou paciente há alguns anos.' },
    { tipo: 'enviada', hora: '14:36', texto: 'Ótimo! Temos disponibilidade nos seguintes horários:\n📅 Segunda a sexta: 8h às 18h\n📅 Sábado: 8h às 12h\n\nQual hora melhor para você?' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '14:38', texto: 'Preferira segunda de manhã, tipo 9h30' },
    { tipo: 'enviada', hora: '14:39', texto: 'Perfeito! 🎯\n\n📅 Segunda-feira, 11 de Abril de 2026\n⏰ 09:30\n👨‍⚕️ Dra. Andressa Barbarotti\n\nSua consulta foi confirmada! Aguardamos você!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '14:45', texto: 'Obrigada! Estou com muito entusiasmo para essa consulta. Há quanto tempo vocês estão nesse ramo?' },
    { tipo: 'enviada', hora: '14:46', texto: 'Que legal sua entusiasmo! A Clínica Dra. Andressa está no mercado há mais de 15 anos, com excelentes resultados e avaliações!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '14:48', texto: 'Que bom! Tenho uma dúvida: preciso levar algo especial para a consulta?' },
    { tipo: 'enviada', hora: '14:49', texto: 'Ótima pergunta! Traga:\n📋 Documento de identidade\n🏥 Cartão do plano de saúde (se tiver)\n📱 Seu histórico médico se tiver\n\nE chegue 10 minutos antes!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '14:52', texto: 'Tudo bem! Outra dúvida: qual é o tempo de duração dessa consulta?' },
    { tipo: 'enviada', hora: '14:53', texto: 'A primeira consulta dura em média 30-45 minutos. A Dra. Andressa é muito dedicada e quer conhecer bem cada paciente!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '15:00', texto: 'Perfeito! Estou muito ansioso mesmo. Como funciona o agendamento de próximas consultas?' },
    { tipo: 'enviada', hora: '15:01', texto: 'Após a consulta, você agenda diretamente com nossa recepção ou pode fazer pelo WhatsApp. Oferecemos pacotes com desconto para múltiplas sessões!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '15:05', texto: 'Certo! E sobre pagamento, vocês aceitam cartão?' },
    { tipo: 'enviada', hora: '15:06', texto: 'Claro! Aceitamos:\n💳 Cartão crédito/débito\n🏦 Pix\n💰 Dinheiro\n📋 Parcelado em até 12x no crédito\n🏥 Plano de saúde\n\nFique à vontade para perguntar!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '15:10', texto: 'Excelente! Vocês são muito atenciosos mesmo. Vou chegar um pouco antes para conferir tudo' },
    { tipo: 'enviada', hora: '15:11', texto: 'Adoramos sua disposição! Nos vemos segunda então! Qualquer dúvida de última hora, é só avisar por aqui. Sucesso! 🌟' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '15:15', texto: 'Vocês são incríveis! Muito obrigada mesmo pela atenção de vocês. Até segunda!' },
    { tipo: 'enviada', hora: '15:16', texto: 'Por nada! É nosso prazer ajudar. Até segunda-feira, Ida! Que tenha um ótimo fim de semana! 😊' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:00', texto: 'Oi! Esqueci de perguntar, qual é a política de cancelamento de consultas?' },
    { tipo: 'enviada', hora: '16:01', texto: 'Ótima pergunta! Nossa política:\n\n❌ Cancelamento até 24h antes = sem multa\n⚠️ Menos de 24h = taxa de 50%\n\nQuestões médicas são exceção!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:05', texto: 'Entendido! E vocês oferecem pacotes de tratamento contínuo?' },
    { tipo: 'enviada', hora: '16:06', texto: 'SIM! Oferecemos:\n\n📦 Pacote 3 sessões - 10% desconto\n📦 Pacote 6 sessões - 20% desconto\n📦 Pacote 12 sessões - 30% desconto\n\nMuito melhor negócio!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:10', texto: 'Que legal! Vou considerar isso após a primeira consulta' },
    { tipo: 'enviada', hora: '16:11', texto: 'Ótimo! A Dra. Andressa vai dar recomendações personalizadas pra você!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:15', texto: 'Ainda tenho uma dúvida: qual é o tempo de espera para agendar?' },
    { tipo: 'enviada', hora: '16:16', texto: 'Boa pergunta! Temos:\n\n⏱️ Atendimento emergencial: 24-48h\n⏱️ Consulta regular: 3-7 dias\n⏱️ Procedimentos: 1-2 semanas\n\nDepende da disponibilidade!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:20', texto: 'Perfeito! Estou muito satisfeita com o atendimento' },
    { tipo: 'enviada', hora: '16:21', texto: 'Fico feliz! Seu bem-estar é nossa prioridade número 1!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:25', texto: 'Uma última pergunta: vocês têm estacionamento?' },
    { tipo: 'enviada', hora: '16:26', texto: 'SIM! Temos estacionamento próprio coberto para pacientes com 1h gratuita na consulta!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:30', texto: 'Excelente! Agora tenho certeza que vou amar ser paciente de vocês' },
    { tipo: 'enviada', hora: '16:31', texto: 'Adoramos ter você conosco! Vamos cuidar muito bem de você!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:35', texto: 'Vocês também oferecem consultas online?' },
    { tipo: 'enviada', hora: '16:36', texto: 'Ótima pergunta! Sim, oferecemos:\n\n💻 Consulta Online: R$ 150,00\n🏥 Presencial: R$ 250,00\n\nEscolha a que preferir!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:40', texto: 'Que bom! Vou fazer presencial mesmo para a primeira' },
    { tipo: 'enviada', hora: '16:41', texto: 'Perfeito! Presencial é melhor mesmo pra primeira avaliação!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:45', texto: 'Tá tudo certo então! Obrigada de novo, vocês foram incríveis!' },
    { tipo: 'enviada', hora: '16:46', texto: 'De nada, Ida! Estamos aqui pra você! Até segunda-feira! 🌟' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:50', texto: 'Qual é o endereço completo para eu ir conferindo a localização?' },
    { tipo: 'enviada', hora: '16:51', texto: 'Claro!\n\n📍 Clínica Dra. Andressa Barbarotti\nRua das Flores, 123 - Centro\nPróximo ao Metro Flores\n📞 (11) 9999-9999' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '16:55', texto: 'Perfeito! Já achei a localização no mapa. Fica perto de casa!' },
    { tipo: 'enviada', hora: '16:56', texto: 'Que sorte! Vai ser bem prático pra você então!' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '17:00', texto: 'Definitivamente vou amar ser atendida por vocês!' },
    { tipo: 'enviada', hora: '17:01', texto: 'Nos vemos segunda! Bora cuidar da sua saúde! 💪' },
    { tipo: 'recebida', nome: 'Ida Santos', hora: '17:05', texto: 'Até lá! Muito obrigada mesmo por toda atenção!' },
    { tipo: 'enviada', hora: '17:06', texto: 'Sempre! Qualquer coisa, é só chamar! Abraços! 🤗' },
  ],
  // Marina Costa - Indicação
  87443: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Marina Costa', hora: '15:12', texto: 'Oi! Recebi uma indicação de uma amiga que fez tratamento com você e gostei muito dos resultados!' },
    { tipo: 'enviada', hora: '15:13', texto: 'Marina! Que legal saber que você conhece uma de nossas pacientes! 🎉\n\nFicarei feliz em te conhecer e esclarecer qualquer dúvida.' },
    { tipo: 'recebida', nome: 'Marina Costa', hora: '15:15', texto: 'Sim! É a Carol. Ela falou muito bem de você. Eu estou pensando em fazer um procedimento estético também.' },
    { tipo: 'enviada', hora: '15:16', texto: 'Que maravilha! A Carol é uma paciente incrível!\n\nPara o procedimento estético, gostaria que você comparecesse para uma avaliação inicial gratuita. Qual sua disponibilidade?' },
    { tipo: 'recebida', nome: 'Marina Costa', hora: '15:20', texto: 'Posso ir amanhã à tarde? Tipo 16h?' },
    { tipo: 'enviada', hora: '15:21', texto: 'Amanhã 16h está perfeito!\n\nNos vemos em breve! Dica: leve documento de identidade e uma foto de rosto frontal se tiver.' },
  ],
  // Carlos Silva - Resultado de Exames
  87444: [
    { tipo: 'evento', data: '06/04/2026' },
    { tipo: 'enviada', hora: '10:00', texto: 'Carlos! Sua consulta está marcada para o dia 12 de Abril. Os exames estão pendentes. Você consegue fazer antes?' },
    { tipo: 'recebida', nome: 'Carlos Silva', hora: '16:45', texto: 'Oi Havila! Consegui fazer os exames ontem. Quando posso levar os resultados?' },
    { tipo: 'enviada', hora: '16:46', texto: 'Ótimo, Carlos!\n\nVocê pode trazer os exames diretamente na consulta do dia 12, ou se preferir, pode enviar as fotos por aqui.' },
    { tipo: 'recebida', nome: 'Carlos Silva', hora: '16:48', texto: 'Vou trazer na consulta mesmo. Já tem lugar pra mim?' },
    { tipo: 'sistema', hora: '16:48', texto: 'Transferido para atendente: Havila Rodrigues' },
    { tipo: 'enviada', nome: 'Havila', hora: '16:50', texto: 'Claro, Carlos! Sua vaga está reservada.\n\nConfirme a consulta respondendo "SIM" quando estiver próximo.' },
  ],
  // Ana Martins - Orçamento
  87445: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Ana Martins', hora: '17:20', texto: 'Adorei os resultados que vocês compartilharam no Instagram! Gostaria de saber o preço de um procedimento.' },
    { tipo: 'enviada', hora: '17:21', texto: 'Ana! Que feliz em saber que você adorou nossos resultados!\n\nPoderia me passar mais detalhes? Qual procedimento te interessou?' },
    { tipo: 'recebida', nome: 'Ana Martins', hora: '17:25', texto: 'O de limpeza profunda com laser. Quanto custa?' },
    { tipo: 'enviada', hora: '17:26', texto: 'Procedimento excelente!\n\nO valor é R$ 450,00 na primeira sessão. Oferecemos pacotes com 3 ou 5 sessões com desconto.\n\nGostaria de agendar uma avaliação gratuita?' },
    { tipo: 'recebida', nome: 'Ana Martins', hora: '17:28', texto: 'Sim! Qual é seu valor de 3 sessões?' },
    { tipo: 'enviada', hora: '17:29', texto: 'Ótimo! 3 sessões saem por R$ 1.200,00 (desconto de 11%).\n\nParcelamos em até 3x sem juros.\n\nQual data você prefere?' },
  ],
  // João Pereira - Novo Lead
  87446: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'João Pereira', hora: '13:45', texto: 'Oi! Meu amigo Pedro falou que você faz um ótimo trabalho. Eu queria consultar, mas tenho várias dúvidas antes.' },
    { tipo: 'enviada', hora: '13:46', texto: 'João! Que bom ouvir uma indicação do Pedro!\n\nSou a IA assistente. Pode me fazer todas as perguntas que tiver, terei prazer em responder!' },
    { tipo: 'recebida', nome: 'João Pereira', hora: '13:50', texto: 'Vocês aceitam plano de saúde? E qual é o valor da primeira consulta?' },
    { tipo: 'enviada', hora: '13:51', texto: 'Ótimas perguntas!\n\nAceitamos SIM planos de saúde (verifique cobertura)\nConsulta inicial: R$ 250,00\nParcelamos em até 2x\n\nTem mais alguma dúvida?' },
    { tipo: 'recebida', nome: 'João Pereira', hora: '13:55', texto: 'Tá bom! Pode marcar para mim então? Prefiro segunda ou terça de tarde' },
    { tipo: 'sistema', hora: '13:55', texto: 'Transferido para atendente: IA - WhatsApp' },
    { tipo: 'enviada', hora: '13:56', texto: 'Perfeito! Segunda temos 14h ou 15h. Qual você prefere?' },
  ],
  // Sandra Oliveira - Aguardando (Dúvida sobre Valores)
  87440: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Sandra Oliveira', hora: '12:30', texto: 'Olá! Qual é o valor da consulta inicial com a Dra. Andressa?' },
    { tipo: 'enviada', hora: '12:31', texto: 'Olá Sandra!\n\nConsulta Inicial com Dra. Andressa: R$ 350,00\n\nGostaria de agendar?' },
    { tipo: 'recebida', nome: 'Sandra Oliveira', hora: '12:35', texto: 'Sim! Mas preciso saber se vocês aceitam plano de saúde também. Tenho Unimed.' },
    { tipo: 'enviada', hora: '12:36', texto: 'Ótimo! A Unimed temos convênio!\n\nVocê pagaria apenas a diferença se houver, ou nada se cobrir 100%.\n\nQual dia você prefere?' },
    { tipo: 'recebida', nome: 'Sandra Oliveira', hora: '12:40', texto: 'Vocês têm disponibilidade para sexta à noite? Saio do trabalho por volta das 18h' },
  ],
  // Patricia Mendes - Retorno
  87441: [
    { tipo: 'evento', data: '04/04/2026' },
    { tipo: 'recebida', nome: 'Patricia Mendes', hora: '10:15', texto: 'Oi Havila! Fui paciente aí há 2 anos. Gostaria de marcar um retorno para acompanhamento.' },
    { tipo: 'enviada', hora: '10:16', texto: 'Patricia! Que alegria saber de você!\n\nCom prazer vamos agendar seu retorno. Como foi sua experiência conosco?' },
    { tipo: 'recebida', nome: 'Patricia Mendes', hora: '10:20', texto: 'Adorei! O resultado foi excelente. Agora preciso de um acompanhamento pós-procedimento.' },
    { tipo: 'enviada', hora: '10:21', texto: 'Que maravilha ouvir isso!\n\nAcompanhamento Pós-Procedimento: R$ 180,00\n\nQual é sua disponibilidade?' },
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Patricia Mendes', hora: '14:45', texto: 'Oi, voltei a pensar... Qual horário tem de terça de manhã? Prefiro cedo.' },
  ],
  // Roberta Lima - Plano de Saúde
  87442: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'recebida', nome: 'Roberta Lima', hora: '16:00', texto: 'Oi! Tenho uma dúvida: vocês aceitam plano de saúde? Qual é a cobertura?' },
    { tipo: 'enviada', hora: '16:01', texto: 'Olá Roberta!\n\nSim! Aceitamos os principais planos de saúde:\nUnimed\nBradesco Saúde\nSulamericana\nSeguros e Previdência\n\nQual é o seu plano?' },
    { tipo: 'recebida', nome: 'Roberta Lima', hora: '16:05', texto: 'Tenho Bradesco. Como funciona o pagamento então?' },
    { tipo: 'enviada', hora: '16:06', texto: 'Com Bradesco é assim:\n\n1. Você paga conosco na consulta\n2. A Bradesco reembolsa você depois\n\nOu você pode enviar seus dados pra gente solicitar pré-autorização ao plano.\n\nTem interesse?' },
    { tipo: 'recebida', nome: 'Roberta Lima', hora: '16:10', texto: 'Entendi! E qual é o valor então?' },
  ],
  // GRUPOS
  1001: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'sistema', hora: '10:30', texto: 'Dra. Andressa adicionada ao grupo' },
    { tipo: 'enviada', nome: 'Dra. Andressa', hora: '10:31', texto: 'Bom dia a todos! Como está a confirmação de consultas para esta semana?' },
    { tipo: 'recebida', nome: 'Havila Rodrigues', hora: '10:33', texto: 'Dra, temos 12 confirmadas de manhã e 8 à tarde para segunda' },
    { tipo: 'recebida', nome: 'Camiliy Nunes', hora: '10:35', texto: 'E terça temos 10 de manhã, 9 à tarde. Uma delas está com dúvida sobre plano de saúde' },
    { tipo: 'enviada', nome: 'Dra. Andressa', hora: '10:37', texto: 'Excelente! Confirmar com a paciente qual é o plano e fazer a autorização necessária.' },
  ],
  1002: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'sistema', hora: '09:00', texto: 'Luana Silva adicionada ao grupo' },
    { tipo: 'enviada', nome: 'Cliente Vanessa', hora: '09:15', texto: 'Oi pessoal! Eu gostaria de fazer aquele procedimento premium que vocês anunciaram.' },
    { tipo: 'recebida', nome: 'Havila Rodrigues', hora: '09:16', texto: 'Vanessa! Que legal! Que procedimento exatamente?' },
    { tipo: 'enviada', nome: 'Cliente Vanessa', hora: '09:20', texto: 'Aquele pacote completo de rejuvenescimento facial que saiu na promoção VIP. Quanto custa?' },
    { tipo: 'recebida', nome: 'Camiliy Nunes', hora: '09:22', texto: 'Vanessa, esse pacote é exclusivo! São 5 sessões especializadas por R$ 2.500,00. Quer agendar?' },
  ],
  1003: [
    { tipo: 'evento', data: '08/04/2026' },
    { tipo: 'sistema', hora: '14:00', texto: 'Luana Silva criou este grupo' },
    { tipo: 'enviada', nome: 'Luana Silva', hora: '14:05', texto: 'Pessoal, avisando que todos os documentos para auditoria foram enviados à pasta compartilhada.' },
    { tipo: 'recebida', nome: 'Dra. Andressa', hora: '14:10', texto: 'Obrigada Luana! Recebi e revisei tudo. Está perfeito!' },
    { tipo: 'enviada', nome: 'Luana Silva', hora: '14:15', texto: 'Perfeito! A auditoria está marcada para próxima segunda. Alguém quer revisar de novo antes?' },
  ],
};

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

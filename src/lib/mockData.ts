/**
 * Mock Data para ProClinic CRM
 * Dados realistas para teste e desenvolvimento
 * Qualidade: Premium AAA
 */

import {
  UsuarioExpandido,
  Conversa,
  Contato,
  ConfiguracaoNotificacoes,
  ConfiguracaoSeguranca,
  ConfiguracaoIntegracao,
  ConfiguracaoEquipe,
} from '@/types';
import { obterEstrategiasSalvas } from './estrategias-salvas';

// ============================================================================
// UTILITÁRIOS
// ============================================================================

const gerarId = () => Math.random().toString(36).substring(2, 11);

const dataAleatoriaUltimo30Dias = (): string => {
  const agora = new Date();
  const dias = Math.floor(Math.random() * 30);
  agora.setDate(agora.getDate() - dias);
  return agora.toISOString();
};

const dataAleatoriaUltimoAno = (): string => {
  const agora = new Date();
  const dias = Math.floor(Math.random() * 365);
  agora.setDate(agora.getDate() - dias);
  return agora.toISOString();
};

// ============================================================================
// NOMES E DADOS BRASILEIROS
// ============================================================================

const nomesBrasileiros = [
  'Ana Silva',
  'Bruno Costa',
  'Carlos Oliveira',
  'Daniela Ferreira',
  'Eduardo Santos',
  'Fernanda Rodrigues',
  'Gustavo Martins',
  'Helena Gomes',
  'Igor Pereira',
  'Julia Alves',
  'Karina Ribeiro',
  'Leonardo Barbosa',
  'Marina Carvalho',
  'Nícolas Monteiro',
  'Olivia Nunes',
];

const empresasBrasileiras = [
  'Accenture Brasil',
  'Bradesco',
  'BNDES',
  'Caixa Econômica',
  'Natura Cosméticos',
  'Petrobras',
  'Ultragaz',
  'Vale',
  'Vivo/Telefonica',
  'Rede Globo',
  'JBS',
  'Embraer',
  'Marfrig',
  'Banco do Brasil',
  'Itaú Unibanco',
];

const emailsDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

const gerarEmail = (nome: string, domain?: string): string => {
  const partes = nome.toLowerCase().split(' ');
  const email = partes[0] + '.' + (partes[1] || partes[0]);
  const domain2 = domain || emailsDomains[Math.floor(Math.random() * emailsDomains.length)];
  return email + '@' + domain2;
};

const gerarTelefone = (): string => {
  const ddd = String(Math.floor(Math.random() * 89) + 11).padStart(2, '0');
  const numero = String(Math.floor(Math.random() * 900000000) + 100000000).padStart(9, '0');
  return `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`;
};

// ============================================================================
// USUARIOS
// ============================================================================

export const mockUsuarios: UsuarioExpandido[] = [
  ...nomesBrasileiros.map((nome, index): UsuarioExpandido => ({
    id: gerarId(),
    nome,
    email: gerarEmail(nome),
    avatar: `https://i.pravatar.cc/150?img=${index}`,
    tipo: index === 0 ? 'admin' : 'usuario',
    sistemaId: 'clinic-001',
    ativo: Math.random() > 0.2,
    criadoEm: dataAleatoriaUltimoAno(),
    atualizadoEm: dataAleatoriaUltimo30Dias(),
    ultimoAcesso: Math.random() > 0.3 ? dataAleatoriaUltimo30Dias() : undefined,
  })),
];

// ============================================================================
// CONVERSAS
// ============================================================================

const titulosConversa = [
  'Agendamento de consulta - Dr. João',
  'Dúvida sobre tratamento dentário',
  'Seguimento pós-operatório',
  'Solicitação de receita',
  'Informações sobre plano de saúde',
  'Cancelamento de agendamento',
  'Consulta online solicitada',
  'Problema com faturamento',
  'Feedback sobre atendimento',
  'Orientações pré-operatório',
  'Renovação de prescrição',
  'Consulta de rotina marcada',
];

export const mockConversas: Conversa[] = Array.from({ length: 12 }, (_, index) => ({
  id: gerarId(),
  sistemaId: 'clinic-001',
  titulo: titulosConversa[index],
  descricao: 'Conversa com paciente',
  status: ['ativa', 'fechada', 'aguardando'][Math.floor(Math.random() * 3)] as any,
  nMensagens: Math.floor(Math.random() * 50) + 5,
  ultimaMensagem: `Última mensagem às ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
  criadoEm: dataAleatoriaUltimo30Dias(),
  atualizadoEm: dataAleatoriaUltimo30Dias(),
  agente: mockUsuarios[Math.floor(Math.random() * 5)]?.nome,
  cliente: nomesBrasileiros[Math.floor(Math.random() * nomesBrasileiros.length)],
}));

// ============================================================================
// CONTATOS
// ============================================================================

const tags = ['Paciente', 'Referência', 'Segurador', 'Fornecedor', 'Especialista', 'VIP'];

export const mockContatos: Contato[] = Array.from({ length: 20 }, (_, index) => {
  const nome = nomesBrasileiros[index % nomesBrasileiros.length];
  const empresa = empresasBrasileiras[Math.floor(Math.random() * empresasBrasileiras.length)];

  return {
    id: gerarId(),
    sistemaId: 'clinic-001',
    nome,
    email: gerarEmail(nome, 'example.com'),
    telefone: gerarTelefone(),
    empresa,
    status: ['ativo', 'inativo', 'suspenso'][Math.floor(Math.random() * 3)] as any,
    tags: [tags[Math.floor(Math.random() * tags.length)]],
    notas: `Paciente com histórico de ${Math.random() > 0.5 ? 'consultas regulares' : 'problemas de agendamento'}`,
    criadoEm: dataAleatoriaUltimoAno(),
    atualizadoEm: dataAleatoriaUltimo30Dias(),
    ultimoContato: dataAleatoriaUltimo30Dias(),
  };
});

// ============================================================================
// PAGAMENTOS
// ============================================================================

export const mockPagamentos = Array.from({ length: 25 }, (_, index) => ({
  id: `PAG-${String(index + 1).padStart(5, '0')}`,
  sistemaId: 'clinic-001',
  tipo: 'consulta',
  metodo: ['cartao', 'pix', 'boleto'][Math.floor(Math.random() * 3)],
  valor: Math.floor(Math.random() * 500) * 10 + 100,
  moeda: 'BRL',
  status: ['confirmado', 'pendente', 'falhou', 'reembolsado'][
    Math.floor(Math.random() * 4)
  ],
  descricao: `Consulta - ${nomesBrasileiros[Math.floor(Math.random() * nomesBrasileiros.length)]}`,
  referenciaExterna: `REF-${gerarId().toUpperCase()}`,
  criadoEm: dataAleatoriaUltimo30Dias(),
  atualizadoEm: dataAleatoriaUltimo30Dias(),
}));

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

export const mockConfiguracaoNotificacoes: ConfiguracaoNotificacoes = {
  id: gerarId(),
  tipo: 'notificacoes',
  emailNotificacoes: true,
  smsNotificacoes: true,
  pushNotificacoes: false,
  notificacoesMarketing: false,
  frequencia: 'imediata',
};

export const mockConfiguracaoSeguranca: ConfiguracaoSeguranca = {
  id: gerarId(),
  tipo: 'seguranca',
  autenticacaoDoisFatores: false,
  ultimaAlteracaoSenha: dataAleatoriaUltimo30Dias(),
  sessoesAtivas: 3,
  loginRecentes: [
    {
      data: new Date().toISOString(),
      localizacao: 'São Paulo, SP',
      dispositivo: 'MacBook Pro - Safari',
    },
    {
      data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      localizacao: 'São Paulo, SP',
      dispositivo: 'iPhone 14 Pro - Safari',
    },
    {
      data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      localizacao: 'Rio de Janeiro, RJ',
      dispositivo: 'Windows Desktop - Chrome',
    },
  ],
};

export const mockConfiguracaoIntegracao: ConfiguracaoIntegracao = {
  id: gerarId(),
  tipo: 'integracao',
  webhooks: [
    {
      id: gerarId(),
      url: 'https://api.example.com/webhooks/pagamentos',
      eventos: ['pagamento.confirmado', 'pagamento.falhou'],
      ativa: true,
    },
    {
      id: gerarId(),
      url: 'https://api.example.com/webhooks/conversas',
      eventos: ['conversa.nova', 'conversa.fechada'],
      ativa: true,
    },
  ],
  apiKeys: [
    {
      id: gerarId(),
      nome: 'Chave de Produção',
      ativa: true,
      criadoEm: dataAleatoriaUltimoAno(),
    },
    {
      id: gerarId(),
      nome: 'Chave de Desenvolvimento',
      ativa: true,
      criadoEm: dataAleatoriaUltimo30Dias(),
    },
  ],
};

export const mockConfiguracaoEquipe: ConfiguracaoEquipe = {
  id: gerarId(),
  tipo: 'equipe',
  membros: mockUsuarios.slice(0, 5).map((user) => ({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.tipo === 'admin' ? 'admin' : ['manager', 'agente', 'visualizador'][
      Math.floor(Math.random() * 3)
    ] as any,
    ativo: user.ativo,
  })),
  convitesPendentes: [
    {
      email: 'novo.agente@example.com',
      role: 'agente',
      enviadoEm: dataAleatoriaUltimo30Dias(),
    },
  ],
};

// ============================================================================
// HELPER: Filtrar dados
// ============================================================================

export const filtrarUsuarios = (
  termo: string,
): UsuarioExpandido[] => {
  const termoBaixo = termo.toLowerCase();
  return mockUsuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(termoBaixo) ||
      u.email.toLowerCase().includes(termoBaixo),
  );
};

export const filtrarConversas = (
  termo: string,
  status?: string,
): Conversa[] => {
  const termoBaixo = termo.toLowerCase();
  return mockConversas.filter(
    (c) =>
      (c.titulo.toLowerCase().includes(termoBaixo) ||
        c.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!status || c.status === status),
  );
};

export const filtrarContatos = (
  termo: string,
  status?: string,
): Contato[] => {
  const termoBaixo = termo.toLowerCase();
  return mockContatos.filter(
    (c) =>
      (c.nome.toLowerCase().includes(termoBaixo) ||
        c.email.toLowerCase().includes(termoBaixo) ||
        c.telefone?.includes(termo) ||
        c.empresa?.toLowerCase().includes(termoBaixo)) &&
      (!status || c.status === status),
  );
};

export const filtrarPagamentos = (
  termo: string,
  status?: string,
): typeof mockPagamentos => {
  const termoBaixo = termo.toLowerCase();
  return mockPagamentos.filter(
    (p) =>
      (p.id.toLowerCase().includes(termoBaixo) ||
        p.descricao.toLowerCase().includes(termoBaixo)) &&
      (!status || p.status === status),
  );
};

// ============================================================================
// HELPER: Paginação
// ============================================================================

export interface PaginacaoParams {
  limit: number;
  offset: number;
}

export const paginar = <T,>(items: T[], limit: number, offset: number) => {
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
    limit,
    offset,
  };
};

// ============================================================================
// FORMATADORES
// ============================================================================

export const formatarMoeda = (valor: number, moeda: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: moeda,
  }).format(valor);
};

export const formatarData = (data: string | Date): string => {
  const d = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatarDataCurta = (data: string | Date): string => {
  const d = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

export const obterCorStatus = (status: string): string => {
  const cores: Record<string, string> = {
    // Conversas
    ativa: 'bg-green-950 text-green-300 border border-green-800',
    fechada: 'bg-slate-700 text-slate-300 border border-slate-600',
    aguardando: 'bg-orange-950 text-orange-300 border border-orange-700',

    // Contatos
    ativo: 'bg-green-950 text-green-300 border border-green-800',
    inativo: 'bg-slate-700 text-slate-300 border border-slate-600',
    suspenso: 'bg-red-950 text-red-300 border border-red-800',

    // Pagamentos
    confirmado: 'bg-green-950 text-green-300 border border-green-800',
    pendente: 'bg-orange-950 text-orange-300 border border-orange-700',
    falhou: 'bg-red-950 text-red-300 border border-red-800',
    reembolsado: 'bg-purple-950 text-purple-300 border border-purple-800',
  };

  return cores[status] || 'bg-slate-700 text-slate-300 border border-slate-600';
};

export const obterLabelStatus = (status: string): string => {
  const labels: Record<string, string> = {
    ativa: 'Ativa',
    fechada: 'Fechada',
    aguardando: 'Aguardando',
    ativo: 'Ativo',
    inativo: 'Inativo',
    suspenso: 'Suspenso',
    confirmado: 'Confirmado',
    pendente: 'Pendente',
    falhou: 'Falhou',
    reembolsado: 'Reembolsado',
  };

  return labels[status] || status;
};

// ============================================================================
// TAREFAS
// ============================================================================

const tarefasTitulos = [
  'Acompanhar paciente pós-cirurgia',
  'Revisar resultados de exames',
  'Preencher prescrições pendentes',
  'Atender ligação de paciente',
  'Preparar documentos para seguro',
  'Agendar consulta de rotina',
  'Responder dúvidas via WhatsApp',
  'Organizar documentação médica',
  'Confirmar agendamentos',
  'Atualizar prontuários',
];

export const mockTarefas = Array.from({ length: 15 }, (_, index) => ({
  id: gerarId(),
  titulo: tarefasTitulos[index % tarefasTitulos.length],
  descricao: `Tarefa importante para garantir qualidade do atendimento`,
  status: ['pendente', 'em andamento', 'concluido'][Math.floor(Math.random() * 3)] as any,
  prioridade: ['baixa', 'media', 'alta'][Math.floor(Math.random() * 3)] as any,
  responsavel: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)]?.nome,
  dataVencimento: dataAleatoriaUltimo30Dias(),
  dataCriacao: dataAleatoriaUltimoAno(),
  percentualConclusao: Math.floor(Math.random() * 100),
  categoria: ['admin', 'paciente', 'seguimento'][Math.floor(Math.random() * 3)],
}));

export const filtrarTarefas = (
  termo: string,
  status?: string,
  prioridade?: string,
): typeof mockTarefas => {
  const termoBaixo = termo.toLowerCase();
  return mockTarefas.filter(
    (t) =>
      (t.titulo.toLowerCase().includes(termoBaixo) ||
        t.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!status || t.status === status) &&
      (!prioridade || t.prioridade === prioridade),
  );
};

// ============================================================================
// FILAS
// ============================================================================

const filasNomes = [
  'Fila de Atendimento Geral',
  'Fila Prioridade (Idosos)',
  'Fila de Consultas Urgentes',
  'Fila de Retorno',
  'Fila de Novos Pacientes',
];

export const mockFilas = Array.from({ length: 5 }, (_, index) => ({
  id: gerarId(),
  nome: filasNomes[index],
  descricao: `Fila para ${filasNomes[index].toLowerCase()}`,
  totalAtendimentos: Math.floor(Math.random() * 20) + 5,
  atendimentosCompletos: Math.floor(Math.random() * 15),
  tempoMedio: Math.floor(Math.random() * 40) + 10,
  agentesAtivos: Math.floor(Math.random() * 5) + 1,
  status: Math.random() > 0.3 ? 'ativa' : 'pausada',
  ultimaAtualizacao: dataAleatoriaUltimo30Dias(),
}));

export const filtrarFilas = (termo: string, status?: string): typeof mockFilas => {
  const termoBaixo = termo.toLowerCase();
  return mockFilas.filter(
    (f) =>
      (f.nome.toLowerCase().includes(termoBaixo) ||
        f.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!status || f.status === status),
  );
};

// ============================================================================
// EQUIPE
// ============================================================================

const especialidades = ['Clínico Geral', 'Cardiologia', 'Dermatologia', 'Pediatria', 'Neurologia'];
const departamentos = ['Clínica', 'Cirurgia', 'Suporte', 'Administrativo', 'Financeiro'];

export const mockEquipe = mockUsuarios.slice(0, 10).map((usuario, index) => ({
  id: usuario.id,
  nome: usuario.nome,
  email: usuario.email,
  avatar: usuario.avatar,
  cargo: ['Médico', 'Enfermeiro', 'Recepcionista', 'Administrativo', 'Gerente'][
    index % 5
  ],
  especialidade: especialidades[index % especialidades.length],
  departamento: departamentos[index % departamentos.length],
  telefone: gerarTelefone(),
  status: usuario.ativo ? 'ativo' : 'inativo',
  dataPrimeiroAcesso: usuario.criadoEm,
  ultimoAcesso: usuario.ultimoAcesso || new Date().toISOString(),
  horasTrabalhadas: Math.floor(Math.random() * 40) + 20,
}));

export const filtrarEquipe = (
  termo: string,
  departamento?: string,
): typeof mockEquipe => {
  const termoBaixo = termo.toLowerCase();
  return mockEquipe.filter(
    (e) =>
      (e.nome.toLowerCase().includes(termoBaixo) ||
        e.email.toLowerCase().includes(termoBaixo) ||
        e.cargo.toLowerCase().includes(termoBaixo)) &&
      (!departamento || e.departamento === departamento),
  );
};

// ============================================================================
// CONEXÕES
// ============================================================================

const tiposConexoes = [
  'Email',
  'SMS',
  'WhatsApp',
  'Telegram',
  'Slack',
  'Google Calendar',
  'Stripe',
  'PayPal',
  'Twilio',
];

export const mockConexoes = Array.from({ length: 9 }, (_, index) => ({
  id: gerarId(),
  nome: tiposConexoes[index],
  tipo: tiposConexoes[index].toLowerCase(),
  status: Math.random() > 0.2 ? 'conectado' : 'desconectado',
  descricao: `Integração com ${tiposConexoes[index]} para melhorar comunicação`,
  dataConexao: dataAleatoriaUltimoAno(),
  ultimaSincronizacao: dataAleatoriaUltimo30Dias(),
  usuarioConfiguracao: mockUsuarios[0]?.nome,
  chaveAPI: `****${gerarId().substring(0, 8)}`,
  erros: Math.random() > 0.8 ? `Erro na sincronização de ${tiposConexoes[index]}` : null,
}));

export const filtrarConexoes = (
  termo: string,
  status?: string,
): typeof mockConexoes => {
  const termoBaixo = termo.toLowerCase();
  return mockConexoes.filter(
    (c) =>
      (c.nome.toLowerCase().includes(termoBaixo) ||
        c.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!status || c.status === status),
  );
};

// ============================================================================
// ARQUIVOS
// ============================================================================

const tiposArquivos = ['PDF', 'DOC', 'XLS', 'JPG', 'PNG', 'ZIP'];
const categorias = ['Documentação', 'Prontuários', 'Exames', 'Contratos', 'Financeiro'];

export const mockArquivos = Array.from({ length: 12 }, (_, index) => ({
  id: gerarId(),
  nome: `Documento_${String(index + 1).padStart(3, '0')}.${tiposArquivos[index % tiposArquivos.length].toLowerCase()}`,
  tipo: tiposArquivos[index % tiposArquivos.length],
  tamanho: Math.floor(Math.random() * 50) + 1,
  categoria: categorias[Math.floor(Math.random() * categorias.length)],
  dataCriacao: dataAleatoriaUltimoAno(),
  dataModificacao: dataAleatoriaUltimo30Dias(),
  criador: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)]?.nome,
  acesso: Math.random() > 0.5 ? 'privado' : 'compartilhado',
  pessoas: Math.floor(Math.random() * 5),
  versao: Math.floor(Math.random() * 5) + 1,
}));

export const filtrarArquivos = (
  termo: string,
  categoria?: string,
): typeof mockArquivos => {
  const termoBaixo = termo.toLowerCase();
  return mockArquivos.filter(
    (a) =>
      (a.nome.toLowerCase().includes(termoBaixo) ||
        a.categoria?.toLowerCase().includes(termoBaixo)) &&
      (!categoria || a.categoria === categoria),
  );
};

// ============================================================================
// ESTRATÉGIAS
// ============================================================================

const estrategiasNomes = [
  'Agendamento Automático',
  'Follow-up de Consultas',
  'Confirmação de Agendamento',
  'Lembretes de Medicação',
  'Pesquisa de Satisfação',
  'Oferta de Pacotes',
];

const estrategiasBase = Array.from({ length: 6 }, (_, index) => ({
  id: gerarId(),
  nome: estrategiasNomes[index],
  descricao: `Estratégia automatizada para ${estrategiasNomes[index].toLowerCase()}`,
  tipo: ['email', 'sms', 'whatsapp'][Math.floor(Math.random() * 3)] as 'email' | 'sms' | 'whatsapp',
  ativa: Math.random() > 0.3,
  dataCriacao: dataAleatoriaUltimoAno(),
  dataAtivacao: dataAleatoriaUltimo30Dias(),
  totalExecutions: Math.floor(Math.random() * 1000) + 100,
  taxaSucesso: Math.floor(Math.random() * 40) + 60,
  criadoPor: mockUsuarios[0]?.nome,
}));

// Merge com estratégias criadas via IA
export const mockEstrategias = [...estrategiasBase, ...obterEstrategiasSalvas()];

export const filtrarEstrategias = (
  termo: string,
  tipo?: string,
): typeof mockEstrategias => {
  const termoBaixo = termo.toLowerCase();
  return mockEstrategias.filter(
    (e) =>
      (e.nome.toLowerCase().includes(termoBaixo) ||
        e.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!tipo || e.tipo === tipo),
  );
};

// ============================================================================
// PORTAL IA
// ============================================================================

const agentesTitulos = [
  'Assistente de Atendimento',
  'Analisador de Prontuários',
  'Gerador de Relatórios',
  'Chatbot de Agendamento',
  'Assistente de Diagnóstico',
  'Analisador de Exames',
  'Gerador de Prescrições',
  'Assistente de Faturamento',
];

export const mockPortalIAs = Array.from({ length: 8 }, (_, index) => ({
  id: gerarId(),
  nome: agentesTitulos[index],
  descricao: `${agentesTitulos[index]} alimentado por IA avançada`,
  versao: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
  categoria: ['Atendimento', 'Análise', 'Automação'][Math.floor(Math.random() * 3)],
  rating: (Math.random() * 2 + 3).toFixed(1),
  instalacoes: Math.floor(Math.random() * 5000) + 100,
  ativa: Math.random() > 0.3,
  dataLancamento: dataAleatoriaUltimoAno(),
}));

export const filtrarPortalIAs = (
  termo: string,
  categoria?: string,
): typeof mockPortalIAs => {
  const termoBaixo = termo.toLowerCase();
  return mockPortalIAs.filter(
    (p) =>
      (p.nome.toLowerCase().includes(termoBaixo) ||
        p.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!categoria || p.categoria === categoria),
  );
};

// ============================================================================
// FLOW BUILDER
// ============================================================================

export const mockFlowBuilder = Array.from({ length: 8 }, (_, index) => ({
  id: gerarId(),
  nome: `Fluxo de Automação ${index + 1}`,
  descricao: `Fluxo automatizado para processos clínicos e administrativos`,
  status: ['ativo', 'pausado', 'arquivado'][Math.floor(Math.random() * 3)],
  trigger: ['novo_paciente', 'agendamento', 'mensagem'][Math.floor(Math.random() * 3)],
  passos: Math.floor(Math.random() * 10) + 2,
  execucoes: Math.floor(Math.random() * 1000) + 100,
  taxaErro: Math.floor(Math.random() * 5),
  dataCriacao: dataAleatoriaUltimoAno(),
  ultimaExecucao: dataAleatoriaUltimo30Dias(),
  criadoPor: mockUsuarios[0]?.nome,
}));

export const filtrarFlowBuilder = (
  termo: string,
  status?: string,
): typeof mockFlowBuilder => {
  const termoBaixo = termo.toLowerCase();
  return mockFlowBuilder.filter(
    (f) =>
      (f.nome.toLowerCase().includes(termoBaixo) ||
        f.descricao?.toLowerCase().includes(termoBaixo)) &&
      (!status || f.status === status),
  );
};

// ============================================================================
// WEBHOOKS
// ============================================================================

const webhooksURL = [
  'https://api.clinic.com/webhooks/events',
  'https://webhook.site/patient-updates',
  'https://integration.saude.com/notify',
  'https://api.agenda.com/schedule-changes',
  'https://payments.clinic.com/transactions',
  'https://messaging.clinic.com/sms',
  'https://reports.clinic.com/export',
  'https://analytics.clinic.com/track',
];

export const mockWebhooks = Array.from({ length: 8 }, (_, index) => ({
  id: gerarId(),
  nome: `Webhook ${index + 1}`,
  url: webhooksURL[index],
  evento: [
    'paciente_criado',
    'agendamento_confirmado',
    'pagamento_recebido',
    'mensagem_recebida',
    'documento_enviado',
    'relatorio_gerado',
  ][Math.floor(Math.random() * 6)],
  ativo: Math.random() > 0.2,
  dataUltimoDisparo: dataAleatoriaUltimo30Dias(),
  totalDisparos: Math.floor(Math.random() * 1000) + 10,
  tentativasFailadas: Math.floor(Math.random() * 5),
  dataCriacao: dataAleatoriaUltimoAno(),
  criadoPor: mockUsuarios[0]?.nome,
}));

export const filtrarWebhooks = (
  termo: string,
  evento?: string,
): typeof mockWebhooks => {
  const termoBaixo = termo.toLowerCase();
  return mockWebhooks.filter(
    (w) =>
      (w.nome.toLowerCase().includes(termoBaixo) ||
        w.url?.toLowerCase().includes(termoBaixo)) &&
      (!evento || w.evento === evento),
  );
};

// ============================================================================
// RESPOSTAS RÁPIDAS
// ============================================================================

const respostasTitulos = [
  'Orientações Pré-Cirurgia',
  'Confirmação de Agendamento',
  'Informações de Faturamento',
  'Horário de Atendimento',
  'Política de Cancelamento',
  'Instruções de Exame',
  'Resultado de Exame',
  'Consulta de Rotina',
];

export const mockRespostas = Array.from({ length: 8 }, (_, index) => ({
  id: gerarId(),
  titulo: respostasTitulos[index],
  conteudo: `Resposta padrão para ${respostasTitulos[index].toLowerCase()} com informações detalhadas e instruções claras`,
  categoria: ['administrativo', 'clinico', 'financeiro'][Math.floor(Math.random() * 3)],
  dataCriacao: dataAleatoriaUltimoAno(),
  dataModificacao: dataAleatoriaUltimo30Dias(),
  usos: Math.floor(Math.random() * 500) + 10,
  criadoPor: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)]?.nome,
  ativo: true,
}));

export const filtrarRespostas = (
  termo: string,
  categoria?: string,
): typeof mockRespostas => {
  const termoBaixo = termo.toLowerCase();
  return mockRespostas.filter(
    (r) =>
      (r.titulo.toLowerCase().includes(termoBaixo) ||
        r.conteudo?.toLowerCase().includes(termoBaixo)) &&
      (!categoria || r.categoria === categoria),
  );
};

// ============================================================================
// INDICADORES (KPI)
// ============================================================================

export const mockIndicadores = [
  {
    id: gerarId(),
    titulo: 'Total de Pacientes',
    valor: Math.floor(Math.random() * 5000) + 1000,
    variacao: Math.floor(Math.random() * 20) - 5,
    periodo: 'este mês',
  },
  {
    id: gerarId(),
    titulo: 'Agendamentos Realizados',
    valor: Math.floor(Math.random() * 500) + 100,
    variacao: Math.floor(Math.random() * 30) - 10,
    periodo: 'este mês',
  },
  {
    id: gerarId(),
    titulo: 'Taxa de Presença',
    valor: Math.floor(Math.random() * 40) + 75,
    variacao: Math.floor(Math.random() * 10) - 2,
    periodo: 'este mês',
    unidade: '%',
  },
  {
    id: gerarId(),
    titulo: 'Receita Total',
    valor: Math.floor(Math.random() * 500000) + 100000,
    variacao: Math.floor(Math.random() * 25) - 5,
    periodo: 'este mês',
    unidade: 'R$',
  },
  {
    id: gerarId(),
    titulo: 'Satisfação de Pacientes',
    valor: (Math.random() * 1 + 4).toFixed(1),
    variacao: Math.floor(Math.random() * 5) - 2,
    periodo: 'este mês',
    unidade: '/5.0',
  },
  {
    id: gerarId(),
    titulo: 'Tempo Médio de Atendimento',
    valor: Math.floor(Math.random() * 20) + 15,
    variacao: Math.floor(Math.random() * 5) - 3,
    periodo: 'este mês',
    unidade: 'min',
  },
];

// ============================================================================
// PEDIDOS DE EXAMES
// ============================================================================

const tiposExames = [
  'Hemograma Completo',
  'Tomografia',
  'Ressonância Magnética',
  'Ultrassom',
  'Radiografia',
  'ECG',
  'Teste de COVID-19',
  'Colonoscopia',
];

export const mockPedidosExames = Array.from({ length: 12 }, (_, index) => ({
  id: `EXM-${String(index + 1).padStart(5, '0')}`,
  paciente: nomesBrasileiros[index % nomesBrasileiros.length],
  tipoExame: tiposExames[index % tiposExames.length],
  medico: mockUsuarios[Math.floor(Math.random() * mockUsuarios.length)]?.nome,
  dataSolicitacao: dataAleatoriaUltimoAno(),
  dataPrevista: dataAleatoriaUltimo30Dias(),
  dataRealizado: Math.random() > 0.4 ? dataAleatoriaUltimo30Dias() : null,
  status: ['solicitado', 'agendado', 'realizado', 'cancelado'][
    Math.floor(Math.random() * 4)
  ],
  laboratorio: ['Laboratório Central', 'Clínica Diagnóstica', 'Hospital da Clínica'][
    Math.floor(Math.random() * 3)
  ],
  resultado: Math.random() > 0.6 ? 'Normal' : 'Alterado',
  prioridade: ['baixa', 'media', 'alta'][Math.floor(Math.random() * 3)],
}));

export const filtrarPedidosExames = (
  termo: string,
  status?: string,
): typeof mockPedidosExames => {
  const termoBaixo = termo.toLowerCase();
  return mockPedidosExames.filter(
    (p) =>
      (p.id.toLowerCase().includes(termoBaixo) ||
        p.paciente?.toLowerCase().includes(termoBaixo) ||
        p.tipoExame?.toLowerCase().includes(termoBaixo)) &&
      (!status || p.status === status),
  );
};

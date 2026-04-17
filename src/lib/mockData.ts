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
  ...nomesBrasileiros.map((nome, index) => ({
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
    ativa: 'bg-green-100 text-green-800',
    fechada: 'bg-gray-100 text-gray-800',
    aguardando: 'bg-yellow-100 text-yellow-800',

    // Contatos
    ativo: 'bg-green-100 text-green-800',
    inativo: 'bg-gray-100 text-gray-800',
    suspenso: 'bg-red-100 text-red-800',

    // Pagamentos
    confirmado: 'bg-green-100 text-green-800',
    pendente: 'bg-yellow-100 text-yellow-800',
    falhou: 'bg-red-100 text-red-800',
    reembolsado: 'bg-blue-100 text-blue-800',
  };

  return cores[status] || 'bg-gray-100 text-gray-800';
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

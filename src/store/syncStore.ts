/**
 * Store de Sincronização de Agenda
 * Gerencia conexões com plataformas externas (Google, Outlook, Feegow, etc.)
 * Persistência: localStorage via chave 'proclinic_sync'
 */

import { create } from 'zustand';

export type IntegrationType = 'oficial' | 'ical' | 'api' | 'caldav';
export type CategoryId = 'pessoal' | 'medico' | 'agendamento';

export interface Platform {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoryId;
  integracao: IntegrationType;
  cor: string;
  inicial: string;
  /** Domínio oficial da marca (usado para buscar o logo real via Clearbit). */
  domain?: string;
}

export interface SyncConnection {
  id: string;
  platformId: string;
  platformNome: string;
  platformCor: string;
  contaLabel: string; // Ex: "felippe@gmail.com" ou subdomínio
  direcao: 'leitura' | 'bidirecional';
  frequencia: 'realtime' | '5min' | '15min' | '60min';
  conflito: 'sistema' | 'origem' | 'manual';
  calendariosImportados: string[]; // nomes dos calendários escolhidos
  criadoEm: string;
  ultimaSync: string;
  ativo: boolean;
}

interface SyncStore {
  conexoes: SyncConnection[];
  addConexao: (c: SyncConnection) => void;
  removeConexao: (id: string) => void;
  toggleConexao: (id: string) => void;
  updateUltimaSync: (id: string) => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'proclinic_sync';

// Catálogo completo de plataformas (19 total) com domínios oficiais
// (usados para buscar o logo real via Clearbit Logo API)
export const PLATAFORMAS: Platform[] = [
  // ── Calendários Pessoais ──
  { id: 'google',     nome: 'Google Calendar',      descricao: 'Gmail, Google Workspace',           categoria: 'pessoal',      integracao: 'oficial', cor: '#4285f4', inicial: 'G',  domain: 'calendar.google.com' },
  { id: 'outlook',    nome: 'Microsoft Outlook',    descricao: 'Outlook, Microsoft 365, Hotmail',   categoria: 'pessoal',      integracao: 'oficial', cor: '#0078d4', inicial: 'O',  domain: 'outlook.com' },
  { id: 'apple',      nome: 'Apple iCalendar',      descricao: 'iPhone, iPad, Mac, iCloud',         categoria: 'pessoal',      integracao: 'caldav',  cor: '#a2aaad', inicial: 'A',  domain: 'apple.com' },
  { id: 'ical',       nome: 'Link iCal (URL)',      descricao: 'Qualquer agenda com link .ics',     categoria: 'pessoal',      integracao: 'ical',    cor: '#9b59b6', inicial: '∞' },

  // ── Sistemas Médicos Brasileiros ──
  { id: 'feegow',     nome: 'Feegow',               descricao: 'Gestão de clínicas e consultórios', categoria: 'medico',       integracao: 'api',     cor: '#00a896', inicial: 'F',  domain: 'feegow.com' },
  { id: 'iclinic',    nome: 'iClinic',              descricao: 'Prontuário eletrônico e agenda',    categoria: 'medico',       integracao: 'api',     cor: '#3498db', inicial: 'iC', domain: 'iclinic.com.br' },
  { id: 'doctoralia', nome: 'Doctoralia',           descricao: 'Agendamento online e telemedicina', categoria: 'medico',       integracao: 'ical',    cor: '#2ecc71', inicial: 'D',  domain: 'doctoralia.com.br' },
  { id: 'amplimed',   nome: 'Amplimed',             descricao: 'Gestão clínica completa',           categoria: 'medico',       integracao: 'api',     cor: '#e67e22', inicial: 'Am', domain: 'amplimed.com.br' },
  { id: 'hidoctor',   nome: 'HiDoctor',             descricao: 'Prontuário + agenda (Centralx)',    categoria: 'medico',       integracao: 'ical',    cor: '#c0392b', inicial: 'Hi', domain: 'hidoctor.com.br' },
  { id: 'memed',      nome: 'Memed',                descricao: 'Prescrição digital e agenda',       categoria: 'medico',       integracao: 'api',     cor: '#1abc9c', inicial: 'M',  domain: 'memed.com.br' },
  { id: 'prontmed',   nome: 'Prontmed',             descricao: 'Prontuário e gestão clínica',       categoria: 'medico',       integracao: 'api',     cor: '#9b59b6', inicial: 'Pm', domain: 'prontmed.com' },
  { id: 'tasy',       nome: 'Tasy (Philips)',       descricao: 'Hospitais e redes de saúde',        categoria: 'medico',       integracao: 'api',     cor: '#0b5394', inicial: 'T',  domain: 'philips.com.br' },
  { id: 'conexa',     nome: 'Conexa Saúde',         descricao: 'Telemedicina e agendamento',        categoria: 'medico',       integracao: 'api',     cor: '#e91e63', inicial: 'Cx', domain: 'conexasaude.com.br' },
  { id: 'shosp',      nome: 'ShoSP',                descricao: 'Gestão clínica regional',           categoria: 'medico',       integracao: 'api',     cor: '#f39c12', inicial: 'Sh', domain: 'shosp.com.br' },
  { id: 'vidaconnect',nome: 'Vida Connect',         descricao: 'Integração moderna de clínicas',    categoria: 'medico',       integracao: 'api',     cor: '#16a085', inicial: 'Vc', domain: 'vidaconnect.com.br' },
  { id: 'outro',      nome: 'Outro sistema',        descricao: 'ClinicWeb, MedKey, Nexodata, etc.', categoria: 'medico',       integracao: 'ical',    cor: '#7f8c8d', inicial: '+' },

  // ── Agendamento Online ──
  { id: 'calendly',   nome: 'Calendly',             descricao: 'Agendamento online popular',        categoria: 'agendamento',  integracao: 'oficial', cor: '#006bff', inicial: 'Cl', domain: 'calendly.com' },
  { id: 'calcom',     nome: 'Cal.com',              descricao: 'Agendamento open-source moderno',   categoria: 'agendamento',  integracao: 'oficial', cor: '#111827', inicial: 'C',  domain: 'cal.com' },
  { id: 'acuity',     nome: 'Acuity Scheduling',    descricao: 'Agendamento profissional global',   categoria: 'agendamento',  integracao: 'oficial', cor: '#ff8a00', inicial: 'Ac', domain: 'acuityscheduling.com' },
];

export const useSyncStore = create<SyncStore>((set, get) => ({
  conexoes: [],

  addConexao: (c) => {
    const conexoes = [...get().conexoes, c];
    set({ conexoes });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conexoes));
  },

  removeConexao: (id) => {
    const conexoes = get().conexoes.filter((c) => c.id !== id);
    set({ conexoes });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conexoes));
  },

  toggleConexao: (id) => {
    const conexoes = get().conexoes.map((c) =>
      c.id === id ? { ...c, ativo: !c.ativo } : c
    );
    set({ conexoes });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conexoes));
  },

  updateUltimaSync: (id) => {
    const conexoes = get().conexoes.map((c) =>
      c.id === id ? { ...c, ultimaSync: new Date().toISOString() } : c
    );
    set({ conexoes });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conexoes));
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) set({ conexoes: JSON.parse(raw) });
    } catch (err) {
      console.error('Erro ao hidratar syncStore:', err);
    }
  },
}));

'use client';

import { Plus, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ActionButtons } from '@/components/dashboard/ActionButtons';

interface FollowUp {
  id: string;
  titulo: string;
  cliente: string;
  agente: string;
  dataAgendada: string;
  status: 'pendente' | 'concluido' | 'atrasado';
  prioridade: 'alta' | 'media' | 'baixa';
  descricao: string;
}

const followupsData: FollowUp[] = [
  { id: '1', titulo: 'Follow-up Maria Silva', cliente: 'Maria Silva', agente: 'Ana Paula', dataAgendada: '2026-04-17', status: 'pendente', prioridade: 'alta', descricao: 'Verificar resultado de exame' },
  { id: '2', titulo: 'Follow-up João Santos', cliente: 'João Santos', agente: 'Carlos Mendes', dataAgendada: '2026-04-18', status: 'pendente', prioridade: 'media', descricao: 'Acompanhamento pós-consulta' },
  { id: '3', titulo: 'Follow-up Helena Costa', cliente: 'Helena Costa', agente: 'Bruno Lima', dataAgendada: '2026-04-16', status: 'atrasado', prioridade: 'alta', descricao: 'Retorno de tratamento' },
  { id: '4', titulo: 'Follow-up Pedro Oliveira', cliente: 'Pedro Oliveira', agente: 'Ana Paula', dataAgendada: '2026-04-15', status: 'concluido', prioridade: 'media', descricao: 'Verificação de medicação' },
  { id: '5', titulo: 'Follow-up Fernanda Ribeiro', cliente: 'Fernanda Ribeiro', agente: 'Carlos Mendes', dataAgendada: '2026-04-19', status: 'pendente', prioridade: 'baixa', descricao: 'Check-up rotina' },
  { id: '6', titulo: 'Follow-up Lucas Pereira', cliente: 'Lucas Pereira', agente: 'Bruno Lima', dataAgendada: '2026-04-20', status: 'pendente', prioridade: 'media', descricao: 'Acompanhamento de resultado' },
  { id: '7', titulo: 'Follow-up Beatriz Martins', cliente: 'Beatriz Martins', agente: 'Ana Paula', dataAgendada: '2026-04-14', status: 'atrasado', prioridade: 'baixa', descricao: 'Ligação de acompanhamento' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'concluido':
      return <CheckCircle className="text-green-400" size={18} />;
    case 'atrasado':
      return <AlertCircle className="text-red-400" size={18} />;
    default:
      return <Clock className="text-yellow-400" size={18} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'bg-green-950 text-green-300 border border-green-800';
    case 'atrasado':
      return 'bg-red-950 text-red-300 border border-red-800';
    default:
      return 'bg-yellow-950 text-yellow-300 border border-yellow-800';
  }
};

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case 'alta':
      return 'bg-red-950 text-red-300 border border-red-800';
    case 'media':
      return 'bg-orange-950 text-orange-300 border border-orange-700';
    default:
      return 'bg-green-950 text-green-300 border border-green-800';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    concluido: 'Concluído',
    atrasado: 'Atrasado'
  };
  return labels[status] || status;
};

const getPrioridadeLabel = (prioridade: string) => {
  const labels: Record<string, string> = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  };
  return labels[prioridade] || prioridade;
};

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<FollowUp[]>(followupsData);
  const [search, setSearch] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'concluido' | 'atrasado'>('todos');

  const followupsFiltrados = followups.filter(f => {
    const matchBusca = f.titulo.toLowerCase().includes(search.toLowerCase()) ||
                       f.cliente.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || f.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow-ups</h1>
          <p className="text-sm text-slate-400 mt-1">Acompanhe todos os follow-ups agendados</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c9943a] text-slate-900 font-semibold rounded-lg hover:bg-[#d4a347] transition-colors">
          <Plus size={18} />
          Novo Follow-up
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-2xl font-bold text-white">{followups.length}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Pendentes</div>
          <div className="text-2xl font-bold text-yellow-400">{followups.filter(f => f.status === 'pendente').length}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Atrasados</div>
          <div className="text-2xl font-bold text-red-400">{followups.filter(f => f.status === 'atrasado').length}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Concluídos</div>
          <div className="text-2xl font-bold text-green-400">{followups.filter(f => f.status === 'concluido').length}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar por título ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c9943a]"
            />
          </div>
        </div>
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#c9943a]"
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="space-y-3">
        {followupsFiltrados.map(followup => (
          <div key={followup.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-[#c9943a] transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(followup.status)}
                  <div>
                    <h3 className="font-semibold text-white">{followup.titulo}</h3>
                    <p className="text-sm text-slate-400">{followup.cliente}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">{followup.descricao}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">Agente: <span className="text-white font-medium">{followup.agente}</span></span>
                  <span className="text-slate-400">Data: <span className="text-white font-medium">{followup.dataAgendada}</span></span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 ml-4">
                <div className="flex gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${getPrioridadeColor(followup.prioridade)}`}>
                    {getPrioridadeLabel(followup.prioridade)}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${getStatusColor(followup.status)}`}>
                    {getStatusLabel(followup.status)}
                  </span>
                </div>
                <ActionButtons
                  onView={() => {}}
                  onEdit={() => {}}
                  onDelete={() => setFollowups(followups.filter(f => f.id !== followup.id))}
                  compact
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {followupsFiltrados.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-white mb-2">Nenhum follow-up encontrado</h3>
          <p className="text-slate-400">Crie um novo follow-up para acompanhar clientes</p>
        </div>
      )}
    </div>
  );
}

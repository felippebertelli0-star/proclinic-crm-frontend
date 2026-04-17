'use client';

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  duracao: number;
  local?: string;
  participantes: string[];
  tipo: 'consulta' | 'reuniao' | 'lembrete' | 'outro';
  cor: string;
}

const eventosData: Evento[] = [
  { id: '1', titulo: 'Consulta - Maria Silva', descricao: 'Check-up geral', data: '2026-04-17', hora: '09:00', duracao: 60, local: 'Sala 1', participantes: ['Dr. João'], tipo: 'consulta', cor: 'bg-blue-600' },
  { id: '2', titulo: 'Reunião de Equipe', descricao: 'Planejamento semanal', data: '2026-04-17', hora: '14:00', duracao: 60, local: 'Sala de Conferência', participantes: ['Ana', 'Carlos', 'Bruno'], tipo: 'reuniao', cor: 'bg-purple-600' },
  { id: '3', titulo: 'Consulta - João Santos', descricao: 'Avaliação pré-operatória', data: '2026-04-18', hora: '10:30', duracao: 45, local: 'Sala 2', participantes: ['Dra. Helena'], tipo: 'consulta', cor: 'bg-blue-600' },
  { id: '4', titulo: 'Follow-up - Pedro Costa', descricao: 'Acompanhamento pós-cirurgia', data: '2026-04-18', hora: '15:00', duracao: 30, local: 'Sala 1', participantes: ['Dr. Bruno'], tipo: 'lembrete', cor: 'bg-green-600' },
  { id: '5', titulo: 'Consulta - Helena Gomes', descricao: 'Rotina', data: '2026-04-19', hora: '11:00', duracao: 50, local: 'Sala 3', participantes: ['Dra. Fernanda'], tipo: 'consulta', cor: 'bg-blue-600' },
];

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    consulta: 'Consulta',
    reuniao: 'Reunião',
    lembrete: 'Lembrete',
    outro: 'Outro'
  };
  return labels[tipo] || tipo;
};

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>(eventosData);
  const [mesAtual, setMesAtual] = useState(new Date(2026, 3, 17)); // Abril 2026

  const diasMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1).getDay();

  const eventosPorData = eventos.reduce((acc, evento) => {
    const data = evento.data;
    if (!acc[data]) acc[data] = [];
    acc[data].push(evento);
    return acc;
  }, {} as Record<string, Evento[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendário</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie consultas e compromissos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c9943a] text-slate-900 font-semibold rounded-lg hover:bg-[#d4a347] transition-colors">
          <Calendar size={18} />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">←</button>
              <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">→</button>
            </div>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(dia => (
              <div key={dia} className="text-center text-xs font-semibold text-slate-400 py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-2">
            {Array(primeiroDia).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array(diasMes).fill(null).map((_, i) => {
              const dia = i + 1;
              const dataStr = `2026-04-${String(dia).padStart(2, '0')}`;
              const temEventos = eventosPorData[dataStr]?.length || 0;
              const ehHoje = dia === 17;

              return (
                <div
                  key={dia}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${ ehHoje
                    ? 'bg-[#c9943a] text-slate-900 border-[#c9943a] font-bold'
                    : 'bg-slate-700 border-slate-600 text-white hover:border-[#c9943a] hover:bg-slate-650'
                  }`}
                >
                  <div className="text-sm font-semibold">{dia}</div>
                  {temEventos > 0 && (
                    <div className="text-xs mt-1 text-slate-400">
                      {temEventos} evento{temEventos > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Próximos Eventos</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {eventos.slice(0, 5).map(evento => (
              <div key={evento.id} className={`${evento.cor} bg-opacity-10 border border-opacity-20 rounded-lg p-3`}>
                <div className="font-semibold text-white text-sm mb-1">{evento.titulo}</div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {evento.data} às {evento.hora}
                  </div>
                  {evento.local && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {evento.local}
                    </div>
                  )}
                  {evento.participantes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      {evento.participantes.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-600"></div>
          <span className="text-slate-300">Consulta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-600"></div>
          <span className="text-slate-300">Reunião</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-600"></div>
          <span className="text-slate-300">Lembrete</span>
        </div>
      </div>
    </div>
  );
}

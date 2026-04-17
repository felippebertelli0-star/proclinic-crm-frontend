'use client';

import { TrendingUp } from 'lucide-react';

export default function PipelinePage() {
  const stages = [
    { name: 'Prospecção', count: 45, value: 'R$ 67.5k', percentage: 100, color: 'bg-blue-600' },
    { name: 'Qualificação', count: 28, value: 'R$ 42.0k', percentage: 62, color: 'bg-purple-600' },
    { name: 'Proposta', count: 12, value: 'R$ 28.5k', percentage: 27, color: 'bg-yellow-600' },
    { name: 'Negociação', count: 5, value: 'R$ 15.2k', percentage: 11, color: 'bg-orange-600' },
    { name: 'Fechado', count: 3, value: 'R$ 12.0k', percentage: 7, color: 'bg-green-600' },
  ];

  const totalValue = 'R$ 165.2k';
  const closedRate = '6.7%';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={28} /> Pipeline CRM
        </h1>
        <p className="text-sm text-slate-400 mt-1">Visualize as oportunidades em cada estágio do funil de vendas</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-semibold mb-2">Valor Total do Pipeline</div>
          <div className="text-3xl font-bold text-[#c9943a]">{totalValue}</div>
          <div className="text-xs text-slate-500 mt-2">+12% em relação ao mês anterior</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-semibold mb-2">Taxa de Fechamento</div>
          <div className="text-3xl font-bold text-green-400">{closedRate}</div>
          <div className="text-xs text-slate-500 mt-2">3 oportunidades fechadas</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-sm text-slate-400 font-semibold mb-2">Oportunidades Totais</div>
          <div className="text-3xl font-bold text-blue-400">93</div>
          <div className="text-xs text-slate-500 mt-2">Distribuídas em 5 estágios</div>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-6">Funil de Vendas</h2>

        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-white">{stage.name}</h3>
                  <p className="text-xs text-slate-400">{stage.count} oportunidades • {stage.value}</p>
                </div>
                <span className="text-sm font-bold text-slate-300">{stage.percentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden relative">
                <div
                  className={`${stage.color} h-full flex items-center justify-end pr-3 transition-all`}
                  style={{ width: `${stage.percentage}%` }}
                >
                  {stage.percentage > 15 && <span className="text-white font-bold text-sm">{stage.percentage}%</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="font-bold text-white mb-4">Maiores Oportunidades</h3>
          <div className="space-y-2">
            {[
              { name: 'ProClinic Hospital', value: 'R$ 28.5k', stage: 'Proposta' },
              { name: 'HealthPlus Clinic', value: 'R$ 22.0k', stage: 'Qualificação' },
              { name: 'MedTech Solutions', value: 'R$ 18.5k', stage: 'Proposta' },
            ].map((opp) => (
              <div key={opp.name} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-white">{opp.name}</p>
                  <p className="text-xs text-slate-400">{opp.stage}</p>
                </div>
                <span className="text-sm font-bold text-[#c9943a]">{opp.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="font-bold text-white mb-4">Próximas Ações</h3>
          <div className="space-y-2">
            {[
              { title: 'Follow-up: João Silva', dueDate: 'Hoje', priority: 'Alta' },
              { title: 'Enviar proposta: Tech Corp', dueDate: 'Amanhã', priority: 'Alta' },
              { title: 'Call: Maria Santos', dueDate: '2026-04-20', priority: 'Média' },
            ].map((action) => (
              <div key={action.title} className="flex items-start justify-between py-2 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-white">{action.title}</p>
                  <p className="text-xs text-slate-400">{action.dueDate}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  action.priority === 'Alta' ? 'bg-red-950 text-red-300' : 'bg-orange-950 text-orange-300'
                }`}>
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

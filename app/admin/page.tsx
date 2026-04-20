'use client';

import { BarChart3, Users2, Zap, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total de Sistemas',
      value: '12',
      change: '+2 este mês',
      icon: '📦',
      color: 'bg-blue-600',
    },
    {
      label: 'Usuários Ativos',
      value: '2,847',
      change: '+142 esta semana',
      icon: '👥',
      color: 'bg-green-600',
    },
    {
      label: 'Tempo de Atividade',
      value: '99.8%',
      change: 'Excelente desempenho',
      icon: '✅',
      color: 'bg-emerald-600',
    },
    {
      label: 'Receita Mensal',
      value: 'R$ 48.5k',
      change: '+8.2% vs mês anterior',
      icon: '💰',
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-5 hover:border-[#d4af37] hover:shadow-lg transition-all"
          >
            <div className="text-xs uppercase text-[#7a8291] tracking-wider font-semibold mb-2">
              {stat.label}
            </div>
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-xs text-[#2ecc71] font-semibold">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Systems Overview */}
      <div className="bg-[#151d2a] border border-[#2a3647] rounded-[14px] p-6">
        <h2 className="text-lg font-bold text-white mb-4">Sistemas Ativos</h2>
        <div className="space-y-3">
          {[
            { name: 'ProClinic CRM', users: 324, status: 'Ativo' },
            { name: 'Jarvis Admin', users: 156, status: 'Ativo' },
            { name: 'WhatsApp Integration', users: 89, status: 'Ativo' },
            { name: 'Analytics Platform', users: 234, status: 'Ativo' },
            { name: 'Webhook Service', users: 45, status: 'Inativo' },
          ].map((sys, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg border border-[#2a3647] hover:border-[#d4af37] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2ecc71]"></div>
                <div>
                  <div className="font-medium text-white">{sys.name}</div>
                  <div className="text-xs text-[#7a8291]">{sys.users} usuários</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                sys.status === 'Ativo'
                  ? 'bg-[rgba(46,204,113,0.15)] text-[#2ecc71]'
                  : 'bg-[rgba(231,76,60,0.15)] text-[#e74c3c]'
              }`}>
                {sys.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[14px] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Alertas Recentes</h3>
          <div className="space-y-2 text-sm text-[#b0b8c1]">
            <div className="flex gap-2">
              <span className="text-[#f39c12]">⚠️</span>
              <span>CPU usage 78% on ProClinic Server</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#2ecc71]">ℹ️</span>
              <span>Backup completed successfully</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#f39c12]">⚠️</span>
              <span>SSL certificate expiring in 30 days</span>
            </div>
          </div>
        </div>

        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[14px] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-[#d4af37] hover:bg-[#e8c547] text-[#0f1419] font-bold rounded-lg transition-all">
              Criar Novo Sistema
            </button>
            <button className="w-full px-4 py-2 border border-[#2a3647] text-[#d4af37] hover:bg-[rgba(212,175,55,0.08)] font-bold rounded-lg transition-all">
              Gerar Relatório
            </button>
            <button className="w-full px-4 py-2 border border-[#2a3647] text-[#d4af37] hover:bg-[rgba(212,175,55,0.08)] font-bold rounded-lg transition-all">
              Monitorar Sistemas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

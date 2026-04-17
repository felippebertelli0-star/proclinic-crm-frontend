'use client';

import { Plus, Settings, Play, Pause } from 'lucide-react';
import { useState } from 'react';

interface Sistema {
  id: string;
  name: string;
  icon: string;
  plan: string;
  users: number;
  status: 'ativo' | 'inativo' | 'trial';
  uptime: number;
  lastSync: string;
}

const sistemas: Sistema[] = [
  {
    id: '1',
    name: 'ProClinic CRM',
    icon: '🏥',
    plan: 'Enterprise',
    users: 324,
    status: 'ativo',
    uptime: 99.9,
    lastSync: '2 min atrás',
  },
  {
    id: '2',
    name: 'Jarvis Assistant',
    icon: '⚡',
    plan: 'Professional',
    users: 156,
    status: 'ativo',
    uptime: 99.8,
    lastSync: '5 min atrás',
  },
  {
    id: '3',
    name: 'Analytics Suite',
    icon: '📊',
    plan: 'Professional',
    users: 234,
    status: 'ativo',
    uptime: 99.7,
    lastSync: '1 min atrás',
  },
  {
    id: '4',
    name: 'WhatsApp API',
    icon: '💬',
    plan: 'Starter',
    users: 89,
    status: 'trial',
    uptime: 98.5,
    lastSync: '30 min atrás',
  },
  {
    id: '5',
    name: 'Email Service',
    icon: '📧',
    plan: 'Professional',
    users: 67,
    status: 'ativo',
    uptime: 99.9,
    lastSync: '3 min atrás',
  },
  {
    id: '6',
    name: 'Backup System',
    icon: '💾',
    plan: 'Enterprise',
    users: 12,
    status: 'inativo',
    uptime: 0,
    lastSync: '2 horas atrás',
  },
];

const statusConfig = {
  ativo: { bg: 'bg-[rgba(46,204,113,0.15)]', text: 'text-[#2ecc71]', label: 'ATIVO' },
  inativo: { bg: 'bg-[rgba(231,76,60,0.15)]', text: 'text-[#e74c3c]', label: 'INATIVO' },
  trial: { bg: 'bg-[rgba(243,156,18,0.15)]', text: 'text-[#f39c12]', label: 'TRIAL' },
};

export default function SistemasPage() {
  const [selectedSistema, setSelectedSistema] = useState<Sistema | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sistemas</h1>
          <p className="text-sm text-[#7a8291] mt-1">Gerencie todos os sistemas e instâncias</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-[#0f1419] font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
        >
          <Plus size={18} />
          Novo Sistema
        </button>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sistemas.map((sistema) => {
          const status = statusConfig[sistema.status];
          return (
            <div
              key={sistema.id}
              onClick={() => setSelectedSistema(sistema)}
              className="bg-[#151d2a] border border-[#2a3647] rounded-[14px] overflow-hidden hover:border-[#d4af37] hover:shadow-xl hover:shadow-[#d4af37]/10 hover:scale-105 transition-all cursor-pointer group"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-[#1a2332] to-[#0a0e12] p-5 flex items-start gap-4">
                <div className="text-4xl">{sistema.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{sistema.name}</h3>
                  <p className="text-xs text-[#7a8291] uppercase tracking-wider">{sistema.plan}</p>
                </div>
                <span className={`${status.bg} ${status.text} text-xs font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap`}>
                  {status.label}
                </span>
              </div>

              {/* Body Section */}
              <div className="p-5 border-b border-[#2a3647]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#7a8291] uppercase tracking-wider mb-1">Usuários</div>
                    <div className="text-xl font-bold text-[#d4af37]">{sistema.users}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#7a8291] uppercase tracking-wider mb-1">Uptime</div>
                    <div className="text-xl font-bold text-[#d4af37]">{sistema.uptime}%</div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="p-5 flex gap-2">
                <button className="flex-1 px-3 py-2 border border-[#2a3647] text-[#b0b8c1] text-xs font-bold rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                  Ver Detalhes
                </button>
                <button className="flex-1 px-3 py-2 bg-[#d4af37] text-[#0f1419] text-xs font-bold rounded-lg hover:bg-[#e8c547] transition-all">
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#151d2a] border border-[#2a3647] rounded-[16px] p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Novo Sistema</h2>
            <p className="text-sm text-[#7a8291] mb-6">Configure um novo sistema no painel</p>

            <form className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-[#b0b8c1] block mb-2">Nome do Sistema</label>
                <input
                  type="text"
                  placeholder="Ex: ProClinic..."
                  className="w-full px-4 py-3 bg-[#1a2332] border border-[#2a3647] rounded-lg text-white placeholder-[#7a8291] focus:border-[#d4af37] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-[#b0b8c1] block mb-2">Plano</label>
                <select className="w-full px-4 py-3 bg-[#1a2332] border border-[#2a3647] rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-all">
                  <option>Starter</option>
                  <option>Professional</option>
                  <option>Enterprise</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-[#b0b8c1] block mb-2">Descrição</label>
                <textarea
                  placeholder="Descrição do sistema..."
                  className="w-full px-4 py-3 bg-[#1a2332] border border-[#2a3647] rounded-lg text-white placeholder-[#7a8291] focus:border-[#d4af37] focus:outline-none transition-all resize-none h-24"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#1a2332] border border-[#2a3647] text-[#b0b8c1] font-bold rounded-lg hover:border-[#e74c3c] hover:text-[#e74c3c] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-[#0f1419] font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

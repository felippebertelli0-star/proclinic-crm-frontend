'use client';

import { AlertCircle } from 'lucide-react';

export default function SuportePage() {
  const tickets = [
    { id: 'TKT-001', titulo: 'Login issues on CRM', cliente: 'ProClinic', priority: 'Alta', status: 'Aberto', data: '2026-04-17' },
    { id: 'TKT-002', titulo: 'API rate limit errors', cliente: 'TechCorp', priority: 'Média', status: 'Em Andamento', data: '2026-04-16' },
    { id: 'TKT-003', titulo: 'Feature request - Reports', cliente: 'HealthPlus', priority: 'Baixa', status: 'Fechado', data: '2026-04-15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Suporte</h1>
          <p className="text-sm text-[#7a8291] mt-1">Gerenciamento de tickets de suporte - <span className="text-[#e74c3c] font-bold">3 pendentes</span></p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
          <div className="text-xs text-[#7a8291] uppercase font-bold mb-2">Total Tickets</div>
          <div className="text-3xl font-black text-[#d4af37]">247</div>
          <div className="text-xs text-[#7a8291] mt-2">Desde o início</div>
        </div>
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
          <div className="text-xs text-[#7a8291] uppercase font-bold mb-2">Abertos</div>
          <div className="text-3xl font-black text-[#f39c12]">12</div>
          <div className="text-xs text-[#f39c12] mt-2 font-bold">Requerem ação</div>
        </div>
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
          <div className="text-xs text-[#7a8291] uppercase font-bold mb-2">Resolvidos</div>
          <div className="text-3xl font-black text-[#2ecc71]">235</div>
          <div className="text-xs text-[#2ecc71] mt-2 font-bold">95% taxa de resolução</div>
        </div>
      </div>

      <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
        <h3 className="font-bold text-white text-lg mb-4">Tickets Abertos</h3>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center gap-4 p-4 bg-[#1a2332] rounded-lg border border-[#2a3647] hover:border-[#d4af37] transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-[#e74c3c]"></div>
              <div className="flex-1">
                <div className="font-semibold text-white">{ticket.titulo}</div>
                <div className="text-xs text-[#7a8291] mt-1">{ticket.id} • {ticket.cliente} • {ticket.data}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                ticket.priority === 'Alta' ? 'bg-[rgba(231,76,60,0.15)] text-[#e74c3c]' :
                ticket.priority === 'Média' ? 'bg-[rgba(243,156,18,0.15)] text-[#f39c12]' :
                'bg-[rgba(46,204,113,0.15)] text-[#2ecc71]'
              }`}>
                {ticket.priority}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                ticket.status === 'Aberto' ? 'bg-[rgba(231,76,60,0.15)] text-[#e74c3c]' :
                ticket.status === 'Em Andamento' ? 'bg-[rgba(243,156,18,0.15)] text-[#f39c12]' :
                'bg-[rgba(46,204,113,0.15)] text-[#2ecc71]'
              }`}>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Plus } from 'lucide-react';

export default function TagsPage() {
  const tags = [
    { name: 'Paciente Premium', count: 45, color: '#c9943a' },
    { name: 'Lead Qualificado', count: 28, color: '#3498db' },
    { name: 'Em Negociação', count: 12, color: '#9b59b6' },
    { name: 'Consulta Agendada', count: 89, color: '#2ecc71' },
    { name: 'Acompanhamento', count: 34, color: '#e74c3c' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Etiquetas</h1>
          <p className="text-sm text-slate-400 mt-1">Organize contatos com tags personalizadas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c9943a] text-slate-900 font-semibold rounded-lg hover:bg-[#d4a347] transition-colors">
          <Plus size={18} />
          Nova Etiqueta
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div key={tag.name} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-[#c9943a] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }}></div>
              <h3 className="font-semibold text-white">{tag.name}</h3>
            </div>
            <p className="text-sm text-slate-400">{tag.count} itens</p>
          </div>
        ))}
      </div>
    </div>
  );
}

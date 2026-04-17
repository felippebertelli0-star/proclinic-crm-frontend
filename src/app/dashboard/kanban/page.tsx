'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

interface KanbanCard {
  id: string;
  title: string;
  client: string;
  value: string;
  priority: 'high' | 'medium' | 'low';
  agent: string;
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  cards: KanbanCard[];
  color: string;
}

const columns: Column[] = [
  {
    id: 'new',
    title: 'Novo',
    color: 'border-blue-500',
    cards: [
      { id: '1', title: 'Contato - João Silva', client: 'João Silva', value: 'R$ 2.500', priority: 'high', agent: 'Ana', dueDate: '2026-04-20' },
      { id: '2', title: 'Lead - Maria Santos', client: 'Maria Santos', value: 'R$ 1.800', priority: 'medium', agent: 'Carlos', dueDate: '2026-04-22' },
    ],
  },
  {
    id: 'qualified',
    title: 'Qualificado',
    color: 'border-yellow-500',
    cards: [
      { id: '3', title: 'Proposta - Tech Corp', client: 'Tech Corp', value: 'R$ 5.000', priority: 'high', agent: 'Bruno', dueDate: '2026-04-18' },
    ],
  },
  {
    id: 'proposal',
    title: 'Proposta',
    color: 'border-purple-500',
    cards: [
      { id: '4', title: 'Negociação - Health Plus', client: 'Health Plus', value: 'R$ 8.500', priority: 'medium', agent: 'Ana', dueDate: '2026-04-21' },
      { id: '5', title: 'Follow-up - MedTech', client: 'MedTech', value: 'R$ 3.200', priority: 'low', agent: 'Carlos', dueDate: '2026-04-25' },
    ],
  },
  {
    id: 'customer',
    title: 'Cliente',
    color: 'border-green-500',
    cards: [
      { id: '6', title: 'Fechado - ProClinic Clinic', client: 'ProClinic Clinic', value: 'R$ 12.000', priority: 'high', agent: 'Bruno', dueDate: '2026-04-15' },
    ],
  },
];

export default function KanbanPage() {
  const [board, setBoard] = useState(columns);
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; fromColumn: string } | null>(null);

  const handleDragStart = (card: KanbanCard, columnId: string) => {
    setDraggedCard({ card, fromColumn: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedCard) return;

    if (draggedCard.fromColumn === columnId) {
      setDraggedCard(null);
      return;
    }

    setBoard((prev) =>
      prev.map((col) => {
        if (col.id === draggedCard.fromColumn) {
          return { ...col, cards: col.cards.filter((c) => c.id !== draggedCard.card.id) };
        }
        if (col.id === columnId) {
          return { ...col, cards: [...col.cards, draggedCard.card] };
        }
        return col;
      })
    );

    setDraggedCard(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-950 text-red-300 border border-red-800';
      case 'medium': return 'bg-orange-950 text-orange-300 border border-orange-700';
      case 'low': return 'bg-green-950 text-green-300 border border-green-800';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie oportunidades com drag-and-drop</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c9943a] text-slate-900 font-semibold rounded-lg hover:bg-[#d4a347] transition-colors">
          <Plus size={18} />
          Nova Oportunidade
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 pb-4">
        {board.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            className="bg-slate-800 rounded-lg p-4 min-h-[600px] border border-slate-700"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${column.color}`}>
              <h2 className="font-semibold text-white">{column.title}</h2>
              <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
                {column.cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card, column.id)}
                  className="bg-slate-700 border border-slate-600 rounded-lg p-3 cursor-move hover:shadow-lg hover:border-[#c9943a] transition-all hover:scale-105"
                >
                  <h3 className="font-semibold text-white text-sm mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-400 mb-3">{card.client}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#c9943a]">{card.value}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getPriorityColor(card.priority)}`}>
                        {card.priority === 'high' ? 'Alta' : card.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-600 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{card.agent}</span>
                    <span className="text-slate-500">{card.dueDate}</span>
                  </div>
                </div>
              ))}

              {/* Add Card Button */}
              <button className="w-full py-2 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-[#c9943a] hover:text-[#c9943a] transition-colors text-sm font-semibold">
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

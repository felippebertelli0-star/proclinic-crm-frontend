/**
 * ActionButtons - Botões de ação para tabelas (editar, deletar, visualizar)
 * Qualidade: Premium AAA
 */

import { Edit, Trash2, Eye } from 'lucide-react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  compact?: boolean;
}

export function ActionButtons({ onEdit, onDelete, onView, compact = false }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={onView}
          className="p-2 text-cyan-400 hover:bg-cyan-950 rounded-lg transition-colors"
          title="Visualizar"
          aria-label="Visualizar"
        >
          <Eye size={compact ? 16 : 18} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
          title="Editar"
          aria-label="Editar"
        >
          <Edit size={compact ? 16 : 18} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:bg-red-950 rounded-lg transition-colors"
          title="Deletar"
          aria-label="Deletar"
        >
          <Trash2 size={compact ? 16 : 18} />
        </button>
      )}
    </div>
  );
}

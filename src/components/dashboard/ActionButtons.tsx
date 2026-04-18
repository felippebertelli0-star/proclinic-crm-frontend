/**
 * ActionButtons - Botões de ação para tabelas (editar, deletar, visualizar)
 * Qualidade: Premium AAA - SVG Lucide Minimalista
 */

import { IconSVG } from '@/lib/icons';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  compact?: boolean;
}

export function ActionButtons({ onEdit, onDelete, onView, compact = false }: ActionButtonsProps) {
  const iconSize = compact ? 16 : 18;

  // Helper to get icon SVG
  const getIcon = (iconKey: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'eye': IconSVG.eye(),
      'edit': IconSVG.edit(),
      'trash': IconSVG.trash(),
    };
    return iconMap[iconKey] || null;
  };

  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={onView}
          className="p-2 text-cyan-400 hover:bg-cyan-950 rounded-lg transition-colors"
          title="Visualizar"
          aria-label="Visualizar"
          style={{ color: '#00d4ff', width: iconSize + 8, height: iconSize + 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
          title="Editar"
          aria-label="Editar"
          style={{ color: '#94a3b8', width: iconSize + 8, height: iconSize + 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:bg-red-950 rounded-lg transition-colors"
          title="Deletar"
          aria-label="Deletar"
          style={{ color: '#f87171', width: iconSize + 8, height: iconSize + 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      )}
    </div>
  );
}

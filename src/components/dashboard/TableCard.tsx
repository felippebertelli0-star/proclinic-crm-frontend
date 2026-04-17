/**
 * TableCard - Card wrapper para tabelas com header
 * Qualidade: Premium AAA
 */

import { Plus } from 'lucide-react';

interface TableCardProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export function TableCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: TableCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2 bg-[#c9943a] text-slate-900 font-semibold rounded-lg hover:bg-[#c9943a] transition-colors shadow-lg"
            aria-label={actionLabel}
          >
            <Plus size={20} />
            {actionLabel}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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

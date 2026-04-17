/**
 * StatusBadge - Componente para exibir status com cores apropriadas
 * Qualidade: Premium AAA
 */

import { obterCorStatus, obterLabelStatus } from '@/lib/mockData';

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const corClasse = obterCorStatus(status);
  const label = customLabel || obterLabelStatus(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${corClasse}`}>
      {label}
    </span>
  );
}

/**
 * Pagination - Componente para navegação entre páginas
 * Qualidade: Premium AAA
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Números de página */}
      <div className="flex gap-1">
        {pages.slice(0, Math.min(5, totalPages)).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
              currentPage === page
                ? 'bg-[#c9943a] text-slate-900 font-bold'
                : 'border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Reticências se houver mais páginas */}
        {totalPages > 5 && (
          <>
            <span className="px-2 py-1 text-slate-500">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                currentPage === totalPages
                  ? 'bg-[#c9943a] text-slate-900 font-bold'
                  : 'border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              aria-label={`Página ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight size={18} />
      </button>

      {/* Informação de página */}
      <span className="ml-4 text-sm text-slate-400">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}

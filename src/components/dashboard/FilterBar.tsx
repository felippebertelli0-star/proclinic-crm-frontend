/**
 * FilterBar - Barra de busca e filtros reutilizável
 * Qualidade: Premium AAA
 */

import { Search } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    label: string;
    name: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-[#c9943a] focus:border-[#c9943a] transition-all"
          aria-label="Buscar"
        />
      </div>

      {/* Filter Dropdowns */}
      {filters?.map((filter) => (
        <select
          key={filter.name}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-[#c9943a] focus:border-[#c9943a] transition-all"
          aria-label={filter.label}
        >
          <option value="" className="bg-slate-700 text-white">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-700 text-white">
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

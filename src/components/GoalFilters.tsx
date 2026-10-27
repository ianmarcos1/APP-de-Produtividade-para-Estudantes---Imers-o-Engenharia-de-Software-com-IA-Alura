import React from 'react';
import { ArrowUpDown, Filter, Search, X } from 'lucide-react';
import { GoalStatus } from '../types/studyGoal';

export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'title_asc';

interface GoalFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: GoalStatus | 'all';
  onStatusFilterChange: (status: GoalStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    not_started: number;
    in_progress: number;
    completed: number;
  };
}

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  return (
    <div className="mb-6 space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs">
      {/* Linha superior: Busca e Ordenação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Barra de Busca */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição de estudo..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <span>Ordenar:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="deadline_asc">Prazo mais próximo</option>
            <option value="deadline_desc">Prazo mais distante</option>
            <option value="created_desc">Mais recentes adicionados</option>
            <option value="title_asc">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Linha inferior: Abas rápidas por status */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
        <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="h-3 w-3" />
          Status:
        </span>

        <button
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('not_started')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            statusFilter === 'not_started'
              ? 'bg-slate-700 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Não iniciados ({counts.not_started})
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('in_progress')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            statusFilter === 'in_progress'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          Em andamento ({counts.in_progress})
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('completed')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Concluídos ({counts.completed})
        </button>
      </div>
    </div>
  );
};

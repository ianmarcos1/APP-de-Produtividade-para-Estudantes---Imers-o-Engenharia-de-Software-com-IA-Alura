import React from 'react';
import { BookOpen, Plus, RotateCcw, Search, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  filterLabel?: string;
  searchQuery?: string;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
  onRestoreSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  filterLabel,
  searchQuery,
  onClearFilters,
  onOpenCreateModal,
  onRestoreSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center sm:p-12 shadow-2xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Search className="h-6 w-6 stroke-[1.8]" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Nenhum objetivo encontrado
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          {searchQuery ? (
            <>
              Não encontramos resultados para a busca "
              <strong className="text-slate-700">{searchQuery}</strong>"
              {filterLabel ? ` no filtro de status "${filterLabel}".` : '.'}
            </>
          ) : (
            `Você não possui nenhum objetivo com o status "${filterLabel}".`
          )}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Limpar filtros e busca
          </button>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Criar novo objetivo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-white p-8 text-center sm:p-14 shadow-2xs">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 ring-8 ring-indigo-50">
          <BookOpen className="h-8 w-8 stroke-[1.8]" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Seu fluxo de estudos começa aqui!
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
        Você ainda não cadastrou nenhum objetivo de estudo. Dê o primeiro passo definindo uma meta simples para hoje ou para a semana.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5 stroke-[2.2]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onRestoreSamples && (
          <button
            type="button"
            onClick={onRestoreSamples}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Carregar exemplos sugeridos</span>
          </button>
        )}
      </div>

      <div className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 text-left">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <span className="text-xs font-bold text-indigo-700">1. Cadastre</span>
          <p className="mt-1 text-xs text-slate-500">Defina o que quer aprender com data limite.</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <span className="text-xs font-bold text-amber-700">2. Pratique</span>
          <p className="mt-1 text-xs text-slate-500">Mude o status para Em andamento ao começar.</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <span className="text-xs font-bold text-emerald-700">3. Conquiste</span>
          <p className="mt-1 text-xs text-slate-500">Marque como Concluído e comemore seu progresso!</p>
        </div>
      </div>
    </div>
  );
};

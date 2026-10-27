import React from 'react';
import { BookOpen, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  completedCount,
  onOpenCreateModal,
}) => {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="border-b border-indigo-100/70 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/30 text-indigo-200 ring-1 ring-indigo-400/40 shadow-inner">
                <BookOpen className="h-6 w-6 text-indigo-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    StudyFlow
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-medium text-indigo-200 ring-1 ring-indigo-400/30">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    Iniciantes
                  </span>
                </div>
                <p className="text-xs text-indigo-200/90 sm:text-sm">
                  Seu espaço acolhedor para organizar e conquistar metas de estudo
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-indigo-950 shadow-md transition-all duration-150 hover:bg-amber-300 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-indigo-900"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
              <span>Novo Objetivo</span>
            </button>
          </div>
        </div>

        {totalCount > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-indigo-200">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>
                Progresso geral: <strong className="text-white">{completedCount}</strong> de{' '}
                <strong className="text-white">{totalCount}</strong> concluídos ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full sm:w-48 bg-indigo-950/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-indigo-700/50">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

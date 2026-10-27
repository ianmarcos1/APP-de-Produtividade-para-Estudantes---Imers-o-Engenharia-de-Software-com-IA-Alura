import React from 'react';
import { CheckCircle2, Clock, ListTodo, PlayCircle } from 'lucide-react';
import { GoalStatus } from '../types/studyGoal';

interface GoalStatsProps {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  activeFilter: GoalStatus | 'all';
  onSelectFilter: (status: GoalStatus | 'all') => void;
}

export const GoalStats: React.FC<GoalStatsProps> = ({
  total,
  notStarted,
  inProgress,
  completed,
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <section aria-label="Estatísticas de objetivos" className="mb-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Cadastrados */}
        <button
          type="button"
          onClick={() => onSelectFilter('all')}
          className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 ${
            activeFilter === 'all'
              ? 'border-indigo-600 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-500/30'
              : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Total Cadastrados
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <ListTodo className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {total}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {total === 1 ? '1 objetivo no total' : `${total} objetivos no total`}
            </p>
          </div>
        </button>

        {/* Não Iniciados */}
        <button
          type="button"
          onClick={() => onSelectFilter('not_started')}
          className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 ${
            activeFilter === 'not_started'
              ? 'border-slate-500 bg-slate-100 shadow-sm ring-2 ring-slate-400/30'
              : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Não Iniciados
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {notStarted}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Aguardando início</p>
          </div>
        </button>

        {/* Em Andamento */}
        <button
          type="button"
          onClick={() => onSelectFilter('in_progress')}
          className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 ${
            activeFilter === 'in_progress'
              ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400/30'
              : 'border-slate-200/80 bg-white hover:border-amber-200 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Em Andamento
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <PlayCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {inProgress}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Estudos em foco</p>
          </div>
        </button>

        {/* Concluídos */}
        <button
          type="button"
          onClick={() => onSelectFilter('completed')}
          className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 ${
            activeFilter === 'completed'
              ? 'border-emerald-600 bg-emerald-50 shadow-sm ring-2 ring-emerald-500/30'
              : 'border-slate-200/80 bg-white hover:border-emerald-200 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Concluídos
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {completed}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Metas atingidas</p>
          </div>
        </button>
      </div>
    </section>
  );
};

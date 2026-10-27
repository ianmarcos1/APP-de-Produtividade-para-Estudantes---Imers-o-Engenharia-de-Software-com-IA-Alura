import React from 'react';
import { Calendar, Check, CheckCircle2, Clock, Edit3, Play, Trash2 } from 'lucide-react';
import { GoalStatus, STATUS_CONFIG, StudyGoal } from '../types/studyGoal';
import { getDeadlineInfo } from '../utils/dateUtils';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onUpdateStatus: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onUpdateStatus,
}) => {
  const isCompleted = goal.status === 'completed';
  const deadlineInfo = getDeadlineInfo(goal.deadline, isCompleted);
  const statusConfig = STATUS_CONFIG[goal.status];

  // Alterna o status rapidamente para agilizar o fluxo do estudante
  const handleQuickNextStatus = () => {
    if (goal.status === 'not_started') {
      onUpdateStatus(goal.id, 'in_progress');
    } else if (goal.status === 'in_progress') {
      onUpdateStatus(goal.id, 'completed');
    } else {
      onUpdateStatus(goal.id, 'in_progress');
    }
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200/80 bg-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200/90 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-indigo-300'
      }`}
    >
      <div>
        {/* Topo do cartão: Badge de Status e Prazo */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Badge do Status */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeBorder}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotBg}`}></span>
            {statusConfig.label}
          </div>

          {/* Badge do Prazo */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${deadlineInfo.badgeClass}`}
            title={`Data limite: ${goal.deadline || 'Não definida'}`}
          >
            <Calendar className="h-3.5 w-3.5 opacity-80" />
            <span>{deadlineInfo.label}</span>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`mt-3.5 text-base font-semibold leading-snug sm:text-lg ${
            isCompleted ? 'text-slate-600 line-through decoration-slate-400' : 'text-slate-900'
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description ? (
          <p
            className={`mt-2 text-sm leading-relaxed whitespace-pre-line ${
              isCompleted ? 'text-slate-500' : 'text-slate-600'
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="mt-2 text-xs italic text-slate-400">
            Nenhuma descrição detalhada adicionada.
          </p>
        )}
      </div>

      {/* Rodapé com Ações */}
      <div className="mt-5 border-t border-slate-100 pt-3.5 flex flex-wrap items-center justify-between gap-2">
        {/* Ação rápida de avanço de status */}
        <div className="flex items-center gap-1">
          {goal.status === 'not_started' && (
            <button
              type="button"
              onClick={handleQuickNextStatus}
              title="Iniciar este estudo agora"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Iniciar estudo</span>
            </button>
          )}

          {goal.status === 'in_progress' && (
            <button
              type="button"
              onClick={handleQuickNextStatus}
              title="Marcar como concluído"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Concluir</span>
            </button>
          )}

          {goal.status === 'completed' && (
            <button
              type="button"
              onClick={handleQuickNextStatus}
              title="Reabrir este objetivo"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Reabrir</span>
            </button>
          )}
        </div>

        {/* Botões de Edição e Exclusão */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Editar objetivo de estudo"
            aria-label={`Editar ${goal.title}`}
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(goal)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 shadow-2xs hover:border-rose-300 hover:bg-rose-50 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
            title="Excluir objetivo de estudo"
            aria-label={`Excluir ${goal.title}`}
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * Utilitários de datas e prazos formatados para estudantes brasileiros
 */

export function formatDateBr(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;

    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export interface DeadlineInfo {
  label: string;
  isUrgent: boolean;
  isOverdue: boolean;
  isToday: boolean;
  badgeClass: string;
}

export function getDeadlineInfo(dateString: string, isCompleted: boolean): DeadlineInfo {
  if (!dateString) {
    return {
      label: 'Sem prazo',
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  }

  if (isCompleted) {
    return {
      label: `Concluído (${formatDateBr(dateString)})`,
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    deadlineDate.setHours(23, 59, 59, 999);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(year, month - 1, day);

    const diffMs = targetDay.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        label: overdueDays === 1 ? 'Venceu ontem' : `Atrasado há ${overdueDays} dias`,
        isUrgent: true,
        isOverdue: true,
        isToday: false,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
      };
    }

    if (diffDays === 0) {
      return {
        label: 'Vence hoje!',
        isUrgent: true,
        isOverdue: false,
        isToday: true,
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold animate-pulse',
      };
    }

    if (diffDays === 1) {
      return {
        label: 'Vence amanhã',
        isUrgent: true,
        isOverdue: false,
        isToday: false,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }

    if (diffDays <= 3) {
      return {
        label: `Restam ${diffDays} dias`,
        isUrgent: true,
        isOverdue: false,
        isToday: false,
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      };
    }

    return {
      label: `Prazo: ${formatDateBr(dateString)}`,
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  } catch {
    return {
      label: dateString,
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  }
}

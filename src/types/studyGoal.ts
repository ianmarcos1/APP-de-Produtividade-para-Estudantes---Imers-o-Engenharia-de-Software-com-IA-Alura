export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export const STATUS_CONFIG: Record<
  GoalStatus,
  {
    label: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    dotBg: string;
  }
> = {
  not_started: {
    label: 'Não iniciado',
    description: 'Objetivo planejado para iniciar em breve',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    dotBg: 'bg-slate-400',
  },
  in_progress: {
    label: 'Em andamento',
    description: 'Estudos em progresso ativo',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotBg: 'bg-amber-500',
  },
  completed: {
    label: 'Concluído',
    description: 'Meta alcançada com sucesso',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    dotBg: 'bg-emerald-500',
  },
};

import React, { useEffect, useState } from 'react';
import { Calendar, HelpCircle, Sparkles, X } from 'lucide-react';
import { GoalFormData, GoalStatus, STATUS_CONFIG, StudyGoal } from '../types/studyGoal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalFormData) => void;
  initialGoal?: StudyGoal | null;
}

const QUICK_INSPIRATIONS = [
  'Aprender lógica de programação básica',
  'Fazer resumo do capítulo 1',
  'Resolver 10 exercícios práticos',
  'Estudar 30 minutos de vocabulário',
];

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [errorMessage, setErrorMessage] = useState('');

  // Sincroniza formulário ao abrir ou trocar initialGoal
  useEffect(() => {
    if (isOpen) {
      if (initialGoal) {
        setTitle(initialGoal.title);
        setDescription(initialGoal.description || '');
        setDeadline(initialGoal.deadline || '');
        setStatus(initialGoal.status);
      } else {
        // Valores padrões amigáveis para novo objetivo
        setTitle('');
        setDescription('');
        // Padrão: daqui a 7 dias
        const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        setDeadline(defaultDeadline);
        setStatus('not_started');
      }
      setErrorMessage('');
    }
  }, [isOpen, initialGoal]);

  // Fecha com tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (title.trim().length < 3) {
      setErrorMessage('O título deve conter pelo menos 3 caracteres.');
      return;
    }

    setErrorMessage('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  const handleApplyQuickTitle = (suggestion: string) => {
    setTitle(suggestion);
    if (errorMessage) setErrorMessage('');
  };

  const setDeadlineOffset = (days: number) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setDeadline(d.toISOString().split('T')[0]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {isEditing ? 'Atualização de Estudo' : 'Novo Planejamento'}
            </span>
            <h2 id="modal-title" className="text-xl font-bold text-slate-900 sm:text-2xl">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Objetivo de Estudo'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {isEditing
                ? 'Atualize os dados e acompanhe o andamento dos seus estudos.'
                : 'Defina uma meta clara e alcançável para começar sem estresse.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Fechar janela"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mensagem de Erro Inline */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 animate-in fade-in">
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-sm font-semibold text-slate-800">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              O que você quer aprender ou praticar? Seja específico.
            </p>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ex: Aprender laços for e while em Python"
              maxLength={120}
              autoFocus
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            {/* Sugestões rápidas para estudantes iniciantes (apenas na criação) */}
            {!isEditing && (
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Sparkles className="h-3 w-3 text-amber-500" /> Ideias para iniciantes:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {QUICK_INSPIRATIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleApplyQuickTitle(suggestion)}
                      className="rounded-lg bg-indigo-50/70 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-sm font-semibold text-slate-800">
              Descrição e anotações <span className="text-xs font-normal text-slate-400">(opcional)</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Materiais de apoio, capítulos, links ou etapas para cumprir a meta.
            </p>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir aos vídeos 1 a 4 da playlist e fazer anotações no caderno."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
            />
          </div>

          {/* Linha com Prazo e Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Campo: Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-sm font-semibold text-slate-800">
                Prazo / Data limite
              </label>
              <p className="text-xs text-slate-500 mb-1.5">
                Até quando você quer concluir?
              </p>
              <div className="relative">
                <input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Atalhos de prazos rápidos */}
              <div className="mt-1.5 flex gap-1.5 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setDeadlineOffset(1)}
                  className="rounded-md bg-slate-100 px-2 py-0.5 hover:bg-slate-200 text-slate-700"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setDeadlineOffset(3)}
                  className="rounded-md bg-slate-100 px-2 py-0.5 hover:bg-slate-200 text-slate-700"
                >
                  +3 dias
                </button>
                <button
                  type="button"
                  onClick={() => setDeadlineOffset(7)}
                  className="rounded-md bg-slate-100 px-2 py-0.5 hover:bg-slate-200 text-slate-700"
                >
                  +1 semana
                </button>
              </div>
            </div>

            {/* Campo: Status */}
            <div>
              <label htmlFor="goal-status" className="block text-sm font-semibold text-slate-800">
                Status atual
              </label>
              <p className="text-xs text-slate-500 mb-1.5">
                Em que fase este objetivo se encontra?
              </p>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="not_started">⚪ Não iniciado</option>
                <option value="in_progress">🟡 Em andamento</option>
                <option value="completed">🟢 Concluído</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                {STATUS_CONFIG[status].description}
              </p>
            </div>
          </div>

          {/* Dica para iniciantes */}
          <div className="rounded-xl bg-indigo-50/60 p-3 text-xs text-indigo-900 flex items-start gap-2 border border-indigo-100">
            <HelpCircle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>Dica pedagógica:</strong> Divida grandes metas em tarefas menores de 25 a 45 minutos. É mais fácil começar com passos simples!
            </p>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

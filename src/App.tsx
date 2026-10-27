import React, { useMemo, useState } from 'react';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { GoalCard } from './components/GoalCard';
import { GoalFilters, SortOption } from './components/GoalFilters';
import { GoalFormModal } from './components/GoalFormModal';
import { GoalStats } from './components/GoalStats';
import { Header } from './components/Header';
import { Toast, ToastMessage } from './components/Toast';
import { storageService } from './services/storageService';
import { GoalFormData, GoalStatus, STATUS_CONFIG, StudyGoal } from './types/studyGoal';

export default function App() {
  // Inicialização síncrona dos objetivos a partir do serviço de localStorage
  const [goals, setGoals] = useState<StudyGoal[]>(() => storageService.getGoals());

  // Estados dos modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<StudyGoal | null>(null);

  // Estados de busca, filtros e ordenação
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadline_asc');

  // Feedback flutuante
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      text,
      type,
    });
  };

  // Contagens para os cards de estatísticas
  const counts = useMemo(() => {
    return {
      all: goals.length,
      not_started: goals.filter((g) => g.status === 'not_started').length,
      in_progress: goals.filter((g) => g.status === 'in_progress').length,
      completed: goals.filter((g) => g.status === 'completed').length,
    };
  }, [goals]);

  // Filtragem e ordenação dos objetivos
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (statusFilter !== 'all' && goal.status !== statusFilter) {
          return false;
        }

        // Filtro por texto de busca
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(query);
          const matchDescription = (goal.description || '').toLowerCase().includes(query);
          return matchTitle || matchDescription;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline_asc') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        }
        if (sortBy === 'deadline_desc') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return b.deadline.localeCompare(a.deadline);
        }
        if (sortBy === 'created_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [goals, statusFilter, searchQuery, sortBy]);

  // Abertura do formulário de criação
  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  // Abertura do formulário de edição
  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  // Submissão do formulário (Criar ou Atualizar)
  const handleFormSubmit = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.addGoal(formData);
      setGoals((prev) => [created, ...prev]);
      showToast('Objetivo cadastrado com sucesso!');
    }
    setIsFormModalOpen(false);
    setEditingGoal(null);
  };

  // Solicitação de exclusão (Abre modal de confirmação)
  const handleRequestDelete = (goal: StudyGoal) => {
    setDeletingGoal(goal);
  };

  // Confirmação efetiva da exclusão
  const handleConfirmDelete = () => {
    if (!deletingGoal) return;
    const success = storageService.deleteGoal(deletingGoal.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== deletingGoal.id));
      showToast('Objetivo excluído com sucesso!');
    }
    setDeletingGoal(null);
  };

  // Atualização rápida de status direto do card
  const handleUpdateStatus = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      const statusLabel = STATUS_CONFIG[newStatus].label;
      showToast(`Status atualizado para "${statusLabel}"!`, 'info');
    }
  };

  // Restauração de objetivos exemplos para estudantes iniciantes
  const handleRestoreSamples = () => {
    const samples = storageService.restoreSamples();
    setGoals(samples);
    setSearchQuery('');
    setStatusFilter('all');
    showToast('Exemplos de objetivos de estudo restaurados!');
  };

  // Limpeza de filtros
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased">
      {/* Cabeçalho */}
      <Header
        totalCount={counts.all}
        completedCount={counts.completed}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Painel de Estatísticas e Total de Objetivos Cadastrados */}
        <GoalStats
          total={counts.all}
          notStarted={counts.not_started}
          inProgress={counts.in_progress}
          completed={counts.completed}
          activeFilter={statusFilter}
          onSelectFilter={setStatusFilter}
        />

        {/* Barra de Filtros, Pesquisa e Ordenação (exibida quando há objetivos cadastrados) */}
        {counts.all > 0 && (
          <GoalFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />
        )}

        {/* Listagem de Objetivos ou Estados Vazios */}
        {counts.all === 0 ? (
          // Estado vazio global: nenhum objetivo cadastrado ainda
          <EmptyState
            isFiltered={false}
            onClearFilters={handleClearFilters}
            onOpenCreateModal={handleOpenCreateModal}
            onRestoreSamples={handleRestoreSamples}
          />
        ) : filteredAndSortedGoals.length === 0 ? (
          // Estado vazio por filtro/pesquisa
          <EmptyState
            isFiltered={true}
            filterLabel={statusFilter !== 'all' ? STATUS_CONFIG[statusFilter].label : undefined}
            searchQuery={searchQuery}
            onClearFilters={handleClearFilters}
            onOpenCreateModal={handleOpenCreateModal}
          />
        ) : (
          // Grid de Cartões de Objetivos
          <section aria-label="Lista de objetivos de estudo">
            <div className="mb-3.5 flex items-center justify-between text-xs text-slate-500">
              <span>
                Exibindo <strong>{filteredAndSortedGoals.length}</strong> de{' '}
                <strong>{counts.all}</strong> objetivos cadastrados
              </span>
              {statusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Ver todos os status
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditModal}
                  onRequestDelete={handleRequestDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>StudyFlow</strong> • Desenvolvido para ajudar estudantes a aprender com foco e tranquilidade.
          </p>
          <p className="text-slate-400">
            Seus dados ficam salvos com segurança no seu próprio navegador.
          </p>
        </div>
      </footer>

      {/* Modal de Cadastro e Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        initialGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={Boolean(deletingGoal)}
        goal={deletingGoal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingGoal(null)}
      />

      {/* Feedback / Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

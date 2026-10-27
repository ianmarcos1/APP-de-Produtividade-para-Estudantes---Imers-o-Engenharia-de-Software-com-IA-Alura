import { GoalFormData, StudyGoal } from '../types/studyGoal';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_KEY = 'studyflow_initialized_v1';

// Exemplos iniciais acolhedores para estudantes iniciantes
export const DEFAULT_SAMPLE_GOALS: StudyGoal[] = [
  {
    id: 'sample-1',
    title: 'Dominar os fundamentos de Lógica de Programação',
    description: 'Compreender variáveis, condicionais (if/else) e laços de repetição praticando 5 exercícios por dia.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Ler o Capítulo 1 do livro de História Moderna',
    description: 'Fazer fichamento com as causas e consequências da Revolução Industrial para o trabalho da próxima semana.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'not_started',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Configurar meu ambiente e ferramentas de estudo',
    description: 'Instalar o navegador limpo para foco, editor de texto e separar um caderno dedicado a anotações.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage
   */
  getGoals(): StudyGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Se nunca foi inicializado, popula com os exemplos para recepcionar o estudante
        const isInitialized = localStorage.getItem(INITIALIZED_KEY);
        if (!isInitialized) {
          this.saveGoals(DEFAULT_SAMPLE_GOALS);
          localStorage.setItem(INITIALIZED_KEY, 'true');
          return DEFAULT_SAMPLE_GOALS;
        }
        return [];
      }
      return JSON.parse(data) as StudyGoal[];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Adiciona um novo objetivo de estudo
   */
  addGoal(formData: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const now = new Date().toISOString();
    const newGoal: StudyGoal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente pelo ID
   */
  updateGoal(id: string, updates: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updatedGoal: StudyGoal = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Remove um objetivo pelo ID
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;

    this.saveGoals(filtered);
    return true;
  },

  /**
   * Limpa todos e restaura exemplos acolhedores
   */
  restoreSamples(): StudyGoal[] {
    this.saveGoals(DEFAULT_SAMPLE_GOALS);
    return DEFAULT_SAMPLE_GOALS;
  },

  /**
   * Limpa todos os objetivos
   */
  clearAll(): void {
    this.saveGoals([]);
  },
};

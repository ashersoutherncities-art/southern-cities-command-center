// API client for dashboard backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Tasks
  async getTasks(filters?: { status?: string; priority?: string; category?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/tasks?${params}`);
  }

  async createTask(task: any) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, updates: any) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: number) {
    return this.request(`/api/tasks/${id}`, { method: 'DELETE' });
  }

  // Ideas
  async getIdeas(filters?: { status?: string; category?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/ideas?${params}`);
  }

  async createIdea(idea: any) {
    return this.request('/api/ideas', {
      method: 'POST',
      body: JSON.stringify(idea),
    });
  }

  async updateIdea(id: number, updates: any) {
    return this.request(`/api/ideas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Projects
  async getProjects(filters?: { status?: string; category?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/projects?${params}`);
  }

  async createProject(project: any) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: number, updates: any) {
    return this.request(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Goals
  async getGoals(filters?: { timeframe?: string; category?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/goals?${params}`);
  }

  async createGoal(goal: any) {
    return this.request('/api/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoal(id: number, updates: any) {
    return this.request(`/api/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Notes
  async getNotes(filters?: { category?: string; limit?: number }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/notes?${params}`);
  }

  async createNote(note: any) {
    return this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  // Relationships
  async getRelationships(filters?: { category?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/relationships?${params}`);
  }

  async createRelationship(relationship: any) {
    return this.request('/api/relationships', {
      method: 'POST',
      body: JSON.stringify(relationship),
    });
  }

  async updateRelationship(id: number, updates: any) {
    return this.request(`/api/relationships/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Metrics
  async getMetrics() {
    return this.request('/api/metrics');
  }

  // External integrations
  async getDeals() {
    return this.request('/api/deals');
  }

  async getCalendar() {
    return this.request('/api/calendar');
  }

  // Habits
  async getHabits(filters?: { active_only?: boolean }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/habits?${params}`);
  }

  async createHabit(habit: any) {
    return this.request('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  }

  async updateHabit(id: number, updates: any) {
    return this.request(`/api/habits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getTodayHabits() {
    return this.request('/api/habits/today');
  }

  async completeHabit(id: number, date?: string, notes?: string) {
    return this.request(`/api/habits/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ date, notes }),
    });
  }

  async uncompleteHabit(id: number, date: string) {
    return this.request(`/api/habits/${id}/complete/${date}`, {
      method: 'DELETE',
    });
  }

  async getHabitCompletions(filters?: { start_date?: string; end_date?: string; habit_id?: number }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/habits/completions?${params}`);
  }

  // Weight Tracker
  async getWeightEntries(days?: number) {
    const params = new URLSearchParams({ days: days?.toString() || '90' });
    return this.request(`/api/weight?${params}`);
  }

  async addWeightEntry(entry: { weight_lbs: number; date?: string; notes?: string }) {
    return this.request('/api/weight', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async getWeightGoal() {
    return this.request('/api/weight/goal');
  }

  async setWeightGoal(goal: { goal_weight: number; target_date?: string }) {
    return this.request('/api/weight/goal', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async getWeightStats() {
    return this.request('/api/weight/stats');
  }

  // Books & Reading
  async getBooks(filters?: { status?: string }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/api/books?${params}`);
  }

  async createBook(book: any) {
    return this.request('/api/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: number, updates: any) {
    return this.request(`/api/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteBook(id: number) {
    return this.request(`/api/books/${id}`, {
      method: 'DELETE',
    });
  }

  async getBookNotes(bookId: number) {
    return this.request(`/api/books/${bookId}/notes`);
  }

  async addBookNote(bookId: number, note: { page?: number; note_type?: string; content: string }) {
    return this.request(`/api/books/${bookId}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async deleteReadingNote(noteId: number) {
    return this.request(`/api/reading-notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async searchReadingNotes(query: string) {
    const params = new URLSearchParams({ q: query });
    return this.request(`/api/reading-notes/search?${params}`);
  }

  async getReadingGoals() {
    return this.request('/api/reading/goals');
  }

  async createReadingGoal(goal: any) {
    return this.request('/api/reading/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async getReadingStats() {
    return this.request('/api/reading/stats');
  }
}

export const api = new ApiClient(API_BASE_URL);

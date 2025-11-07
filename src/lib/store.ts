// In-memory data store (replaces database)

import { TimeEntry, Task, Project, TaskStatus, Priority } from '@/src/types';

// In-memory storage
const store = {
  timeEntries: [] as TimeEntry[],
  tasks: [] as Task[],
  projects: [] as Project[],
};

// Helper function to generate IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Time Entry Store
export const timeStore = {
  findActive: (): TimeEntry | null => {
    return store.timeEntries.find(entry => !entry.endTime) || null;
  },

  create: (data: Partial<TimeEntry>): TimeEntry => {
    const entry: TimeEntry = {
      id: generateId(),
      startTime: data.startTime || new Date(),
      endTime: data.endTime,
      duration: data.duration,
      description: data.description,
      userId: data.userId || 'demo-user',
      taskId: data.taskId,
      projectId: data.projectId,
      isManual: data.isManual || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.timeEntries.push(entry);
    return entry;
  },

  update: (id: string, data: Partial<TimeEntry>): TimeEntry | null => {
    const index = store.timeEntries.findIndex(entry => entry.id === id);
    if (index === -1) return null;
    
    store.timeEntries[index] = {
      ...store.timeEntries[index],
      ...data,
      updatedAt: new Date(),
    };
    return store.timeEntries[index];
  },

  findById: (id: string): TimeEntry | null => {
    return store.timeEntries.find(entry => entry.id === id) || null;
  },

  findAll: (filters?: { startDate?: Date; endDate?: Date; projectId?: string; taskId?: string; limit?: number }): TimeEntry[] => {
    let filtered = [...store.timeEntries];

    if (filters?.startDate) {
      filtered = filtered.filter(entry => entry.startTime >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(entry => entry.startTime <= filters.endDate!);
    }
    if (filters?.projectId) {
      filtered = filtered.filter(entry => entry.projectId === filters.projectId);
    }
    if (filters?.taskId) {
      filtered = filtered.filter(entry => entry.taskId === filters.taskId);
    }

    filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  },

  delete: (id: string): boolean => {
    const index = store.timeEntries.findIndex(entry => entry.id === id);
    if (index === -1) return false;
    store.timeEntries.splice(index, 1);
    return true;
  },
};

// Task Store
export const taskStore = {
  findAll: (filters?: { status?: TaskStatus; priority?: Priority; projectId?: string }): Task[] => {
    let filtered = [...store.tasks];

    if (filters?.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters?.projectId) {
      filtered = filtered.filter(task => task.projectId === filters.projectId);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  findById: (id: string): Task | null => {
    return store.tasks.find(task => task.id === id) || null;
  },

  create: (data: Partial<Task>): Task => {
    const task: Task = {
      id: generateId(),
      title: data.title || '',
      description: data.description,
      status: data.status || TaskStatus.TODO,
      priority: data.priority || Priority.MEDIUM,
      projectId: data.projectId,
      userId: data.userId || 'demo-user',
      dueDate: data.dueDate,
      completedAt: data.completedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.tasks.push(task);
    return task;
  },

  update: (id: string, data: Partial<Task>): Task | null => {
    const index = store.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    const updates: Partial<Task> = { ...data, updatedAt: new Date() };
    
    if (data.status === TaskStatus.DONE && store.tasks[index].status !== TaskStatus.DONE) {
      updates.completedAt = new Date();
    }

    store.tasks[index] = {
      ...store.tasks[index],
      ...updates,
    };
    return store.tasks[index];
  },

  delete: (id: string): boolean => {
    const index = store.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    store.tasks.splice(index, 1);
    return true;
  },
};

// Project Store
export const projectStore = {
  findAll: (includeArchived = false): Project[] => {
    let filtered = [...store.projects];

    if (!includeArchived) {
      filtered = filtered.filter(project => !project.isArchived);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  findById: (id: string): Project | null => {
    return store.projects.find(project => project.id === id) || null;
  },

  create: (data: Partial<Project>): Project => {
    const project: Project = {
      id: generateId(),
      name: data.name || '',
      description: data.description,
      color: data.color || '#3B82F6',
      isArchived: data.isArchived || false,
      userId: data.userId || 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.projects.push(project);
    return project;
  },

  update: (id: string, data: Partial<Project>): Project | null => {
    const index = store.projects.findIndex(project => project.id === id);
    if (index === -1) return null;

    store.projects[index] = {
      ...store.projects[index],
      ...data,
      updatedAt: new Date(),
    };
    return store.projects[index];
  },

  delete: (id: string): boolean => {
    const index = store.projects.findIndex(project => project.id === id);
    if (index === -1) return false;
    store.projects.splice(index, 1);
    return true;
  },
};

// Helper functions for stats
export const statsHelper = {
  getTimeStats: () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEntries = store.timeEntries.filter(e => e.startTime >= todayStart && e.duration);
    const weekEntries = store.timeEntries.filter(e => e.startTime >= weekStart && e.duration);
    const monthEntries = store.timeEntries.filter(e => e.startTime >= monthStart && e.duration);

    return {
      today: todayEntries.reduce((sum, e) => sum + (e.duration || 0), 0),
      thisWeek: weekEntries.reduce((sum, e) => sum + (e.duration || 0), 0),
      thisMonth: monthEntries.reduce((sum, e) => sum + (e.duration || 0), 0),
      totalTasks: store.tasks.length,
      completedTasks: store.tasks.filter(t => t.status === TaskStatus.DONE).length,
      activeProjects: store.projects.filter(p => !p.isArchived).length,
    };
  },

  getProjectStats: (projectId: string) => {
    const project = projectStore.findById(projectId);
    if (!project) return null;

    const projectTasks = store.tasks.filter(t => t.projectId === projectId);
    const projectEntries = store.timeEntries.filter(e => e.projectId === projectId);
    const totalTime = projectEntries.reduce((sum, e) => sum + (e.duration || 0), 0);

    return {
      project,
      totalTime,
      tasksCount: projectTasks.length,
      completedTasks: projectTasks.filter(t => t.status === TaskStatus.DONE).length,
      timeEntries: projectEntries,
    };
  },
};


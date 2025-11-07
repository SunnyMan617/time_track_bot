// Type definitions for the Time Tracking Bot

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TimeEntry {
  id: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  userId: string;
  taskId?: string;
  projectId?: string;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: string;
  userId: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  isArchived: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface TimeStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalTasks: number;
  completedTasks: number;
  activeProjects: number;
}

export interface DailyStats {
  date: string;
  duration: number;
  entriesCount: number;
}

export interface ProjectStats {
  projectId: string;
  projectName: string;
  totalTime: number;
  tasksCount: number;
  color: string;
}


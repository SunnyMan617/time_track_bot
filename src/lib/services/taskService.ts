// Task Service

import prisma from '../db';
import { TaskStatus, Priority } from '../../types';
import { Prisma } from '@prisma/client';

export class TaskService {
  static async createTask(
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: Priority;
      projectId?: string;
      dueDate?: Date;
    }
  ) {
    const task = await prisma.task.create({
      data: {
        userId,
        ...data,
      },
      include: {
        project: true,
      },
    });

    return task;
  }

  static async updateTask(
    userId: string,
    taskId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: Priority;
      projectId?: string;
      dueDate?: Date;
    }
  ) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const completedAt = data.status === 'DONE' && task.status !== 'DONE' ? new Date() : task.completedAt;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        completedAt,
      },
      include: {
        project: true,
        timeEntries: true,
      },
    });

    return updatedTask;
  }

  static async deleteTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({ where: { id: taskId } });
    return task;
  }

  static async getTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
      include: {
        project: true,
        timeEntries: {
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  static async getTasks(
    userId: string,
    options?: {
      status?: TaskStatus;
      projectId?: string;
      priority?: Priority;
    }
  ) {
    const where: Prisma.TaskWhereInput = { userId };

    if (options?.status) where.status = options.status;
    if (options?.projectId) where.projectId = options.projectId;
    if (options?.priority) where.priority = options.priority;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: true,
        timeEntries: true,
      },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    });

    return tasks;
  }
}


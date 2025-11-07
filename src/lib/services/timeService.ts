// Time Entry Service

import prisma from '../db';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export class TimeService {
  static async startTimer(userId: string, taskId?: string, projectId?: string, description?: string) {
    // Check if there's already an active timer
    const activeTimer = await prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    if (activeTimer) {
      throw new Error('You already have an active timer. Stop it first.');
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId,
        taskId,
        projectId,
        description,
        startTime: new Date(),
      },
      include: {
        task: true,
        project: true,
      },
    });

    return timeEntry;
  }

  static async stopTimer(userId: string, entryId: string) {
    const timeEntry = await prisma.timeEntry.findFirst({
      where: {
        id: entryId,
        userId,
        endTime: null,
      },
    });

    if (!timeEntry) {
      throw new Error('No active timer found');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - timeEntry.startTime.getTime()) / 1000);

    const updatedEntry = await prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        endTime,
        duration,
      },
      include: {
        task: true,
        project: true,
      },
    });

    return updatedEntry;
  }

  static async getActiveTimer(userId: string) {
    const activeTimer = await prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
      include: {
        task: true,
        project: true,
      },
    });

    return activeTimer;
  }

  static async createManualEntry(
    userId: string,
    startTime: Date,
    endTime: Date,
    taskId?: string,
    projectId?: string,
    description?: string
  ) {
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId,
        taskId,
        projectId,
        description,
        startTime,
        endTime,
        duration,
        isManual: true,
      },
      include: {
        task: true,
        project: true,
      },
    });

    return timeEntry;
  }

  static async getTimeEntries(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      projectId?: string;
      taskId?: string;
      limit?: number;
    }
  ) {
    const where: any = { userId };

    if (options?.startDate || options?.endDate) {
      where.startTime = {};
      if (options.startDate) where.startTime.gte = options.startDate;
      if (options.endDate) where.startTime.lte = options.endDate;
    }

    if (options?.projectId) where.projectId = options.projectId;
    if (options?.taskId) where.taskId = options.taskId;

    const entries = await prisma.timeEntry.findMany({
      where,
      include: {
        task: true,
        project: true,
      },
      orderBy: { startTime: 'desc' },
      take: options?.limit,
    });

    return entries;
  }

  static async getTimeStats(userId: string) {
    const now = new Date();

    const [todayEntries, weekEntries, monthEntries, totalTasks, completedTasks, activeProjects] =
      await Promise.all([
        prisma.timeEntry.aggregate({
          where: {
            userId,
            startTime: {
              gte: startOfDay(now),
              lte: endOfDay(now),
            },
          },
          _sum: { duration: true },
        }),
        prisma.timeEntry.aggregate({
          where: {
            userId,
            startTime: {
              gte: startOfWeek(now),
              lte: endOfWeek(now),
            },
          },
          _sum: { duration: true },
        }),
        prisma.timeEntry.aggregate({
          where: {
            userId,
            startTime: {
              gte: startOfMonth(now),
              lte: endOfMonth(now),
            },
          },
          _sum: { duration: true },
        }),
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: 'DONE' } }),
        prisma.project.count({ where: { userId, isArchived: false } }),
      ]);

    return {
      today: todayEntries._sum.duration || 0,
      thisWeek: weekEntries._sum.duration || 0,
      thisMonth: monthEntries._sum.duration || 0,
      totalTasks,
      completedTasks,
      activeProjects,
    };
  }

  static async deleteTimeEntry(userId: string, entryId: string) {
    const entry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!entry) {
      throw new Error('Time entry not found');
    }

    await prisma.timeEntry.delete({ where: { id: entryId } });
    return entry;
  }

  static async updateTimeEntry(
    userId: string,
    entryId: string,
    data: {
      description?: string;
      startTime?: Date;
      endTime?: Date;
      taskId?: string;
      projectId?: string;
    }
  ) {
    const entry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!entry) {
      throw new Error('Time entry not found');
    }

    let duration = entry.duration;
    if (data.startTime || data.endTime) {
      const start = data.startTime || entry.startTime;
      const end = data.endTime || entry.endTime;
      if (end) {
        duration = Math.floor((end.getTime() - start.getTime()) / 1000);
      }
    }

    const updatedEntry = await prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        ...data,
        duration,
      },
      include: {
        task: true,
        project: true,
      },
    });

    return updatedEntry;
  }
}


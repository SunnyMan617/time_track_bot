// Project Service

import prisma from '../db';

export class ProjectService {
  static async createProject(
    userId: string,
    data: {
      name: string;
      description?: string;
      color?: string;
    }
  ) {
    const project = await prisma.project.create({
      data: {
        userId,
        ...data,
      },
    });

    return project;
  }

  static async updateProject(
    userId: string,
    projectId: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      isArchived?: boolean;
    }
  ) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        tasks: true,
        timeEntries: true,
      },
    });

    return updatedProject;
  }

  static async deleteProject(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await prisma.project.delete({ where: { id: projectId } });
    return project;
  }

  static async getProject(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        timeEntries: {
          orderBy: { startTime: 'desc' },
          take: 10,
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  static async getProjects(userId: string, includeArchived: boolean = false) {
    const where: any = { userId };
    if (!includeArchived) {
      where.isArchived = false;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        tasks: true,
        timeEntries: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }

  static async getProjectStats(userId: string, projectId: string) {
    const [project, totalTime, tasksCount, completedTasks] = await Promise.all([
      prisma.project.findFirst({
        where: { id: projectId, userId },
      }),
      prisma.timeEntry.aggregate({
        where: { projectId, userId },
        _sum: { duration: true },
      }),
      prisma.task.count({
        where: { projectId, userId },
      }),
      prisma.task.count({
        where: { projectId, userId, status: 'DONE' },
      }),
    ]);

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      projectId,
      projectName: project.name,
      totalTime: totalTime._sum.duration || 0,
      tasksCount,
      completedTasks,
      color: project.color,
    };
  }
}


// Tasks API Routes

import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/src/lib/services/taskService';
import { TaskStatus, Priority } from '@/src/types';
import { z } from 'zod';

// Default user ID for single-user mode (no authentication)
const DEFAULT_USER_ID = 'demo-user';

const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
});

const UpdateTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
});

// GET: Get tasks
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');

    if (taskId) {
      const task = await TaskService.getTask(DEFAULT_USER_ID, taskId);
      return NextResponse.json({ data: task });
    }

    const status = searchParams.get('status') as TaskStatus | null;
    const priority = searchParams.get('priority') as Priority | null;
    const projectId = searchParams.get('projectId');

    const tasks = await TaskService.getTasks(DEFAULT_USER_ID, {
      status: status || undefined,
      priority: priority || undefined,
      projectId: projectId || undefined,
    });

    return NextResponse.json({ data: tasks });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST: Create task
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateTaskSchema.parse(body);

    const task = await TaskService.createTask(DEFAULT_USER_ID, {
      title: validated.title,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      projectId: validated.projectId,
      dueDate: validated.dueDate,
    });

    return NextResponse.json({ data: task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT: Update task
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UpdateTaskSchema.parse(body);

    const task = await TaskService.updateTask(DEFAULT_USER_ID, validated.taskId, {
      title: validated.title,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      projectId: validated.projectId,
      dueDate: validated.dueDate,
    });

    return NextResponse.json({ data: task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE: Delete task
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'Missing taskId' }, { status: 400 });
    }

    const task = await TaskService.deleteTask(DEFAULT_USER_ID, taskId);
    return NextResponse.json({ data: task });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}


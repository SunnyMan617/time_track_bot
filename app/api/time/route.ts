// Time Entries API Routes

import { NextRequest, NextResponse } from 'next/server';
import { timeStore, statsHelper } from '@/src/lib/store';
import { z } from 'zod';

// Default user ID for single-user mode (no authentication)
const DEFAULT_USER_ID = 'demo-user';

const StartTimerSchema = z.object({
  taskId: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().optional(),
});

const StopTimerSchema = z.object({
  entryId: z.string(),
});

const ManualEntrySchema = z.object({
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  taskId: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().optional(),
});

// GET: Get time entries
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'active') {
      const activeTimer = timeStore.findActive();
      return NextResponse.json({ data: activeTimer });
    }

    if (action === 'stats') {
      const stats = statsHelper.getTimeStats();
      return NextResponse.json({ data: stats });
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const projectId = searchParams.get('projectId');
    const taskId = searchParams.get('taskId');
    const limit = searchParams.get('limit');

    const entries = timeStore.findAll({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      projectId: projectId || undefined,
      taskId: taskId || undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ data: entries });
  } catch (error) {
    console.error('Get time entries error:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

// POST: Start timer or create manual entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'start') {
      const validated = StartTimerSchema.parse(body);
      
      // Check if there's already an active timer
      const activeTimer = timeStore.findActive();
      if (activeTimer) {
        return NextResponse.json({ error: 'There is already an active timer' }, { status: 400 });
      }

      const entry = timeStore.create({
        userId: DEFAULT_USER_ID,
        startTime: new Date(),
        taskId: validated.taskId,
        projectId: validated.projectId,
        description: validated.description,
        isManual: false,
      });
      return NextResponse.json({ data: entry });
    }

    if (action === 'stop') {
      const validated = StopTimerSchema.parse(body);
      const entry = timeStore.findById(validated.entryId);
      
      if (!entry) {
        return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
      }

      if (entry.endTime) {
        return NextResponse.json({ error: 'Timer already stopped' }, { status: 400 });
      }

      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000);
      
      const updated = timeStore.update(validated.entryId, {
        endTime,
        duration,
      });
      
      return NextResponse.json({ data: updated });
    }

    if (action === 'manual') {
      const validated = ManualEntrySchema.parse(body);
      const duration = Math.floor((validated.endTime.getTime() - validated.startTime.getTime()) / 1000);
      
      const entry = timeStore.create({
        userId: DEFAULT_USER_ID,
        startTime: validated.startTime,
        endTime: validated.endTime,
        duration,
        taskId: validated.taskId,
        projectId: validated.projectId,
        description: validated.description,
        isManual: true,
      });
      return NextResponse.json({ data: entry });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Time entry error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// PUT: Update time entry
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { entryId, ...data } = body;

    if (!entryId) {
      return NextResponse.json({ error: 'Missing entryId' }, { status: 400 });
    }

    const updates: any = {};
    if (data.description !== undefined) updates.description = data.description;
    if (data.startTime) updates.startTime = new Date(data.startTime);
    if (data.endTime) updates.endTime = new Date(data.endTime);
    if (data.taskId !== undefined) updates.taskId = data.taskId;
    if (data.projectId !== undefined) updates.projectId = data.projectId;

    if (updates.startTime && updates.endTime) {
      updates.duration = Math.floor((updates.endTime.getTime() - updates.startTime.getTime()) / 1000);
    }

    const entry = timeStore.update(entryId, updates);
    
    if (!entry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }

    return NextResponse.json({ data: entry });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Update time entry error:', error);
    return NextResponse.json({ error: 'Failed to update time entry' }, { status: 500 });
  }
}

// DELETE: Delete time entry
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json({ error: 'Missing entryId' }, { status: 400 });
    }

    const deleted = timeStore.delete(entryId);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Delete time entry error:', error);
    return NextResponse.json({ error: 'Failed to delete time entry' }, { status: 500 });
  }
}


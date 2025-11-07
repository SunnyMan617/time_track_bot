// Time Entries API Routes

import { NextRequest, NextResponse } from 'next/server';
import { TimeService } from '@/src/lib/services/timeService';
import { z } from 'zod';

const StartTimerSchema = z.object({
  userId: z.string(),
  taskId: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().optional(),
});

const StopTimerSchema = z.object({
  userId: z.string(),
  entryId: z.string(),
});

const ManualEntrySchema = z.object({
  userId: z.string(),
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
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (action === 'active') {
      const activeTimer = await TimeService.getActiveTimer(userId);
      return NextResponse.json({ data: activeTimer });
    }

    if (action === 'stats') {
      const stats = await TimeService.getTimeStats(userId);
      return NextResponse.json({ data: stats });
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const projectId = searchParams.get('projectId');
    const taskId = searchParams.get('taskId');
    const limit = searchParams.get('limit');

    const entries = await TimeService.getTimeEntries(userId, {
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
      const entry = await TimeService.startTimer(
        validated.userId,
        validated.taskId,
        validated.projectId,
        validated.description
      );
      return NextResponse.json({ data: entry });
    }

    if (action === 'stop') {
      const validated = StopTimerSchema.parse(body);
      const entry = await TimeService.stopTimer(validated.userId, validated.entryId);
      return NextResponse.json({ data: entry });
    }

    if (action === 'manual') {
      const validated = ManualEntrySchema.parse(body);
      const entry = await TimeService.createManualEntry(
        validated.userId,
        validated.startTime,
        validated.endTime,
        validated.taskId,
        validated.projectId,
        validated.description
      );
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
    const { userId, entryId, ...data } = body;

    if (!userId || !entryId) {
      return NextResponse.json({ error: 'Missing userId or entryId' }, { status: 400 });
    }

    const entry = await TimeService.updateTimeEntry(userId, entryId, {
      description: data.description,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      taskId: data.taskId,
      projectId: data.projectId,
    });

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
    const userId = searchParams.get('userId');
    const entryId = searchParams.get('entryId');

    if (!userId || !entryId) {
      return NextResponse.json({ error: 'Missing userId or entryId' }, { status: 400 });
    }

    const entry = await TimeService.deleteTimeEntry(userId, entryId);
    return NextResponse.json({ data: entry });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Delete time entry error:', error);
    return NextResponse.json({ error: 'Failed to delete time entry' }, { status: 500 });
  }
}


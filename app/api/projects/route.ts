// Projects API Routes

import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/src/lib/services/projectService';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
});

const UpdateProjectSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  isArchived: z.boolean().optional(),
});

// GET: Get projects
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');
    const includeArchived = searchParams.get('includeArchived') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (projectId) {
      const action = searchParams.get('action');
      if (action === 'stats') {
        const stats = await ProjectService.getProjectStats(userId, projectId);
        return NextResponse.json({ data: stats });
      }
      const project = await ProjectService.getProject(userId, projectId);
      return NextResponse.json({ data: project });
    }

    const projects = await ProjectService.getProjects(userId, includeArchived);
    return NextResponse.json({ data: projects });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST: Create project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateProjectSchema.parse(body);

    const project = await ProjectService.createProject(validated.userId, {
      name: validated.name,
      description: validated.description,
      color: validated.color,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT: Update project
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UpdateProjectSchema.parse(body);

    const project = await ProjectService.updateProject(validated.userId, validated.projectId, {
      name: validated.name,
      description: validated.description,
      color: validated.color,
      isArchived: validated.isArchived,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE: Delete project
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'Missing userId or projectId' }, { status: 400 });
    }

    const project = await ProjectService.deleteProject(userId, projectId);
    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}


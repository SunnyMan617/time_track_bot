// Projects API Routes

import { NextRequest, NextResponse } from 'next/server';
import { projectStore, taskStore, timeStore, statsHelper } from '@/src/lib/store';
import { z } from 'zod';

// Default user ID for single-user mode (no authentication)
const DEFAULT_USER_ID = 'demo-user';

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
});

const UpdateProjectSchema = z.object({
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
    const projectId = searchParams.get('projectId');
    const includeArchived = searchParams.get('includeArchived') === 'true';

    if (projectId) {
      const action = searchParams.get('action');
      if (action === 'stats') {
        const stats = statsHelper.getProjectStats(projectId);
        if (!stats) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json({ data: stats });
      }
      
      const project = projectStore.findById(projectId);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      // Include tasks and time entries
      const tasks = taskStore.findAll({ projectId });
      const timeEntries = timeStore.findAll({ projectId });
      
      return NextResponse.json({ 
        data: { 
          ...project, 
          tasks,
          timeEntries 
        } 
      });
    }

    const projects = projectStore.findAll(includeArchived);
    
    // Add tasks and timeEntries count to each project
    const projectsWithData = projects.map(project => {
      const tasks = taskStore.findAll({ projectId: project.id });
      const timeEntries = timeStore.findAll({ projectId: project.id });
      return {
        ...project,
        tasks,
        timeEntries,
      };
    });
    
    return NextResponse.json({ data: projectsWithData });
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

    const project = projectStore.create({
      userId: DEFAULT_USER_ID,
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

    const updates: any = {};
    if (validated.name !== undefined) updates.name = validated.name;
    if (validated.description !== undefined) updates.description = validated.description;
    if (validated.color !== undefined) updates.color = validated.color;
    if (validated.isArchived !== undefined) updates.isArchived = validated.isArchived;

    const project = projectStore.update(validated.projectId, updates);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

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
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    const deleted = projectStore.delete(projectId);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}


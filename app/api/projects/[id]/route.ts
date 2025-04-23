import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserIdFromToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  budget: z.number().min(0, 'Budget must be a positive number'),
  deadline: z.string().datetime('Invalid deadline date'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  clientId: z.string().min(1, 'Client ID is required'),
});

// GET /api/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        client: {
          userId,
        },
      },
      include: {
        client: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Error fetching project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    const body = await request.json();
    
    const validatedData = projectSchema.parse(body);
    
    // Verify that the project belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        client: {
          userId,
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify that the new client belongs to the user
    const client = await prisma.client.findFirst({
      where: {
        id: validatedData.clientId,
        userId,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Client not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        client: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Error updating project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    
    // Verify that the project belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        client: {
          userId,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { message: 'Error deleting project' },
      { status: 500 }
    );
  }
} 
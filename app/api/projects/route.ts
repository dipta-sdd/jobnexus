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

// GET /api/projects - Get all projects for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    const projects = await prisma.project.findMany({
      where: {
        client: {
          userId,
        },
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Error fetching projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const body = await request.json();
    
    const validatedData = projectSchema.parse(body);
    
    // Verify that the client belongs to the user
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

    const project = await prisma.project.create({
      data: validatedData,
      include: {
        client: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Error creating project' },
      { status: 500 }
    );
  }
}

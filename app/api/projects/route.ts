import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  budget: z.number().min(0),
  deadline: z.string().datetime(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']),
  clientId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // Get search parameter
      const searchQuery = searchParams.get('search');
      
      // Get sort parameters
      const sortField = searchParams.get('sortField') || 'title';
      const sortOrder = searchParams.get('sortOrder') || 'asc';

      // Build where clause for search
      const where: any = {
        userId: user.id,
      };

      if (searchQuery) {
        where.OR = [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { status: { contains: searchQuery, mode: 'insensitive' } },
          { client: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ];
      }

      const orderBy: any = {};
      orderBy[sortField] = sortOrder;

      const projects = await prisma.project.findMany({
        where,
        include: {
          client: true,
          logs: true,
          reminders: true,
        },
        orderBy,
      });

      return NextResponse.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (user) => {
    try {
      const body = await request.json();
      const validatedData = projectSchema.parse(body);

      const project = await prisma.project.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          budget: validatedData.budget,
          deadline: new Date(validatedData.deadline),
          status: validatedData.status,
          clientId: validatedData.clientId,
          userId: user.id,
        },
        include: {
          client: true,
        },
      });

      return NextResponse.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input data', details: error.errors },
          { status: 400 }
        );
      }
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }
  });
}

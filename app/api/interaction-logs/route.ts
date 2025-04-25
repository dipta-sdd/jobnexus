import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { z } from 'zod';

const interactionLogSchema = z.object({
  type: z.enum(['call', 'meeting', 'email']),
  notes: z.string().min(1),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // Get filter parameters
      const type = searchParams.get('type');
      const clientId = searchParams.get('clientId');
      const projectId = searchParams.get('projectId');
      const searchQuery = searchParams.get('search');
      
      // Get sort parameters
      const sortField = searchParams.get('sortField') || 'date';
      const sortOrder = searchParams.get('sortOrder') || 'desc';

      // Build where clause for filters
      const where: any = {
        userId: user.id,
      };

      if (type) {
        where.type = type;
      }

      if (clientId) {
        where.clientId = clientId;
      }

      if (projectId) {
        where.projectId = projectId;
      }

      if (searchQuery) {
        where.OR = [
          { type: { contains: searchQuery, mode: 'insensitive' } },
          { notes: { contains: searchQuery, mode: 'insensitive' } },
          { client: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { project: { title: { contains: searchQuery, mode: 'insensitive' } } },
        ];
      }

      const orderBy: any = {};
      switch (sortField) {
        case 'type':
          orderBy.type = sortOrder;
          break;
        case 'date':
          orderBy.date = sortOrder;
          break;
        case 'client':
          orderBy.client = { name: sortOrder };
          break;
        case 'project':
          orderBy.project = { title: sortOrder };
          break;
        default:
          orderBy.date = 'desc';
      }

      const interactionLogs = await prisma.interactionLog.findMany({
        where,
        include: {
          client: true,
          project: true,
        },
        orderBy,
      });

      return NextResponse.json(interactionLogs);
    } catch (error) {
      console.error('Error fetching interaction logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch interaction logs' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (user) => {
    try {
      const body = await request.json();
      const validatedData = interactionLogSchema.parse(body);

      // Ensure at least one of clientId or projectId is provided
      if (!validatedData.clientId && !validatedData.projectId) {
        return NextResponse.json(
          { error: 'Either clientId or projectId must be provided' },
          { status: 400 }
        );
      }

      const interactionLog = await prisma.interactionLog.create({
        data: {
          type: validatedData.type,
          notes: validatedData.notes,
          clientId: validatedData.clientId,
          projectId: validatedData.projectId || null,
          userId: user.id,
        },
        include: {
          client: true,
          project: true,
        },
      });

      return NextResponse.json(interactionLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input data', details: error.errors },
          { status: 400 }
        );
      }
      console.error('Error creating interaction log:', error);
      return NextResponse.json(
        { error: 'Failed to create interaction log' },
        { status: 500 }
      );
    }
  });
} 
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { z } from 'zod';
import { Prisma } from '@/lib/generated/prisma';
import { User } from '@/lib/types';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  budget: z.number().min(0),
  deadline: z.string().datetime(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']),
  clientId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (user:User) => {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const sortField = searchParams.get("sortField") || "title";
      const sortOrder = searchParams.get("sortOrder") || "asc";

      const where: Prisma.ProjectWhereInput = {
        userId: user.id,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { status: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ],
      };

      if (startDate || endDate) {
        where.deadline = {};
        if (startDate) where.deadline.gte = new Date(startDate);
        if (endDate) where.deadline.lte = new Date(endDate);
      }

      const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
      if (sortField === "client") {
        orderBy.client = { name: sortOrder as Prisma.SortOrder };
      } else {
        orderBy[sortField as keyof Prisma.ProjectOrderByWithRelationInput] =
          sortOrder as Prisma.SortOrder;
      }

      const projects = await prisma.project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          logs: true,
          reminders: true,
        },
        orderBy,
      });

      return NextResponse.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (user:User) => {
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

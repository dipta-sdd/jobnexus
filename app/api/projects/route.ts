
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
  startDate: z.string().datetime(),
  deadline: z.string().datetime(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']),
  clientId: z.string().min(1),
});


/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieves all projects associated with the authenticated user with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter projects by title, description, status, or client name
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter projects with deadline on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter projects with deadline on or before this date
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [title, description, budget, deadline, status, client]
 *         description: Field to sort by (defaults to title)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending, defaults to asc)
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   budget:
 *                     type: number
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [Pending, In Progress, Completed, Cancelled]
 *                   client:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   logs:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/InteractionLog'
 *                   reminders:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Reminder'
 *       500:
 *         description: Failed to fetch projects
 */
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

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project associated with the authenticated user and a client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budget
 *               - deadline
 *               - status
 *               - clientId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *                 minimum: 0
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed, Cancelled]
 *               clientId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 budget:
 *                   type: number
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 clientId:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Failed to create project
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (user:User) => {
    try {
      const body = await request.json();
      const validatedData = projectSchema.parse(body);
      if (new Date(validatedData.startDate) > new Date(validatedData.deadline)) {
        return NextResponse.json({ error: 'Start date must be smaller than or equal to deadline' }, { status: 400 });
      }

      const project = await prisma.project.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          budget: validatedData.budget,
          startDate: new Date(validatedData.startDate),
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

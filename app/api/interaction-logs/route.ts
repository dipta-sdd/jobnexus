/**
 * @swagger
 * /api/interaction-logs:
 *   get:
 *     summary: Get all interaction logs
 *     description: Retrieves all interaction logs associated with the authenticated user with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter logs by type, notes, client name, or project title
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs with date on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs with date on or before this date
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [date, type, client, project]
 *         description: Field to sort by (defaults to date)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending, defaults to desc)
 *     responses:
 *       200:
 *         description: List of interaction logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [call, meeting, email]
 *                   notes:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   client:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   project:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *       500:
 *         description: Failed to fetch interaction logs
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { z } from 'zod';
import { Prisma } from '@/lib/generated/prisma';
import { User } from '@/lib/types';

const interactionLogSchema = z.object({
  type: z.enum(['call', 'meeting', 'email']),
  notes: z.string().min(1),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (user:User) => {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const sortField = searchParams.get("sortField") || "date";
      const sortOrder = searchParams.get("sortOrder") || "desc";

      const where: Prisma.InteractionLogWhereInput = {
        userId: user.id,
        OR: [
          { type: { contains: search, mode: "insensitive" } },
          { notes: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
          { project: { title: { contains: search, mode: "insensitive" } } },
        ],
      };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      const orderBy: Prisma.InteractionLogOrderByWithRelationInput = {};
      if (sortField === "client") {
        orderBy.client = { name: sortOrder as Prisma.SortOrder };
      } else if (sortField === "project") {
        orderBy.project = { title: sortOrder as Prisma.SortOrder };
      } else {
        orderBy[sortField as keyof Prisma.InteractionLogOrderByWithRelationInput] =
          sortOrder as Prisma.SortOrder;
      }

      const interactionLogs = await prisma.interactionLog.findMany({
        where,
        orderBy,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return NextResponse.json(interactionLogs);
    } catch (error) {
      console.error("Error fetching interaction logs:", error);
      return NextResponse.json(
        { error: "Failed to fetch interaction logs" },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/interaction-logs:
 *   post:
 *     summary: Create a new interaction log
 *     description: Creates a new interaction log associated with the authenticated user, linked to a client and/or project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - notes
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [call, meeting, email]
 *               notes:
 *                 type: string
 *               clientId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interaction log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: [call, meeting, email]
 *                 notes:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input data or missing required relationships
 *       500:
 *         description: Failed to create interaction log
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (user:User) => {
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
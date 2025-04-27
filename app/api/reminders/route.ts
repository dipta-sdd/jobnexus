/**
 * @swagger
 * /api/reminders:
 *   get:
 *     summary: Get all reminders
 *     description: Retrieves all reminders associated with the authenticated user with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter reminders by title, client name, project title, or status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reminders with due date on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reminders with due date on or before this date
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [title, dueDate, status, client, project]
 *         description: Field to sort by (defaults to dueDate)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending, defaults to asc)
 *     responses:
 *       200:
 *         description: List of reminders retrieved successfully
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
 *                   notes:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
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
 *         description: Failed to fetch reminders
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { Prisma } from '@/lib/generated/prisma';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  return withAuth(request, async (user:User) => {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const sortField = searchParams.get("sortField") || "dueDate";
      const sortOrder = searchParams.get("sortOrder") || "asc";

      const where: Prisma.ReminderWhereInput = {
        userId: user.id,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
          { project: { title: { contains: search, mode: "insensitive" } } },
          { status: { contains: search, mode: "insensitive" } },
        ],
      };

      if (startDate || endDate) {
        where.dueDate = {};
        if (startDate) where.dueDate.gte = new Date(startDate);
        if (endDate) where.dueDate.lte = new Date(endDate);
      }

      const orderBy: Prisma.ReminderOrderByWithRelationInput = {};
      if (sortField === "client") {
        orderBy.client = { name: sortOrder as Prisma.SortOrder };
      } else if (sortField === "project") {
        orderBy.project = { title: sortOrder as Prisma.SortOrder };
      } else {
        orderBy[sortField as keyof Prisma.ReminderOrderByWithRelationInput] =
          sortOrder as Prisma.SortOrder;
      }

      const reminders = await prisma.reminder.findMany({
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

      return NextResponse.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return NextResponse.json(
        { error: "Failed to fetch reminders" },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Create a new reminder
 *     description: Creates a new reminder associated with the authenticated user, optionally linked to a client and/or project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               notes:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               clientId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reminder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       500:
 *         description: Failed to create reminder
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (user) => {
    try {
      const body = await request.json();
      const { title, notes, dueDate, clientId, projectId } = body;

      const reminder = await prisma.reminder.create({
        data: {
          title,
          notes,
          dueDate: new Date(dueDate),
          clientId,
          projectId,
          userId: user.id,
        },
        include: {
          client: true,
          project: true,
        },
      });

      return NextResponse.json(reminder);
    } catch (error) {
      console.error('Error creating reminder:', error);
      return NextResponse.json(
        { error: 'Failed to create reminder' },
        { status: 500 }
      );
    }
  });
} 
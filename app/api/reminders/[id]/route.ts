/**
 * @swagger
 * /api/reminders/{id}:
 *   get:
 *     summary: Get reminder by ID
 *     description: Retrieves a specific reminder by ID with associated client and project information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reminder ID
 *     responses:
 *       200:
 *         description: Reminder retrieved successfully
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
 *                 status:
 *                   type: string
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Reminder not found
 *       500:
 *         description: Failed to fetch reminder
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { User } from '@/lib/types';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user:User) => {
    try {
      const reminder = await prisma.reminder.findUnique({
        where: {
          id: params.id,
          userId: user.id,
        },
        include: {
          client: true,
          project: true,
        },
      });

      if (!reminder) {
        return NextResponse.json(
          { error: 'Reminder not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(reminder);
    } catch (error) {
      console.error('Error fetching reminder:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reminder' },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/reminders/{id}:
 *   put:
 *     summary: Update reminder
 *     description: Updates an existing reminder's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reminder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               notes:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               clientId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reminder updated successfully
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
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       500:
 *         description: Failed to update reminder
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user:User) => {
    try {
      const body = await request.json();
      const { id } = await params;
      const { title, notes, dueDate, status, clientId, projectId } = body;

      const reminder = await prisma.reminder.update({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          title,
          notes,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          status,
          clientId,
          projectId: projectId || null,
        },
        include: {
          client: true,
          project: true,
        },
      });

      return NextResponse.json(reminder);
    } catch (error) {
      console.error('Error updating reminder:', error);
      return NextResponse.json(
        { error: 'Failed to update reminder' },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     summary: Delete reminder
 *     description: Deletes a specific reminder
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reminder ID
 *     responses:
 *       200:
 *         description: Reminder deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete reminder
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user:User) => {
    try {
      const {id } = await params;
      await prisma.reminder.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });

      return NextResponse.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return NextResponse.json(
        { error: 'Failed to delete reminder' },
        { status: 500 }
      );
    }
  });
}  
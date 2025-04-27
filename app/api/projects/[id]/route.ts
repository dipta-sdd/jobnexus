
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { z } from 'zod';


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
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieves a specific project by ID with associated client, interaction logs, and reminders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
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
 *                   enum: [Pending, In Progress, Completed, Cancelled]
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InteractionLog'
 *                 reminders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reminder'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Failed to fetch project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
    try {
        const { id } = await params;
      const project = await prisma.project.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
        include: {
          client: true,
          logs: {
            orderBy: {
              date: 'desc',
            },
          },
          reminders: {
            orderBy: {
              dueDate: 'desc',
            },
          }, 
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: 500 }
      );
    }
  });
} 

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     description: Updates an existing project's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
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
 *         description: Project updated successfully
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
 *                 status:
 *                   type: string
 *       500:
 *         description: Failed to update project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
    try {
      const body = await request.json();
      const parsedData = projectSchema.parse(body);
      const { id } = await params;
      const project = await prisma.project.update({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          ...parsedData,
          startDate: parsedData.startDate ? new Date(parsedData.startDate) : undefined,
          deadline: parsedData.deadline ? new Date(parsedData.deadline) : undefined,
        },
        include: {
          client: true,
          logs: {
            orderBy: {
              date: 'desc',
            },
          },
          reminders: {
            orderBy: {
              dueDate: 'desc',
            },
          },
        },
      });

      return NextResponse.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     description: Deletes a project and all associated interaction logs and reminders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
    try {
      const { id } = params;
      // Delete all associated records first
      await prisma.interactionLog.deleteMany({
        where: {
          projectId: id,
          userId: user.id,
        },
      });

      await prisma.reminder.deleteMany({
        where: {
          projectId: id,
          userId: user.id,
        },
      });
      await prisma.project.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });

      return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json(
        { error: "Failed to delete project" },
        { status: 500 }
      );
    }
  });
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { User } from '@/lib/types';
/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     description: Retrieves a specific client by ID with their associated projects, reminders, and interaction logs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *     responses:
 *       200:
 *         description: Client retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 company:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 reminders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reminder'
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InteractionLog'
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to fetch client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user: User) => {
    try {
      const client = await prisma.client.findUnique({
        where: {
          id: params.id,
          userId: user.id,
        },
        include: {
          projects: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          reminders: {
            orderBy: {
              dueDate: 'asc',
            },
          },
          logs: {
            orderBy: {
              date: 'desc',
            },
          },
        },
      });

      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(client);
    } catch (error) {
      console.error('Error fetching client:', error);
      return NextResponse.json(
        { error: 'Failed to fetch client' },
        { status: 500 }
      );
    }
  });
} 

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     description: Updates an existing client's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       500:
 *         description: Failed to update client
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user: User) => {
    try {
      const { name, email, phone, company, notes } = await request.json();
      // console.log(name, email, phone, company, notes);
      const client = await prisma.client.update({
        where: {
          id: params.id,
          userId: user.id,
        }, 
        data: {
          name,
          email,
          phone,
          company,
          notes,
        },
      });

      return NextResponse.json(client);
    } catch (error) {
      console.error('Error updating client:', error);
      return NextResponse.json(
        { error: 'Failed to update client' },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     description: Deletes a client and all associated projects, reminders, and interaction logs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete client
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user:User) => {
    try {
      const { id } = await params;
      
      // Delete all associated records first
      await prisma.project.deleteMany({
        where: {
          clientId: id,
          userId: user.id
        }
      });

      await prisma.interactionLog.deleteMany({
        where: {
          clientId: id,
          userId: user.id
        }
      });

      await prisma.reminder.deleteMany({
        where: {
          clientId: id,
          userId: user.id
        }
      });

      // Then delete the client
      await prisma.client.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });

      return NextResponse.json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error("Error deleting client:", error);
      return NextResponse.json(
        { error: "Failed to delete client" , message: error },
        { status: 500 }
      );
    }
  });
}

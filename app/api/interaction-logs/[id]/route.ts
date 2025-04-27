/**
 * @swagger
 * /api/interaction-logs/{id}:
 *   get:
 *     summary: Get interaction log by ID
 *     description: Retrieves a specific interaction log by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The interaction log ID
 *     responses:
 *       200:
 *         description: Interaction log retrieved successfully
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
 *                 clientId:
 *                   type: string
 *                 projectId:
 *                   type: string
 *       500:
 *         description: Failed to fetch interaction log
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware/withAuth";
import { User } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user:User ) => {
    try {
      const { id } = await params;
      const log = await prisma.interactionLog.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });

      return NextResponse.json(log);
    } catch (error) {
      console.error("Error fetching interaction log:", error);
      return NextResponse.json(
        { error: "Failed to fetch interaction log" },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/interaction-logs/{id}:
 *   put:
 *     summary: Update interaction log
 *     description: Updates an existing interaction log's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The interaction log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [call, meeting, email]
 *               notes:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               clientId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interaction log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 date:
 *                   type: string
 *       500:
 *         description: Failed to update interaction log
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user: User) => {
    try {
      const { type, notes, date, clientId, projectId } = await request.json();
      const { id } = await params;
      const log = await prisma.interactionLog.update({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          type,
          notes,
          date,
          clientId,
          projectId: projectId || null,
        },
      });

      return NextResponse.json(log);
    } catch (error) {
      console.error("Error updating interaction log:", error);
      return NextResponse.json(
        { error: "Failed to update interaction log" },
        { status: 500 }
      );
    }
  });
}

/**
 * @swagger
 * /api/interaction-logs/{id}:
 *   delete:
 *     summary: Delete interaction log
 *     description: Deletes a specific interaction log
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The interaction log ID
 *     responses:
 *       200:
 *         description: Interaction log deleted successfully
 *       500:
 *         description: Failed to delete interaction log
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user: User) => {
    try {
      const { id } = await params;
      const log = await prisma.interactionLog.delete({
        where: {
          id: id, 
          userId: user.id,
        }
      });

      return NextResponse.json(log);
    } catch (error) {
      console.error("Error updating interaction log:", error);
      return NextResponse.json(
        { error: "Failed to delete interaction log" },
        { status: 500 }
      );
    }
  });
}

import { NextRequest, NextResponse } from "next/server";
import { cookiesToUser } from "@/lib/auth";
import { User } from "@/lib/types";
import { withAuth } from "@/lib/middleware/withAuth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     description: Creates a new client associated with the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
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
 *         description: Client created successfully
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, notes } = body;
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await cookiesToUser(token);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        company,
        notes,
        userId: user.id,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     description: Retrieves all clients associated with the authenticated user with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter clients by name, email, or phone
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter clients created on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter clients created on or before this date
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [name, email, phone, company, createdAt, projects]
 *         description: Field to sort by (defaults to name)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending, defaults to asc)
 *     responses:
 *       200:
 *         description: List of clients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   company:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   projects:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Project'
 *                   reminders:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Reminder'
 *                   logs:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/InteractionLog'
 *       500:
 *         description: Failed to fetch clients
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (user: User) => {
    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const sortField = searchParams.get("sortField") || "name";
      const sortOrder = searchParams.get("sortOrder") || "asc";

      const where: Prisma.ClientWhereInput = {
        userId: user.id,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const orderBy: Prisma.ClientOrderByWithRelationInput = {};
      if (sortField === "projects") {
        orderBy.projects = {
          _count: sortOrder as Prisma.SortOrder,
        };
      } else {
        orderBy[sortField as keyof Prisma.ClientOrderByWithRelationInput] =
          sortOrder as Prisma.SortOrder;
      }

      const clients = await prisma.client.findMany({
        where,
        include: {
          projects: true,
          reminders: true,
          logs: true,
        },
        orderBy,
      });

      return NextResponse.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      return NextResponse.json(
        { error: "Failed to fetch clients" },
        { status: 500 }
      );
    }
  });
}

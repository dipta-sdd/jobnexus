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
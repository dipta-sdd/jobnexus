import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    try {
      const reminders = await prisma.reminder.findMany({
        where: {
          userId: user.id,
        },
        include: {
          client: true,
          project: true,
        },
        orderBy: {
          dueDate: 'asc',
        },
      });
      return NextResponse.json(reminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reminders' },
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
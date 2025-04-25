import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
    try {
      const body = await request.json();
      const { title, notes, dueDate, status, clientId, projectId } = body;

      const reminder = await prisma.reminder.update({
        where: {
          id: params.id,
          userId: user.id,
        },
        data: {
          title,
          notes,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          status,
          clientId,
          projectId,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
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
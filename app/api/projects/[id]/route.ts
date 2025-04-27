import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user) => {
    try {
      const body = await request.json();
      const { title, description, startDate, deadline, status, clientId } = body;
      const { id } = await params;
      const project = await prisma.project.update({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          title,
          description,
          startDate: startDate ? new Date(startDate) : undefined,
          deadline: deadline ? new Date(deadline) : undefined,
          status,
          clientId,
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
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/middleware/withAuth';
import { User } from '@/lib/types';

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

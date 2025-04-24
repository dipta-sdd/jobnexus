import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, withClientOwner } from '@/lib/middleware/withAuth';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  return withAuth(request , (async (user : User) =>{
    try {
      const projects = await prisma.project.findMany({
        where: {
          userId: user.id,
        },
        include: {
          client: true,
        },
      });
      return NextResponse.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }
  }))
}

export async function POST(request: NextRequest) {
  return withClientOwner(request, async (body , user) => {
    try {
      // const body = await req.json();
      const { title, clientId, budget, deadline, status } = body;
      
      const project = await prisma.project.create({
        data: {
          title,
          clientId,
          budget,
          deadline: new Date(deadline),
          status,
          userId: user.id
        },
        include: {
          client: true,
        },
      });
  
      return NextResponse.json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }
  });
}

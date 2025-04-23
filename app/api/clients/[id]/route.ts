import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserIdFromToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/clients/[id] - Get a specific client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { message: 'Error fetching client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update a client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    const body = await request.json();
    
    const validatedData = clientSchema.parse(body);
    
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating client:', error);
    return NextResponse.json(
      { message: 'Error updating client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromToken(request);
    
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 }
      );
    }

    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Client deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { message: 'Error deleting client' },
      { status: 500 }
    );
  }
} 
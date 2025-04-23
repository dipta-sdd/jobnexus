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

// GET /api/clients - Get all clients for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { message: 'Error fetching clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    const body = await request.json();
    
    const validatedData = clientSchema.parse(body);
    
    const client = await prisma.client.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating client:', error);
    return NextResponse.json(
      { message: 'Error creating client' },
      { status: 500 }
    );
  }
}

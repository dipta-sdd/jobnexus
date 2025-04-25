import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookiesToUser } from "@/lib/auth";
import { User } from "@/lib/types";
import { withAuth } from "@/lib/middleware/withAuth";

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

export async function GET(request: NextRequest) {
  return withAuth(request, async (user: User) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // Get search parameter
      const searchQuery = searchParams.get('search');
      
      // Get sort parameters
      const sortField = searchParams.get('sortField') || 'name';
      const sortOrder = searchParams.get('sortOrder') || 'asc';

      // Build where clause for search
      const where: {
        userId: string;
        OR?: Array<{
          name?: { contains: string; mode: 'insensitive' };
          email?: { contains: string; mode: 'insensitive' };
          phone?: { contains: string; mode: 'insensitive' };
        }>;
      } = {
        userId: user.id,
      };

      if (searchQuery) {
        where.OR = [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { phone: { contains: searchQuery, mode: 'insensitive' } },
        ];
      }

      // Build orderBy clause
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      orderBy[sortField] = sortOrder as 'asc' | 'desc';

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
      console.error('Error fetching clients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch clients' },
        { status: 500 }
      );
    }
  });
}

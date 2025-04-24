import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookiesToUser } from "@/lib/auth";
import { User } from "@/lib/types";

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
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user : User | null = await cookiesToUser(token);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const clients = await prisma.client.findMany({
      where: { userId: user.id },
      include: {
        projects: true
      }
    });
    console.log(clients);
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error creating client:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

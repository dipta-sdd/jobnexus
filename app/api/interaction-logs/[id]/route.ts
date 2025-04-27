import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/middleware/withAuth";
import { User } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user:User ) => {
    try {
      const { id } = await params;
      const log = await prisma.interactionLog.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });

      return NextResponse.json(log);
    } catch (error) {
      console.error("Error fetching interaction log:", error);
      return NextResponse.json(
        { error: "Failed to fetch interaction log" },
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
      const { type, notes, date, clientId, projectId } = await request.json();
      const { id } = await params;
      const log = await prisma.interactionLog.update({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          type,
          notes,
          date,
          clientId,
          projectId: projectId || null,
        },
      });

      return NextResponse.json(log);
    } catch (error) {
      console.error("Error updating interaction log:", error);
      return NextResponse.json(
        { error: "Failed to update interaction log" },
        { status: 500 }
      );
    }
  });
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (user: User) => {
    try {
      const { id } = await params;
      const log = await prisma.interactionLog.delete({
        where: {
          id: id, 
          userId: user.id,
        }
      });

      return NextResponse.json(log);
    } catch (error) {
      console.error("Error updating interaction log:", error);
      return NextResponse.json(
        { error: "Failed to delete interaction log" },
        { status: 500 }
      );
    }
  });
}
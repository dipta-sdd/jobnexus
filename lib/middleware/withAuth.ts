import { NextRequest, NextResponse } from "next/server";
import { cookiesToUser } from "../auth";
import { Client, User } from "../types";
import prisma from "../prisma";

export async function withAuth(
  request: NextRequest,
  handler: (user: User, request?: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const authorization = request.headers.get("authorization");
  const token = authorization && authorization.split(" ").pop();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user: User | null = await cookiesToUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handler(user, request);
}

export async function withClientOwner(
  request: NextRequest,
  handler: (body, user: User) => Promise<NextResponse>
): Promise<NextResponse> {
  const authorization = request.headers.get("authorization");
  const token = authorization && authorization.split(" ").pop();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user: User | null = await cookiesToUser(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { clientId } = body;
  const client: Client | null = await prisma.client.findUnique({
    where: {
      userId: user.id,
      id: clientId,
    },
  });
  if (!client) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler(body, user);
}

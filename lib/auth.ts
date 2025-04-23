import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'token';

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export async function createToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

export function getAuthCookie() {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserIdFromToken(request: NextRequest): Promise<string> {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.sub) {
      throw new Error('Invalid token payload');
    }

    return payload.sub as string;
  } catch (err) {
    console.error('Token verification failed:', err);
    throw new Error('Invalid token');
  }
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete('token');
}

export function getAuthToken(request: NextRequest): string | undefined {
  return request.cookies.get('token')?.value;
}

export function getAuthHeader(request: NextRequest): string | undefined {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
}
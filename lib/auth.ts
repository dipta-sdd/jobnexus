import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse } from 'next/server';
import prisma from './prisma';
import { User } from './types';


const prismaClient = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'token';

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
  const headersList = await headers();
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return null;
  }

  try {
    const user = await prismaClient.user.findUnique({
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


export async function cookiesToUser( token){
  try {


    if (!token) {
      return null;
    }

    // Verify the token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return null;
  }
}

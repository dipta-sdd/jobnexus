import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real application, you would:
    // 1. Verify the JWT token
    // 2. Fetch user data from your database
    // 3. Return the user data

    // For now, we'll return a mock user
    // TODO: Replace with actual user data from your database
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
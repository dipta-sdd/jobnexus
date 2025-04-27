import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Check authentication status
 *     description: Returns the current authentication status
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export async function GET(request: NextRequest) {
  // This is a simple route that redirects to specific auth endpoints
  // or provides information about available auth endpoints
  return NextResponse.json({
    message: 'Auth API Endpoints',
    endpoints: [
      {
        path: '/api/auth/login',
        method: 'POST',
        description: 'Login with email and password'
      },
      {
        path: '/api/auth/signup',
        method: 'POST',
        description: 'Create a new account'
      },
      {
        path: '/api/auth/logout',
        method: 'GET',
        description: 'Log out the current user'
      },
      {
        path: '/api/auth/me',
        method: 'GET',
        description: 'Get the current authenticated user info'
      }
    ]
  });
}

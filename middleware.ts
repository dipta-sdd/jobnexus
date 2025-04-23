import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that don't require authentication
const publicPaths = ['/'];

const unAuthPaths = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  if (unAuthPaths.includes(pathname)) {
    if(token){
      return NextResponse.redirect(new URL('/', request.url));
    }
    else{
      return NextResponse.next();
    }
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.sub) {
      throw new Error('Invalid token payload');
    }

    // Add userId to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub as string);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/clients/:path*',
    '/projects/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/serverAuth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('jobbridge_session') || cookieStore.get('jobbridge_admin_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const user = verifySessionToken(sessionCookie.value);
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

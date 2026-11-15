import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isServerAccount, verifyServerCredentials, createSessionToken } from '@/lib/serverAuth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Check if this is a server-managed account (Admin or configured Employer)
    if (!isServerAccount(email)) {
      return NextResponse.json({ success: false, isServerAccount: false });
    }

    const user = verifyServerCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, isServerAccount: true, error: 'Invalid Login Credentials.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const cookieStore = await cookies();

    // Set unified session cookie
    cookieStore.set('jobbridge_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Also set legacy admin cookie if user is admin
    if (user.role === 'admin') {
      cookieStore.set('jobbridge_admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Server login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication error' },
      { status: 500 }
    );
  }
}

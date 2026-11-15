import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminCredentials, createAdminToken } from '@/lib/adminAuth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const cookieStore = await cookies();
    cookieStore.set('jobbridge_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    const user = {
      id: 'admin_static_id',
      email: (email || 'admin@gmail.com').toLowerCase(),
      fullName: 'System Admin',
      role: 'admin',
      companyName: null
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}

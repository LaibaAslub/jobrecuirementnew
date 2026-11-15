import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('jobbridge_admin_session');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout API error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

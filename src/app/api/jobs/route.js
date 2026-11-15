import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error in /api/jobs:', error);
      return NextResponse.json({ success: false, error: error.message, jobs: [] }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      jobs: data || [],
      count: data?.length || 0,
    });
  } catch (err) {
    console.error('Server error in /api/jobs:', err);
    return NextResponse.json({ success: false, error: err.message, jobs: [] }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getConversationMessages, saveMessage } from '@/lib/messagesDb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const partnerEmail = searchParams.get('partnerEmail');
    const jobId = searchParams.get('jobId');

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'userEmail parameter is required.' }, { status: 400 });
    }

    const messages = await getConversationMessages(userEmail, partnerEmail, jobId);
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      sender_id,
      receiver_id,
      sender_email,
      receiver_email,
      sender_name,
      receiver_name,
      sender_role,
      receiver_role,
      job_id,
      job_title,
      application_id,
      content
    } = body || {};

    if (!sender_email || !receiver_email || !content?.trim()) {
      return NextResponse.json({ success: false, error: 'sender_email, receiver_email, and content are required.' }, { status: 400 });
    }

    const newMsg = await saveMessage({
      sender_id,
      receiver_id,
      sender_email,
      receiver_email,
      sender_name,
      receiver_name,
      sender_role,
      receiver_role,
      job_id,
      job_title,
      application_id,
      content
    });

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

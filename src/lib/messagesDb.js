import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'messages.json');

function readLocalMessages() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]', 'utf8');
      return [];
    }
    const content = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading local messages:', err);
    return [];
  }
}

function writeLocalMessages(messages) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local messages:', err);
  }
}

/**
 * Fetch conversation messages between two users or all messages involving userEmail.
 */
export async function getConversationMessages(userEmail, partnerEmail = null, jobId = null) {
  if (!userEmail) return [];
  const normalizedUser = String(userEmail).toLowerCase().trim();
  const normalizedPartner = partnerEmail ? String(partnerEmail).toLowerCase().trim() : null;

  // 1. Try fetching from Supabase first
  try {
    let query = supabase.from('messages').select('*');

    if (normalizedPartner) {
      query = query.or(
        `and(sender_email.ilike.${normalizedUser},receiver_email.ilike.${normalizedPartner}),and(sender_email.ilike.${normalizedPartner},receiver_email.ilike.${normalizedUser})`
      );
    } else {
      query = query.or(`sender_email.ilike.${normalizedUser},receiver_email.ilike.${normalizedUser}`);
    }

    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (!error && Array.isArray(data)) {
      return data;
    }
  } catch (e) {
    // Supabase table might not exist yet, fallback gracefully
  }

  // 2. Fallback to server persistent JSON store
  const allMessages = readLocalMessages();
  return allMessages.filter(msg => {
    const sender = String(msg.sender_email || '').toLowerCase().trim();
    const receiver = String(msg.receiver_email || '').toLowerCase().trim();

    if (normalizedPartner) {
      const match = (sender === normalizedUser && receiver === normalizedPartner) ||
                    (sender === normalizedPartner && receiver === normalizedUser);
      if (!match) return false;
    } else {
      const match = (sender === normalizedUser || receiver === normalizedUser);
      if (!match) return false;
    }

    if (jobId && msg.job_id && String(msg.job_id) !== String(jobId)) {
      return false;
    }

    return true;
  }).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

/**
 * Save a new real message.
 */
export async function saveMessage(messageData) {
  const newMsg = {
    id: messageData.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    sender_id: messageData.sender_id || null,
    receiver_id: messageData.receiver_id || null,
    sender_email: String(messageData.sender_email || '').toLowerCase().trim(),
    receiver_email: String(messageData.receiver_email || '').toLowerCase().trim(),
    sender_name: messageData.sender_name || 'User',
    receiver_name: messageData.receiver_name || 'Contact',
    sender_role: messageData.sender_role || 'user',
    receiver_role: messageData.receiver_role || 'user',
    job_id: messageData.job_id || null,
    job_title: messageData.job_title || null,
    application_id: messageData.application_id || null,
    content: String(messageData.content || '').trim(),
    is_read: false,
    created_at: messageData.created_at || new Date().toISOString()
  };

  // 1. Try Supabase
  try {
    const { data, error } = await supabase.from('messages').insert([newMsg]).select();
    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (e) {
    // Continue to local storage
  }

  // 2. Save to local fallback store
  const messages = readLocalMessages();
  messages.push(newMsg);
  writeLocalMessages(messages);
  return newMsg;
}

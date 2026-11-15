import crypto from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const EMPLOYER_EMAIL = process.env.EMPLOYER_EMAIL || 'employer@jobbridge.com';
const EMPLOYER_PASSWORD = process.env.EMPLOYER_PASSWORD || 'employer123';
const EMPLOYER_NAME = process.env.EMPLOYER_NAME || 'Alex Turner';
const EMPLOYER_COMPANY = process.env.EMPLOYER_COMPANY || 'TechCorp Solutions';
const EMPLOYER_ID = process.env.EMPLOYER_ID || 'e0000000-0000-0000-0000-000000000001';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'jobbridge_secure_session_secret_2026_x89a';

function timingSafeMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const maxLen = 128;
  const bufA = Buffer.from(a.padEnd(maxLen, ' ').slice(0, maxLen));
  const bufB = Buffer.from(b.padEnd(maxLen, ' ').slice(0, maxLen));
  return crypto.timingSafeEqual(bufA, bufB) && a === b;
}

/**
 * Check if the email belongs to any server-managed account (Admin or Employer)
 */
export function isServerAccount(email) {
  if (!email) return false;
  const normalized = String(email).trim().toLowerCase();
  return (
    normalized === ADMIN_EMAIL.trim().toLowerCase() ||
    normalized === EMPLOYER_EMAIL.trim().toLowerCase()
  );
}

/**
 * Verifies credentials for server-configured accounts.
 * Returns the authenticated user object or null.
 */
export function verifyServerCredentials(email, password) {
  if (!email || !password) return null;
  const inputEmail = String(email).trim().toLowerCase();
  const inputPassword = String(password);

  // Check Admin
  if (
    timingSafeMatch(inputEmail, ADMIN_EMAIL.trim().toLowerCase()) &&
    timingSafeMatch(inputPassword, ADMIN_PASSWORD)
  ) {
    return {
      id: 'admin_static_id',
      email: ADMIN_EMAIL.trim().toLowerCase(),
      fullName: 'System Admin',
      role: 'admin',
      companyName: null,
    };
  }

  // Check Employer
  if (
    timingSafeMatch(inputEmail, EMPLOYER_EMAIL.trim().toLowerCase()) &&
    timingSafeMatch(inputPassword, EMPLOYER_PASSWORD)
  ) {
    return {
      id: EMPLOYER_ID,
      email: EMPLOYER_EMAIL.trim().toLowerCase(),
      fullName: EMPLOYER_NAME,
      role: 'employer',
      companyName: EMPLOYER_COMPANY,
    };
  }

  return null;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export function createSessionToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    companyName: user.companyName || null,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days expiration
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
  return `${payloadStr}.${signature}`;
}

/**
 * Validates and decodes a signed session token.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;

  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
  if (signature.length !== expectedSignature.length) return null;

  const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!isValid) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
      companyName: payload.companyName || null,
    };
  } catch {
    return null;
  }
}

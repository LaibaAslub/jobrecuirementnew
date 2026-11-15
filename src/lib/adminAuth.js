import crypto from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'jobbridge_admin_secret_key_default_2026';

/**
 * Verify admin credentials securely on the server.
 * Neither the email nor password is ever bundled to client-side code.
 */
export function verifyAdminCredentials(email, password) {
  if (!email || !password) return false;
  const inputEmail = String(email).trim().toLowerCase();
  const targetEmail = String(ADMIN_EMAIL).trim().toLowerCase();
  const inputPassword = String(password);
  const targetPassword = String(ADMIN_PASSWORD);

  // Pad strings to equal length for constant-time comparison
  const maxLen = 128;
  const paddedInputEmail = inputEmail.padEnd(maxLen, ' ').slice(0, maxLen);
  const paddedTargetEmail = targetEmail.padEnd(maxLen, ' ').slice(0, maxLen);
  const paddedInputPassword = inputPassword.padEnd(maxLen, ' ').slice(0, maxLen);
  const paddedTargetPassword = targetPassword.padEnd(maxLen, ' ').slice(0, maxLen);

  const emailMatch = crypto.timingSafeEqual(
    Buffer.from(paddedInputEmail),
    Buffer.from(paddedTargetEmail)
  ) && inputEmail === targetEmail;

  const passwordMatch = crypto.timingSafeEqual(
    Buffer.from(paddedInputPassword),
    Buffer.from(paddedTargetPassword)
  ) && inputPassword === targetPassword;

  return emailMatch && passwordMatch;
}

/**
 * Generate a cryptographically signed session token for admin authentication.
 */
export function createAdminToken() {
  const payload = {
    id: 'admin_static_id',
    email: ADMIN_EMAIL.toLowerCase(),
    fullName: 'System Admin',
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days expiration
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payloadStr).digest('hex');
  return `${payloadStr}.${signature}`;
}

/**
 * Verify and unpack an admin session token.
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;

  const expectedSignature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payloadStr).digest('hex');
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
      companyName: null
    };
  } catch {
    return null;
  }
}

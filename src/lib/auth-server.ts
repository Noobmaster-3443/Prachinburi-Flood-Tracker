/**
 * Server-side Admin Authentication and Session Security
 * Eliminates client-side PIN exposure and sessionStorage authorization boundaries.
 */

import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PIN || 'prachin-admin-secret-key-2026';
const ADMIN_PIN = process.env.ADMIN_PIN || 'PrachinAdmin#2026!';

export function validateAdminPin(inputPin: string): boolean {
  if (!inputPin) return false;
  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(inputPin.trim());
  const b = Buffer.from(ADMIN_PIN.trim());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function generateAdminSessionToken(): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `admin:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${hmac}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const [role, expiresStr] = payload.split(':');
    if (role !== 'admin') return false;

    const expiresAt = Number(expiresStr);
    if (isNaN(expiresAt) || expiresAt < Date.now()) return false;

    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSig);
    if (sigA.length !== sigB.length) return false;

    return crypto.timingSafeEqual(sigA, sigB);
  } catch {
    return false;
  }
}

export function extractAdminTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

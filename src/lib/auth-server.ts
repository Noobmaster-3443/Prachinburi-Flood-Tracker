/**
 * Server-side Admin Authentication and Session Security
 * Eliminates client-side PIN exposure and sessionStorage authorization boundaries.
 */

import crypto from 'crypto';

function getAdminPin(): string | undefined {
  return process.env.ADMIN_PIN;
}

function getAdminSecret(): string | undefined {
  return process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PIN;
}

export function validateAdminPin(inputPin: string): boolean {
  const configuredPin = getAdminPin();
  // Both production and development require process.env.ADMIN_PIN.
  // If missing from environment variables, admin authentication fails safely.
  if (!inputPin || !configuredPin) return false;

  const a = Buffer.from(inputPin.trim());
  const b = Buffer.from(configuredPin.trim());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function generateAdminSessionToken(): string {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error('ADMIN_PIN or ADMIN_JWT_SECRET must be configured in environment variables.');
  }
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `admin:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${hmac}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  const secret = getAdminSecret();
  if (!token || !secret) return false;
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const [role, expiresStr] = payload.split(':');
    if (role !== 'admin') return false;

    const expiresAt = Number(expiresStr);
    if (isNaN(expiresAt) || expiresAt < Date.now()) return false;

    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
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

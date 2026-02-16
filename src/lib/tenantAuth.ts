import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ============================================
// TENANT AUTH UTILITIES
// ============================================

// Supabase client with service role (for server-side operations)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// PASSWORD HASHING (bcrypt)
// ============================================

const BCRYPT_ROUNDS = 12; // Industry standard, good balance of security/speed

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// SECURE TOKEN GENERATION
// ============================================

/**
 * Generate a secure random token (for invites/resets)
 * Returns a URL-safe base64 string
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Generate token expiry timestamp
 * @param hours - Hours until expiry (default: 24 for invites, 1 for resets)
 */
export function getTokenExpiry(hours: number = 24): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}

// ============================================
// SESSION MANAGEMENT
// ============================================

const SESSION_SECRET = process.env.TENANT_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SESSION_EXPIRY_DAYS = 7;

interface TenantSession {
  tenantId: string;
  email: string;
  contractorId: string;
  exp: number; // expiry timestamp
}

/**
 * Create a signed session token
 */
export function createSessionToken(tenant: {
  id: string;
  email: string;
  contractor_id: string;
}): string {
  const session: TenantSession = {
    tenantId: tenant.id,
    email: tenant.email,
    contractorId: tenant.contractor_id,
    exp: Date.now() + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
  };
  
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  
  return `${payload}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): TenantSession | null {
  try {
    const [payload, signature] = token.split('.');
    
    if (!payload || !signature) {
      return null;
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const session: TenantSession = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8')
    );
    
    // Check expiry
    if (session.exp < Date.now()) {
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

// ============================================
// DATABASE OPERATIONS
// ============================================

/**
 * Find tenant by email (only enabled tenants)
 */
export async function findTenantByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('tenant_logins')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('enabled', true)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
}

/**
 * Find tenant by email (including disabled tenants)
 * Used to show appropriate error message for disabled accounts
 */
export async function findTenantByEmailIncludeDisabled(email: string) {
  const { data, error } = await supabaseAdmin
    .from('tenant_logins')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data;
}

/**
 * Find tenant by invite token
 */
export async function findTenantByInviteToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from('tenant_logins')
    .select('*')
    .eq('invite_token', token)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  // Check if token expired
  if (data.invite_expires_at && new Date(data.invite_expires_at) < new Date()) {
    return null;
  }
  
  return data;
}

/**
 * Find tenant by reset token
 */
export async function findTenantByResetToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from('tenant_logins')
    .select('*')
    .eq('reset_token', token)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  // Check if token expired
  if (data.reset_expires_at && new Date(data.reset_expires_at) < new Date()) {
    return null;
  }
  
  return data;
}

/**
 * Update tenant password (for setup or reset)
 */
export async function updateTenantPassword(
  tenantId: string,
  password: string,
  clearInviteToken: boolean = false,
  clearResetToken: boolean = false
) {
  const passwordHash = await hashPassword(password);
  
  const updateData: Record<string, unknown> = {
    password_hash: passwordHash,
  };
  
  if (clearInviteToken) {
    updateData.invite_token = null;
    updateData.invite_expires_at = null;
  }
  
  if (clearResetToken) {
    updateData.reset_token = null;
    updateData.reset_expires_at = null;
  }
  
  const { error } = await supabaseAdmin
    .from('tenant_logins')
    .update(updateData)
    .eq('id', tenantId);
  
  return !error;
}

/**
 * Set reset token for tenant
 */
export async function setResetToken(tenantId: string): Promise<string | null> {
  const token = generateSecureToken();
  const expiry = getTokenExpiry(1); // 1 hour expiry for reset tokens
  
  const { error } = await supabaseAdmin
    .from('tenant_logins')
    .update({
      reset_token: token,
      reset_expires_at: expiry.toISOString(),
    })
    .eq('id', tenantId);
  
  if (error) {
    return null;
  }
  
  return token;
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(tenantId: string) {
  await supabaseAdmin
    .from('tenant_logins')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', tenantId);
}

/**
 * Get meter IDs for a tenant (via contractor -> contract -> local)
 */
export async function getTenantMeterIds(tenantId: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin.rpc('get_tenant_meter_ids', {
    tenant_id: tenantId,
  });
  
  if (error) {
    // Fallback: manual query
    const { data: tenant } = await supabaseAdmin
      .from('tenant_logins')
      .select('contractor_id')
      .eq('id', tenantId)
      .single();
    
    if (!tenant) return [];
    
    const { data: contractor } = await supabaseAdmin
      .from('contractors')
      .select('contract_id')
      .eq('id', tenant.contractor_id)
      .single();
    
    if (!contractor) return [];
    
    const { data: contract } = await supabaseAdmin
      .from('contracts')
      .select('local_id')
      .eq('id', contractor.contract_id)
      .eq('is_current', true)
      .single();
    
    if (!contract) return [];
    
    const { data: local } = await supabaseAdmin
      .from('locals')
      .select('meter_ids')
      .eq('id', contract.local_id)
      .single();
    
    return local?.meter_ids || [];
  }
  
  return data || [];
}

// ============================================
// COOKIE HELPERS
// ============================================

export const TENANT_SESSION_COOKIE = 'tenant_session';

export function getSessionCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAge ?? SESSION_EXPIRY_DAYS * 24 * 60 * 60, // seconds
  };
}

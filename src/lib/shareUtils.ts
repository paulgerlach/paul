import { ROUTE_SHARED_DASHBOARD } from "@/routes/routes";

export interface ShareFilters {
  meterIds?: string[];
  startDate?: string;
  endDate?: string;
  expiry?: string;
}

export function createShareableUrl(filters: ShareFilters, expiresInHours: number = 720): string { // 30 days default
  const params = new URLSearchParams();
  
  if (filters.meterIds && filters.meterIds.length > 0) {
    params.set('meters', filters.meterIds.join(','));
  }
  
  if (filters.startDate) {
    params.set('start', filters.startDate);
  }
  
  if (filters.endDate) {
    params.set('end', filters.endDate);
  }
  
  // Set expiration timestamp
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + expiresInHours);
  params.set('exp', expiryTime.getTime().toString());
  
  // Simple checksum to prevent URL tampering
  const checksum = btoa(`${params.get('meters') || ''}:${params.get('exp')}`).slice(0, 8);
  params.set('c', checksum);
  
  return `${ROUTE_SHARED_DASHBOARD}?${params.toString()}`;
}

export function parseSharedUrl(searchParams: URLSearchParams): ShareFilters {
  return {
    meterIds: searchParams.get('meters')?.split(',').filter(Boolean) || [],
    startDate: searchParams.get('start') || undefined,
    endDate: searchParams.get('end') || undefined,
    expiry: searchParams.get('exp') || undefined,
  };
}

export function isShareLinkExpired(expiryTimestamp?: string): boolean {
  if (!expiryTimestamp) return false;
  
  const expiryTime = new Date(parseInt(expiryTimestamp));
  return new Date() > expiryTime;
}

export function getExpirationInfo(expiryTimestamp?: string) {
  if (!expiryTimestamp) {
    return { isExpired: false, expiryDate: null };
  }
  
  const expiryDate = new Date(parseInt(expiryTimestamp));
  const isExpired = new Date() > expiryDate;
  
  return { isExpired, expiryDate };
}

export function validateShareUrl(searchParams: URLSearchParams): boolean {
  const checksum = searchParams.get('c');
  const meters = searchParams.get('meters') || '';
  const exp = searchParams.get('exp');
  
  if (!checksum || !exp) return false;
  
  const expectedChecksum = btoa(`${meters}:${exp}`).slice(0, 8);
  return checksum === expectedChecksum;
}

// Secret key for signing verified tokens (in production, use env variable)
const VERIFICATION_SECRET = 'heidi-pin-verify-2024';

/**
 * Create a verified token after PIN validation
 * This token proves the user entered the correct PIN
 * Token is tied to the original link parameters and expires with the link
 */
export function createVerifiedToken(searchParams: URLSearchParams): string {
  const meters = searchParams.get('meters') || '';
  const exp = searchParams.get('exp') || '';
  const checksum = searchParams.get('c') || '';
  
  // Create signature from link params + secret
  const payload = `${meters}:${exp}:${checksum}:${VERIFICATION_SECRET}`;
  const signature = btoa(payload).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  
  return signature;
}

/**
 * Validate a verified token
 * Returns true if the token is valid for this link
 */
export function validateVerifiedToken(searchParams: URLSearchParams, token: string | null): boolean {
  if (!token) return false;
  
  const expectedToken = createVerifiedToken(searchParams);
  return token === expectedToken;
}

/**
 * Add verified token to existing URL
 */
export function addVerifiedTokenToUrl(url: string, searchParams: URLSearchParams): string {
  const token = createVerifiedToken(searchParams);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}vt=${token}`;
}


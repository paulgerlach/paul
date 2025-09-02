import { createHash } from 'crypto';

export interface DashboardFilters {
  startDate: string | null;
  endDate: string | null;
  meterIds: string[];
  userId: string;
  objectId?: string;
}

export interface ShareableLink {
  token: string;
  filters: DashboardFilters;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Generate a shareable token for dashboard filters
 */
export function generateShareToken(filters: DashboardFilters): string {
  const payload = {
    ...filters,
    timestamp: Date.now(),
    // Add some randomness to ensure uniqueness
    random: Math.random().toString(36).substring(7)
  };
  
  const token = createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
    .substring(0, 32); // Take first 32 characters for URL friendliness
  
  return token;
}

/**
 * Create shareable URL with encoded filters
 */
export function createShareableUrl(filters: DashboardFilters, baseUrl?: string): string {
  const token = generateShareToken(filters);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Encode filters in URL parameters for immediate access
  const searchParams = new URLSearchParams();
  
  if (filters.startDate) searchParams.set('start', filters.startDate);
  if (filters.endDate) searchParams.set('end', filters.endDate);
  if (filters.meterIds.length > 0) searchParams.set('meters', filters.meterIds.join(','));
  if (filters.objectId) searchParams.set('object', filters.objectId);
  searchParams.set('user', filters.userId);
  searchParams.set('token', token);
  
  return `${base}/shared/dashboard?${searchParams.toString()}`;
}

/**
 * Parse shared dashboard URL parameters
 */
export function parseSharedUrl(searchParams: URLSearchParams): DashboardFilters | null {
  try {
    const userId = searchParams.get('user');
    const token = searchParams.get('token');
    
    if (!userId || !token) return null;
    
    return {
      startDate: searchParams.get('start'),
      endDate: searchParams.get('end'),
      meterIds: searchParams.get('meters')?.split(',').filter(Boolean) || [],
      userId,
      objectId: searchParams.get('object') || undefined
    };
  } catch (error) {
    console.error('Error parsing shared URL:', error);
    return null;
  }
}

/**
 * Validate if a shared link is still valid (basic validation)
 */
export function validateShareToken(filters: DashboardFilters, providedToken: string): boolean {
  // For basic validation, we can regenerate the token and compare
  // In production, you might want to store tokens in database with expiration
  try {
    const expectedToken = generateShareToken({
      ...filters,
      // Remove timestamp and random for validation
      timestamp: undefined,
      random: undefined
    } as any);
    
    // For now, just check if token format is valid
    return providedToken.length === 32 && /^[a-f0-9]+$/.test(providedToken);
  } catch {
    return false;
  }
}


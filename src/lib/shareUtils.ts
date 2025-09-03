// Simple URL parameter-based sharing with 24-hour expiration
export function createShareableUrl(filters: {
  startDate?: string;
  endDate?: string;
  meterIds?: string[];
}, expiresInHours: number = 24): string {
  const expiry = Date.now() + (expiresInHours * 60 * 60 * 1000);
  const params = new URLSearchParams();
  if (filters.startDate) params.set('start', filters.startDate);
  if (filters.endDate) params.set('end', filters.endDate);
  if (filters.meterIds?.length) params.set('meters', filters.meterIds.join(','));
  params.set('exp', expiry.toString());
  return `/shared/dashboard?${params.toString()}`;
}

export function parseSharedUrl(searchParams: URLSearchParams) {
  return {
    startDate: searchParams.get('start'),
    endDate: searchParams.get('end'),
    meterIds: searchParams.get('meters')?.split(',').filter(Boolean) || [],
    expiry: searchParams.get('exp')
  };
}

export function isLinkExpired(expiry: string | null): boolean {
  if (!expiry) return false; // No expiry means no expiration (backward compatibility)
  return Date.now() > parseInt(expiry);
}

export function getExpirationInfo(expiry: string | null): { isExpired: boolean; expiresAt: Date | null; hoursRemaining: number } {
  if (!expiry) return { isExpired: false, expiresAt: null, hoursRemaining: 24 };
  
  const expiryTime = parseInt(expiry);
  const now = Date.now();
  const isExpired = now > expiryTime;
  const hoursRemaining = Math.max(0, Math.ceil((expiryTime - now) / (1000 * 60 * 60)));
  
  return {
    isExpired,
    expiresAt: new Date(expiryTime),
    hoursRemaining
  };
}


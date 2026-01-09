/**
 * Rate Limiting Utility for BVED API
 * 
 * Implements in-memory rate limiting per-token and per-IP.
 * For production at scale, consider upgrading to Redis-backed solution (e.g., @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Timestamp when limit resets
}

// In-memory stores (consider Redis for multi-instance deployments)
const tokenLimits = new Map<string, RateLimitEntry>();
const ipLimits = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of tokenLimits.entries()) {
    if (entry.resetAt < now) {
      tokenLimits.delete(key);
    }
  }
  for (const [key, entry] of ipLimits.entries()) {
    if (entry.resetAt < now) {
      ipLimits.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
}

/**
 * Check rate limit for a token
 * 
 * @param tokenId - Token ID (UUID) from database
 * @param limit - Maximum requests per window
 * @param windowSeconds - Time window in seconds
 * @returns Rate limit result
 */
export function checkTokenRateLimit(
  tokenId: string,
  limit: number = 1000,
  windowSeconds: number = 3600 // 1 hour default
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `token:${tokenId}`;
  
  const entry = tokenLimits.get(key);
  
  if (!entry || entry.resetAt < now) {
    // New window or expired
    tokenLimits.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      reset: Math.floor((now + windowMs) / 1000),
    };
  }
  
  if (entry.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset: Math.floor(entry.resetAt / 1000),
    };
  }
  
  entry.count++;
  return {
    allowed: true,
    limit,
    remaining: limit - entry.count,
    reset: Math.floor(entry.resetAt / 1000),
  };
}

/**
 * Check rate limit for an IP address
 * 
 * @param ip - IP address
 * @param limit - Maximum requests per window
 * @param windowSeconds - Time window in seconds
 * @returns Rate limit result
 */
export function checkIPRateLimit(
  ip: string,
  limit: number = 100,
  windowSeconds: number = 60 // 1 minute default
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `ip:${ip}`;
  
  const entry = ipLimits.get(key);
  
  if (!entry || entry.resetAt < now) {
    // New window or expired
    ipLimits.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      reset: Math.floor((now + windowMs) / 1000),
    };
  }
  
  if (entry.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset: Math.floor(entry.resetAt / 1000),
    };
  }
  
  entry.count++;
  return {
    allowed: true,
    limit,
    remaining: limit - entry.count,
    reset: Math.floor(entry.resetAt / 1000),
  };
}

/**
 * Extract IP address from request
 */
export function getClientIP(request: Request): string {
  // Check various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }
  
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  // Fallback (won't work in serverless, but good for local dev)
  return "unknown";
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  tokenLimit: RateLimitResult,
  ipLimit: RateLimitResult
): Response {
  // Token-based rate limit headers
  response.headers.set("X-RateLimit-Limit", tokenLimit.limit.toString());
  response.headers.set("X-RateLimit-Remaining", tokenLimit.remaining.toString());
  response.headers.set("X-RateLimit-Reset", tokenLimit.reset.toString());
  
  // IP-based rate limit headers (with prefix to distinguish)
  response.headers.set("X-RateLimit-IP-Limit", ipLimit.limit.toString());
  response.headers.set("X-RateLimit-IP-Remaining", ipLimit.remaining.toString());
  response.headers.set("X-RateLimit-IP-Reset", ipLimit.reset.toString());
  
  return response;
}

/**
 * Check if a timestamp is within the last 24 hours.
 */
export function isWithin24Hours(createdAt: string | null): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  return now.getTime() - created.getTime() < 24 * 60 * 60 * 1000;
}

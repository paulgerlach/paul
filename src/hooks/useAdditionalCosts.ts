import { useEffect, useState } from 'react';

/**
 * Hook to fetch the user's total monthly advance payment (Nebenkostenvorauszahlung)
 * from their active contracts
 * @param userId - Optional user ID for admin viewing another user's data
 */
export function useAdditionalCosts(userId?: string) {
  const [totalAdditionalCosts, setTotalAdditionalCosts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAdditionalCosts() {
      try {
        setLoading(true);
        setError(null);

        // Add userId as query parameter if provided (admin viewing another user)
        const url = userId 
          ? `/api/user-additional-costs?userId=${userId}`
          : '/api/user-additional-costs';

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch additional costs');
        }

        const data = await response.json();
        setTotalAdditionalCosts(data.totalAdditionalCosts || 0);
      } catch (err) {
        console.error('Error fetching additional costs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setTotalAdditionalCosts(0);
      } finally {
        setLoading(false);
      }
    }

    fetchAdditionalCosts();
  }, [userId]);

  return { totalAdditionalCosts, loading, error };
}


/**
 * Utility functions for meter operations
 */

export const fetchMeterUUIDs = async (localIds: string[]): Promise<string[]> => {
  if (!localIds.length) return [];
  
  try {
    const response = await fetch("/api/meters-by-locals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localIds }),
    });

    if (response.ok) {
      const { meters } = await response.json();
      return meters
        .map((meter: any) => meter.id)
        .filter((id: string) => Boolean(id));
    }
    return [];
  } catch (error) {
    console.error("Error fetching meter IDs:", error);
    return [];
  }
};

export const fetchSingleLocalMeterUUIDs = async (localId: string): Promise<string[]> => {
  return fetchMeterUUIDs([localId]);
};
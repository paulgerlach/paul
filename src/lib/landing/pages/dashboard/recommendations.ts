/** The recommendation list's filter and counts (plan 01 §1.4), pure. */

export const RECOMMENDATION_KINDS = ["take", "cancel", "bill"] as const;
export type RecommendationKind = (typeof RECOMMENDATION_KINDS)[number];
export type RecommendationFilter = "all" | RecommendationKind;

/** The rows with the given kind (or every kind) whose name contains `query`. */
export function filterRecommendations<
	T extends { name: string; kind: RecommendationKind },
>(rows: readonly T[], kind: RecommendationFilter, query: string): T[] {
	const q = query.trim().toLowerCase();
	return rows.filter(
		(row) =>
			(kind === "all" || row.kind === kind) &&
			(!q || row.name.toLowerCase().includes(q)),
	);
}

/** How many rows there are per kind, and in total. */
export function countByKind(
	rows: readonly { kind: RecommendationKind }[],
): Record<RecommendationFilter, number> {
	const counts = { all: rows.length, take: 0, cancel: 0, bill: 0 };
	for (const row of rows) counts[row.kind]++;
	return counts;
}

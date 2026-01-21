// Local cache only (source of truth is Supabase `users.has_seen_tour`)
export const MAIN_DASHBOARD_TOUR_STORAGE_KEY = "has_seen_tour";

export function hasSeenMainDashboardTour(): boolean {
	if (typeof window === "undefined") return true;
	return window.localStorage.getItem(MAIN_DASHBOARD_TOUR_STORAGE_KEY) === "true";
}

export function markMainDashboardTourSeen(): void {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(MAIN_DASHBOARD_TOUR_STORAGE_KEY, "true");
}

export async function fetchMainDashboardTourSeen(): Promise<boolean> {
	const res = await fetch("/api/tours/main-dashboard", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) return false;
	const data = (await res.json()) as { seen?: boolean };
	return Boolean(data?.seen);
}

export async function markMainDashboardTourSeenServer(): Promise<void> {
	await fetch("/api/tours/main-dashboard", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
}


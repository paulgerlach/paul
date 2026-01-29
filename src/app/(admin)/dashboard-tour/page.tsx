"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_OBJEKTE, ROUTE_DASHBOARD } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import TourDashboardCharts from "@/components/Admin/DashboardCharts/TourDashboardCharts";
import TourGuide from "@/components/Guide/TourGuide";
import { useTourStore } from "@/store/useTourStore";
import ShareButton from "@/app/shared/ShareButton";
import { useChartStore } from "@/store/useChartStore";

export default function TourDashboardPage() {
	const setRun = useTourStore((state) => state.setRun);
	const [userId, setUserId] = useState<string | null>(null);
	const isTableView = useChartStore((state) => state.isTableView);

	useEffect(() => {
		setRun(true);
	}, [setRun]);

	useEffect(() => {
		async function loadUserId() {
			try {
				console.log("[Tour] Loading user from Supabase...");
				const {
					data: { user },
				} = await supabase.auth.getUser();
				console.log("[Tour] User loaded:", user?.id);
				setUserId(user?.id || null);
			} catch (error) {
				console.error("Error loading user:", error);
			}
		}
		loadUserId();
	}, []);

	const ensureUserId = async (): Promise<string | null> => {
		if (userId) return userId;
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			const id = user?.id || null;
			setUserId(id);
			return id;
		} catch (error) {
			console.error("[Tour] Error ensuring userId:", error);
			return null;
		}
	};

	const handleSkipTour = async () => {
		const id = await ensureUserId();
		console.log("[Tour] Skip tour clicked, userId:", id);
		if (id) {
			try {
				console.log("[Tour] Calling API to mark tour as seen...");
				const response = await fetch("/api/mark-tour-seen", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId: id }),
				});

				console.log("[Tour] API response status:", response.status);

				if (!response.ok) {
					console.error("[Tour] API call failed with status:", response.status);
					const errorText = await response.text();
					console.error("[Tour] API error:", errorText);
					return;
				}

				const data = await response.json();
				console.log("[Tour] Skip tour API response:", data);
				if (!data.success) {
					console.error("[Tour] Failed to mark tour as seen:", data);
					return;
				}
				console.log("[Tour] Successfully marked tour as seen, redirecting to dashboard");
			} catch (error) {
				console.error("[Tour] Error marking tour as seen:", error);
				return;
			}
		} else {
			console.error("[Tour] Cannot skip tour - userId is null/undefined");
			return;
		}
		window.location.assign(`${ROUTE_DASHBOARD}?tour_completed=true`);
	};

	const handleTourComplete = async () => {
		const id = await ensureUserId();
		console.log("[Tour] Tour complete, userId:", id);
		if (id) {
			try {
				console.log("[Tour] Calling API to mark tour as seen...");
				const response = await fetch("/api/mark-tour-seen", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId: id }),
				});

				console.log("[Tour] API response status:", response.status);

				if (!response.ok) {
					console.error("[Tour] API call failed with status:", response.status);
					const errorText = await response.text();
					console.error("[Tour] API error:", errorText);
					return;
				}

				const data = await response.json();
				console.log("[Tour] Complete tour API response:", data);
				if (!data.success) {
					console.error("[Tour] Failed to mark tour as seen:", data);
					return;
				}
				console.log("[Tour] Successfully marked tour as seen, redirecting to dashboard");
			} catch (error) {
				console.error("[Tour] Error marking tour as seen:", error);
				return;
			}
		} else {
			console.error("[Tour] Cannot complete tour - userId is null/undefined");
			return;
		}
		window.location.assign(`${ROUTE_DASHBOARD}?tour_completed=true`);
	};

	const handleRestartTour = () => {
		setRun(true);
	};

	return (
		<TourGuide onTourComplete={handleTourComplete} onTourSkip={handleSkipTour}>
			<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 space-y-6 overflow-y-auto flex-1">
				<Breadcrumb 
					backTitle="Objekte" 
					link={ROUTE_OBJEKTE} 
					title={isTableView ? "Verbrauchsdaten" : "Dashboard"} 
				/>
				<TourDashboardCharts />
				<div className="flex gap-2 max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
					<ShareButton />
				</div>
			</div>
		</TourGuide>
	);
}

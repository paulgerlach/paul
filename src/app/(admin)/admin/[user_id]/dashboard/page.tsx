"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_OBJEKTE, ROUTE_TOUR_DASHBOARD } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";
import { useChartStore } from "@/store/useChartStore";

export default function AdminDashboardPage({
	params,
}: {
	params: Promise<{ user_id: string }>;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tourCompleted = searchParams.get("tour_completed") === "true";
	const [isChecking, setIsChecking] = useState(true);
	
	const isTableView = useChartStore((state) => state.isTableView);

	useEffect(() => {
		// Skip tour check if user just completed tour
		if (tourCompleted) {
			console.log("[Tour Check] Skipping check - tour just completed");
			setIsChecking(false);
			return;
		}

		async function checkTourStatus() {
			try {
				console.log("[Tour Check] Starting tour status check...");
				const {
					data: { user },
				} = await supabase.auth.getUser();

				console.log("[Tour Check] User:", user?.id);
				if (user) {
					const { data, error } = await supabase
						.from("users")
						.select("has_seen_tour")
						.eq("id", user.id)
						.single();

					console.log("[Tour Check] Tour data:", { data, error });
					if (!error && data && !data.has_seen_tour) {
						console.log("[Tour Check] Redirecting to tour dashboard...");
						router.push(ROUTE_TOUR_DASHBOARD);
						return;
					} else {
						console.log("[Tour Check] No redirect - has_seen_tour:", data?.has_seen_tour);
					}
				}
			} catch (error) {
				console.error("[Tour Check] Error checking tour status:", error);
			} finally {
				setIsChecking(false);
			}
		}

		checkTourStatus();
	}, [router, tourCompleted]);

	if (isChecking) {
		return null;
	}

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 overflow-scroll space-y-6">
			<Breadcrumb 
				backTitle="Objekte" 
				link={ROUTE_OBJEKTE} 
				title={isTableView ? "Verbrauchsdaten" : "Dashboard"} 
			/>
			<DashboardCharts />
			<div className="flex justify-start max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<ShareButton />
			</div>
		</div>
	);
}

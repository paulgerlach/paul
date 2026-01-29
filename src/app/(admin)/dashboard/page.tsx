"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_OBJEKTE, ROUTE_TOUR_DASHBOARD } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";
import { useChartStore } from "@/store/useChartStore";

export default function AdminPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tourCompleted = searchParams.get("tour_completed") === "true";
	const [isChecking, setIsChecking] = useState(true);
	
	// Use a selector for better reactivity
	const isTableView = useChartStore((state) => state.isTableView);

	useEffect(() => {
		// Skip tour check if user just completed tour
		if (tourCompleted) {
			setIsChecking(false);
			return;
		}

		async function checkTourStatus() {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (user) {
					const { data, error } = await supabase
						.from("users")
						.select("has_seen_tour")
						.eq("id", user.id)
						.single();

					if (!error && data && !data.has_seen_tour) {
						router.push(ROUTE_TOUR_DASHBOARD);
						return;
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
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 space-y-6 overflow-y-auto flex-1">
			<Breadcrumb 
				backTitle="Objekte" 
				link={ROUTE_OBJEKTE} 
				title={isTableView ? "Datenansicht" : "Dashboard"} 
			/>
			<DashboardCharts />
			<div className="flex justify-start max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<ShareButton />
			</div>
		</div>
	);
}

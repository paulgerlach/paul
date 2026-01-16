"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ROUTE_OBJEKTE, ROUTE_DASHBOARD } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import TourDashboardCharts from "@/components/Admin/DashboardCharts/TourDashboardCharts";
import TourGuide from "@/components/Guide/TourGuide";
import { useTourStore } from "@/store/useTourStore";
import ShareButton from "@/app/shared/ShareButton";

export default function TourDashboardPage() {
	const router = useRouter();
	const setRun = useTourStore((state) => state.setRun);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		setRun(true);
	}, [setRun]);

	useEffect(() => {
		async function loadUserId() {
			try {
				const supabase = createClient(
					process.env.NEXT_PUBLIC_SUPABASE_URL!,
					process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
				);
				const {
					data: { user },
				} = await supabase.auth.getUser();
				setUserId(user?.id || null);
			} catch (error) {
				console.error("Error loading user:", error);
			}
		}
		loadUserId();
	}, []);

	const handleSkipTour = async () => {
		console.log("[Tour] Skip tour clicked, userId:", userId);
		if (userId) {
			try {
				const response = await fetch("/api/mark-tour-seen", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId }),
				});
				const data = await response.json();
				console.log("[Tour] Skip tour API response:", data);
			} catch (error) {
				console.error("[Tour] Error marking tour as seen:", error);
			}
		}
		router.push(ROUTE_DASHBOARD);
	};

	const handleTourComplete = async () => {
		console.log("[Tour] Tour complete, userId:", userId);
		if (userId) {
			try {
				const response = await fetch("/api/mark-tour-seen", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId }),
				});
				const data = await response.json();
				console.log("[Tour] Complete tour API response:", data);
			} catch (error) {
				console.error("[Tour] Error marking tour as seen:", error);
			}
		}
		router.push(ROUTE_DASHBOARD);
	};

	const handleRestartTour = () => {
		setRun(true);
	};

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 space-y-6 overflow-y-auto flex-1">
			<Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
			<TourDashboardCharts />
			<TourGuide
				onTourComplete={handleTourComplete}
				onTourSkip={handleSkipTour}
			/>
			<div className="flex gap-2 max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<ShareButton />
			</div>
		</div>
	);
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ROUTE_OBJEKTE, ROUTE_TOUR_DASHBOARD } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";

export default function AdminPage() {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		async function checkTourStatus() {
			try {
				const supabase = createClient(
					process.env.NEXT_PUBLIC_SUPABASE_URL!,
					process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
				);
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
				console.error("Error checking tour status:", error);
			} finally {
				setIsChecking(false);
			}
		}

		checkTourStatus();
	}, [router]);

	if (isChecking) {
		return null;
	}

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 space-y-6 overflow-y-auto flex-1">
			<Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
			<DashboardCharts />
			<div className="flex justify-start max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<ShareButton />
			</div>
		</div>
	);
}

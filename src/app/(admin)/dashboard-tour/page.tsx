"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import TourDashboardCharts from "@/components/Admin/DashboardCharts/TourDashboardCharts";
import TourGuide from "@/components/Guide/TourGuide";
import { useTourStore } from "@/store/useTourStore";

export default function TourDashboardPage() {
	const router = useRouter();
	const setRun = useTourStore((state) => state.setRun);

	useEffect(() => {
		setRun(true);
	}, [setRun]);

	const handleSkipTour = () => {
		router.push("/admin/dashboard");
	};

	const handleRestartTour = () => {
		setRun(true);
	};

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 space-y-6 overflow-y-auto flex-1">
			<Breadcrumb
				backTitle="Objekte"
				link={ROUTE_OBJEKTE}
				title="Tour Dashboard"
			/>
			<TourDashboardCharts />
			<TourGuide />
			<div className="flex gap-2 max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<button
					onClick={handleRestartTour}
					className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium text-sm"
				>
					Restart Tour
				</button>
				<button
					onClick={handleSkipTour}
					className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
				>
					Skip Tour
				</button>
				<button
					onClick={() => router.push("/admin/dashboard")}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
				>
					Go to Dashboard
				</button>
			</div>
		</div>
	);
}

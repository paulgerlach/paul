"use client";

import { useEffect } from "react";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";
import { useTourStore } from "@/store/useTourStore";

export default function AdminDashboardPage({
	params,
}: {
	params: Promise<{ user_id: string }>;
}) {
	const setRun = useTourStore((state) => state.setRun);

	useEffect(() => {
		setRun(true);
	}, [setRun]);

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 overflow-scroll space-y-6">
			<Breadcrumb
				backTitle="Objekte"
				link={ROUTE_OBJEKTE}
				title="Dashboard"
			/>
			<DashboardCharts />
			<div className="flex gap-2 max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<button
					onClick={() => setRun(true)}
					className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium text-sm"
				>
					Start Tour
				</button>
				<ShareButton />
			</div>
		</div>
	);
}

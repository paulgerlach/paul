"use client";

import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";

export default function AdminDashboardPage({
	params,
}: {
	params: Promise<{ user_id: string }>;
}) {
	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 overflow-scroll space-y-6">
			<Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
			<DashboardCharts />
			<div className="flex justify-start max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl mx-auto">
				<ShareButton />
			</div>
		</div>
	);
}

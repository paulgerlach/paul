"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMeterHierarchy } from "@/hooks/useChartData";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";
import DashboardTable from "./DashboardTable";

const WaterChart = dynamic(
	() => import("@/components/Basic/Charts/WaterChart"),
	{
		loading: () => <ChartCardSkeleton />,
		ssr: false,
	},
);

const ElectricityChart = dynamic(
	() => import("@/components/Basic/Charts/ElectricityChart"),
	{
		loading: () => <ChartCardSkeleton />,
		ssr: false,
	},
);

const HeatingCosts = dynamic(
	() => import("@/components/Basic/Charts/HeatingCosts"),
	{
		loading: () => <ChartCardSkeleton />,
		ssr: false,
	},
);

const NotificationsChart = dynamic(
	() => import("@/components/Basic/Charts/NotificationsChart"),
	{
		loading: () => <ChartCardSkeleton />,
		ssr: false,
	},
);

const EinsparungChart = dynamic(
	() => import("@/components/Basic/Charts/EinsparungChart"),
	{
		loading: () => <ChartCardSkeleton />,
		ssr: false,
	},
);

export default function DashboardCharts() {
	const { meterIds, isTableView } = useChartStore();
	const params = useParams();
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	// Get the effective user ID for metadata lookups (needed for Table View hierarchy)
	useEffect(() => {
		const getUserId = async () => {
			if (params?.user_id) {
				setCurrentUserId(params.user_id as string);
			} else {
				const { data: { user } } = await supabase.auth.getUser();
				if (user) setCurrentUserId(user.id);
			}
		};
		getUserId();
	}, [params]);

	// Hierarchy data for Table View (building/unit/tenant mapping)
	const hierarchy = useMeterHierarchy(currentUserId || undefined);

	// Single unified data fetch with SWR caching (replaces 5 separate API calls)
	const {
		coldWaterData,
		hotWaterData,
		electricityData,
		heatData,
		notificationsData,
		isLoading,
		error
	} = useDashboardData();

	// Combined data for EinsparungChart and Table View (all device types)
	const allData = useMemo(() => [
		...coldWaterData,
		...hotWaterData,
		...electricityData,
		...heatData,
	], [coldWaterData, hotWaterData, electricityData, heatData]);

	// Show message when no meter IDs are selected
	if (!meterIds.length && !isLoading) {
		return (
			<ContentWrapper className="grid gap-3 [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_400px] max-[1300px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-medium:flex max-medium:flex-col">
				<div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
					<div className="text-gray-400 mb-4">
						<svg
							className="w-16 h-16 mx-auto"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Keine Wohnungen ausgewählt
					</h3>
					<p className="text-gray-600">
						Bitte wählen Sie Wohnungen aus, um die Verbrauchsdaten anzuzeigen.
					</p>
				</div>
			</ContentWrapper>
		);
	}

	// TABLE VIEW
	if (isTableView) {
		const isTableLoading = isLoading || hierarchy.loading;
		return (
			<ContentWrapper className="grid gap-3 [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_400px] max-[1300px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-medium:flex max-medium:flex-col">
				<div className="col-span-full h-[492px]">
					{isTableLoading ? (
						<div className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm text-center p-6">
							<div className="flex flex-col items-center gap-4">
								<div className="w-12 h-12 border-4 border-dark_green/20 border-t-dark_green rounded-full animate-spin" />
								<p className="text-gray-500 font-medium">Bereite Verbrauchsdaten vor...</p>
							</div>
						</div>
					) : (
						<DashboardTable data={allData} hierarchy={hierarchy.data} />
					)}
				</div>
			</ContentWrapper>
		);
	}

	// CHART VIEW (ORIGINAL)
	return (
		<ContentWrapper className="grid gap-3 [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_400px] max-[1300px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-medium:flex max-medium:flex-col">
			{/* Column 1: Kaltwasser + Warmwasser */}
			<div className="flex flex-col gap-3">
				<div className="h-[240px]">
					{isLoading ? (
						<ChartCardSkeleton />
					) : (
						<WaterChart
							csvText={coldWaterData}
							color="#6083CC"
							title="Kaltwasser"
							chartType="cold"
							isEmpty={coldWaterData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Daten für Kaltwasser im ausgewählten Zeitraum."
						/>
					)}
				</div>
				<div className="h-[240px]">
					{isLoading ? (
						<ChartCardSkeleton />
					) : (
						<WaterChart
							csvText={hotWaterData}
							color="#E74B3C"
							title="Warmwasser"
							chartType="hot"
							isEmpty={hotWaterData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Daten für Warmwasser im ausgewählten Zeitraum."
						/>
					)}
				</div>
			</div>

			{/* Column 2: Stromverbrauch + Heizkosten */}
			<div className="flex flex-col gap-3">
				<div className="h-[200px]">
					{isLoading ? (
						<ChartCardSkeleton />
					) : (
						<ElectricityChart
							electricityReadings={electricityData}
							isEmpty={electricityData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Stromdaten im ausgewählten Zeitraum."
						/>
					)}
				</div>
				<div className="h-[280px]">
					{isLoading ? (
						<ChartCardSkeleton />
					) : (
						<HeatingCosts
							csvText={heatData}
							isEmpty={heatData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
						/>
					)}
				</div>
			</div>

			{/* Column 3: Benachrichtigungen + Einsparung (these stay together on tablet) */}
			<div className="flex flex-col gap-3 max-[1300px]:col-span-2 max-medium:col-span-1 max-medium:flex max-medium:flex-col">
				<div className="h-[300px] max-[1300px]:h-[300px]">
					{isLoading ? (
						<ChartCardSkeleton />
					) : (
						<NotificationsChart
							isEmpty={notificationsData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Daten im ausgewählten Zeitraum."
							parsedData={{ data: notificationsData, errors: [] }}
						/>
					)}
				</div>
				<div className="h-[180px] max-[1300px]:h-[300px]">
					{isLoading ? (
						<ChartCardSkeleton />
					) : (
						<EinsparungChart
							selectedData={allData}
							isEmpty={allData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine CO₂-Einsparungen im ausgewählten Zeitraum."
						/>
					)}
				</div>
			</div>
		</ContentWrapper>
	);
}

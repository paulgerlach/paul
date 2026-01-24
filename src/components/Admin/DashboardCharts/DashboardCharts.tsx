"use client";

import dynamic from "next/dynamic";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { useChartStore } from "@/store/useChartStore";
import {
	useWaterChartData,
	useElectricityChartData,
	useHeatChartData,
	useNotificationsChartData,
} from "@/hooks/useChartData";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";

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
	const { meterIds } = useChartStore();

	// Individual chart data hooks
	const coldWaterChart = useWaterChartData("cold");
	const hotWaterChart = useWaterChartData("hot");
	const electricityChart = useElectricityChartData();
	const heatChart = useHeatChartData();
	const notificationsChart = useNotificationsChartData();

	// Combine data for EinsparungChart (needs all device types for CO2 calculations)
	const einsparungChartData = [
		...coldWaterChart.data,
		...hotWaterChart.data,
		...electricityChart.data,
		...heatChart.data,
	];
	const einsparungChartLoading =
		coldWaterChart.loading ||
		hotWaterChart.loading ||
		electricityChart.loading ||
		heatChart.loading;

	// Debug logging
	console.log("[DashboardCharts] Render:", {
		meterIdsCount: meterIds.length,
		loading: coldWaterChart.loading,
	});

	// Show message when no meter IDs are selected
	// Only show if not loading (prevents showing message during initial load)
	const isAnyChartLoading =
		coldWaterChart.loading ||
		hotWaterChart.loading ||
		electricityChart.loading ||
		heatChart.loading;

	if (!meterIds.length && !isAnyChartLoading) {
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

	// Determine whether to show electricity chart based on data availability
	const shouldShowElectricityChart = electricityChart.data.length > 0;

	return (
			<ContentWrapper className="grid gap-3 [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_400px] max-[1300px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-medium:flex max-medium:flex-col">
			{/* Column 1: Kaltwasser + Warmwasser */}
			<div className="flex flex-col gap-3">
				<div className="h-[312px]">
					{coldWaterChart.loading ? (
						<ChartCardSkeleton />
					) : (
						<WaterChart
							csvText={coldWaterChart.data}
							color="#6083CC"
							title="Kaltwasser"
							chartType="cold"
							isEmpty={coldWaterChart.data.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Daten für Kaltwasser im ausgewählten Zeitraum."
						/>
					)}
				</div>
				<div className="h-[271px]">
					{hotWaterChart.loading ? (
						<ChartCardSkeleton />
					) : (
						<WaterChart
							csvText={hotWaterChart.data}
							color="#E74B3C"
							title="Warmwasser"
							chartType="hot"
							isEmpty={hotWaterChart.data.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Daten für Warmwasser im ausgewählten Zeitraum."
						/>
					)}
				</div>
			</div>

			{/* Column 2: Stromverbrauch + Heizkosten */}
			<div className="flex flex-col gap-3">
				<div className="electricity-chart-container h-[265px]">
					{electricityChart.loading ? (
						<ChartCardSkeleton />
					) : (
						<ElectricityChart
							electricityReadings={electricityChart.data}
							isEmpty={electricityChart.data.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Stromdaten im ausgewählten Zeitraum."
						/>
					)}
				</div>
				<div className="heating-chart-container h-[318px]">
					{heatChart.loading ? (
						<ChartCardSkeleton />
					) : (
						<HeatingCosts
							csvText={heatChart.data}
							isEmpty={heatChart.data.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Heizungsdaten im ausgewählten Zeitraum."
						/>
					)}
				</div>
			</div>

			{/* Column 3: Benachrichtigungen + Einsparung (these stay together on tablet) */}
			<div className="flex flex-col gap-3 max-[1300px]:col-span-2 max-medium:col-span-1 max-medium:flex max-medium:flex-col">
				<div className="notifications-chart-container h-[360px] max-[1300px]:h-[300px]">
					{notificationsChart.loading ? (
						<ChartCardSkeleton />
					) : (
						<NotificationsChart
							isEmpty={notificationsChart.data.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine Daten im ausgewählten Zeitraum."
							parsedData={{ data: notificationsChart.data, errors: [] }}
						/>
					)}
				</div>
				<div className="einsparung-chart-container h-[220px] max-[1300px]:h-[300px]">
					{einsparungChartLoading ? (
						<ChartCardSkeleton />
					) : (
						<EinsparungChart
							selectedData={einsparungChartData}
							isEmpty={einsparungChartData.length === 0}
							emptyTitle="Keine Daten verfügbar."
							emptyDescription="Keine CO₂-Einsparungen im ausgewählten Zeitraum."
						/>
					)}
				</div>
			</div>
		</ContentWrapper>
	);
}
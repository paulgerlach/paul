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

import { Responsive, WidthProvider, } from 'react-grid-layout/legacy';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Correct import for react-grid-layout
import { LayoutItem } from "react-grid-layout";

// import { Layout } from "lucide-react";
const ResponsiveGridLayout = WidthProvider(Responsive);
const defaultLayout: LayoutItem[] = [
  // Row 1
  { i: "coldWater", x: 0, y: 0, w: 4, h: 4 },    // Column 1
  { i: "electricity", x: 4, y: 0, w: 4, h: 3 },     // Column 2
  { i: "notifications", x: 8, y: 0, w: 4, h: 5},  // Column 3
  
  // Row 2
  { i: "hotWater", x: 0, y: 7, w: 4, h: 4 },      // Column 1
  { i: "heating", x: 4, y: 7, w: 4, h: 5 }, // Column 2
  { i: "einsparung", x: 8, y: 7, w: 4, h: 3 },    // Column 3
];



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
	// Local state for layout to handle resizing updates
  	const [layout, setLayout] = useState<LayoutItem[]>(defaultLayout);

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


	// When no meters selected, charts show their default empty states (no early return)
	const effectiveLoading = meterIds.length > 0 && isLoading;
	const noMetersSelected = meterIds.length === 0;
	const defaultEmptyTitle = noMetersSelected
		? "Keine Wohnungen ausgewählt"
		: "Keine Daten verfügbar.";
	const defaultEmptyDescription = noMetersSelected
		? "Bitte wählen Sie Wohnungen aus, um die Verbrauchsdaten anzuzeigen."
		: undefined;

	// TABLE VIEW
	if (isTableView) {
		const isTableLoading = effectiveLoading || hierarchy.loading;
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
    <ContentWrapper className="p-0 overflow-hidden">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 6, xxs: 2 }}
        rowHeight={45}
        margin={[20, 20]}
        isResizable={true}
        isDraggable={false}
        useCSSTransforms={true}
        // Compact type ensures items pack tightly without gaps
        compactType="vertical"
        // Prevent collisions
        preventCollision={false}
      >
		<div key="coldWater" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
			{effectiveLoading ? (
				<ChartCardSkeleton />
			) : (
				<WaterChart
				csvText={coldWaterData}
				color="#6083CC"
				title="Kaltwasser"
				chartType="cold"
				isEmpty={coldWaterData.length === 0}
				emptyTitle={defaultEmptyTitle}
				emptyDescription={
					defaultEmptyDescription ??
					"Keine Daten für Kaltwasser im ausgewählten Zeitraum."
				}
			/>
			)}
        </div>

        <div key="hotWater" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
			{effectiveLoading ? (
				<ChartCardSkeleton />
			) : (
				<WaterChart
				csvText={hotWaterData}
				color="#E74B3C"
				title="Warmwasser"
				chartType="hot"
				isEmpty={hotWaterData.length === 0}
				emptyTitle={defaultEmptyTitle}
				emptyDescription={
					defaultEmptyDescription ??
					"Keine Daten für Warmwasser im ausgewählten Zeitraum."
				}
			/>
  			)}
        </div>

        <div key="electricity" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
			{effectiveLoading ? (
				<ChartCardSkeleton />
			) : (
				<ElectricityChart
				electricityReadings={electricityData}
				isEmpty={electricityData.length === 0}
				emptyTitle={defaultEmptyTitle}
				emptyDescription={
					defaultEmptyDescription ??
					"Keine Stromdaten im ausgewählten Zeitraum."
				}
			/>
  			)}
        </div>

        <div key="heating" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
			{effectiveLoading ? (
				<ChartCardSkeleton />
			) : (
				<HeatingCosts
				csvText={heatData}
				isEmpty={heatData.length === 0}
				emptyTitle={defaultEmptyTitle}
				emptyDescription={
					defaultEmptyDescription ??
					"Keine Heizungsdaten im ausgewählten Zeitraum."
				}
			/>
  			)}
        </div>

        <div key="notifications" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
			{effectiveLoading ? (
				<ChartCardSkeleton />
			) : (
				<NotificationsChart
				isEmpty={notificationsData.length === 0}
				emptyTitle={defaultEmptyTitle}
				emptyDescription={
					defaultEmptyDescription ??
					"Keine Daten im ausgewählten Zeitraum."
				}
				parsedData={{ data: notificationsData, errors: [] }}
			/>
  			)}
        </div>

        <div key="einsparung" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
			{effectiveLoading ? (
				<ChartCardSkeleton />
			) : (
				<EinsparungChart
				selectedData={allData}
				isEmpty={allData.length === 0}
				emptyTitle={defaultEmptyTitle}
				emptyDescription={
					defaultEmptyDescription ??
					"Keine CO₂-Einsparungen im ausgewählten Zeitraum."
				}
			/>
  			)}
        </div>
      </ResponsiveGridLayout>
    </ContentWrapper>
  );
}
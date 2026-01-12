import { earth } from "@/static/icons";
import Image from "next/image";
import { EmptyState } from "@/components/Basic/ui/States";
import { MeterReadingType } from "@/api";
import {
	calculateCO2Savings,
	formatCO2Savings,
	getCO2Context,
} from "@/utils/co2Calculator";
import { useChartStore } from "@/store/useChartStore";

interface EinsparungChartProps {
	isEmpty?: boolean;
	emptyTitle?: string;
	emptyDescription?: string;
	selectedData?: MeterReadingType[];
}

export default function EinsparungChart({
	isEmpty,
	emptyTitle,
	emptyDescription,
	selectedData,
}: EinsparungChartProps) {
	// Data is already filtered by meter IDs at database level
	const filteredData = selectedData || [];

	// Calculate CO₂ savings from the filtered data
	const co2Result = filteredData ? calculateCO2Savings(filteredData) : null;
	const co2Display = co2Result
		? formatCO2Savings(co2Result.totalCO2SavedTons)
		: "0t CO₂";
	const co2Context = co2Result
		? getCO2Context(co2Result.totalCO2SavedTons)
		: null;

	// Determine if we should show empty state
	const shouldShowEmpty =
		isEmpty ||
		!filteredData ||
		filteredData.length === 0 ||
		co2Result?.totalCO2SavedTons === 0;

	return (
		<div className="rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col">
			<div className="flex pb-3 border-b border-b-dark_green/10 items-center justify-between mb-1">
				<h2 className="text-lg max-small:text-sm max-medium:text-sm font-medium text-gray-800">
					Einsparung
				</h2>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="w-5 h-5 max-small:max-w-5 max-small:max-h-5 max-medium:max-w-5 max-medium:max-h-5"
					src={earth}
					alt="earth"
				/>
			</div>
			<div className="flex-1 flex flex-col justify-center">
				{shouldShowEmpty ? (
					<EmptyState
						title={emptyTitle ?? "Keine Daten verfügbar."}
						description={
							emptyDescription ??
							"Keine CO₂-Einsparungen im ausgewählten Zeitraum."
						}
						imageSrc={earth.src}
						imageAlt="Einsparung"
					/>
				) : (
					<div className="text-center">
						<p className="text-6xl md:text-3xl lg:text-4xl text-black/50 mb-2">
							{co2Display}
						</p>
						{co2Context &&
							co2Result &&
							co2Result.totalCO2SavedTons > 0.1 && (
								<p className="text-xs text-gray-500 max-small:text-xs">
									{co2Context.description}
								</p>
							)}
						{/* {co2Result && (
              <div className="mt-2 text-xs text-gray-400">
                {co2Result.details.deviceCount.heating + co2Result.details.deviceCount.hotWater + co2Result.details.deviceCount.coldWater} Geräte
              </div>
            )} */}
					</div>
				)}
			</div>
		</div>
	);
}

"use client";

import React from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useTourStore } from "@/store/useTourStore";

interface TourGuideProps {
	onTourComplete?: () => void;
	onTourSkip?: () => void;
}

const steps = [
	{
		target: "#WaterChart",
		content: "Welcome to your dashboard! Here you can monitor your water consumption in real-time.",
		disableBeacon: true,
	},
	{
		target: ".electricity-chart-container",
		content: "Track your electricity usage and identify trends to optimize your energy consumption.",
	},
	{
		target: ".heating-chart-container",
		content: "Monitor your heating costs and analyze seasonal patterns for better efficiency.",
	},
	{
		target: ".notifications-chart-container",
		content: "Stay informed with real-time notifications about your meters and usage alerts.",
	},
	{
		target: ".einsparung-chart-container",
		content: "See your CO₂ savings contributions and environmental impact over time.",
	},
];

const CustomTooltip = ({
	step,
	backProps,
	primaryProps,
	skipProps,
	tooltipProps,
	isLastStep,
	index,
}: any) => (
	<div
		{...tooltipProps}
		className="bg-white rounded-lg shadow-xl p-5 max-w-sm border border-gray-100"
	>
		{step.title && (
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				{step.title}
			</h3>
		)}
		<div className="text-sm text-gray-700 leading-relaxed">
			{step.content}
		</div>
		<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
			<button
				{...skipProps}
				className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
			>
				Skip tour
			</button>
			<div className="flex gap-2">
				{index > 0 && (
					<button
						{...backProps}
						className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
					>
						Back
					</button>
				)}
				<button
					{...primaryProps}
					className="px-3 py-1.5 text-sm text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors font-medium"
				>
					{isLastStep ? "Finish" : "Next"}
				</button>
			</div>
		</div>
	</div>
);

export default function TourGuide({ onTourComplete, onTourSkip }: TourGuideProps) {
	const run = useTourStore((state) => state.run);
	const setRun = useTourStore((state) => state.setRun);

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		if (status === STATUS.FINISHED) {
			setRun(false);
			onTourComplete?.();
		} else if (status === STATUS.SKIPPED) {
			setRun(false);
			onTourSkip?.();
		}
	};

	return (
		<Joyride
			steps={steps}
			run={run}
			continuous
			showSkipButton
			tooltipComponent={CustomTooltip}
			callback={handleJoyrideCallback}
			styles={{
				options: {
					zIndex: 1000,
					overlayColor: "rgba(0, 0, 0, 0.5)",
				},
				spotlight: {
					borderRadius: 8,
				},
			}}
		/>
	);
}

"use client";

import React, { useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useTourStore } from "@/store/useTourStore";

interface TourGuideProps {
	onTourComplete?: () => void;
	onTourSkip?: () => void;
}

const steps = [
	{
		target: "#WaterChart",
		content:
			"Willkommen auf Ihrem Dashboard! Hier können Sie Ihren Wasserverbrauch in Echtzeit überwachen.",
		disableBeacon: true,
	},
	{
		target: ".notifications-chart-container",
		content:
			"Bleiben Sie mit Echtzeitbenachrichtigungen über Ihre Zähler und Verbrauchsalarme informiert.",
	},
	{
		target: ".einsparung-chart-container",
		content:
			"Verfolgen Sie Ihren CO₂-Einsparungsbeitrag und die Umweltauswirkungen über die Zeit.",
	},
	{
		target: "#sidebar",
		content:
			"Nutzen Sie die Seitenleiste, um durch Ihr Dashboard, Objekte, Dokumente und Abrechnungsinformationen zu navigieren.",
		placement: "right" as const,
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
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
		)}
		<div className="text-sm text-gray-700 leading-relaxed">{step.content}</div>
		<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
			<button
				{...skipProps}
				className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
			>
				Tour überspringen
			</button>
			<div className="flex gap-2">
				{index > 0 && (
					<button
						{...backProps}
						className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
					>
						Zurück
					</button>
				)}
				<button
					{...primaryProps}
					className="px-3 py-1.5 text-sm text-dark_text bg-green rounded-md hover:bg-green/80 transition-colors font-medium"
				>
					{isLastStep ? "Fertigstellen" : "Weiter"}
				</button>
			</div>
		</div>
	</div>
);

export default function TourGuide({
	onTourComplete,
	onTourSkip,
}: TourGuideProps) {
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

	// Handle overlay clicks to complete the tour
	useEffect(() => {
		if (!run) return;

		const handleOverlayClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			
			// Ignore clicks on tooltip, spotlight, or buttons
			if (
				target.closest('[class*="react-joyride__tooltip"]') ||
				target.closest('[class*="tooltip"]') ||
				target.closest('[class*="react-joyride__spotlight"]') ||
				target.closest('[class*="spotlight"]') ||
				target.closest('button') ||
				target.tagName === 'BUTTON'
			) {
				return;
			}
			
			// Check if clicked element is the overlay (full-screen dark background)
			const rect = target.getBoundingClientRect();
			const isOverlay = 
				rect.width >= window.innerWidth * 0.95 && 
				rect.height >= window.innerHeight * 0.95 &&
				window.getComputedStyle(target).position === 'fixed';
			
			if (isOverlay) {
				event.preventDefault();
				event.stopPropagation();
				setRun(false);
				onTourComplete?.();
			}
		};

		// Add click listener with a delay to ensure overlay is rendered
		const timeoutId = setTimeout(() => {
			document.addEventListener("click", handleOverlayClick, true);
		}, 150);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener("click", handleOverlayClick, true);
		};
	}, [run, setRun, onTourComplete]);

	return (
		<Joyride
			steps={steps}
			run={run}
			continuous
			showSkipButton
			spotlightPadding={0}
			tooltipComponent={CustomTooltip}
			callback={handleJoyrideCallback}
			styles={{
				options: {
					zIndex: 1000,
					overlayColor: "rgba(0, 0, 0, 0.5)",
				},
				spotlight: {
					borderRadius: 15,
				},
			}}
		/>
	);
}

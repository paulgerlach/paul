"use client";

import React, { useEffect } from "react";
import Joyride, { ACTIONS, CallBackProps, STATUS } from "react-joyride";
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
		const { status, action } = data;

		// Treat clicking the shaded overlay (Joyride "close") as completing the tour.
		// This ensures we mark `has_seen_tour=true` the same as the normal finish flow.
		if (status === STATUS.FINISHED) {
			setRun(false);
			onTourComplete?.();
			return;
		}

		if (status === STATUS.SKIPPED) {
			setRun(false);

			if (action === ACTIONS.CLOSE) {
				onTourComplete?.();
				return;
			}

			onTourSkip?.();
		}
	};

	// Backup: reliably catch clicks on the Joyride overlay element itself.
	// (Depending on Joyride version/config, overlay click doesn't always surface clearly via callback.)
	useEffect(() => {
		if (!run) return;

		const handleOverlayClick = (event: MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();
			setRun(false);
			onTourComplete?.();
		};

		let overlayEl: HTMLElement | null = null;
		let observer: MutationObserver | null = null;

		const attach = () => {
			const el = document.querySelector<HTMLElement>(".react-joyride__overlay");
			if (!el) return false;
			overlayEl = el;
			overlayEl.addEventListener("click", handleOverlayClick, true);
			return true;
		};

		if (!attach()) {
			observer = new MutationObserver(() => {
				if (attach()) observer?.disconnect();
			});
			observer.observe(document.body, { childList: true, subtree: true });
		}

		return () => {
			observer?.disconnect();
			if (overlayEl) {
				overlayEl.removeEventListener("click", handleOverlayClick, true);
			}
		};
	}, [run, setRun, onTourComplete]);

	return (
		<Joyride
			steps={steps}
			run={run}
			continuous
			showSkipButton
			disableOverlayClose={false}
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

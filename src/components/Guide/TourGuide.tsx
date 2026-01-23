"use client";

import React, { useEffect, useMemo } from "react";
import {
	NextStep,
	NextStepProvider,
	useNextStep,
	type CardComponentProps,
	type Tour,
} from "nextstepjs";
import { useTourStore } from "@/store/useTourStore";

interface TourGuideProps {
	onTourComplete?: () => void;
	onTourSkip?: () => void;
	children: React.ReactNode;
}

const TOUR_NAME = "dashboardTour";

const nextStepTours: Tour[] = [
	{
		tour: TOUR_NAME,
		steps: [
			{
				icon: "",
				title: "",
				content:
					"Willkommen auf Ihrem Dashboard! Hier können Sie Ihren Wasserverbrauch in Echtzeit überwachen.",
				selector: "#WaterChart",
				side: "top",
				showControls: true,
				showSkip: true,
				pointerPadding: 0,
				pointerRadius: 15,
			},
			{
				icon: "",
				title: "",
				content:
					"Bleiben Sie mit Echtzeitbenachrichtigungen über Ihre Zähler und Verbrauchsalarme informiert.",
				selector: ".notifications-chart-container",
				side: "left",
				showControls: true,
				showSkip: true,
				pointerPadding: 0,
				pointerRadius: 15,
			},
			{
				icon: "",
				title: "",
				content:
					"Verfolgen Sie Ihren CO₂-Einsparungsbeitrag und die Umweltauswirkungen über die Zeit.",
				selector: ".einsparung-chart-container",
				side: "left",
				showControls: true,
				showSkip: true,
				pointerPadding: 0,
				pointerRadius: 15,
			},
			{
				icon: "",
				title: "",
				content:
					"Nutzen Sie die Seitenleiste, um durch Ihr Dashboard, Objekte, Dokumente und Abrechnungsinformationen zu navigieren.",
				selector: "#sidebar",
				side: "right",
				showControls: true,
				showSkip: true,
				pointerPadding: 0,
				pointerRadius: 15,
			},
		],
	},
];

function isLikelyOverlayElement(el: HTMLElement): boolean {
	const rect = el.getBoundingClientRect();
	if (rect.width < window.innerWidth * 0.9) return false;
	if (rect.height < window.innerHeight * 0.9) return false;
	const style = window.getComputedStyle(el);
	if (style.position !== "fixed") return false;

	const bg = style.backgroundColor || "";
	const match = bg.match(
		/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/
	);
	if (!match) return false;
	const alpha = match[4] ? Number(match[4]) : 1;
	return alpha > 0 && alpha < 1;
}

function TourCard({
	step,
	currentStep,
	totalSteps,
	nextStep,
	prevStep,
	skipTour,
	arrow,
}: CardComponentProps) {
	const isLast = currentStep === totalSteps - 1;

	return (
		<div className="nextstep-tour-card bg-white rounded-lg shadow-xl p-5 w-[440px] max-w-[92vw] border border-gray-100">
			{step.title ? (
				<h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
			) : null}
			<div className="text-sm text-gray-700 leading-relaxed">{step.content as any}</div>
			{arrow}
			<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
				{step.showSkip && skipTour ? (
					<button
						onClick={skipTour}
						className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
					>
						Tour überspringen
					</button>
				) : (
					<span />
				)}
				<div className="flex gap-2">
					{currentStep > 0 && prevStep ? (
						<button
							onClick={prevStep}
							className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
						>
							Zurück
						</button>
					) : null}
					<button
						onClick={nextStep}
						className="px-3 py-1.5 text-sm text-dark_text bg-green rounded-md hover:bg-green/80 transition-colors font-medium"
					>
						{isLast ? "Fertigstellen" : "Weiter"}
					</button>
				</div>
			</div>
		</div>
	);
}

function TourAutoStart({
	onTourComplete,
}: {
	onTourComplete?: () => void;
}) {
	const run = useTourStore((state) => state.run);
	const setRun = useTourStore((state) => state.setRun);
	const { startNextStep, closeNextStep, isNextStepVisible } = useNextStep();

	// Start when run=true (keeps existing behavior)
	useEffect(() => {
		if (!run) return;
		startNextStep(TOUR_NAME);
	}, [run, startNextStep]);

	// Treat overlay clicks as completing the tour
	useEffect(() => {
		if (!isNextStepVisible) return;

		const onClickCapture = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;

			// Ignore clicks inside the tour card/tooltip
			if (target.closest(".nextstep-tour-card")) return;

			// If user clicks the shaded area (overlay), treat it as completion.
			// (We also accept "anything outside the card" as a close gesture.)
			if (isLikelyOverlayElement(target) || !target.closest(".nextstep-tour-card")) {
				e.preventDefault();
				e.stopPropagation();
				setRun(false);
				closeNextStep();
				onTourComplete?.();
			}
		};

		document.addEventListener("click", onClickCapture, true);
		return () => document.removeEventListener("click", onClickCapture, true);
	}, [isNextStepVisible, closeNextStep, onTourComplete, setRun]);

	return null;
}

export default function TourGuide({
	onTourComplete,
	onTourSkip,
	children,
}: TourGuideProps) {
	const setRun = useTourStore((state) => state.setRun);
	const shadowOpacity = useMemo(() => "0.5", []);

	return (
		<NextStepProvider>
			<NextStep
				steps={nextStepTours}
				cardComponent={TourCard}
				shadowRgb="0, 0, 0"
				shadowOpacity={shadowOpacity}
				clickThroughOverlay={false}
				overlayZIndex={10000}
				onComplete={() => {
					setRun(false);
					onTourComplete?.();
				}}
				onSkip={() => {
					setRun(false);
					onTourSkip?.();
				}}
			>
				<>
					{children}
					<TourAutoStart onTourComplete={onTourComplete} />
				</>
			</NextStep>
		</NextStepProvider>
	);
}

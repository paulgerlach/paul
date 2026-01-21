import type { Tour } from "nextstepjs";

/**
 * Main dashboard tour steps.
 *
 * Note: selectors are injected at runtime by `MainDashboardTourAutoStart`
 * so we don't have to edit dashboard components to add ids.
 */
export const MAIN_DASHBOARD_TOUR_NAME = "mainDashboard";

export const mainDashboardTourSteps: Tour[] = [
	{
		tour: MAIN_DASHBOARD_TOUR_NAME,
		steps: [
			{
				icon: "👋",
				title: "Dashboard teilen",
				content:
					"Über diesen Button können Sie Ihr Dashboard sicher teilen (z.B. mit Kollegen oder der Verwaltung).",
				selector: "button.share-button-responsive",
				side: "bottom",
				showControls: true,
				showSkip: true,
			},
			{
				icon: "👋",
				title: "Überblick",
				content:
					"Hier sehen Sie Verbrauch, Benachrichtigungen und Einsparungen auf einen Blick.",
				selector: 'div.border-y-\\[16px\\].border-\\[\\#EFEEEC\\]',
				side: "top",
				showControls: true,
				showSkip: true,
			},
			{
				icon: "🧭",
				title: "Navigation",
				content:
					"Über die Sidebar navigieren Sie zu Dashboard, Objekte, Dokumente und Abrechnung.",
				selector: 'div.bg-white.max-w-\\[356px\\]',
				side: "right",
				showControls: true,
				showSkip: true,
			},
		],
	},
];


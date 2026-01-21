"use client";

import { useEffect, useMemo, useRef } from "react";
import { useNextStep } from "nextstepjs";
import {
	hasSeenMainDashboardTour,
	fetchMainDashboardTourSeen,
	markMainDashboardTourSeen,
	markMainDashboardTourSeenServer,
} from "./tourStorage";
import { MAIN_DASHBOARD_TOUR_NAME } from "./steps";

function isLikelyOverlayElement(el: HTMLElement): boolean {
	const rect = el.getBoundingClientRect();
	if (rect.width < window.innerWidth * 0.9) return false;
	if (rect.height < window.innerHeight * 0.9) return false;

	const style = window.getComputedStyle(el);
	if (style.position !== "fixed") return false;

	// Must visually look like a dim overlay (transparent-ish background).
	const bg = style.backgroundColor || "";
	// Covers common formats like: "rgba(0, 0, 0, 0.5)"
	const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
	if (!match) return false;

	const alpha = match[4] ? Number(match[4]) : 1;
	return alpha > 0 && alpha < 1;
}

function isDashboardPath(pathname: string): boolean {
	// Works for both: /dashboard and /admin/[id]/dashboard
	return pathname.endsWith("/dashboard");
}

function ensureTourAnchors(): boolean {
	// IMPORTANT: do not mutate DOM to add ids here.
	// Mutating attributes before a subtree hydrates can cause hydration mismatch warnings.
	const hasShareButton =
		!!document.querySelector("button.share-button-responsive") ||
		Array.from(document.querySelectorAll("button")).some(
			(b) => (b.textContent || "").trim() === "Dashboard teilen"
		);

	const hasDashboardWrapper = !!document.querySelector(
		'div.border-y-\\[16px\\].border-\\[\\#EFEEEC\\]'
	);

	// Desktop sidebar always exists on desktop; on mobile, it may be hidden.
	const hasSidebar = !!document.querySelector('div.bg-white.max-w-\\[356px\\]');

	return hasShareButton && hasDashboardWrapper && hasSidebar;
}

export default function MainDashboardTourAutoStart() {
	const initialPath = useMemo(() => {
		if (typeof window === "undefined") return "";
		return window.location.pathname;
	}, []);

	const { startNextStep, closeNextStep, isNextStepVisible } = useNextStep();

	const startedRef = useRef(false);
	const observerRef = useRef<MutationObserver | null>(null);

	// Start tour once the dashboard DOM is ready (charts are dynamically loaded).
	useEffect(() => {
		if (startedRef.current) return;

		let cancelled = false;

		const tryStart = () => {
			if (cancelled) return;
			if (!isDashboardPath(window.location.pathname)) return;
			const anchorsReady = ensureTourAnchors();
			if (anchorsReady) {
				startedRef.current = true;
				observerRef.current?.disconnect();
				// eslint-disable-next-line no-console
				console.log("[MainDashboardTour] Starting tour");
				startNextStep(MAIN_DASHBOARD_TOUR_NAME);
			}
		};

		const init = async () => {
			if (!isDashboardPath(window.location.pathname)) return;

			const forceTour =
				new URLSearchParams(window.location.search).get("force_tour") === "1";

			// Fast path: local cache says seen.
			if (!forceTour && hasSeenMainDashboardTour()) {
				// eslint-disable-next-line no-console
				console.log("[MainDashboardTour] Not starting: local cache has_seen_tour=true");
				return;
			}

			// Source of truth: Supabase per-user field.
			try {
				const serverSeen = await fetchMainDashboardTourSeen();
				if (!forceTour && serverSeen) {
					markMainDashboardTourSeen();
					// eslint-disable-next-line no-console
					console.log("[MainDashboardTour] Not starting: server has_seen_tour=true");
					return;
				}
			} catch {
				// If the check fails, we still allow the tour to start.
				// eslint-disable-next-line no-console
				console.log("[MainDashboardTour] Server seen check failed; continuing");
			}

			// Attempt immediately, then observe until charts mount.
			tryStart();

			// eslint-disable-next-line no-console
			console.log("[MainDashboardTour] Anchors ready:", ensureTourAnchors());
		};

		// Start immediately if we're already on dashboard.
		void init();

		// If this layout persists across navigation, listen for route changes.
		const onLocationChange = () => {
			if (startedRef.current) return;
			if (!isDashboardPath(window.location.pathname)) return;
			// eslint-disable-next-line no-console
			console.log("[MainDashboardTour] Route change to dashboard detected");
			void init();
		};

		const originalPushState = history.pushState;
		const originalReplaceState = history.replaceState;

		const patchHistory = () => {
			history.pushState = function (...args) {
				originalPushState.apply(this, args);
				window.dispatchEvent(new Event("locationchange"));
			};
			history.replaceState = function (...args) {
				originalReplaceState.apply(this, args);
				window.dispatchEvent(new Event("locationchange"));
			};
		};

		patchHistory();

		window.addEventListener("popstate", () =>
			window.dispatchEvent(new Event("locationchange"))
		);
		window.addEventListener("locationchange", onLocationChange);

		if (!startedRef.current) {
			const obs = new MutationObserver(() => tryStart());
			observerRef.current = obs;
			obs.observe(document.body, { childList: true, subtree: true });

			// Safety timeout to avoid observing forever.
			const timeout = window.setTimeout(() => {
				obs.disconnect();
			}, 15000);

			return () => {
				cancelled = true;
				window.clearTimeout(timeout);
				obs.disconnect();
				window.removeEventListener("locationchange", onLocationChange);
				history.pushState = originalPushState;
				history.replaceState = originalReplaceState;
			};
		}

		return () => {
			cancelled = true;
			observerRef.current?.disconnect();
			window.removeEventListener("locationchange", onLocationChange);
			history.pushState = originalPushState;
			history.replaceState = originalReplaceState;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startNextStep, initialPath]);

	// Treat overlay clicks as "seen" and close the tour.
	useEffect(() => {
		if (!isNextStepVisible) return;

		const onClickCapture = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;

			// Ignore clicks inside the tooltip/control UI
			if (target.closest("button")) return;

			if (isLikelyOverlayElement(target)) {
				markMainDashboardTourSeen();
				void markMainDashboardTourSeenServer();
				closeNextStep();
			}
		};

		document.addEventListener("click", onClickCapture, true);
		return () => document.removeEventListener("click", onClickCapture, true);
	}, [isNextStepVisible, closeNextStep]);

	return null;
}


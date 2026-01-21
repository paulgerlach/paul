"use client";

import type { PropsWithChildren } from "react";
import { NextStep, NextStepProvider } from "nextstepjs";
import MainDashboardTourAutoStart from "./MainDashboardTourAutoStart";
import { mainDashboardTourSteps } from "./steps";
import { markMainDashboardTourSeen, markMainDashboardTourSeenServer } from "./tourStorage";

export default function MainDashboardTourShell({ children }: PropsWithChildren) {
	return (
		<NextStepProvider>
			<NextStep
				steps={mainDashboardTourSteps}
				onComplete={() => {
					markMainDashboardTourSeen();
					void markMainDashboardTourSeenServer();
				}}
				onSkip={() => {
					// We still consider the tour "seen" when skipped/closed,
					// so users aren't forced back into it.
					markMainDashboardTourSeen();
					void markMainDashboardTourSeenServer();
				}}
			>
				<>
					{children}
					<MainDashboardTourAutoStart />
				</>
			</NextStep>
		</NextStepProvider>
	);
}


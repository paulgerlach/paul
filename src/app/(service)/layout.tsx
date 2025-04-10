import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import FragebogenHeader from "@/components/Header/FragebogenHeader";

const exo_2Sans = Exo_2({
	variable: "--font-exo_2-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Heidi Systems",
	description:
		"Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default function FragebogenLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${exo_2Sans.variable}`}>
				<QueryProvider>
					<FragebogenHeader />
					{children}
				</QueryProvider>
			</body>
		</html>
	);
}

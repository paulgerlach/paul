import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./(base)/globals.css";

const exo_2Sans = Exo_2({
	variable: "--font-exo_2-sans",
	subsets: ["latin"],
	display: "swap",
	preload: true,
	fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://heidisystems.com"),
	title:
		"Heidi Systems | Fernablesbare Funkzähler für Warmwasser, Kaltwasser & Heizung",
	description:
		"Digitale Erfassung aller Verbrauchsdaten im Gebäude. Kostenlose Installation fernablesbarer Funkzähler für Warmwasser, Kaltwasser und Heizung. Automatisierte Betriebskostenabrechnung in Deutschland.",
	keywords: [
		"Fernablesbare Zähler",
		"Funkzähler",
		"Warmwasserzähler",
		"Kaltwasserzähler",
		"Heizkostenabrechnung",
		"Betriebskostenabrechnung",
		"Energiemanagement",
		"Verbrauchserfassung",
		"Digitale Zähler",
		"Deutschland",
		"Kostenlose Installation",
	],
	alternates: {
		canonical: "/",
		languages: {
			"de-DE": "/",
		},
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "de_DE",
		url: "https://heidisystems.com",
		title: "Heidi Systems | Fernablesbare Funkzähler für Deutschland",
		description:
			"Kostenlose Installation fernablesbarer Funkzähler für Warmwasser, Kaltwasser und Heizung. Automatisierte Betriebskostenabrechnung in Deutschland.",
		siteName: "Heidi Systems",
	},
	verification: {
		google: "your-google-verification-code",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${exo_2Sans.variable}`} suppressHydrationWarning>
          {children}
      </body>
    </html>
  );
}

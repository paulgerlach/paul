"use client";

import Image from "next/image";
import { information } from "@/static/icons";
import { useMemo } from "react";

export default function TipsOfTheDay() {
	const tips = [
		"Schalten Sie Lichter aus, wenn Sie den Raum verlassen",
		"LED-Lampen verbrauchen bis zu 75% weniger Energie",
		"Ziehen Sie ungenutzte Geräte aus der Steckdose",
		"Senken Sie die Raumtemperatur im Winter um 2°C",
		"Nutzen Sie Tageslicht statt künstlicher Beleuchtung",
		"Duschen Sie kürzer und sparen Sie Warmwasser",
		"Lüften Sie kurz und intensiv statt Fenster dauerhaft gekippt zu lassen",
		"Nutzen Sie Energiesparfunktionen bei Haushaltsgeräten",
		"Waschen Sie Wäsche bei niedrigeren Temperaturen",
		"Entkalken Sie regelmäßig Wasserkocher und Kaffeemaschine",
		"Nutzen Sie Deckel beim Kochen, um Energie zu sparen",
		"Tauen Sie Kühl- und Gefrierschränke regelmäßig ab",
	];

	// Select a random tip that stays consistent during the session
	const dailyTip = useMemo(() => {
		const today = new Date().toDateString();
		const hash = today
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return tips[hash % tips.length];
	}, []);

	return (
		<div className="px-2 mb-4">
			<div className="w-full bg-[#EFEFEF] rounded-base p-4 flex flex-col gap-2 items-center justify-center text-center relative">
				{/* Information icon in circular background positioned at top center */}
				<div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#EFEFEF] rounded-full flex items-center justify-center">
					<Image
						src={information}
						alt="Information"
						width={32}
						height={32}
						className="w-8 h-8 brightness-[0.6] grayscale p-1"
					/>
				</div>

				<h3 className="font-bold text-sm mt-2">Tipp des Tages</h3>
				<p className="text-xs text-gray-600 mt-2 pb-4">{dailyTip}</p>
			</div>
		</div>
	);
}

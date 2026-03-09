"use client";

import Image from "next/image";
import { information } from "@/static/icons";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function TipsOfTheDay() {
	const [isVisible, setIsVisible] = useState(false);
	const [dailyTip, setDailyTip] = useState<string | null>(null);

	useEffect(() => {
		const storedDate = localStorage.getItem("tipOfTheDay_closed");
		const today = new Date().toDateString();

		if (storedDate === today) {
			setIsVisible(false);
			return;
		}

		const fetchDailyTip = async () => {
			const { data: tips, error } = await supabase
				.from("daily_tips")
				.select("content")
				.eq("is_active", true);

			if (!error && tips && tips.length > 0) {
				const hash = today
					.split("")
					.reduce((acc, char) => acc + char.charCodeAt(0), 0);

				const selectedTip = tips[hash % tips.length].content;
				setDailyTip(selectedTip);
				setIsVisible(true);
			}
		};

		fetchDailyTip();
	}, [supabase]);

	const handleClose = () => {
		const today = new Date().toDateString();
		localStorage.setItem("tipOfTheDay_closed", today);
		setIsVisible(false);
	};

	if (!isVisible || !dailyTip) return null;

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

				{/* Close button */}
				<button
					onClick={handleClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
					aria-label="Close tip"
				>
					<X size={16} />
				</button>

				<h3 className="font-bold text-sm mt-2">Tipp des Tages</h3>
				<p className="text-xs text-gray-600 mt-2 pb-4">{dailyTip}</p>
			</div>
		</div>
	);
}

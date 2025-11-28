"use client";

import { article1 } from "@/static/icons";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { FunctionsSlideType } from "@/types";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import animation4 from "@/animations/Animation_4.json";
import animation5 from "@/animations/Animation_5.json";
import animation6 from "@/animations/Animation_6.json";

export const functionsSwiper: FunctionsSlideType[] = [
	{
		item: (
			<Image
				width={0}
				height={0}
				sizes="100vw"
				loading="lazy"
				className="large:w-full max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:w-full max-medium:max-w-full overflow-hidden max-large:object-fill"
				src={article1}
				alt="article image"
			/>
		),
		title: "Intelligente Messlösungen",
		subtitle:
			"Statten Sie Ihre Immobilie mit modernster Funktechnologie aus und erfassen Sie Warmwasser-, Kaltwasser- und Heizungsverbrauch sowie Rauchmelderdaten automatisch.",
	},
	{
		item: (
			<LazyLottie
				animationData={animation5}
				id="animation5function"
				wrapperClassName="relative max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:w-full max-large:object-fill"
			/>
		),
		title: "Verbrauchsdaten in Echtzeit",
		subtitle:
			"Behalten Sie Ihren Energieverbrauch stets im Blick. Unsere intelligente Technologie erfasst Verbrauchsdaten in Echtzeit und liefert wertvolle Insights –für eine effiziente Steuerung jederzeit und von überall.",
	},
	{
		item: (
			<LazyLottie
				animationData={animation6}
				id="animation6function"
				wrapperClassName="relative max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:w-full max-large:object-fill"
			/>
		),
		title: "Flexible Bedarfsanpassung",
		subtitle:
			"Wählen Sie mit nur einem Klick die passenden Messgeräte für Ihre Immobilie. Wir übernehmen die Installation und sorgen für eine reibungslose Integration.",
	},
	{
		item: (
			<LazyLottie
				animationData={animation4}
				id="animation4function"
				wrapperClassName="relative max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:w-full max-large:object-fill"
			/>
		),
		title: "Kundenservice 24/7",
		subtitle:
			"Unser Support ist rund um die Uhr für Sie da. Ob technische Fragen oder individuelle Anliegen –wir finden schnelle, kompetente Lösungen, genau dann, wenn Sie sie brauchen.",
	},
];

export default function FunctionsSwiper() {
	return (
		<Swiper
			modules={[Pagination]}
			spaceBetween={20}
			slidesPerView={1}
			pagination={{ clickable: true }}
			className="swiper !pt-8 functions-swiper"
		>
			{functionsSwiper.map((slide, index) => (
				<SwiperSlide key={index} className="swiper-slide space-y-6">
					{slide.item}
					<p className="text-dark_text text-xl font-bold leading-[24px]">
						{slide.title}
					</p>
					<p className="text-dark_text leading-5 text-[17px]">
						{slide.subtitle}
					</p>
				</SwiperSlide>
			))}
		</Swiper>
	);
}

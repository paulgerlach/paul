"use client";

import { news1, news2, news3 } from "@/static/icons";
import Image, { type StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

export type NewsSwiperType = {
	image: StaticImageData;
	title: string;
	subtitle: string;
};

export const newsSlides = [
	{
		image: news1,
		title: "Alles aus einer Hand",
		subtitle:
			"Beratung, Planung, Installation, Service & Wartung - unkompliziert und reibungslos.",
	},
	{
		image: news2,
		title: "Regionale Meisterbetriebe",
		subtitle:
			"Wir verbinden traditionelles Handwerk mit der Technologie von morgen.",
	},
	{
		image: news3,
		title: "72 Standorte deutschlandweit",
		subtitle:
			"Die Heidi- Gruppe ist mit Standorten deutschlandweit vertreten und agiert auch in Österreich, Dänemark und der Schweiz",
	},
];

export default function NewsSwiper() {
	return (
		<div className="news-swiper relative">
			{/* Swipe indicator - mobile only */}
			<div className="hidden max-medium:block absolute top-8 left-1/2 -translate-x-1/2 z-10 animate-fade-out">
				<div className="flex items-center gap-2 text-dark_text/60 text-sm animate-swipe-hint">
					<span>👆</span>
					<span>Wischen</span>
					<span className="animate-swipe-arrow">→</span>
				</div>
			</div>
			<Swiper
				modules={[Pagination, Autoplay]}
				spaceBetween={20}
				slidesPerView={1}
				pagination={{ clickable: true }}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
				loop={true}
				className="news-swiper px-[72px] max-large:px-6 mb-20 max-medium:!pt-20"
			>
				{newsSlides.map((slide, index) => (
					<SwiperSlide
						key={index}
						className="rounded-base bg-card_dark_bg p-4 pb-10"
					>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							className="block w-full mb-2.5"
							src={slide.image}
							alt="news image"
						/>
						<p className="text-dark_text text-[30px] leading-9 mb-4">
							{slide.title}
						</p>
						<p className="text-dark_text text-[17px] leading-5">
							{slide.subtitle}
						</p>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

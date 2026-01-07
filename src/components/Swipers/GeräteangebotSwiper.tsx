"use client";

import { ROUTE_GERAETE } from "@/routes/routes";
import {
	slider_counter1,
	swiper_counter2,
	swiper_counter3,
	swiper_counter4,
} from "@/static/icons";
import type { GeräteangebotSwiperType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

const items: GeräteangebotSwiperType[] = [
	{
		image: slider_counter1,
		name: "Kaltwasserzähler-Funkgerät",
	},
	{
		image: swiper_counter2,
		name: "Heizungszähler-Funkgerät",
	},
	{
		image: swiper_counter3,
		name: "Warmwasserzähler-Funkgerät",
	},
	{
		image: swiper_counter4,
		name: "Funk-Rauchmelder",
	},
	{
		image: slider_counter1,
		name: "Kaltwasserzähler-Funkgerät",
	},
	{
		image: swiper_counter2,
		name: "Heizungszähler-Funkgerät",
	},
	{
		image: swiper_counter3,
		name: "Warmwasserzähler-Funkgerät",
	},
	{
		image: swiper_counter4,
		name: "Funk-Rauchmelder",
	},
];

export default function GeräteangebotSwiper() {
	const handleAutoplayControl = (swiper: SwiperType) => {
		// Enable autoplay only when slidesPerView is 1 (mobile)
		if (swiper.params.slidesPerView === 1) {
			swiper.autoplay.start();
		} else {
			swiper.autoplay.stop();
		}
	};

	return (
		<div className="p-[72px] max-large:p-6">
			<h3 className="mb-14 text-[45px] text-center leading-[54px] max-medium:text-2xl text-dark_text">
				Geräteangebot
			</h3>
			<Swiper
				slidesPerView={1}
				loop={true}
				navigation
				centeredSlides={true}
				spaceBetween={75}
				mousewheel={true}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
				onInit={handleAutoplayControl}
				onBreakpoint={handleAutoplayControl}
				breakpoints={{
					768: {
						slidesPerView: 2,
						spaceBetween: 75,
					},
					1024: {
						slidesPerView: 3,
						spaceBetween: 120,
						mousewheel: false,
					},
					1920: {
						slidesPerView: 5,
						spaceBetween: 120,
						mousewheel: false,
					},
				}}
				modules={[Navigation, Autoplay]}
				className="swiper counters-swiper !px-20 max-medium:!px-8 max-medium:!mx-0 !mx-10 !pb-10 !pt-[150px] max-medium:!pt-[75px] relative"
			>
				{items.map((item, index) => (
					<SwiperSlide key={index}>
						<Link
							href={ROUTE_GERAETE}
							className="swiper-slide max-w-[300px] max-small:max-w-full max-h-[190px] relative"
						>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								className="w-full h-[190px] object-contain"
								src={item.image}
								alt="swiper image"
							/>
							<span className="absolute block -bottom-10 w-full text-center">
								{item.name}
							</span>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

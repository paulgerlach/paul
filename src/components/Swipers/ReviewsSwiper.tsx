"use client";

import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import Image from "next/image";
import Link from "next/link";
import type { ReviewSwiperType } from "@/types";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { trustpilot } from "@/static/icons";
import { useRef } from "react";

const items: ReviewSwiperType[] = [
	{
		text: "Mit Heidi haben wir den gesamten Ableseprozess digitalisiert. Kein manuelles Erfassen, keine Terminabstimmungen und die Verbrauchsdaten fließen automatisch in unsere Abrechnungssysteme. Das spart enorm Zeit.",
		name: "Heiner L.",
		position: "Weber Hausverwaltung",
		video: "videos/video1.mp4",
	},
	{
		text: "Durch die automatische Erfassung und Analyse der Verbrauchsdaten konnten wir ineffiziente Verbräuche frühzeitig erkennen. Das senkt langfristig die Betriebskosten und sorgt für eine faire Abrechnung.",
		name: "Julie K.",
		position: "SV1 Real Estate",
		video: "videos/video2.mp4",
	},
	{
		text: "Die Umstellung auf Heidi verlief reibungslos. Das Team hat die Funkzähler schnell installiert, und der Service ist hervorragend. Wir haben weniger Verwaltungsaufwand und profitieren von modernster Technologie.",
		name: "Thomas S.",
		position: "Hausverwaltung Schmidt & Kollegen",
		video: "videos/video3.mp4",
	},
	{
		text: "Dank Heidi erfassen wir Verbrauchsdaten automatisch und erstellen Betriebskostenabrechnungen schneller und präziser. Weniger Aufwand, weniger Fehler und mehr Effizienz.",
		name: "Franz P.",
		position: "Hausverwaltung Becker & Co.",
		video: "videos/video4.mp4",
	},
];

export default function ReviewsSwiper() {
	const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
	const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

	const handleVideoClick = (index: number) => {
		videoRefs.current.forEach((video, i) => {
			if (video) {
				if (i === index) {
					if (video.paused) {
						video.play();
					} else {
						video.pause();
					}
				} else {
					video.pause();
				}
			}
		});
	};

	const handleMobileVideoClick = (index: number) => {
		mobileVideoRefs.current.forEach((video, i) => {
			if (video) {
				if (i === index) {
					if (video.paused) {
						video.play();
					} else {
						video.pause();
					}
				} else {
					video.pause();
				}
			}
		});
	};

	return (
		<>
			{/* Desktop Version */}
			<div className="max-small:hidden py-16 max-medium:py-8 pl-36 max-large:pl-30 max-medium:pl-16 max-medium:flex-col max-medium:gap-8 flex items-center justify-start gap-[72px]">
				<div className="max-w-[436px] pt-12 space-y-6">
					<h4 className="text-[45px] leading-[54px] max-medium:text-2xl text-dark_text">
						Das sagen unsere Kund:innen über Heidi
					</h4>
					<p className="text-xl text-dark_text">
						Zu gut, um wahr zu sein? Lassen wir die sprechen, die es am besten
						wissen - unsere Kund:innen. Ihre Erfahrungen zeigen, warum Heidi
						überzeugt.
					</p>
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={trustpilot}
						alt="trustpilot"
					/>
					<Link
						className="text-lg block w-fit text-dark_text py-2.5 px-5 border border-dark_green/20 duration-300 transition hover:bg-green hover:border-green hover:text-white rounded-full"
						href={ROUTE_FRAGEBOGEN}
					>
						Anfrage starten
					</Link>
				</div>
				<Swiper
					navigation
					loop={false}
					slidesPerView={1.3}
					modules={[Navigation]}
					spaceBetween={65}
					className="swiper max-w-full !pt-12 reviews-swiper relative"
				>
					{items.map((item, index) => (
						<SwiperSlide
							key={index}
							className="swiper-slide !max-w-[680px] !flex items-stretch justify-between max-medium:flex-col gap-3 rounded-[30px] bg-dark_green px-10 pt-8 pb-6"
						>
							<div className="flex flex-col items-start justify-between">
								<p className="text-xl text-white leading-[1]">&bdquo;{item.text}&ldquo;</p>
								<div className="space-y-1.5">
									<p className="text-xl text-white">{item.name}</p>
									<p className="text-xl text-white">{item.position}</p>
								</div>
							</div>
							<video
								ref={(el) => {
									videoRefs.current[index] = el;
								}}
								onClick={() => handleVideoClick(index)}
								className="-mt-20 max-medium:mt-0 max-medium:w-full max-medium:h-auto duration-300 relative object-cover aspect-video cursor-pointer w-[200px] h-[336px] rounded-[40px]"
								loop
							>
								<source src={item.video} type="video/mp4" />
							</video>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Mobile Version - Figma Design */}
			<div className="hidden max-small:block pt-12 pb-8 px-5">
				{/* Title and Trustpilot for mobile */}
				<div className="mb-10 space-y-5">
					<h4 className="text-[30px] leading-[36px] text-dark_text">
						Das schätzen unsere Kund:innen an Heidi
					</h4>
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={trustpilot}
						alt="trustpilot"
					/>
				</div>
				<Swiper
					navigation={{
						nextEl: ".mobile-review-next",
						prevEl: ".mobile-review-prev",
					}}
					loop={true}
					slidesPerView={1}
					modules={[Navigation]}
					spaceBetween={20}
					className="swiper mobile-reviews-swiper relative"
				>
					{items.map((item, index) => (
						<SwiperSlide key={index} className="swiper-slide">
							{/* Video/Image on top */}
							<div className="relative">
								<video
									ref={(el) => {
										mobileVideoRefs.current[index] = el;
									}}
									onClick={() => handleMobileVideoClick(index)}
									className="w-full h-[400px] object-cover rounded-[20px] cursor-pointer"
									loop
									playsInline
								>
									<source src={item.video} type="video/mp4" />
								</video>
								{/* Navigation arrow on video */}
								<button className="mobile-review-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M9 18L15 12L9 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</button>
							</div>
							
							{/* Quote card below */}
							<div className="bg-dark_green rounded-[20px] px-6 py-8 -mt-16 relative z-0 pt-20">
								<p className="text-[22px] leading-[28px] text-white italic mb-8">
									&ldquo;{item.text}&rdquo;
								</p>
								<div className="space-y-1">
									<p className="text-lg text-white">{item.name}</p>
									<p className="text-lg text-white/80">{item.position}</p>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</>
	);
}

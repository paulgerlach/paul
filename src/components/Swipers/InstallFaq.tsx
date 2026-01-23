"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Mousewheel } from "swiper/modules";
import { install_faq2, install_faq3, install_faq5 } from "@/static/icons";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import Image from "next/image";
import { slideDown, slideUp } from "@/utils";

export default function InstallFaq() {
	const slides = [
		{
			id: "bedarfsanalyse",
			name: "Bedarfsanalyse",
			text: "Wir prüfen Ihren aktuellen Bestand und ermitteln, welche Geräte optimal zu Ihren Anforderungen passen, um Zeit und Kosten zu sparen.",
			animationName: "Animation_1",
		},
		{
			name: "Installation",
			text: "Unsere Experten installieren alle Zähler kostenlos und stellen sicher, dass alles einwandfrei funktioniert – ohne versteckte Kosten.",
			img: install_faq2,
		},
		{
			name: "Ablesen",
			text: "Alle Heidi-Geräte nutzen modernste Funktechnologie und ermöglichen eine sichere Echtzeit-Übertragung der Verbrauchsdaten.",
			img: install_faq3,
		},
		{
			id: "score_chart",
			name: "Verbrauchsanalyse",
			text: "Übersichtliche und detaillierte Analysen ermöglichen eine präzise Verbrauchsauswertung, auch über mehrere Immobilien hinweg.",
			animationName: "Animation_10",
		},
		{
			name: "Wartung",
			text: "Wir kümmern uns um die laufende Wartung Ihrer Heidi-Geräte und sorgen für einen störungsfreien Betrieb.",
			img: install_faq5,
		},
	];

	const swiperRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
	const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

	// Desktop bullet animation
	useEffect(() => {
		const updateNextClass = () => {
			const bullets = document.querySelectorAll(".install-faq-bullet");
			bullets.forEach((bullet, index) => {
				bullet.classList.toggle(
					"next",
					index === (activeIndex + 1) % slides.length,
				);
				const bulletText = bullet.querySelector("p");
				if (index === activeIndex) {
					slideDown(bulletText);
				} else {
					slideUp(bulletText);
				}
			});
		};

		updateNextClass();
	}, [activeIndex, slides.length]);

	// Mobile autoplay - cycles every 5 seconds
	useEffect(() => {
		if (isAutoplayPaused) return;

		const interval = setInterval(() => {
			setMobileActiveIndex((prev) => (prev + 1) % slides.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoplayPaused, slides.length]);

	// Resume autoplay after 8 seconds of inactivity
	useEffect(() => {
		if (!isAutoplayPaused) return;

		const timeout = setTimeout(() => {
			setIsAutoplayPaused(false);
		}, 8000);

		return () => clearTimeout(timeout);
	}, [isAutoplayPaused]);

	const handleMobileStepClick = (index: number) => {
		setMobileActiveIndex(index);
		setIsAutoplayPaused(true); // Pause autoplay when user interacts
	};

	return (
		<div
			id="installFaq"
			className="my-16 max-small:my-8 py-16 pl-[100px] pr-[156px] max-large:px-20 max-medium:px-10 max-small:px-5 max-large:gap-8 bg-[#AEBBA5]"
		>
			{/* Desktop Version */}
			<div className="relative space-y-7 max-small:hidden">
				<h4 className="text-[44px] max-w-[480px] leading-[54px] max-medium:text-2xl text-dark_text">
					Kostenfreie Installation der neuen Funkgeräte
				</h4>
				<Swiper
					ref={swiperRef}
					modules={[Pagination, Autoplay, Mousewheel]}
					slidesPerView={1}
					spaceBetween={50}
					centeredSlides
					autoplay={{ delay: 5000, disableOnInteraction: false }}
					mousewheel
					wrapperClass="swiper-wrapper max-w-[670px] mr-0 ml-auto"
					pagination={{
						clickable: true,
						renderBullet: (index, className) => `
                <div class="${className} install-faq-bullet space-y-2">
                  <div class="bg-[#D0D7CA] bullet-inner duration-300 p-1.5 pr-7 rounded-full text-dark_text text-[30px] leading-[1] w-fit flex items-center justify-start gap-2 relative">
                    <span class="rounded-full size-11 flex items-center justify-center !bg-white !text-dark_text">${index + 1}</span>
                    ${slides[index].name}
                    <svg
                          class="facet-pill-border hidden [.next_&]:block"
                          height="58"
                          width="100%"
                          role="presentation"
                          aria-hidden="true"
                        >
                          <rect
                            height="58"
                            width="100%"
                            ry="30"
                            class="animated-rect"
                            ></rect>
                        </svg>
                  </div>
                  <p class="install-faq-text text-left text-[15px] leading-[18px] text-dark_text">${slides[index].text}</p>
                </div>`,
					}}
					breakpoints={{
						992: {
							slidesPerView: 1,
							direction: "vertical",
							spaceBetween: 0,
							mousewheel: false,
						},
					}}
					className="swiper install-faq-swiper h-[440px] max-large:h-fit !flex flex-row-reverse max-large:gap-10 justify-between items-start max-large:flex-col-reverse relative"
					onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
				>
					{slides.map((slide, index) => (
						<SwiperSlide
							key={index}
							className="relative ml-auto mr-0 max-w-xl w-full"
						>
							{slide.animationName ? (
								<LazyLottie
									wrapperClassName="w-full h-[440px]"
									id={slide.id}
									animationName={slide.animationName}
								/>
							) : slide.img ? (
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									src={slide.img}
									alt={slide.name}
									className="w-full"
								/>
							) : null}
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Mobile Version - Matching Figma Design */}
			<div className="hidden max-small:block px-5">
				<h4 className="text-[30px] leading-[36px] text-dark_text mb-8">
					Kostenfrei Installation der neuen Funkgeräte
				</h4>
				
				{/* Numbered Steps */}
				<div className="space-y-3">
					{slides.map((slide, index) => (
						<div key={index}>
							<button
								onClick={() => handleMobileStepClick(index)}
								className={`flex items-center gap-2 px-1.5 pr-5 py-1.5 rounded-full transition-all duration-300 ${
									mobileActiveIndex === index
										? "bg-dark_text text-white"
										: "bg-[#D0D7CA] text-dark_text"
								}`}
							>
								<span
									className={`rounded-full size-10 flex items-center justify-center text-lg font-medium ${
										mobileActiveIndex === index
											? "bg-white text-dark_text"
											: "bg-white text-dark_text"
									}`}
								>
									{index + 1}
								</span>
								<span className="text-[28px]">
									{slide.name}
								</span>
							</button>
							{/* Description text below active item */}
							{mobileActiveIndex === index && (
								<p className="text-[15px] leading-[18px] text-dark_text mt-2 ml-1">
									{slide.text}
								</p>
							)}
						</div>
					))}
				</div>

				{/* Card below */}
				<div className="mt-10">
				{slides[mobileActiveIndex].animationName ? (
					<LazyLottie
						wrapperClassName="w-full h-[300px]"
						id={slides[mobileActiveIndex].id}
						animationName={slides[mobileActiveIndex].animationName}
					/>
				) : slides[mobileActiveIndex].img ? (
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={slides[mobileActiveIndex].img}
						alt={slides[mobileActiveIndex].name}
						className="w-full rounded-xl"
					/>
				) : null}
				</div>
			</div>
		</div>
	);
}

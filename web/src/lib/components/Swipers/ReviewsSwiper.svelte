<script lang="ts">
	import { Navigation } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { trustpilot } from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";
	import type { ReviewSwiperType } from "$lib/types";

	const items: ReviewSwiperType[] = [
		{
			text: "Mit Heidi haben wir den gesamten Ableseprozess digitalisiert. Kein manuelles Erfassen, keine Terminabstimmungen und die Verbrauchsdaten fließen automatisch in unsere Abrechnungssysteme. Das spart enorm Zeit.",
			name: "Heiner L.",
			position: "Weber Hausverwaltung",
			video: "/videos/video1.mp4",
		},
		{
			text: "Durch die automatische Erfassung und Analyse der Verbrauchsdaten konnten wir ineffiziente Verbräuche frühzeitig erkennen. Das senkt langfristig die Betriebskosten und sorgt für eine faire Abrechnung.",
			name: "Julie K.",
			position: "SV1 Real Estate",
			video: "/videos/video2.mp4",
		},
		{
			text: "Die Umstellung auf Heidi verlief reibungslos. Das Team hat die Funkzähler schnell installiert, und der Service ist hervorragend. Wir haben weniger Verwaltungsaufwand und profitieren von modernster Technologie.",
			name: "Thomas S.",
			position: "Hausverwaltung Schmidt & Kollegen",
			video: "/videos/video3.mp4",
		},
		{
			text: "Dank Heidi erfassen wir Verbrauchsdaten automatisch und erstellen Betriebskostenabrechnungen schneller und präziser. Weniger Aufwand, weniger Fehler und mehr Effizienz.",
			name: "Franz P.",
			position: "Hausverwaltung Becker & Co.",
			video: "/videos/video4.mp4",
		},
	];

	const videos: HTMLVideoElement[] = $state([]);
	const mobileVideos: HTMLVideoElement[] = $state([]);

	// Play/pause the clicked video and pause all others.
	const toggleVideo = (list: HTMLVideoElement[], index: number) => {
		list.forEach((video, i) => {
			if (i === index && video.paused) video.play();
			else video.pause();
		});
	};
</script>

<!-- Desktop Version -->
<div
	class="flex items-center justify-start gap-[72px] py-16 pl-36 max-large:pl-30 max-medium:flex-col max-medium:gap-8 max-medium:py-8 max-medium:pl-16 max-small:hidden"
>
	<div class="max-w-[436px] space-y-6 pt-12">
		<h4 class="text-[45px] leading-[54px] text-dark_text max-medium:text-2xl">
			Das sagen unsere Kund:innen über Heidi
		</h4>
		<p class="text-xl text-dark_text">
			Zu gut, um wahr zu sein? Lassen wir die sprechen, die es am besten wissen
			- unsere Kund:innen. Ihre Erfahrungen zeigen, warum Heidi überzeugt.
		</p>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={trustpilot}
			alt="trustpilot"
		/>
		<a
			class="block w-fit rounded-full border border-dark_green/20 px-5 py-2.5 text-lg text-dark_text transition duration-300 hover:border-green hover:bg-green hover:text-white"
			href={ROUTE_FRAGEBOGEN}
		>
			Anfrage starten
		</a>
	</div>
	<div
		class="swiper reviews-swiper relative max-w-full !pt-12"
		{@attach swiper({
			navigation: true,
			loop: false,
			slidesPerView: 1.3,
			modules: [Navigation],
			spaceBetween: 65,
		})}
	>
		<div class="swiper-wrapper">
			{#each items as item, index (item.name)}
				<div
					class="swiper-slide !flex !max-w-[680px] items-stretch justify-between gap-3 rounded-[30px] bg-dark_green px-10 pt-8 pb-6 max-medium:flex-col"
				>
					<div class="flex flex-col items-start justify-between">
						<p class="text-xl leading-[1] text-white">
							&bdquo;{item.text}&ldquo;
						</p>
						<div class="space-y-1.5">
							<p class="text-xl text-white">{item.name}</p>
							<p class="text-xl text-white">{item.position}</p>
						</div>
					</div>
					<video
						bind:this={videos[index]}
						onclick={() => toggleVideo(videos, index)}
						class="relative -mt-20 aspect-video h-[336px] w-[200px] cursor-pointer rounded-[40px] object-cover duration-300 max-medium:mt-0 max-medium:h-auto max-medium:w-full"
						loop
					>
						<source src={item.video} type="video/mp4" />
					</video>
				</div>
			{/each}
		</div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</div>

<!-- Mobile Version -->
<div class="hidden px-5 pt-12 pb-8 max-small:block">
	<!-- Title and Trustpilot for mobile -->
	<div class="mb-10 space-y-5">
		<h4 class="text-[30px] leading-[36px] text-dark_text">
			Das schätzen unsere Kund:innen an Heidi
		</h4>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={trustpilot}
			alt="trustpilot"
		/>
	</div>
	<div
		class="swiper mobile-reviews-swiper relative"
		{@attach swiper({
			navigation: {
				nextEl: ".mobile-review-next",
				prevEl: ".mobile-review-prev",
			},
			loop: true,
			slidesPerView: 1,
			modules: [Navigation],
			spaceBetween: 20,
		})}
	>
		<div class="swiper-wrapper">
			{#each items as item, index (item.name)}
				<div class="swiper-slide">
					<!-- Video/Image on top -->
					<div class="relative">
						<video
							bind:this={mobileVideos[index]}
							onclick={() => toggleVideo(mobileVideos, index)}
							class="h-[400px] w-full cursor-pointer rounded-[20px] object-cover"
							loop
							playsinline
						>
							<source src={item.video} type="video/mp4" />
						</video>
						<!-- Navigation arrow on video -->
						<button
							aria-label="Weiter"
							class="mobile-review-next absolute top-1/2 right-4 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9 18L15 12L9 6"
									stroke="#666"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>

					<!-- Quote card below -->
					<div
						class="relative z-0 -mt-16 rounded-[20px] bg-dark_green px-6 py-8 pt-20"
					>
						<p class="mb-8 text-[22px] leading-[28px] text-white italic">
							&ldquo;{item.text}&rdquo;
						</p>
						<div class="space-y-1">
							<p class="text-lg text-white">{item.name}</p>
							<p class="text-lg text-white/80">{item.position}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

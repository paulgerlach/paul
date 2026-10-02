<script lang="ts">
	import type SwiperCore from "swiper";
	import { Autoplay, Mousewheel, Pagination } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { install_faq2, install_faq3, install_faq5 } from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";
	import { slideDown, slideUp } from "$lib/utils/slide";

	type Slide = {
		id?: string;
		name: string;
		text: string;
		animationName?: string;
		img?: ImageAsset;
	};

	const slides: Slide[] = [
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

	let root: HTMLElement;
	let desktopSwiper = $state<SwiperCore>();
	let activeIndex = $state(0);
	let mobileActiveIndex = $state(0);
	let isAutoplayPaused = $state(false);
	const mobileSlide = $derived(slides[mobileActiveIndex]);

	// Desktop bullet animation. The bullets are HTML from renderBullet, so they
	// are updated through the DOM.
	$effect(() => {
		if (!desktopSwiper) return;
		root.querySelectorAll(".install-faq-bullet").forEach((bullet, index) => {
			bullet.classList.toggle(
				"next",
				index === (activeIndex + 1) % slides.length,
			);
			const bulletText = bullet.querySelector("p");
			if (index === activeIndex) slideDown(bulletText);
			else slideUp(bulletText);
		});
	});

	// Mobile autoplay - cycles every 5 seconds
	$effect(() => {
		if (isAutoplayPaused) return;
		const interval = setInterval(() => {
			mobileActiveIndex = (mobileActiveIndex + 1) % slides.length;
		}, 5000);
		return () => clearInterval(interval);
	});

	// Resume autoplay after 8 seconds of inactivity
	$effect(() => {
		if (!isAutoplayPaused) return;
		const timeout = setTimeout(() => (isAutoplayPaused = false), 8000);
		return () => clearTimeout(timeout);
	});

	const handleMobileStepClick = (index: number) => {
		mobileActiveIndex = index;
		isAutoplayPaused = true; // Pause autoplay when user interacts
	};

	const renderBullet = (index: number, className: string) => `
		<div class="${className} install-faq-bullet space-y-2">
			<div class="bg-[#D0D7CA] bullet-inner duration-300 p-1.5 pr-7 rounded-full text-dark_text text-[30px] leading-[1] w-fit flex items-center justify-start gap-2 relative">
				<span class="rounded-full size-11 flex items-center justify-center !bg-white !text-dark_text">${index + 1}</span>
				${slides[index].name}
				<svg class="facet-pill-border hidden [.next_&]:block" height="58" width="100%" role="presentation" aria-hidden="true">
					<rect height="58" width="100%" ry="30" class="animated-rect"></rect>
				</svg>
			</div>
			<p class="install-faq-text text-left text-[15px] leading-[18px] text-dark_text">${slides[index].text}</p>
		</div>`;
</script>

<div
	id="installFaq"
	bind:this={root}
	class="my-16 bg-[#AEBBA5] py-16 pr-[156px] pl-[100px] max-large:gap-8 max-large:px-20 max-medium:px-10 max-small:my-8 max-small:px-5"
>
	<!-- Desktop Version -->
	<div class="relative space-y-7 max-small:hidden">
		<h4
			class="max-w-[480px] text-[44px] leading-[54px] text-dark_text max-medium:text-2xl"
		>
			Kostenfreie Installation der neuen Funkgeräte
		</h4>
		<div
			class="swiper install-faq-swiper relative !flex h-[440px] flex-row-reverse items-start justify-between max-large:h-fit max-large:flex-col-reverse max-large:gap-10"
			{@attach swiper(
				{
					modules: [Pagination, Autoplay, Mousewheel],
					slidesPerView: 1,
					spaceBetween: 50,
					centeredSlides: true,
					autoplay: { delay: 5000, disableOnInteraction: false },
					mousewheel: true,
					pagination: { clickable: true, renderBullet },
					breakpoints: {
						992: {
							slidesPerView: 1,
							direction: "vertical",
							spaceBetween: 0,
							mousewheel: false,
						},
					},
					on: { slideChange: (s) => (activeIndex = s.activeIndex) },
				},
				(s) => (desktopSwiper = s),
			)}
		>
			<div class="swiper-wrapper mr-0 ml-auto max-w-[670px]">
				{#each slides as slide (slide.name)}
					<div class="swiper-slide relative mr-0 ml-auto w-full max-w-xl">
						{#if slide.animationName}
							<LazyLottie
								wrapperClassName="w-full h-[440px]"
								id={slide.id}
								animationName={slide.animationName}
							/>
						{:else if slide.img}
							<Image
								width={0}
								height={0}
								sizes="100vw"
								src={slide.img}
								alt={slide.name}
								class="w-full"
							/>
						{/if}
					</div>
				{/each}
			</div>
			<div class="swiper-pagination"></div>
		</div>
	</div>

	<!-- Mobile Version -->
	<div class="hidden px-5 max-small:block">
		<h4 class="mb-8 text-[30px] leading-[36px] text-dark_text">
			Kostenfrei Installation der neuen Funkgeräte
		</h4>

		<!-- Numbered Steps -->
		<div class="space-y-3">
			{#each slides as slide, index (slide.name)}
				<div>
					<button
						onclick={() => handleMobileStepClick(index)}
						class={[
							"flex items-center gap-2 rounded-full px-1.5 py-1.5 pr-5 transition-all duration-300",
							mobileActiveIndex === index
								? "bg-dark_text text-white"
								: "bg-[#D0D7CA] text-dark_text",
						]}
					>
						<span
							class="flex size-10 items-center justify-center rounded-full bg-white text-lg font-medium text-dark_text"
						>
							{index + 1}
						</span>
						<span class="text-[28px]">{slide.name}</span>
					</button>
					<!-- Description text below active item -->
					{#if mobileActiveIndex === index}
						<p class="mt-2 ml-1 text-[15px] leading-[18px] text-dark_text">
							{slide.text}
						</p>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Card below -->
		<div class="mt-10">
			{#if mobileSlide.animationName}
				<LazyLottie
					wrapperClassName="w-full h-[300px]"
					id={mobileSlide.id}
					animationName={mobileSlide.animationName}
				/>
			{:else if mobileSlide.img}
				<Image
					width={0}
					height={0}
					sizes="100vw"
					src={mobileSlide.img}
					alt={mobileSlide.name}
					class="w-full rounded-xl"
				/>
			{/if}
		</div>
	</div>
</div>

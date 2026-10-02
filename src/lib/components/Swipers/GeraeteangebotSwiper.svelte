<script lang="ts">
	import type SwiperCore from "swiper";
	import { Autoplay, Navigation } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		slider_counter1,
		swiper_counter2,
		swiper_counter3,
		swiper_counter4,
	} from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";
	import { ROUTE_GERAETE } from "$lib/routes";
	import type { GeraeteangebotSwiperType } from "$lib/types";

	const devices: GeraeteangebotSwiperType[] = [
		{ image: slider_counter1, name: "Kaltwasserzähler-Funkgerät" },
		{ image: swiper_counter2, name: "Heizungszähler-Funkgerät" },
		{ image: swiper_counter3, name: "Warmwasserzähler-Funkgerät" },
		{ image: swiper_counter4, name: "Funk-Rauchmelder" },
	];
	// Listed twice so loop mode has enough slides.
	const items = [...devices, ...devices];

	// Enable autoplay only when slidesPerView is 1 (mobile)
	const handleAutoplayControl = (s: SwiperCore) => {
		if (s.params.slidesPerView === 1) s.autoplay.start();
		else s.autoplay.stop();
	};
</script>

<div class="p-[72px] max-large:p-6">
	<h3
		class="mb-14 text-center text-[45px] leading-[54px] text-dark_text max-medium:text-2xl"
	>
		Geräteangebot
	</h3>
	<div
		class="swiper counters-swiper relative !mx-10 !px-20 !pt-[150px] !pb-10 max-medium:!mx-0 max-medium:!px-8 max-medium:!pt-[75px]"
		{@attach swiper({
			slidesPerView: 1,
			loop: true,
			navigation: true,
			centeredSlides: true,
			spaceBetween: 75,
			// No Mousewheel module is loaded, so this has no effect (same as before).
			mousewheel: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			},
			on: { init: handleAutoplayControl, breakpoint: handleAutoplayControl },
			breakpoints: {
				768: { slidesPerView: 2, spaceBetween: 75 },
				1024: { slidesPerView: 3, spaceBetween: 120, mousewheel: false },
				1920: { slidesPerView: 5, spaceBetween: 120, mousewheel: false },
			},
			modules: [Navigation, Autoplay],
		})}
	>
		<div class="swiper-wrapper">
			{#each items as item, index (index)}
				<div class="swiper-slide">
					<a
						href={ROUTE_GERAETE}
						class="swiper-slide relative max-h-[190px] max-w-[300px] max-small:max-w-full"
					>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							class="h-[190px] w-full object-contain"
							src={item.image}
							alt="swiper image"
						/>
						<span class="absolute -bottom-10 block w-full text-center">
							{item.name}
						</span>
					</a>
				</div>
			{/each}
		</div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</div>

<script lang="ts">
	import { Pagination } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		chart_slide_2,
		chart_slide_3,
		right_arrow,
		swiper_chart,
	} from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";
	import { ROUTE_DATENSCHUTZHINWEISE } from "$lib/routes";
	import type { ChartSwiperType } from "$lib/types";

	const slides: ChartSwiperType[] = [
		{
			image: dashboardImage,
			name: "Dashboard",
			title: "Ihr Verbrauch auf einen Blick",
			text: "Das Dashboard visualisiert Heizungs-, Warm- und Kaltwasserverbrauch und bietet eine klare, übersichtliche Darstellung.",
		},
		{
			image: analyseImage,
			name: "Analyse",
			title: "Datenbasierte Analyse",
			text: "Erhalten Sie präzise Einblicke in Ihren Energie- und Wasserverbrauch, erkennen Sie Trends frühzeitig und optimieren Sie Ihre Kosten nachhaltig.",
		},
		{
			image: betriebskostenImage,
			name: "Betriebskosten",
			title: "Effiziente Betriebskostenabrechnung",
			text: "Unsere intelligenten Funkzähler erfassen Heizungs-, Warm- und Kaltwasserverbräuche präzise und stellen die Daten direkt für eine rechtskonforme Abrechnung bereit.",
		},
	];
</script>

{#snippet dashboardImage()}
	<Image
		width={0}
		height={0}
		sizes="100vw"
		src={swiper_chart}
		alt="swiper_chart"
	/>
{/snippet}

{#snippet analyseImage()}
	<div
		class="py-24 pl-[105px] max-large:py-16 max-large:pl-16 max-medium:pl-10 max-small:pl-5"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={chart_slide_2}
			alt="swiper_chart"
		/>
	</div>
{/snippet}

{#snippet betriebskostenImage()}
	<div class="pt-24 max-large:pt-16">
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={chart_slide_3}
			alt="swiper_chart"
		/>
	</div>
{/snippet}

<div
	class="!my-16 !px-20 max-large:!px-16 max-medium:!px-10 max-small:!my-8 max-small:!px-5"
>
	<div
		class="swiper chart-swiper relative"
		{@attach swiper({
			slidesPerView: 1,
			spaceBetween: 0,
			// No Mousewheel module is loaded, so this has no effect (same as before).
			mousewheel: true,
			modules: [Pagination],
			breakpoints: { 1024: { mousewheel: false } },
			pagination: {
				el: ".chart-swiper-pagination",
				clickable: true,
				renderBullet: (index, className) =>
					`<span class="${className} custom-bullet">${slides[index].name}</span>`,
			},
		})}
	>
		<div class="swiper-wrapper">
			{#each slides as slide (slide.name)}
				<div
					data-slide-name={slide.name}
					class="swiper-slide !flex items-center justify-between rounded-base bg-[#EFEDEC] pt-10 pl-[100px] max-large:pl-16 max-medium:flex-col max-medium:pt-5 max-medium:pl-10 max-small:pl-5"
				>
					<div class="max-w-xl">
						<h5
							class="mb-10 text-[45px] leading-[54px] text-dark_text medium:text-2xl"
						>
							{slide.title}
						</h5>
						<p class="mb-6 text-lg text-dark_text">{slide.text}</p>
						<a
							class="group flex cursor-pointer items-center justify-start gap-1.5 text-link"
							href={ROUTE_DATENSCHUTZHINWEISE}
						>
							Mehr erfahren
							<Image
								width={0}
								height={0}
								sizes="100vw"
								class="colored-to-black -rotate-90 transition group-hover:translate-x-1"
								src={right_arrow}
								alt="right_arrow"
							/>
						</a>
					</div>

					{@render slide.image()}
				</div>
			{/each}
		</div>

		<div class="swiper-controllers max-medium:hidden">
			<div class="chart-swiper-pagination swiper-pagination"></div>
		</div>
	</div>
</div>

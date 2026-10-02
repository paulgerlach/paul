<script lang="ts">
	import type SwiperCore from "swiper";
	import { Autoplay, Controller, Navigation, Pagination } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		numbered_counter1,
		numbered_counter2,
		numbered_counter3,
		numbered_counter4,
		right_arrow,
	} from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";
	import { ROUTE_BLOG } from "$lib/routes";
	import type {
		NumberedSwiperDataItemSlideType,
		NumberedSwiperDataItemType,
	} from "$lib/types";

	const items: NumberedSwiperDataItemType[] = [
		{
			mainImage: numbered_counter1,
			slides: [
				{
					text: "Kaltwasser-Funkgerät",
					title: "Hochpräzise Messung",
					longText:
						"Dank moderner Ultraschalltechnologie misst der Kaltwasserzähler den Verbrauch mit höchster Genauigkeit - ab dem ersten Tropfen.",
				},
				{
					text: "Kaltwasser-Funkgerät",
					title: "Akustische Leckageerkennung",
					longText:
						"Integrierte Sensoren identifizieren selbst kleinste Leckagen frühzeitig und helfen, Wasserverschwendung sowie Schäden zu vermeiden.",
				},
				{
					text: "Kaltwasser-Funkgerät",
					title: "Automatische Funkübertragung",
					longText:
						"Verbrauchsdaten werden kabellos in Echtzeit übermittelt, wodurch eine manuelle Ablesung entfällt und volle Transparenz gewährleistet wird.",
				},
				{
					text: "Kaltwasser-Funkgerät",
					title: "Langlebig & wartungsarm",
					longText:
						"Der Zähler ist für eine lange Lebensdauer konzipiert und widersteht dank robuster Bauweise und Schutzklasse IP68 selbst anspruchsvollen Umgebungsbedingungen.",
				},
			],
		},
		{
			mainImage: numbered_counter2,
			slides: [
				{
					text: "Warmwasser-Funkgerät",
					title: "Präzise Messung",
					longText:
						"Die moderne Ultraschalltechnologie gewährleistet eine exakte Erfassung des Warmwasserverbrauchs - selbst bei minimalem Durchfluss.",
				},
				{
					text: "Warmwasser-Funkgerät",
					title: "Drahtlose Datenübertragung",
					longText:
						"Der integrierte Funkmodus sendet Verbrauchsdaten automatisch, wodurch eine manuelle Ablesung entfällt und der Verwaltungsaufwand minimiert wird.",
				},
				{
					text: "Warmwasser-Funkgerät",
					title: "Hohe Temperaturbeständigkeit",
					longText:
						"peziell für den Einsatz in Warmwasserleitungen entwickelt, bietet der Zähler zuverlässige Leistung auch bei dauerhaft hohen Temperaturen.",
				},
				{
					text: "Warmwasser-Funkgerät",
					title: "Langlebig & wartungsfrei",
					longText:
						"Dank hochwertiger Materialien und robuster Bauweise ist der Warmwasser-Funkzähler besonders widerstandsfähig und nahezu wartungsfrei im Betrieb.",
				},
			],
		},
		{
			mainImage: numbered_counter3,
			slides: [
				{
					text: "Heizungszähler-Funkgerät",
					title: "Präzise Verbrauchserfassung",
					longText:
						"Durch moderne Ultraschalltechnologie werden Heizungsverbräuche exakt und zuverlässig gemessen, unabhängig von Temperaturschwankungen.",
				},
				{
					text: "Heizungszähler-Funkgerät",
					title: "Integrierte Leckageerkennung",
					longText:
						"Der Heizungszähler erkennt akustisch mögliche Leckagen und hilft so, frühzeitig Schäden zu vermeiden und Heizkosten zu optimieren.",
				},
				{
					text: "Heizungszähler-Funkgerät",
					title: "Digitale Fernablesung",
					longText:
						"Die Verbrauchsdaten werden automatisch per Funk übermittelt, sodass eine manuelle Ablesung entfällt und eine kontinuierliche Überwachung möglich ist.",
				},
				{
					text: "Heizungszähler-Funkgerät",
					title: "Robust & langlebig",
					longText:
						"Dank hochwertiger Materialien und Schutzklasse IP68 ist der Heizungszähler äußerst widerstandsfähig gegen äußere Einflüsse und für eine lange Lebensdauer ausgelegt.",
				},
			],
		},
		{
			mainImage: numbered_counter4,
			slides: [
				{
					text: "Funk-Rauchmelder",
					title: "Automatische Alarmweiterleitung",
					longText:
						"Dank der integrierten Funktechnologie kommuniziert der Rauchmelder mit anderen Geräten und kann Alarme direkt an zentrale Systeme oder mobile Endgeräte weiterleiten.",
				},
				{
					text: "Funk-Rauchmelder",
					title: "Frühzeitige Rauchdetektion",
					longText:
						"Die fotoelektrische Sensorik erkennt selbst kleinste Rauchpartikel schnell und zuverlässig, wodurch Brände frühzeitig bemerkt und Schäden minimiert werden können.",
				},
				{
					text: "Funk-Rauchmelder",
					title: "Lange Batterielaufzeit",
					longText:
						"Mit einer Lebensdauer von bis zu 10 Jahren arbeitet der Funk-Rauchmelder wartungsarm und sorgt für dauerhafte Sicherheit ohne häufigen Batteriewechsel.",
				},
				{
					text: "Funk-Rauchmelder",
					title: "Einfache Vernetzung mehrerer \n Geräte",
					longText:
						"Mehrere Funk-Rauchmelder lassen sich miteinander verbinden, sodass bei Gefahr alle vernetzten Geräte gleichzeitig Alarm auslösen und eine flächendeckende Warnung ermöglichen.",
				},
			],
		},
	];

	const classNames = ["first", "second", "third", "fourth"];

	// Each product slide holds a visible vertical swiper and a hidden twin with
	// its own pagination; the controller module keeps the pair in sync.
	const swipersMain: (SwiperCore | undefined)[] = [];
	const swipersSecond: (SwiperCore | undefined)[] = [];

	const link = (index: number) => {
		const main = swipersMain[index];
		const second = swipersSecond[index];
		if (main && second) {
			main.controller.control = second;
			second.controller.control = main;
		}
	};

	const numberedPagination = (el: string) => ({
		el,
		clickable: true,
		renderBullet: (idx: number, className: string) =>
			`<span class="${className}">${idx + 1}</span>`,
	});
</script>

<!-- Shared feature slide content for the desktop and mobile variants -->
{#snippet featureSlideContent(
	slide: NumberedSwiperDataItemSlideType,
	variant: "desktop" | "mobile",
)}
	{@const isDesktop = variant === "desktop"}
	<div class={isDesktop ? "max-w-[594px] space-y-6" : "space-y-3 px-2"}>
		<p class={["font-bold text-green", isDesktop ? "text-base" : "text-sm"]}>
			{slide.text}
		</p>
		<h4
			class={[
				"text-dark_text",
				isDesktop
					? "text-[45px] leading-[54px] max-medium:text-2xl"
					: "text-xl",
			]}
		>
			{slide.title}
		</h4>
		<p class={isDesktop ? "" : "text-sm text-dark_text/80"}>
			{slide.longText}
		</p>
		<a
			class={[
				"group flex cursor-pointer items-center justify-start gap-1.5 text-link",
				!isDesktop && "text-sm",
			]}
			href={ROUTE_BLOG}
		>
			Mehr erfahren
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class={[
					"colored-to-blue -rotate-90 transition group-hover:translate-x-1",
					!isDesktop && "h-2 w-2",
				]}
				src={right_arrow}
				alt="right_arrow"
			/>
		</a>
	</div>
{/snippet}

<div class="p-[72px] max-large:p-6">
	<!-- Desktop/Tablet Version -->
	<div class="max-small:hidden">
		<div
			class="swiper numbered-swiper relative !py-3.5"
			{@attach swiper({
				modules: [Navigation],
				spaceBetween: 20,
				navigation: true,
				slidesPerView: 1,
			})}
		>
			<div class="swiper-wrapper">
				{#each items as item, index (index)}
					<div
						class="swiper-slide relative !flex items-center justify-center gap-9 rounded-base max-large:flex-col"
					>
						<Image
							width={0}
							height={0}
							sizes="100vw"
							class="absolute top-1/2 left-0 -translate-y-1/2 max-large:relative max-large:translate-y-0"
							src={item.mainImage}
							alt="numbered counter"
						/>
						<div
							class="swiper w-full !px-5 !pl-[440px] max-large:!pl-5 numbered-item-swiper--{classNames[
								index
							]}"
							{@attach swiper(
								{
									modules: [Pagination, Controller],
									spaceBetween: 20,
									pagination: numberedPagination(
										`.numbered-item-swiper-pagination-${classNames[index]}-first`,
									),
									slidesPerView: 1,
									direction: "vertical",
								},
								(s) => {
									swipersMain[index] = s;
									link(index);
								},
							)}
						>
							<div class="swiper-wrapper">
								{#each item.slides as slide (slide.title)}
									<div
										class="swiper-slide !flex items-center justify-start gap-9 rounded-base max-large:flex-col"
									>
										{@render featureSlideContent(slide, "desktop")}
									</div>
								{/each}
							</div>
						</div>
						<div
							class="swiper w-0 numbered-item-swiper--{classNames[index]}"
							{@attach swiper(
								{
									modules: [Pagination, Controller],
									spaceBetween: 20,
									slidesPerView: 1,
									direction: "vertical",
									pagination: numberedPagination(
										`.numbered-item-swiper-pagination-${classNames[index]}-second`,
									),
								},
								(s) => {
									swipersSecond[index] = s;
									link(index);
								},
							)}
						>
							<div class="swiper-wrapper">
								{#each item.slides as slide (slide.title)}
									<div class="swiper-slide"></div>
								{/each}
							</div>
						</div>
						<div class="swiper-controllers max-medium:hidden">
							<div
								class="numbered-item-swiper-pagination-{classNames[
									index
								]}-first swiper-pagination"
							></div>
							<div
								class="numbered-item-swiper-pagination-{classNames[
									index
								]}-second swiper-pagination"
							></div>
						</div>
					</div>
				{/each}
			</div>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		</div>
	</div>

	<!-- Mobile Version - All 4 products stacked, features swipe horizontally -->
	<div class="hidden flex-col gap-10 max-small:flex">
		{#each items as item, index (index)}
			<div class="flex flex-col gap-4">
				<!-- Product Image -->
				<Image
					width={400}
					height={400}
					sizes="(max-width: 640px) 280px, 400px"
					class="mx-auto h-[280px] w-auto object-contain"
					src={item.mainImage}
					alt="numbered counter"
				/>
				<!-- Navigation Arrows between image and title -->
				<div class="flex items-center justify-center gap-4">
					<button
						aria-label="Zurück"
						class="mobile-swiper-prev-{index} flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-dark_text shadow-md transition hover:bg-gray-50 disabled:opacity-30"
					>
						<svg
							class="h-4 w-4 rotate-180"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
					<button
						aria-label="Weiter"
						class="mobile-swiper-next-{index} flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-dark_text shadow-md transition hover:bg-gray-50 disabled:opacity-30"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
				<!-- Horizontal Feature Swiper with Autoplay -->
				<div
					class="swiper w-full"
					{@attach swiper({
						modules: [Navigation, Autoplay],
						spaceBetween: 16,
						slidesPerView: 1,
						navigation: {
							prevEl: `.mobile-swiper-prev-${index}`,
							nextEl: `.mobile-swiper-next-${index}`,
						},
						autoplay: {
							delay: 4000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						},
						loop: true,
					})}
				>
					<div class="swiper-wrapper">
						{#each item.slides as slide (slide.title)}
							<div class="swiper-slide">
								{@render featureSlideContent(slide, "mobile")}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

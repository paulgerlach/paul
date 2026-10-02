<script lang="ts">
	import { Navigation, Pagination } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import {
		personSlide1,
		personSlide2,
		personSlide3,
		personSlide4,
		personSlide5,
		personSlideIcon1,
		personSlideIcon2,
		personSlideIcon3,
		personSlideIcon4,
		personSlideIcon5,
		personSlidePerson1,
		personSlidePerson2,
		personSlidePerson3,
		personSlidePerson4,
		personSlidePerson5,
	} from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";

	type PersonSwiperSlideDataType = {
		image: ImageAsset;
		text: string;
		icon: ImageAsset;
		personIcon: ImageAsset;
		personName: string;
		personRole: string;
	};

	const personSwiperSlides: PersonSwiperSlideDataType[] = [
		{
			text: "Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.",
			personName: "Felix Gerlach, CEO &",
			personRole: "Geschäftsführer, Pro Gera",
			image: personSlide1,
			icon: personSlideIcon1,
			personIcon: personSlidePerson1,
		},
		{
			text: "Dank Heidi ist es egal, ob ich in Düsseldorf, München oder Berlin bin – ich habe jederzeitdie volle Transparenz über die Verbräuche.",
			personName: "Erik Brandenburg, CEO &",
			personRole: "Geschäftsführer, Carter Benson Group",
			image: personSlide2,
			icon: personSlideIcon2,
			personIcon: personSlidePerson2,
		},
		{
			text: "Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.",
			personName: "Klaus Gsuck, Immobilienmanager",
			personRole: "Vitec Real Estate Management",
			image: personSlide3,
			icon: personSlideIcon3,
			personIcon: personSlidePerson3,
		},
		{
			text: "Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.",
			personName: "Fabian Höhne, CEO &",
			personRole: "Geschäftsführer, Vitolus",
			image: personSlide4,
			icon: personSlideIcon4,
			personIcon: personSlidePerson4,
		},
		{
			text: "[...] Wir haben durch Heidi Systems Funkzähler einbauen lassen. Die Installation lief reibungslos – jetzt haben wir alle Verbrauchsdaten zentral im Blick und sparen Zeit sowie Energie.",
			personName: "Ralf Glasenhauer,",
			personRole: "Leiter der Gemeinde",
			image: personSlide5,
			icon: personSlideIcon5,
			personIcon: personSlidePerson5,
		},
	];
</script>

<div
	class="swiper brands-swiper mt-20 !px-[72px] max-megalarge:!px-16 max-large:!px-6 max-medium:mt-10 max-medium:!px-5"
>
	<div
		class="swiper swiper-wrapper"
		{@attach swiper({
			pagination: { type: "bullets", clickable: true },
			loop: true,
			slidesPerView: 1,
			navigation: true,
			modules: [Pagination, Navigation],
		})}
	>
		<div class="swiper-wrapper">
			{#each personSwiperSlides as slide (slide.personName)}
				<div
					class="swiper-slide !flex items-stretch gap-[72px] rounded-base bg-dark_green p-5 max-large:grid max-large:grid-cols-2 max-large:gap-6 max-medium:!grid max-medium:grid-cols-1 max-medium:grid-rows-2 max-medium:items-start max-medium:justify-start"
				>
					<div
						class="flex flex-col items-start justify-between p-5 max-medium:p-0"
					>
						<Image
							width={120}
							height={60}
							sizes="120px"
							class="max-h-[60px] w-fit max-w-[120px] max-medium:mb-16"
							src={slide.icon}
							alt="vitolos"
						/>
						<div
							class="flex flex-grow flex-col items-start justify-end space-y-10"
						>
							<p
								class="text-[27px] leading-[32.4px] text-white max-medium:text-lg max-medium:leading-6"
							>
								„{slide.text}“
							</p>
							<div class="flex items-center gap-7">
								<Image
									width={100}
									height={60}
									sizes="100px"
									class="h-[60px] w-[100px] rounded-base"
									src={slide.personIcon}
									alt="vonovia person"
								/>
								<div class="space-y-1">
									<p class="text-xl leading-6 text-white/50">
										{slide.personName}
									</p>
									<p class="text-xl leading-6 text-white/50">
										{slide.personRole}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="max-medium:h-full">
						<div
							class="size-[500px] max-large:size-fit max-medium:h-full max-medium:w-full"
						>
							<Image
								width={500}
								height={500}
								sizes="(max-width: 768px) 100vw, 500px"
								class="size-[500px] rounded-base max-large:size-fit max-medium:h-full max-medium:w-full max-medium:object-cover"
								src={slide.image}
								alt="vonovia person"
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
		<div class="swiper-pagination"></div>
	</div>
</div>

<script lang="ts">
	import { Autoplay, Pagination } from "swiper/modules";
	import { swiper } from "$lib/attachments/swiper";
	import NewsCard from "./NewsCard.svelte";
	import { newsSlides } from "./newsSlides";
</script>

<div class="news-swiper relative">
	<!-- Swipe indicator - mobile only -->
	<div
		class="animate-fade-out absolute top-8 left-1/2 z-10 hidden -translate-x-1/2 max-medium:block"
	>
		<div
			class="animate-swipe-hint flex items-center gap-2 text-sm text-dark_text/60"
		>
			<span>👆</span>
			<span>Wischen</span>
			<span class="animate-swipe-arrow">→</span>
		</div>
	</div>
	<div
		class="swiper news-swiper mb-20 px-[72px] max-large:px-6 max-medium:!pt-20"
		{@attach swiper({
			modules: [Pagination, Autoplay],
			spaceBetween: 20,
			slidesPerView: 1,
			pagination: { clickable: true },
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			},
			loop: true,
		})}
	>
		<div class="swiper-wrapper">
			{#each newsSlides as slide (slide.title)}
				<div class="swiper-slide rounded-base bg-card_dark_bg p-4 pb-10">
					<NewsCard {slide} />
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>
</div>

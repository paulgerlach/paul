<script lang="ts">
	import NewsCard from "./NewsCard.svelte";
	import { newsSlides } from "./newsSlides";
</script>

<div class="news-swiper mb-20 px-[72px] max-large:px-6 max-medium:pt-20">
	<div class="grid grid-cols-3 gap-5 max-medium:flex max-medium:gap-0">
		{#each newsSlides as slide (slide.title)}
			<div class="rounded-base bg-card_dark_bg p-4 pb-10">
				<NewsCard {slide} />
			</div>
		{/each}
	</div>
</div>

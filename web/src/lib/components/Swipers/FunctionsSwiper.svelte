<script lang="ts">
	import { Autoplay, Pagination } from "swiper/modules";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { article1 } from "$lib/assets/icons";
	import { swiper } from "$lib/attachments/swiper";
	import {
		functionAnimations,
		functionLottieClass,
		functionTexts,
	} from "./functionSlides";
</script>

<div class="relative">
	<!-- Swipe indicator - mobile only -->
	<div
		class="animate-fade-out pointer-events-none absolute top-2 left-1/2 z-10 hidden -translate-x-1/2 max-medium:block"
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
		class="swiper functions-swiper !pt-8"
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
			{#each functionTexts as slide, index (index)}
				<div class="swiper-slide space-y-6">
					{#if index === 0}
						<Image
							width={0}
							height={0}
							sizes="100vw"
							class="max-h-[244px] max-w-[300px] overflow-hidden max-large:object-fill max-medium:max-h-full max-medium:w-full max-medium:max-w-full large:w-full"
							src={article1}
							alt="article image"
						/>
					{:else}
						<LazyLottie
							animationName={functionAnimations[index - 1]}
							id="{functionAnimations[index - 1].replace(
								'Animation_',
								'animation',
							)}function"
							wrapperClassName={functionLottieClass}
						/>
					{/if}
					<p class="text-xl leading-[24px] font-bold text-dark_text">
						{slide.title}
					</p>
					<p class="text-[17px] leading-5 text-dark_text">
						{slide.subtitle}
					</p>
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>
</div>

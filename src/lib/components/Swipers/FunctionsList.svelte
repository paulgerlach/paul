<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { article1 } from "$lib/assets/icons";
	import {
		functionAnimations,
		functionLottieClass,
		functionTexts,
	} from "./functionSlides";
</script>

<div
	class="grid grid-cols-4 gap-11 max-large:gap-6 max-medium:flex max-medium:gap-0"
>
	{#each functionTexts as slide, index (slide.title)}
		<div class="space-y-6">
			{#if index === 0}
				<Image
					width={0}
					height={0}
					sizes="100vw"
					class="max-h-[244px] max-w-[300px] overflow-hidden max-large:object-fill max-medium:max-h-full max-medium:max-w-full large:w-full"
					src={article1}
					alt="article image"
				/>
			{:else}
				<LazyLottie
					animationName={functionAnimations[index - 1]}
					id={functionAnimations[index - 1].replace("Animation_", "animation")}
					wrapperClassName={functionLottieClass}
				/>
			{/if}
			<p class="text-xl leading-[24px] font-bold text-dark_text">
				{slide.title}
			</p>
			<p class="text-[17px] leading-5 text-dark_text">{slide.subtitle}</p>
		</div>
	{/each}
</div>

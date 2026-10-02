<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		berlinBear,
		dumax,
		google,
		harte,
		hsp,
		idgim,
		quarterback,
		raum,
		right_arrow,
		star,
		vitec,
		wagner,
		winfried,
	} from "$lib/assets/icons";
	import TickerItems from "./TickerItems.svelte";

	const logos = {
		berlinBear,
		dumax,
		harte,
		hsp,
		idgim,
		quarterback,
		raum,
		vitec,
		wagner,
		winfried,
	};
</script>

<div
	class="flex items-center justify-start gap-16 px-[100px] py-8 max-small:flex-col max-small:justify-center max-small:gap-4 max-small:px-5 max-small:py-4"
>
	<div
		class="group flex w-full max-w-[345px] items-center justify-start gap-3 rounded-[40px] px-4 py-2.5 max-small:justify-center max-small:gap-2"
	>
		<span
			class="flex items-center justify-start gap-2 max-small:justify-center max-small:gap-1"
		>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="colored-to-black size-5 max-small:size-4"
				src={google}
				alt="google"
			/>
			{#each { length: 5 }, i (i)}
				<Image
					width={0}
					height={0}
					sizes="100vw"
					class="size-4 max-small:size-3"
					src={star}
					alt="rate star"
				/>
			{/each}
		</span>
		<span
			class="text-center text-[15px] leading-[18px] whitespace-nowrap text-dark_text max-small:text-xs"
		>
			1.850+ Bewertungen
		</span>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="colored-to-black size-2.5 -rotate-90 transition group-hover:translate-x-1.5 max-small:size-2"
			src={right_arrow}
			alt="chevron"
		/>
	</div>
	<div class="ticker-wrap not-filtered max-small:w-full">
		<TickerItems {logos} />
	</div>
</div>

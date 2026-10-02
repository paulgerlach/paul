<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { chart1, chart2, chart3, chart5 } from "$lib/assets/icons";
</script>

{#snippet chart(src: ImageAsset, className = "h-fit")}
	<div class={className}>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="w-full"
			{src}
			alt="chart"
		/>
	</div>
{/snippet}

<div
	class="my-16 px-[100px] max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
>
	<div
		class="mx-auto grid w-fit grid-cols-3 gap-2.5 rounded-[15px] bg-[#EFEEEC] p-2.5 max-medium:grid-cols-1"
	>
		<div class="flex max-w-[385px] flex-col gap-y-3.5">
			{@render chart(chart1)}
			{@render chart(chart2)}
		</div>
		<div class="flex max-w-[385px] flex-col gap-y-3.5">
			{@render chart(chart3)}
			<LazyLottie
				id="chart4"
				animationName="Animation_12"
				wrapperClassName="h-full"
			/>
		</div>
		<div class="flex max-w-[385px] flex-col gap-y-3.5">
			{@render chart(chart5, "row-span-2 h-fit")}
			<LazyLottie
				id="chart6"
				wrapperClassName="h-fit"
				animationName="Animation_13"
			/>
		</div>
	</div>
</div>

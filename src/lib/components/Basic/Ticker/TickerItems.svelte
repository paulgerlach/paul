<!-- The logo strip shared by both tickers. The CSS animation in app.css
     scrolls it; the list is repeated three times so it loops seamlessly. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";

	let { logos }: { logos: Record<string, ImageAsset> } = $props();

	const items = $derived(
		[1, 2, 3].flatMap((round) =>
			Object.entries(logos).map(([name, src]) => ({
				key: `${round}-${name}`,
				name,
				src,
			})),
		),
	);
</script>

<div class="ticker">
	{#each items as item (item.key)}
		<div class="ticker__item">
			<Image
				width={0}
				height={0}
				sizes="100vw"
				src={item.src}
				alt={item.name}
			/>
		</div>
	{/each}
</div>

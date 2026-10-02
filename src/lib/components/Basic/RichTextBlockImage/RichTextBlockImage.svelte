<script lang="ts">
	import type { RTImageNode } from "@prismicio/client";
	import type { RichTextComponentProps } from "@prismicio/svelte";
	import CmsImage from "$lib/components/Basic/Image/CmsImage.svelte";

	let { node }: RichTextComponentProps<RTImageNode> = $props();

	// GIFs are served as-is so they stay animated (next/image `unoptimized`).
	const isGif = $derived(
		!!node.url && new URL(node.url).pathname.toLowerCase().endsWith(".gif"),
	);
	const imageClass =
		"h-auto max-h-[400px] w-full max-w-full rounded-2xl object-cover shadow-lg";
</script>

{#if node.url}
	<div class="flex flex-col items-start justify-center gap-2.5">
		{#if isGif}
			<img
				src={node.url}
				alt={node.alt || ""}
				loading="lazy"
				decoding="async"
				class={imageClass}
			/>
		{:else}
			<CmsImage field={node} class={imageClass} />
		{/if}
		{#if node.alt}
			<span class="mx-auto block w-fit text-sm font-medium">{node.alt}</span>
		{/if}
	</div>
{/if}

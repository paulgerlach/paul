<!--
  Drop-in for next/image with local assets. Renders the same <picture> markup
  as <enhanced:img>. As with next/image, a width/height of 0 (the
  `width={0} height={0}` pattern) falls back to the intrinsic size, and
  loading defaults to "lazy".
-->
<script lang="ts">
	import type { HTMLImgAttributes } from "svelte/elements";
	import type { ImageAsset } from "./types";

	type Props = Omit<HTMLImgAttributes, "src"> & {
		src: ImageAsset;
		alt: string;
		/** Next's `priority`: load eagerly with high fetch priority. */
		priority?: boolean;
	};

	let {
		src,
		width,
		height,
		sizes,
		priority = false,
		loading = priority ? "eager" : "lazy",
		...rest
	}: Props = $props();

	const sources = $derived(Object.entries(src.sources));
</script>

{#snippet img()}
	<img
		src={src.img.src}
		width={width || src.img.w}
		height={height || src.img.h}
		{sizes}
		{loading}
		fetchpriority={priority ? "high" : undefined}
		decoding="async"
		{...rest}
	/>
{/snippet}

{#if sources.length}
	<!-- display: contents keeps the <img> as the layout box (flex item etc.),
	     as with next/image, which renders a bare <img>. The <source>s are
	     hidden so they don't become flex items; selection still works. -->
	<picture class="contents">
		{#each sources as [format, srcset] (format)}
			<source class="hidden" {srcset} {sizes} type="image/{format}" />
		{/each}
		{@render img()}
	</picture>
{:else}
	{@render img()}
{/if}

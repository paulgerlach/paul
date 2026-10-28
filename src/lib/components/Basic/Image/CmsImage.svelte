<!--
  next/image replacement for Prismic images (imgix). Uses Next's deviceSizes
  as srcset widths with `fit=max`, which, like Next's optimizer, never
  upscales. The browser then derives the same natural size as with
  next/image, which keeps flex layouts identical (see Image.svelte).
-->
<script lang="ts">
	import {
		asImageWidthSrcSet,
		isFilled,
		type ImageFieldImage,
	} from "@prismicio/client";
	import type { HTMLImgAttributes } from "svelte/elements";

	type Props = Omit<HTMLImgAttributes, "src" | "srcset" | "alt"> & {
		field: ImageFieldImage | null | undefined;
		/** Used when the field has no alt text. */
		fallbackAlt?: string;
	};

	let {
		field,
		fallbackAlt = "",
		sizes = "100vw",
		loading = "lazy",
		...rest
	}: Props = $props();

	const image = $derived(
		isFilled.imageThumbnail(field)
			? {
					...asImageWidthSrcSet(field, {
						widths: [640, 750, 828, 1080, 1200, 1920],
						fit: "max",
					}),
					alt: field.alt || fallbackAlt,
					width: field.dimensions.width,
					height: field.dimensions.height,
				}
			: null,
	);
</script>

{#if image}
	<img
		src={image.src}
		srcset={image.srcset}
		alt={image.alt}
		width={image.width}
		height={image.height}
		{sizes}
		{loading}
		decoding="async"
		{...rest}
	/>
{/if}

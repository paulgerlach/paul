<!--
  Drop-in for next/image with local assets. Like next/image it renders a bare
  <img> (no <picture>), so it behaves as the layout box everywhere: flex/grid
  item, `space-y-*` child, etc. As with next/image, a width/height of 0 (the
  `width={0} height={0}` pattern) falls back to the intrinsic size, and loading
  defaults to "lazy".

  Images load the full-size WebP variant from enhanced-img (supported by every
  current browser). With `sizes`, the srcset lists that file under Next's
  `deviceSizes` (+ `imageSizes`) width descriptors, as next/image does. The browser derives the
  image's natural size from the chosen descriptor, and that natural size decides
  how far the image shrinks in flex rows. Mirroring Next keeps those layouts
  identical at every viewport.
-->
<script lang="ts" module>
	/** `images.deviceSizes` / `images.imageSizes` from the Next config. */
	const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920];
	const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 384];

	/** Largest candidate of an enhanced-img srcset ("a 1x, b 2x" → "b"). */
	const largest = (srcset: string | undefined) =>
		srcset?.split(",").at(-1)?.trim().split(" ")[0];
</script>

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

	const webp = $derived(largest(src.sources.webp));
	const url = $derived(webp ?? src.img.src);
	// SVGs have no variants; next/image serves them unoptimized, without srcset.
	// Like next/image: viewport-relative `sizes` use the device buckets only,
	// fixed `sizes` (e.g. "25px") also get the small image buckets.
	const srcset = $derived.by(() => {
		if (!webp || !sizes) return undefined;
		const widths = /\d+vw/.test(sizes)
			? DEVICE_SIZES
			: [...IMAGE_SIZES, ...DEVICE_SIZES];
		// Next serves bucket `w` resized to min(w, file width). We only have the
		// full file, so buckets narrower than it are declared at the file's own
		// width: the browser then derives the same natural size as with Next.
		const fileW = src.img.w;
		const descriptors = [...new Set(widths.map((w) => Math.max(w, fileW)))];
		return descriptors.map((w) => `${webp} ${w}w`).join(", ");
	});
</script>

<img
	src={url}
	{srcset}
	width={width || src.img.w}
	height={height || src.img.h}
	{sizes}
	{loading}
	fetchpriority={priority ? "high" : undefined}
	decoding="async"
	{...rest}
/>

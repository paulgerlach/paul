<!--
  A device photo, contained in its box (the design's .ipim: a background
  with `contain`). Decorative: every mock-up it sits in is hidden from
  screen readers or names the device in text.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { DeviceImage } from "../content";
	import { DEVICE_PHOTOS } from "../photos";

	let { image, size }: { image: DeviceImage; size: number } = $props();
</script>

<span class="ipim" style:width="{size}px" style:height="{size}px"
	><Image src={DEVICE_PHOTOS[image]} alt="" sizes="{size}px" /></span
>

<style>
	.ipim {
		display: block;
		flex: none;
	}
	.ipim :global(img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>

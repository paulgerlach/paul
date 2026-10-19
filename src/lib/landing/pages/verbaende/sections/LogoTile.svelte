<!--
  Rows 1–3's tile (the design's .vb-lg): the association's logo on a white
  card with its line under it. Server-rendered shown; a card still below the
  fold rises in once when it comes into view (the design's `.uv-row.in`),
  never with reduced motion. The tile is hidden from screen readers (Rows).
-->
<script lang="ts">
	import type { Picture } from "vite-imagetools";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { enterView } from "$lib/landing/attachments/enterView";

	let { logo, line }: { logo: Picture; line: string } = $props();

	let waiting = $state(false);
</script>

<div
	class={["card", waiting && "wait"]}
	{@attach enterView({
		prepare: () => (waiting = true),
		play: () => {
			waiting = false;
		},
	})}
>
	<Image src={logo} alt="" />
	<small>{line}</small>
</div>

<style>
	.card {
		background: #fff;
		border-radius: 20px;
		padding: 44px 40px 30px;
		display: grid;
		justify-items: center;
		gap: 22px;
		width: min(78%, 360px);
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.35);
		transition:
			opacity 0.8s,
			transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.card.wait {
		opacity: 0;
		transform: translateY(10px);
	}
	.card :global(img) {
		max-width: 220px;
		max-height: 84px;
		width: auto;
		height: auto;
		display: block;
	}
	small {
		font-size: 13.5px;
		font-weight: 600;
		color: #5b6b66;
		text-align: center;
	}
</style>

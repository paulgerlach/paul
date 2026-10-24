<!--
  Row 5's photo in the before/after tile (the design's .ipp): on the tool's
  side it opens with the new meter's photo, a shutter flash and a focus
  frame, then the line that files it into the protocol; on the clipboard's
  side it folds away. CSS only, driven by `on` (the tile's side).
-->
<script lang="ts">
	import meter from "$lib/assets/landing/installationspartner/meter.jpg?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Tick from "$lib/landing/sections/uv/Tick.svelte";
	import { meterPhoto } from "../content";

	let { on }: { on: boolean } = $props();
</script>

<div class={["ipp", on && "on"]}>
	<figure class="ph">
		<Image src={meter} alt="" width={96} height={96} sizes="96px" />
		<span class="fl"></span>
		<span class="frame"></span>
	</figure>
	<div class="m">
		<small>{meterPhoto.unit}</small>
		<b>{meterPhoto.title}</b>
		<small class="done"><Tick width={10} /> {meterPhoto.done}</small>
	</div>
</div>

<style>
	.ipp {
		display: flex;
		gap: 12px;
		align-items: center;
		overflow: hidden;
		max-height: 0;
		opacity: 0;
		transition:
			max-height 0.5s,
			opacity 0.4s,
			margin 0.5s;
	}
	.ipp.on {
		max-height: 130px;
		opacity: 1;
		margin: 4px 0 10px;
	}
	.ph {
		position: relative;
		margin: 0;
		width: 96px;
		height: 96px;
		border-radius: 12px;
		overflow: hidden;
		flex: none;
		background: var(--ink);
	}
	.ph :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transform: scale(1.15);
		transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s;
	}
	.on .ph :global(img) {
		transform: none;
	}
	.fl {
		position: absolute;
		inset: 0;
		background: #fff;
		opacity: 0;
		pointer-events: none;
	}
	.on .fl {
		animation: flash 0.7s ease-out 0.35s;
	}
	@keyframes flash {
		0% {
			opacity: 0;
		}
		15% {
			opacity: 0.95;
		}
		100% {
			opacity: 0;
		}
	}
	.frame {
		position: absolute;
		inset: 8px;
		border: 2px solid rgba(138, 214, 143, 0.9);
		border-radius: 8px;
		opacity: 0;
	}
	.on .frame {
		animation: frame 1.2s ease-out 0.1s;
	}
	@keyframes frame {
		0% {
			opacity: 0;
			transform: scale(1.15);
		}
		30% {
			opacity: 1;
			transform: none;
		}
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	.m small {
		display: block;
		font-size: 11.5px;
		color: var(--muted);
	}
	.m b {
		display: block;
		font-size: 14px;
		margin: 2px 0 4px;
	}
	.m .done {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: #2f7a3c;
		font-weight: 600;
		opacity: 0;
		transition: opacity 0.4s 1.1s;
	}
	.on .done {
		opacity: 1;
	}
	/* The design's tick keeps its ink stroke beside the green text. */
	.done :global(svg) {
		width: 10px;
		height: 10px;
	}
	.done :global(path) {
		stroke: var(--ink);
	}
</style>

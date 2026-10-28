<!--
  The full-width photo with its caption (.uv-pic). It eases out of a slight
  zoom once in view, but only if it was below the fold on load, never with
  reduced motion (as /vorgehen's WideImage).
-->
<script lang="ts">
	import type { Picture } from "vite-imagetools";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";

	let {
		label,
		caption,
		photo,
	}: { label: string; caption: [string, string]; photo: Picture } = $props();

	let zoom = $state(false);
	let shown = $state(false);
</script>

<section class="pic" aria-label={label}>
	<div class="wrap">
		<figure
			class={["big rv", zoom && "zoom", shown && "in"]}
			{@attach (el) => {
				zoom =
					!prefersReducedMotion() &&
					el.getBoundingClientRect().top >= window.innerHeight;
				return inView({ once: true, onEnter: () => (shown = true) })(el);
			}}
		>
			<Image src={photo} alt="" sizes="(max-width: 1240px) 100vw, 1160px" />
			<figcaption>{caption[0]}<br />{caption[1]}</figcaption>
		</figure>
	</div>
</section>

<style>
	.pic {
		padding: 0 0 120px;
	}
	.big {
		margin: 0;
		position: relative;
		border-radius: 26px;
		overflow: hidden;
		height: clamp(360px, 50vw, 640px);
	}
	.big :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.zoom :global(img) {
		transform: scale(1.06);
	}
	.zoom.in :global(img) {
		transform: none;
	}
	.big::after {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(20, 34, 30, 0.42);
	}
	figcaption {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		text-align: center;
		z-index: 1;
		font-size: clamp(34px, 5vw, 72px);
		letter-spacing: -0.04em;
		line-height: 1.05;
		padding: 20px;
	}
</style>

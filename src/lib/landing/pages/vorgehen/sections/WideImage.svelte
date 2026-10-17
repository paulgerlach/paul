<!--
  The wide building photo with its example caption. It eases out of a slight
  zoom once in view, but only if it was below the fold on load (an image that
  is already visible doesn't jump), never with reduced motion.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import photo from "$lib/assets/landing/vorgehen/building-wide.webp?enhanced";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { wide } from "../content";

	let zoom = $state(false);
	let shown = $state(false);
</script>

<section class="wide">
	<div class="wrap">
		<figure
			class={["img rv", zoom && "zoom", shown && "in"]}
			{@attach (el) => {
				zoom =
					!prefersReducedMotion() &&
					el.getBoundingClientRect().top >= window.innerHeight;
				return inView({ once: true, onEnter: () => (shown = true) })(el);
			}}
		>
			<Image
				src={photo}
				alt=""
				priority
				sizes="(max-width: 1280px) 100vw, 1280px"
				style={`object-position: ${wide.objectPosition}`}
			/>
			<figcaption>
				<span class="dot" aria-hidden="true"></span>{wide.caption}
			</figcaption>
		</figure>
	</div>
</section>

<style>
	.wide {
		padding-bottom: 16px;
	}
	.wrap {
		max-width: 1280px;
	}
	.img {
		position: relative;
		margin: 0;
		border-radius: 24px;
		overflow: hidden;
		aspect-ratio: 16/7;
		background: var(--soft);
	}
	.img :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.zoom :global(img) {
		transform: scale(1.04);
	}
	.zoom.in :global(img) {
		transform: none;
	}
	figcaption {
		position: absolute;
		left: 24px;
		bottom: 24px;
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(8px);
		border-radius: 12px;
		padding: 10px 14px;
		font-size: 14px;
		font-weight: 500;
		max-width: calc(100% - 48px);
	}
	.dot {
		width: 8px;
		height: 8px;
		flex: none;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px rgba(138, 214, 143, 0.25);
		animation: pulse 2.4s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			box-shadow: 0 0 0 8px rgba(138, 214, 143, 0);
		}
	}
	@media (max-width: 980px) {
		.img {
			aspect-ratio: 4/3;
		}
	}
	@media (max-width: 560px) {
		figcaption {
			left: 14px;
			bottom: 14px;
			max-width: calc(100% - 28px);
			font-size: 13px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
		}
	}
</style>

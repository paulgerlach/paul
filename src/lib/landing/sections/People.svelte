<!--
  The people block ("Menschen statt Hotline." on the region pages, "Selbst
  abrechnen. Nicht allein." on /selbstabrechnung): a photo, the heading, a
  text, three checks and the demo CTA. Photo and text fade up once in view
  (not without JS or with reduced motion).
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";

	let {
		title,
		text,
		checks,
		photo,
		photoAlt = "Persönliche Beratung bei Heidi",
		objectPosition,
		spaced = false,
	}: {
		/** Each line of the heading; they're joined with a line break. */
		title: string[];
		text: string;
		checks: string[];
		photo: ImageAsset;
		photoAlt?: string;
		/** The photo's `object-position` (default `50% 30%`). */
		objectPosition?: string;
		/** Padding above too (the design's `.pp-in`), where no section with padding precedes it. */
		spaced?: boolean;
	} = $props();

	let armed = $state(false);
	let shown = $state(false);
</script>

<section
	class={["pp wrap", spaced && "spaced", armed && "armed", shown && "in"]}
	aria-labelledby="pp-h"
	{@attach (el) => {
		armed = !prefersReducedMotion();
		return inView({
			threshold: 0.15,
			once: true,
			onEnter: () => (shown = true),
		})(el);
	}}
>
	<div class="pp-g">
		<figure class="pp-f">
			<Image
				src={photo}
				alt={photoAlt}
				sizes="(max-width: 900px) 100vw, 640px"
				style={objectPosition
					? `object-position: ${objectPosition}`
					: undefined}
			/>
		</figure>
		<div class="pp-t">
			<h2 id="pp-h">
				{#each title as line, i (i)}{#if i > 0}<br />{/if}{line}{/each}
			</h2>
			<p>{text}</p>
			<ul class="pp-l">
				{#each checks as check (check)}
					<li><span><Check /></span>{check}</li>
				{/each}
			</ul>
			<a
				class="pp-a"
				href={DEMO_HREF}
				onclick={DEMO_HREF === START_HREF ? focusSignup : undefined}
				>Demo buchen <span aria-hidden="true">→</span></a
			>
		</div>
	</div>
</section>

<style>
	.pp {
		padding-block: 0 110px;
	}
	.pp.spaced {
		padding-block: 110px;
	}
	.pp-g {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: center;
	}
	.pp-f {
		margin: 0;
		border-radius: 24px;
		overflow: hidden;
		aspect-ratio: 1/1;
		background: #eef0ee;
		transition:
			opacity 1.1s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pp-f :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 30%;
		display: block;
		transition: transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pp-f:hover :global(img) {
		transform: scale(1.03);
	}
	.pp-t {
		transition:
			opacity 1.1s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 1.1s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.armed:not(.in) .pp-f,
	.armed:not(.in) .pp-t {
		opacity: 0;
		transform: translateY(18px);
	}
	.pp-t h2 {
		font-size: clamp(34px, 4.4vw, 60px);
		font-weight: 500;
		letter-spacing: -0.035em;
		line-height: 1.04;
	}
	.pp-t p {
		color: var(--muted);
		font-size: clamp(16px, 1.4vw, 19px);
		line-height: 1.5;
		margin-top: 20px;
		max-width: 44ch;
	}
	.pp-l {
		list-style: none;
		padding: 0;
		margin: 28px 0 0;
		display: grid;
		gap: 12px;
	}
	.pp-l li {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 16px;
		font-weight: 500;
	}
	.pp-l li span {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #8ad68f;
		display: grid;
		place-items: center;
		flex: none;
	}
	.pp-l :global(svg) {
		width: 11px;
		height: 10px;
	}
	.pp-a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 32px;
		background: #1e322d;
		color: #fff;
		border-radius: 12px;
		padding: 14px 20px;
		font-weight: 600;
		font-size: 15.5px;
		text-decoration: none;
		transition: background 0.3s;
	}
	.pp-a:hover {
		background: #2c4640;
	}

	@media (max-width: 900px) {
		.pp-g {
			grid-template-columns: 1fr;
		}
		.pp-f {
			aspect-ratio: 4/3;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pp-f,
		.pp-t,
		.pp-f :global(img) {
			transition: none;
		}
	}
</style>

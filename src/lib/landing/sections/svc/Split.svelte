<!--
  The service template's photo section (.pg-sec, the designs' .lg-split): the
  photo beside the head, a list of three ticked points and the source. The
  photo settles from a slight zoom as it reveals (server-rendered settled).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { Picture } from "vite-imagetools";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import type { SplitContent } from "./types";

	let {
		content,
		photo,
		width,
		height,
		position,
		icon,
	}: {
		content: SplitContent;
		photo: Picture;
		width: number;
		height: number;
		/** The photo's object-position, where the design sets one. */
		position?: string;
		/** The pill's 20×20 stroke icon paths. */
		icon: Snippet;
	} = $props();
</script>

<section class="pg-sec smp" aria-labelledby="pn-h">
	<div class="wrap split">
		<figure class="ph rv" style:--pos={position}>
			<Image
				src={photo}
				alt={content.alt}
				sizes="(max-width: 900px) 100vw, 640px"
				{width}
				{height}
			/>
		</figure>
		<div>
			<SectionHead
				id="pn-h"
				eyebrow={content.pill}
				heading={content.h2}
				{icon}
			/>
			<p class="lead rv">{content.lead}</p>
			<ul class="pl rv">
				{#each content.points as point (point)}
					<li><span class="okb"><Check /></span>{point}</li>
				{/each}
			</ul>
			<p class="src rv">{content.source}</p>
		</div>
	</div>
</section>

<style>
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.smp :global(h2) {
		margin-top: 18px;
	}
	.split {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: clamp(32px, 5vw, 72px);
		align-items: center;
	}
	.ph {
		margin: 0;
		border-radius: 22px;
		overflow: hidden;
		aspect-ratio: 3/2;
		background: #e9eceb;
	}
	.ph :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--pos, 50% 50%);
		display: block;
		transition: scale 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ph:global(.rv-wait) :global(img) {
		scale: 1.05;
	}
	/* .dm-lead */
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.pl {
		list-style: none;
		padding: 0;
		margin: 22px 0 0;
		display: grid;
		gap: 10px;
		font-size: 15.5px;
	}
	.pl li {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	/* .pg-src */
	.src {
		margin-top: 18px;
		font-size: 13px;
		color: var(--faint);
	}
	@media (max-width: 900px) {
		.split {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

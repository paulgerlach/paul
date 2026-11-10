<!--
  "Nach den Regeln der Technik." (.pg-sec, .lg-split): the photo of the lab
  technician beside the head, the three sampling points and the source. The
  photo settles from a slight zoom as it reveals (server-rendered settled).
-->
<script lang="ts">
	import photo from "$lib/assets/landing/legionellenpruefung/sampling.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { sampling } from "../content";
</script>

<section class="pg-sec smp" aria-labelledby="pn-h">
	<div class="wrap split">
		<figure class="ph rv">
			<Image
				src={photo}
				alt={sampling.alt}
				sizes="(max-width: 900px) 100vw, 640px"
				width={740}
				height={493}
			/>
		</figure>
		<div>
			<SectionHead id="pn-h" eyebrow={sampling.pill} heading={sampling.h2}>
				{#snippet icon()}
					<path d="M10 2.5s5 5.6 5 9.3a5 5 0 0 1-10 0c0-3.7 5-9.3 5-9.3z" />
				{/snippet}
			</SectionHead>
			<p class="lead rv">{sampling.lead}</p>
			<ul class="pl rv">
				{#each sampling.points as point (point)}
					<li><span class="okb"><Check /></span>{point}</li>
				{/each}
			</ul>
			<p class="src rv">{sampling.source}</p>
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

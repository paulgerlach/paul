<!-- "Vermieten, statt Zählerständen hinterherlaufen." (.pv-duo): a photo and a text card with a crop of the flat. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import owner from "$lib/assets/landing/private-vermieter/owner.jpg?enhanced";
	import Head from "../components/Head.svelte";
	import { duo } from "../content";
</script>

<section class="duo" aria-labelledby="pv-dh">
	<div class="wrap">
		<Head id="pv-dh" eyebrow={duo.eyebrow} lines={duo.h2} />
		<div class="dg">
			<figure class="rv">
				<Image src={owner} alt="" sizes="(max-width: 900px) 100vw, 620px" />
			</figure>
			<div class="dt rv">
				<i class="crop" aria-hidden="true"></i>
				{#each duo.text as p (p)}<p>{p}</p>{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.duo {
		padding: 120px 0 40px;
	}
	.dg {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 16px;
		margin-top: 40px;
	}
	figure {
		margin: 0;
		border-radius: 20px;
		overflow: hidden;
		aspect-ratio: 5/4;
	}
	figure :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	figure:hover :global(img) {
		transform: scale(1.03);
	}
	.dt {
		background: var(--card);
		border-radius: 20px;
		padding: clamp(22px, 3vw, 36px);
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	/* A crop of the flat (the design's .th4) */
	.crop {
		display: block;
		flex: none;
		width: clamp(120px, 14vw, 190px);
		aspect-ratio: 3/2;
		border-radius: 12px;
		margin: 0 0 auto auto;
		background-image: var(--img-room);
		background-size: 220%;
		background-position: 30% 40%;
		background-repeat: no-repeat;
	}
	p {
		color: rgba(255, 255, 255, 0.86);
		font-size: clamp(16px, 1.3vw, 18px);
		line-height: 1.55;
		max-width: 46ch;
	}
	p:last-child {
		color: var(--mute);
	}
	@media (max-width: 900px) {
		.dg {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		figure:hover :global(img) {
			transform: none;
		}
	}
</style>

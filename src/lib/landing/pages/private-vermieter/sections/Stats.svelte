<!-- Three figures (.pv-stats), each card with a crop of the page's photos (the design's .th). -->
<script lang="ts">
	import { stats } from "../content";
</script>

<section class="stats" aria-label={stats.label}>
	<div class="wrap sg">
		{#each stats.items as item (item.value)}
			<div class="st rv">
				<div><b>{item.value}</b><span>{item.text}</span></div>
				<i class="crop c{item.crop}" aria-hidden="true"></i>
			</div>
		{/each}
	</div>
</section>

<style>
	.stats {
		padding: 24px 0 120px;
	}
	.sg {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	.st {
		background: var(--card);
		border-radius: 18px;
		padding: 22px 22px 20px;
		display: flex;
		justify-content: space-between;
		gap: 16px;
		min-height: 150px;
	}
	.st > div {
		display: flex;
		flex-direction: column;
	}
	b {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: clamp(30px, 3vw, 42px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1;
	}
	span {
		margin-top: auto;
		padding-top: 22px;
		color: var(--mute);
		font-size: 15px;
		line-height: 1.35;
	}
	/* Crops of the photos (the design's .th1–.th3) */
	.crop {
		display: block;
		flex: none;
		width: clamp(78px, 8vw, 112px);
		aspect-ratio: 3/2;
		border-radius: 10px;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.c1 {
		background-image: var(--img-room);
		background-size: 330%;
		background-position: 8% 60%;
	}
	.c2 {
		background-image: var(--img-meter);
		background-size: 380%;
		background-position: 82% 78%;
	}
	.c3 {
		background-image: var(--img-room);
		background-size: 260%;
		background-position: 92% 72%;
	}
	@media (max-width: 900px) {
		.sg {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 620px) {
		.st {
			min-height: 120px;
		}
	}
</style>

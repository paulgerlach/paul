<!-- "Alles aus einer Hand." (.pv-all): six advantages with icons. -->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { benefits } from "../content";
</script>

<section class="all" aria-labelledby="pv-ah">
	<div class="wrap">
		<Head id="pv-ah" eyebrow={benefits.eyebrow} lines={benefits.h2} center />
		<div class="ag">
			{#each benefits.items as item (item.title)}
				<article class="rv">
					<span class="ic"><Icon name={item.icon} /></span>
					<div>
						<h3>{item.title}</h3>
						<p>{item.text}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.all {
		padding: 120px 0;
	}
	.ag {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		margin-top: 56px;
	}
	article {
		display: flex;
		gap: 22px;
		align-items: flex-start;
		background: var(--card);
		border-radius: 18px;
		padding: 24px;
		transition:
			background 0.3s,
			transform 0.3s;
	}
	article:hover {
		background: var(--card2);
		transform: translateY(-2px);
	}
	.ic {
		width: 52px;
		height: 52px;
		border-radius: 12px;
		background: rgba(138, 214, 143, 0.12);
		color: var(--accent);
		display: grid;
		place-items: center;
		flex: none;
		transition:
			background 0.3s,
			color 0.3s;
	}
	article:hover .ic {
		background: var(--accent);
		color: var(--ink);
	}
	.ic :global(svg) {
		width: 22px;
		height: 22px;
	}
	/* `.ag h3`: beats the landing reset of heading margins and letter-spacing. */
	.ag h3 {
		font-size: 18px;
		font-weight: 500;
		letter-spacing: -0.01em;
	}
	p {
		color: var(--mute);
		font-size: 15px;
		line-height: 1.5;
		margin-top: 6px;
	}
	@media (max-width: 900px) {
		.ag {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		article:hover {
			transform: none;
		}
	}
</style>

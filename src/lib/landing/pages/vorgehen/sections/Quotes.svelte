<!-- Three customer quotes (the design's plain cards, no badge), from the shared testimonial data. -->
<script lang="ts">
	import { testimonial } from "$lib/landing/data/testimonials";
	import Head from "../components/Head.svelte";
	import { quotes } from "../content";

	const items = quotes.keys.map(testimonial);
</script>

<!-- Copy and roles need sign-off: see the go-live gate, plan §4.4. -->
<section class="blk" aria-labelledby="vg-quotes-h">
	<div class="wrap">
		<Head id="vg-quotes-h" eyebrow={quotes.eyebrow} title={quotes.h2} center />
		<ul>
			{#each items as item (item.key)}
				<li class="rv">
					<figure>
						<blockquote>{item.quote}</blockquote>
						<figcaption>
							<span class="av" aria-hidden="true">{item.initials}</span>
							<span><b>{item.name}</b><small>{item.role}</small></span>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.blk {
		padding-top: clamp(72px, 9vw, 128px);
	}
	.wrap {
		max-width: 1280px;
	}
	ul {
		list-style: none;
		margin: 48px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	li {
		display: flex;
	}
	li:nth-child(2) {
		transform: translateY(28px);
	}
	figure {
		flex: 1;
		margin: 0;
		background: var(--soft);
		border-radius: 18px;
		padding: 26px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24px;
	}
	blockquote {
		margin: 0;
		font-size: 16.5px;
		line-height: 1.55;
	}
	figcaption {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.av {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-size: 12px;
		font-weight: 600;
		flex: none;
	}
	b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	@media (max-width: 980px) {
		ul {
			grid-template-columns: minmax(0, 1fr);
		}
		li:nth-child(2) {
			transform: none;
		}
	}
</style>

<!-- "Mehr als Ablesung.": six feature cards; a card links only where its page exists. -->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { features } from "../content";
</script>

<section class="blk" aria-labelledby="vg-features-h">
	<div class="wrap">
		<Head
			id="vg-features-h"
			eyebrow={features.eyebrow}
			title={features.h2}
			center
		/>
		<ul>
			{#each features.items as item (item.title)}
				<li class="rv">
					<svelte:element
						this={item.href ? "a" : "div"}
						class={["card", item.href && "link"]}
						href={item.href}
					>
						<span class="ic"><Icon name={item.icon} /></span>
						<div>
							<h3>{item.title}</h3>
							<p>{item.text}</p>
						</div>
					</svelte:element>
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
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}
	li {
		display: flex;
	}
	.card {
		flex: 1;
		display: flex;
		gap: 18px;
		align-items: flex-start;
		background: var(--soft);
		border-radius: 18px;
		padding: 24px;
		color: var(--ink);
		text-decoration: none;
		transition:
			background 0.25s,
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.link:hover {
		background: var(--soft2);
		transform: translateY(-2px);
	}
	.ic {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: #fff;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 22px;
		height: 22px;
	}
	/* More specific than the landing heading reset (the design's <b>). */
	.card h3 {
		font-size: 17px;
		font-weight: 500;
		letter-spacing: normal;
		line-height: 1.5;
	}
	p {
		font-size: 15px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 6px;
	}
	@media (max-width: 980px) {
		ul {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.link:hover {
			transform: none;
		}
	}
</style>

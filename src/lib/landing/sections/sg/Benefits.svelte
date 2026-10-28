<!-- "Was Sie mit Heidi bekommen." (.sg-get): four cards with an icon, the first one dark. -->
<script lang="ts">
	import Head from "./Head.svelte";
	import Icon from "./Icon.svelte";
	import type { Benefits } from "./types";

	let { benefits }: { benefits: Benefits } = $props();
</script>

<section class="pg-sec" aria-labelledby="sg-g-h">
	<div class="wrap">
		<Head id="sg-g-h" pill={benefits.pill} heading={benefits.h2} />
		<div class="get">
			{#each benefits.items as item (item.title)}
				<article class={["rv", item.dark && "dark"]}>
					<span class="gi"><Icon name={item.icon} /></span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.get {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	article {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px 24px;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	article:hover {
		transform: translateY(-3px);
		box-shadow: 0 20px 40px -28px rgba(30, 50, 45, 0.35);
	}
	article.dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.gi {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
	}
	.gi :global(svg) {
		width: 19px;
		height: 19px;
	}
	.dark .gi {
		background: var(--accent);
		border-color: var(--accent);
	}
	/* `.get h3`: beats the landing reset of heading margins. */
	.get h3 {
		font-size: 19px;
		font-weight: 600;
		margin-top: 22px;
		letter-spacing: -0.01em;
	}
	p {
		font-size: 15px;
		color: var(--muted);
		margin-top: 8px;
		line-height: 1.5;
	}
	.dark p {
		color: rgba(255, 255, 255, 0.7);
	}
	@media (max-width: 1040px) {
		.get {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.get {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		article:hover {
			transform: none;
		}
	}
</style>

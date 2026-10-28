<!-- "So, wie sie bei Ihnen liegen. Auch als Scan." (.pg-sec.alt, .pc-docs): the six document types. -->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { documents } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="doc-h">
	<div class="wrap">
		<Head
			id="doc-h"
			pill={documents.pill}
			symbol="clipboard"
			heading={documents.heading}
			center
		/>
		<ul class="docs">
			{#each documents.items as item (item.title)}
				<li class="rv">
					<span class="dt"><Icon name={item.icon} /></span>
					<b>{item.title}</b>
					<small>{item.text}</small>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.docs {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin: 44px 0 0;
	}
	.docs li {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 22px;
		transition: transform 0.3s;
	}
	.dt {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #eef4ef;
		color: #2f7a3c;
		display: grid;
		place-items: center;
		transition: transform 0.3s;
	}
	.docs li:hover .dt {
		transform: rotate(-6deg) scale(1.06);
	}
	.dt :global(svg) {
		width: 20px;
		height: 20px;
	}
	b {
		display: block;
		font-size: 16.5px;
		font-weight: 600;
		margin-top: 14px;
	}
	small {
		display: block;
		color: var(--muted);
		font-size: 14px;
		margin-top: 4px;
		line-height: 1.45;
	}
	@media (max-width: 980px) {
		.docs {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.docs li:hover .dt {
			transform: none;
		}
	}
</style>

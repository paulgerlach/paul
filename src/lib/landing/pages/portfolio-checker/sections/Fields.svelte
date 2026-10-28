<!-- "Die Daten, die Sie sonst zusammensuchen." (.pg-sec.alt, .pc-fx): the eight extracted fields. -->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { fields } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="ex-h">
	<div class="wrap">
		<Head
			id="ex-h"
			pill={fields.pill}
			symbol="doc"
			heading={fields.heading}
			center
		/>
		<ul class="fx">
			{#each fields.items as item (item.title)}
				<li class="rv">
					<span class="xi"><Icon name={item.icon} /></span>
					<b>{item.title}</b>
					<small>{item.text}</small>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.fx {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
		margin: 44px 0 0;
	}
	.fx li {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 18px;
	}
	.xi {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: #eef4ef;
		color: #2f7a3c;
		display: grid;
		place-items: center;
	}
	.xi :global(svg) {
		width: 17px;
		height: 17px;
	}
	b {
		display: block;
		font-size: 15px;
		font-weight: 600;
		margin-top: 12px;
	}
	small {
		display: block;
		font-size: 13px;
		color: var(--muted);
		margin-top: 3px;
	}
	@media (max-width: 980px) {
		.fx {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.fx {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

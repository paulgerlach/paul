<!--
  "Heidi in Ihrer Stadt" (the design's `.rf-cities`): every city page and
  the Germany hub, with a search that hides the tiles whose name doesn't
  match (the pure `search.ts`) and says so when none is left. Every tile is
  server-rendered; without JS the search is hidden.
-->
<script lang="ts">
	import { CITIES } from "$lib/landing/pages/messdienstanbieter-city/cities";
	import { cityRoute } from "$lib/routes";
	import Icon from "../components/Icon.svelte";
	import { cities } from "../content";
	import { matchesCity } from "../search";

	const tiles = [
		...CITIES.map((c) => ({
			name: c.name,
			href: cityRoute(c.slug),
			isNew: "isNew" in c && c.isNew,
			all: false,
		})),
		{ name: cities.all.text, href: cities.all.href, isNew: false, all: true },
	];

	let query = $state("");
	const shown = $derived(tiles.map((t) => matchesCity(t.name, query)));
	const none = $derived(!shown.includes(true));
</script>

<section class="pg-sec alt" aria-labelledby="ct-h">
	<div class="wrap">
		<div class="top">
			<div class="head">
				<span class="pill rv"><Icon name="globe" />{cities.pill}</span>
				<h2 class="h2 rv" id="ct-h">
					{cities.h2} <span>{cities.h2Accent}</span>
				</h2>
			</div>
			<label class="search rv"
				><Icon name="search" /><input
					type="search"
					placeholder={cities.search}
					autocomplete="off"
					aria-label={cities.search}
					bind:value={query}
				/></label
			>
		</div>
		<div class="cities rv">
			{#each tiles as tile, k (tile.href)}
				<a
					class={["city", tile.all && "all"]}
					href={tile.href}
					hidden={!shown[k]}
					><span
						>{tile.name}{#if tile.isNew}<em>{cities.newBadge}</em>{/if}</span
					><span class="ar" aria-hidden="true">→</span></a
				>
			{/each}
		</div>
		<div role="status">
			{#if none}
				<p class="none">
					{cities.none}
					<a href={cities.noneLink.href}>{cities.noneLink.text}</a>.
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		flex-wrap: wrap;
	}
	.search {
		display: flex;
		align-items: center;
		gap: 10px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 0 14px;
		min-width: 260px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.search:focus-within {
		border-color: var(--ink);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	.search :global(svg) {
		width: 17px;
		height: 17px;
		color: var(--faint);
		flex: none;
	}
	.search input {
		border: 0;
		outline: none;
		font: inherit;
		font-size: 15px;
		padding: 12px 0;
		background: none;
		width: 100%;
		color: var(--ink);
	}
	.cities {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 10px;
		margin-top: 36px;
	}
	.city {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 14px 16px;
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		transition:
			border-color 0.2s,
			transform 0.2s,
			background 0.2s;
	}
	.city:hover {
		border-color: var(--ink);
		transform: translateY(-2px);
	}
	.ar {
		color: var(--faint);
		transition:
			transform 0.2s,
			color 0.2s;
	}
	.city:hover .ar {
		transform: translateX(3px);
		color: var(--ink);
	}
	.city.all {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
		grid-column: span 2;
	}
	.city.all .ar {
		color: var(--accent);
	}
	em {
		font-style: normal;
		font-size: 10.5px;
		font-weight: 700;
		background: #e3f3e4;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 2px 7px;
		margin-left: 6px;
	}
	.none {
		margin-top: 16px;
		font-size: 14.5px;
		color: var(--muted);
	}
	.none a {
		color: var(--ok);
		font-weight: 600;
	}

	@media (max-width: 1040px) {
		.cities {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.cities {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.search {
			min-width: 0;
			width: 100%;
		}
	}
	@media (scripting: none) {
		.search {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.city:hover,
		.city:hover .ar {
			transform: none;
		}
	}
</style>

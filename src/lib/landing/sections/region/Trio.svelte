<!-- Three click demos: billing, the one signature, and the tenants' uVI access. -->
<script lang="ts">
	import TrioBilling from "./TrioBilling.svelte";
	import TrioSignature from "./TrioSignature.svelte";
	import TrioTenantAccess from "./TrioTenantAccess.svelte";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();

	const titles = [
		"Heizkostenabrechnung auf Knopfdruck",
		"Eine Unterschrift. Wir kümmern uns um den Rest.",
		"uVI-Zugang für Mieter",
	];
</script>

<section class="trio wrap" aria-labelledby="trio-h">
	<h2 id="trio-h" class="sr-only">Heidi im Überblick</h2>
	<div class="trio-grid">
		{#each titles as title, i (title)}
			<div>
				{#if i === 0}
					<TrioBilling />
				{:else if i === 1}
					<TrioSignature />
				{:else}
					<TrioTenantAccess example={content.example} />
				{/if}
				<h3>{title}</h3>
				<p>{content.trio[i]}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.trio {
		padding-block: 0 110px;
	}
	.trio-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: 24px;
		row-gap: 0;
	}
	.trio-grid > div {
		display: grid;
		grid-row: span 3;
		grid-template-rows: subgrid;
		align-content: start;
	}
	h3 {
		font-size: 19px;
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-top: 22px;
	}
	p {
		color: var(--muted);
		font-size: 16px;
		line-height: 1.45;
		margin-top: 8px;
		max-width: 40ch;
	}

	@media (max-width: 980px) {
		.trio-grid {
			grid-template-columns: 1fr;
			row-gap: 40px;
		}
		.trio-grid > div {
			display: block;
		}
	}
</style>

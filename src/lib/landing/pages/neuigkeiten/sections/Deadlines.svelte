<!--
  "Gesetz & Fristen" (.pg-sec.alt): the shared head and four rows (.bl-rg),
  each with a green icon tile, a title, a text and the arrow. A row is a link
  only while its page exists (plan README, Links).
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { deadlines, type DeadlineIcon } from "../content";
</script>

{#snippet calendar()}
	<rect x="3" y="4" width="14" height="13" rx="2" /><path
		d="M3 8h14M7 2.5v3M13 2.5v3"
	/>
{/snippet}

{#snippet icon(name: DeadlineIcon)}
	<StrokeIcon>
		{#if name === "wifi"}
			<path
				d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
			/>
			<circle cx="10" cy="16" r=".8" fill="currentColor" />
		{:else if name === "doc"}
			<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
				d="M12 2.5V6h3.5M8 10h5M8 13h5"
			/>
		{:else if name === "calc"}
			<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
				d="M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01"
			/>
		{:else}
			<circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" />
		{/if}
	</StrokeIcon>
{/snippet}

<section class="pg-sec alt" aria-labelledby="nw-rg-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="nw-rg-h"
				eyebrow={deadlines.pill}
				icon={calendar}
				heading={deadlines.h2}
			/>
		</div>
		<div class="rows">
			{#each deadlines.rows as row (row.title)}
				<svelte:element
					this={row.href ? "a" : "div"}
					class={["row rv", row.href && "link"]}
					href={row.href}
				>
					<span class="ri">{@render icon(row.icon)}</span>
					<span><b>{row.title}</b><small>{row.text}</small></span>
					{#if row.href}<span class="ar" aria-hidden="true">→</span>{/if}
				</svelte:element>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
	}
	/* .dm-h2's 18 px above the H2, lost to the landing heading reset at equal
	   specificity (as on /plattform/schnittstellen). */
	.head :global(h2) {
		margin-top: 18px;
	}
	.rows {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin-top: 44px;
	}
	.row {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr) auto;
		gap: 16px;
		align-items: center;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 16px 20px;
		color: var(--ink);
		text-decoration: none;
		transition:
			border-color 0.25s,
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.link:hover {
		border-color: #bfe3c2;
		transform: translateX(3px);
	}
	b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	small {
		display: block;
		font-size: 14px;
		color: var(--muted);
		margin-top: 2px;
	}
	.ar {
		color: var(--ok);
	}
	.ri {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #e6f5e7;
		color: #245f33;
		display: grid;
		place-items: center;
	}
	.ri :global(svg) {
		width: 20px;
		height: 20px;
	}
	@media (prefers-reduced-motion: reduce) {
		.link:hover {
			transform: none;
		}
	}
	@media (max-width: 720px) {
		.rows {
			grid-template-columns: 1fr;
		}
	}
</style>

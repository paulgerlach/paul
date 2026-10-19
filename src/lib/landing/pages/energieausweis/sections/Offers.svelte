<!--
  "Vier Wege zum Energieausweis." (.pg-sec.alt#produkte): the head, the
  filter (the design's .pg-seg, here a radiogroup) and four offer cards.
  The filter dims the other type's cards and rings its own; the check's
  "Passende Angebote ansehen" sets it too (the page holds the value).
  Without JS the filter is hidden and all four show.
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import { OFFERS_ID, type OfferFilter, offers } from "../content";

	let { filter = $bindable() }: { filter: OfferFilter } = $props();
</script>

<section class="pg-sec alt of" id={OFFERS_ID} aria-labelledby="ea-pr-h">
	<div class="wrap">
		<div class="top">
			<div class="head">
				<SectionHead id="ea-pr-h" eyebrow={offers.pill} heading={offers.h2}>
					{#snippet icon()}
						<path d="M14.5 5.5A5.5 5.5 0 1 0 14.5 14.5M3.5 8.5h7M3.5 11.5h7" />
					{/snippet}
				</SectionHead>
			</div>
			<div class="rv filter">
				<Segmented
					options={offers.filter.options}
					bind:value={filter}
					label={offers.filter.label}
				/>
			</div>
		</div>
		<div class="grid">
			{#each offers.items as offer (offer.title)}
				<article
					class={[
						"p rv",
						offer.recommended && "rc",
						filter !== "all" && offer.type !== filter && "off",
						filter !== "all" && offer.type === filter && "hl",
					]}
				>
					<div class="ph">
						<span class="pt">{offer.tier}</span>
						{#if offer.recommended}
							<span class="rec">{offers.recommended}</span>
						{/if}
					</div>
					<h3>{offer.title}</h3>
					<ul>
						{#each offer.points as point (point.lead)}
							<li><Check /><span><b>{point.lead}</b> {point.text}</span></li>
						{/each}
					</ul>
					<div class="price">
						<small>{offers.from}</small>
						<b>{offer.price}</b>
						<em>{offers.vat}</em>
					</div>
					<a
						class={["bk", offer.recommended && "inv"]}
						href={offers.cta.href}
						onclick={offers.cta.href === START_HREF ? focusSignup : undefined}
						>{offers.cta.text} <span class="ar" aria-hidden="true">→</span></a
					>
				</article>
			{/each}
		</div>
		<p class="src rv">{offers.note}</p>
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
	.head {
		max-width: 760px;
	}
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.of :global(h2) {
		margin-top: 18px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		margin-top: 40px;
		align-items: stretch;
	}
	.p {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 22px;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.3s,
			box-shadow 0.3s,
			opacity 0.3s,
			filter 0.3s;
	}
	.p:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
	}
	.p.rc {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.p.off {
		opacity: 0.35;
		filter: grayscale(0.6);
	}
	.p.hl {
		box-shadow:
			0 0 0 2px var(--accent-deep),
			0 18px 40px -26px rgba(30, 50, 45, 0.35);
	}
	.ph {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		min-height: 26px;
	}
	.pt {
		font-size: 12px;
		font-weight: 600;
		color: var(--muted);
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 999px;
		padding: 3px 10px;
	}
	.rc .pt {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.14);
		color: rgba(255, 255, 255, 0.75);
	}
	.rec {
		font-size: 12px;
		font-weight: 700;
		background: var(--accent);
		color: var(--ink);
		border-radius: 999px;
		padding: 3px 10px;
	}
	/* `.p h3`: beats the landing reset of heading margins. */
	.p h3 {
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 18px;
		line-height: 1.2;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}
	li {
		display: flex;
		gap: 10px;
		font-size: 14px;
		line-height: 1.45;
		color: var(--muted);
	}
	li b {
		color: var(--ink);
		font-weight: 600;
	}
	.rc li {
		color: rgba(255, 255, 255, 0.7);
	}
	.rc li b {
		color: #fff;
	}
	li :global(svg) {
		width: 12px;
		height: 10px;
		flex: none;
		margin-top: 5px;
	}
	.rc li :global(svg path) {
		stroke: var(--accent);
	}
	.price {
		display: flex;
		align-items: baseline;
		gap: 6px;
		margin-top: 22px;
		padding-top: 18px;
		border-top: 1px solid var(--hair);
	}
	.rc .price {
		border-color: rgba(255, 255, 255, 0.12);
	}
	.price small {
		font-size: 13px;
		color: var(--muted);
	}
	.price b {
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}
	.rc .price b {
		color: var(--accent);
	}
	.price em {
		font-style: normal;
		font-size: 12px;
		color: var(--faint);
	}
	/* .ea-p .bk-next */
	.bk {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		margin-top: 16px;
		background: var(--ink);
		color: #fff;
		font-size: 14px;
		font-weight: 600;
		border-radius: 11px;
		padding: 12px 14px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #2a443d;
	}
	.bk:active {
		transform: scale(0.98);
	}
	/* .bk-next.inv (a flex item of the card, so it still spans it) */
	.bk.inv {
		background: var(--accent);
		color: var(--ink);
	}
	.bk.inv:hover {
		background: #fff;
	}
	.ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
	/* .pg-src */
	.src {
		margin-top: 18px;
		font-size: 13px;
		color: var(--faint);
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (scripting: none) {
		.filter {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.p:hover {
			transform: none;
		}
	}
</style>

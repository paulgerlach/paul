<!--
  One offer document as a scrollable preview (the design's `docHtml`, laid
  out like the Heidi offer template), A4 pages sized in container units:
  "Gerätemiete und Service" on four pages, "Heizkostenabrechnung" on three.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import HeidiLogo from "$lib/landing/components/icons/HeidiLogo.svelte";
	import { FEATURE_PHOTOS, PHOTOS } from "../../photos";
	import { OFFER_COMPANY } from "../data";
	import {
		amount,
		n2,
		offerFileName,
		type Offer,
		type OfferPart,
	} from "../model";
	import { offerDoc, type OfferTable } from "../offerDoc";
	import { getSelfService } from "../wizard.svelte";

	let { offer, part }: { offer: Offer; part: OfferPart } = $props();
	const w = getSelfService();
	const d = $derived(offerDoc(w.s, offer, part));
	const p = $derived(d.p);
	/** The billing's own document. */
	const abr = $derived(d.abr);
	const dates = $derived(d.dates);
	const billing = $derived(d.billing);
	const property = $derived(d.property);
	const pages = $derived(d.pages);
</script>

{#snippet head(full: boolean)}
	<div class="dp-logo"><HeidiLogo /></div>
	{#if full}
		<div class="dp-ad">
			<div>
				{#each billing as line, i (i)}{#if i}<br />{/if}{line}{/each}
			</div>
			<div class="r">
				{#each OFFER_COMPANY.sender as line (line)}{line}<br
					/>{/each}Angebotsnummer: {part.nr}
			</div>
		</div>
		<div class="dp-meta">
			<div>
				<b>Liegenschaftsadresse</b>{#each property as line, i (i)}{#if i}<br
						/>{/if}{line}{/each}
			</div>
			<div><b>Objekt ID</b>{offer.id}</div>
			<div class="r"><b>Angebotsdatum</b>{dates.date}</div>
		</div>
	{/if}
{/snippet}

{#snippet table(x: OfferTable)}
	<table class="dp-t">
		<thead>
			<tr>
				{#each x.cols as [h, r] (h)}<th class={[r && "r"]}>{h}</th>{/each}
			</tr>
		</thead>
		<tbody>
			{#if x.first}<tr><td colspan={x.cols.length}>{x.first}</td></tr>{/if}
			{#each x.rows as cells, i (i)}
				<tr>
					{#each cells as v, j (j)}<td class={[x.cols[j][1] && "r"]}>{v}</td
						>{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="n"
				><td colspan={x.cols.length - 1}>{x.labelNet}</td><td class="r"
					>{amount(x.totalNet)}</td
				></tr
			>
			<tr class="b"
				><td colspan={x.cols.length - 1}>{x.labelGross}</td><td class="r"
					>{amount(x.totalGross)}</td
				></tr
			>
		</tfoot>
	</table>
{/snippet}

{#snippet foot(n: number)}
	<div class="dp-ft">
		{#each OFFER_COMPANY.footer as col, i (i)}
			<div>
				{#each col as line, j (j)}{#if j}<br />{/if}{line}{/each}
			</div>
		{/each}
	</div>
	<span class="dp-pn">Seite {n} von {pages}</span>
{/snippet}

{#snippet terms()}
	{#each d.terms as t (t)}<p class="dp-p dp-sm">{t}</p>{/each}
{/snippet}

<div class="dp-view">
	<div class="dp-doc"><b>Dokument {part.of}</b>{part.title}</div>
	<div class="dp-bar">
		<span>{offerFileName(w.s, offer, part.title)}</span><span
			>{pages} Seiten</span
		>
	</div>
	<!-- A scrolling region needs focus to scroll by keyboard. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="dp-scroll"
		tabindex="0"
		role="region"
		aria-label="Angebot, scrollbar"
	>
		<section class="dp-pg">
			<div class="dp-in">
				{@render head(true)}
				<h2 class="dp-h">{d.heading}</h2>
				<p class="dp-p">
					{d.intro[0]}<b>{d.intro[1]}</b>{d.intro[2]}
				</p>
				{#each d.features as f (f.h)}
					<div class="dp-f">
						<div class="dp-fi">
							<Image
								src={FEATURE_PHOTOS[f.img]}
								alt=""
								width={0}
								height={0}
								sizes="160px"
							/>
						</div>
						<div>
							<h3>{f.h}</h3>
							<p>{f.p}</p>
							<ul>
								{#each f.b as b (b)}<li>{b}</li>{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
			{@render foot(1)}
		</section>
		<section class="dp-pg">
			<div class="dp-in">
				{@render head(true)}
				<h2 class="dp-h dp-h2">{d.overview}</h2>
				{#if !abr}
					<div class="dp-box l">
						<b>{d.onceLabel}</b><b>{n2(p.sO)} €</b><small>{d.exVat}</small>
					</div>
				{/if}
				<div class="dp-box d">
					<b>{d.yearLabel}</b><b>{n2(p.year)} €</b><small>{d.exVat}</small>
				</div>
				<div class="dp-sub">
					<span>{d.serviceLabel}</span><b>{n2(p.sS)} €</b><small
						>{d.exVat}</small
					>
				</div>
				{#if !abr}
					<div class="dp-sub">
						<span>{d.deviceLabel}</span><b>{d.deviceValue}</b><small
							>{d.exVat}</small
						>
					</div>
				{/if}
				<p class="dp-p dp-mu">{d.separate}</p>
				{#if d.requested}
					<p class="dp-p dp-mu">{d.requested}</p>
				{/if}
				<p class="dp-p">
					{#each d.closing as line, i (i)}{#if i}<br />{/if}{line}{/each}
				</p>
				<p class="dp-p dp-gr">{d.greeting}</p>
				<Image
					class="dp-sig"
					src={PHOTOS.signature}
					alt=""
					width={520}
					height={377}
					sizes="120px"
				/>
				<p class="dp-p">{OFFER_COMPANY.signatory}</p>
			</div>
			{@render foot(2)}
		</section>
		<section class="dp-pg">
			<div class="dp-in">
				{@render head(false)}
				<h2 class="dp-h3">{d.yearly.title}</h2>
				<p class="dp-k">{d.yearly.kicker}</p>
				{@render table(d.yearly)}
				{#if abr}
					{@render terms()}
				{:else}
					<h2 class="dp-h3">{d.rental.title}</h2>
					<p class="dp-k">{d.rental.kicker}</p>
					{@render table(d.rental)}
				{/if}
			</div>
			{@render foot(3)}
		</section>
		{#if !abr}
			<section class="dp-pg">
				<div class="dp-in">
					{@render head(false)}
					<h2 class="dp-h3">{d.once.title}</h2>
					<p class="dp-k">{d.once.kicker}</p>
					{@render table(d.once)}
					{@render terms()}
					{#if d.selfMounted}
						<p class="dp-p dp-sm">{d.selfMounted}</p>
					{/if}
					{#if d.checks.length}
						<p class="dp-p dp-sm"><b>{d.checksIntro}</b></p>
						<ul class="dp-ul">
							{#each d.checks as x, i (i)}<li>{x}</li>{/each}
						</ul>
					{/if}
				</div>
				{@render foot(4)}
			</section>
		{/if}
	</div>
</div>

<style>
	/* The offer preview (#ss-css "Angebotsvorschau, alle Seiten") */
	.dp-view {
		margin-top: 18px;
		border: 1px solid var(--hair);
		border-radius: 16px;
		overflow: hidden;
		background: #e8ecea;
	}
	:global(.dp-view) + .dp-view {
		margin-top: 22px;
	}
	.dp-doc {
		display: flex;
		gap: 10px;
		align-items: baseline;
		padding: 12px 16px 0;
		font-size: 13.5px;
		color: var(--muted);
	}
	.dp-doc b {
		color: var(--ink);
		font-weight: 600;
	}
	.dp-bar {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 16px;
		background: #fff;
		border-bottom: 1px solid var(--hair);
		font-size: 12.5px;
		color: var(--muted);
	}
	.dp-bar span:last-child {
		white-space: nowrap;
	}
	.dp-bar span:first-child {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--ink);
		font-weight: 500;
	}
	.dp-scroll {
		max-height: min(860px, 78vh);
		overflow-y: auto;
		padding: 22px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 20px;
		scroll-behavior: smooth;
		overscroll-behavior: contain;
	}
	.dp-scroll:focus-visible {
		outline: 2px solid #8ad68f;
		outline-offset: -2px;
	}
	.dp-pg {
		min-width: 0;
		position: relative;
		background: #fff;
		aspect-ratio: 210/297;
		container-type: inline-size;
		box-shadow: 0 12px 30px -18px rgba(30, 50, 45, 0.45);
		color: #2a2f2d;
		line-height: 1.55;
	}
	.dp-in {
		padding: 6.5cqw 8.5cqw 17cqw;
		font-size: 1.55cqw;
	}
	.dp-logo {
		display: flex;
		justify-content: flex-end;
		height: 3.6cqw;
		margin-bottom: 6cqw;
		color: #2f4f47;
	}
	.dp-logo :global(svg) {
		height: 100%;
		width: auto;
	}
	.dp-ad {
		display: flex;
		justify-content: space-between;
		gap: 4cqw;
		font-size: 1.4cqw;
		line-height: 1.75;
	}
	.dp-ad .r {
		text-align: right;
	}
	.dp-meta {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr;
		gap: 3cqw;
		margin-top: 4.5cqw;
		font-size: 1.4cqw;
		line-height: 1.75;
	}
	.dp-meta b {
		display: block;
		font-weight: 600;
	}
	.dp-meta .r {
		text-align: right;
	}
	/* `.dp-pg h2.dp-h`: beats the landing reset of heading margins. */
	.dp-pg h2.dp-h {
		font-size: 2.9cqw;
		font-weight: 600;
		color: #1e322d;
		letter-spacing: -0.01em;
		margin: 6cqw 0 2.4cqw;
	}
	.dp-pg h2.dp-h2 {
		margin-top: 10cqw;
		margin-bottom: 4cqw;
	}
	.dp-pg h2.dp-h3 {
		font-size: 2.3cqw;
		font-weight: 600;
		color: #1e322d;
		letter-spacing: -0.02em;
		margin: 5cqw 0 0;
	}
	.dp-pg h2.dp-h3:first-of-type {
		margin-top: 7cqw;
	}
	.dp-k {
		font-size: 1.9cqw;
		font-weight: 600;
		color: #7fa088;
		margin: 1.4cqw 0 2cqw;
	}
	.dp-p {
		margin: 2.4cqw 0 0;
		font-size: 1.45cqw;
	}
	.dp-mu {
		color: var(--muted);
	}
	.dp-sm {
		font-size: 1.35cqw;
	}
	.dp-gr {
		margin-top: 5cqw;
	}
	.dp-in :global(.dp-sig) {
		display: block;
		width: 11cqw;
		height: auto;
		margin: 1.5cqw 0 0.5cqw;
	}
	.dp-f {
		display: grid;
		grid-template-columns: 24cqw 1fr;
		gap: 4.5cqw;
		margin-top: 4cqw;
		align-items: start;
	}
	.dp-fi {
		aspect-ratio: 1;
		background: #f1f2f1;
		border-radius: 1.6cqw;
		display: grid;
		place-items: center;
		padding: 2.2cqw;
	}
	.dp-fi :global(img) {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.dp-f h3 {
		font-size: 1.9cqw;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #1e322d;
		margin: 0 0 0.6cqw;
	}
	.dp-f p {
		margin: 0;
		font-size: 1.4cqw;
	}
	/* Tailwind's preflight drops the list markers the design keeps. */
	.dp-f ul {
		margin: 1.6cqw 0 0;
		padding-left: 5cqw;
		font-size: 1.4cqw;
		list-style: disc;
	}
	.dp-f li {
		margin: 0.2cqw 0;
	}
	.dp-box {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.4cqw 2cqw;
		border-radius: 1cqw;
		padding: 2.2cqw 3cqw;
		margin-bottom: 0.8cqw;
		font-size: 1.6cqw;
	}
	.dp-box b:nth-child(2) {
		text-align: right;
	}
	.dp-box small {
		grid-column: 2;
		text-align: right;
		font-size: 1.15cqw;
		opacity: 0.85;
	}
	.dp-box.l {
		background: #dce8e0;
		color: #1e322d;
	}
	.dp-box.d {
		background: #7fa088;
		color: #fff;
	}
	.dp-sub {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.3cqw 2cqw;
		padding: 2cqw 3cqw 2cqw 7cqw;
		border-bottom: 1px solid #eaedeb;
		font-size: 1.4cqw;
	}
	.dp-sub b {
		text-align: right;
	}
	.dp-sub small {
		grid-column: 2;
		text-align: right;
		font-size: 1.15cqw;
		color: var(--muted);
	}
	.dp-sub + .dp-sub {
		border-bottom: 0;
	}
	.dp-t {
		width: 100%;
		border-collapse: collapse;
		font-size: 1.3cqw;
	}
	.dp-t th {
		background: #dce8e0;
		text-align: left;
		font-weight: 600;
		padding: 1.6cqw 1.2cqw;
	}
	.dp-t td {
		padding: 1.8cqw 1.2cqw;
		border-bottom: 1px solid #eaedeb;
		vertical-align: top;
	}
	.dp-t .r {
		text-align: right;
	}
	.dp-t tfoot td {
		font-weight: 600;
		border: 0;
	}
	.dp-t tr.n td {
		background: #dce8e0;
	}
	.dp-t tr.b td {
		background: #7fa088;
		color: #fff;
	}
	.dp-ul {
		margin: 1cqw 0 0;
		padding-left: 4cqw;
		font-size: 1.35cqw;
		list-style: disc;
	}
	.dp-ft {
		position: absolute;
		left: 8.5cqw;
		right: 8.5cqw;
		bottom: 5cqw;
		display: grid;
		grid-template-columns: 1fr 1.15fr 1.5fr 1.6fr;
		gap: 2cqw;
		font-size: 0.95cqw;
		line-height: 1.5;
		color: #3a403e;
	}
	.dp-pn {
		position: absolute;
		right: 8.5cqw;
		bottom: 2cqw;
		font-size: 0.95cqw;
		color: var(--muted);
	}
	@media (max-width: 640px) {
		.dp-scroll {
			padding: 10px;
			gap: 10px;
		}
	}
</style>

<!--
  One offer document as a scrollable preview (the design's `docHtml`, laid
  out like the Heidi offer template), A4 pages sized in container units:
  "Gerätemiete und Service" on four pages, "Heizkostenabrechnung" on three.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import HeidiLogo from "$lib/landing/components/icons/HeidiLogo.svelte";
	import { FEATURE_PHOTOS, PHOTOS } from "../../photos";
	import { features, OFFER_COMPANY, OFFER_TERMS } from "../data";
	import {
		amount,
		billingLines,
		calc,
		gross,
		n2,
		offerDates,
		offerFileName,
		propertyLines,
		scope,
		tech,
		totalPrice,
		unitPrice,
		type Offer,
		type OfferPart,
		type Position,
	} from "../model";
	import { getSelfService } from "../wizard.svelte";

	let { offer, part }: { offer: Offer; part: OfferPart } = $props();
	const w = getSelfService();
	const c = $derived(calc(w.s));
	const p = $derived(part.p);
	/** The billing's own document. */
	const abr = $derived(part.kind === "a");
	const dates = $derived(offerDates(offer));
	const billing = $derived(billingLines(w.s));
	const property = $derived(propertyLines(w.s));
	const pages = $derived(abr ? 3 : 4);
	const services: [string, boolean][] = [
		["Servicedienstleistungen jährlich", false],
		["Mengeneinheit", true],
		["Stück", true],
		["Einzelpreis in €", true],
		["Gesamtpreis in €", true],
	];
	const servicesOnce: [string, boolean][] = [
		["Servicedienstleistungen einmalig", false],
		...services.slice(1),
	];
	const devices: [string, boolean][] = [
		["Gerätetyp", false],
		["Laufzeit", true],
		...services.slice(1),
	];
	const row = (r: Position) => [r.t, r.me, r.n, n2(r.ep), n2(r.n * r.ep)];
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

{#snippet table(
	cols: [string, boolean][],
	rows: (string | number)[][],
	first: string,
	labN: string,
	totN: number | string,
	labB: string,
	totB: number | string,
)}
	<table class="dp-t">
		<thead>
			<tr>
				{#each cols as [h, r] (h)}<th class={[r && "r"]}>{h}</th>{/each}
			</tr>
		</thead>
		<tbody>
			{#if first}<tr><td colspan={cols.length}>{first}</td></tr>{/if}
			{#each rows as cells, i (i)}
				<tr>
					{#each cells as v, j (j)}<td class={[cols[j][1] && "r"]}>{v}</td
						>{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="n"
				><td colspan={cols.length - 1}>{labN}</td><td class="r"
					>{amount(totN)}</td
				></tr
			>
			<tr class="b"
				><td colspan={cols.length - 1}>{labB}</td><td class="r"
					>{amount(totB)}</td
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
	{#each OFFER_TERMS as t (t)}<p class="dp-p dp-sm">{t}</p>{/each}
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
				<h2 class="dp-h">Angebot {part.title}</h2>
				<p class="dp-p">
					Sehr geehrte Damen und Herren, auf den folgenden Seiten finden Sie
					unser Angebot für <b>{property.join(", ")}</b>. Ihr Lieferumfang im
					Überblick:
				</p>
				{#each features(c.self) as f (f.h)}
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
				<h2 class="dp-h dp-h2">Angebotsübersicht zu Ihrer Anfrage</h2>
				{#if !abr}
					<div class="dp-box l">
						<b>Einmalige Servicedienstleistungen</b><b>{n2(p.sO)} €</b><small
							>zzgl. der gesetzlichen MwSt.</small
						>
					</div>
				{/if}
				<div class="dp-box d">
					<b>Gesamtpreis pro Jahr</b><b>{n2(p.year)} €</b><small
						>zzgl. der gesetzlichen MwSt.</small
					>
				</div>
				<div class="dp-sub">
					<span
						>{abr
							? "Heizkostenabrechnung pro Jahr"
							: "Geräteservice pro Jahr"}</span
					><b>{n2(p.sS)} €</b><small>zzgl. der gesetzlichen MwSt.</small>
				</div>
				{#if !abr}
					<div class="dp-sub">
						{#if p.buy}
							<span>Gerätekauf (einmalig)</span><b>auf Anfrage</b>
						{:else}
							<span>Gerätemiete pro Jahr</span><b>{n2(p.sM)} €</b>
						{/if}<small>zzgl. der gesetzlichen MwSt.</small>
					</div>
				{/if}
				<p class="dp-p dp-mu">
					{abr
						? "Die Gerätemiete bieten wir Ihnen in einem separaten Angebot an."
						: "Die Heizkostenabrechnung bieten wir Ihnen in einem separaten Angebot an."}
				</p>
				{#if p.onRequest.length || p.extras.length}
					<p class="dp-p dp-mu">
						Zusätzlich angefragt: {[
							...p.onRequest.map((r) => `${r.n} × ${r.sub}`),
							...p.extras,
						].join(", ")}. Richtwerte netto, den genauen Preis ergänzen wir im
						Angebot.
					</p>
				{/if}
				<p class="dp-p">
					Auf das erste Vertragsjahr entfällt ein Betrag von {n2(p.first)} €. Ab dem
					zweiten Vertragsjahr wird jährlich ein Betrag von {n2(p.year)} € fällig.<br
					/>Das Angebot ist gültig bis einschließlich {dates.valid}. Für
					Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung und freuen
					uns auf die Zusammenarbeit.<br />Alle Preise verstehen sich zzgl. der
					gesetzlichen MwSt.
				</p>
				<p class="dp-p dp-gr">Mit freundlichen Grüßen</p>
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
				<h2 class="dp-h3">Servicedienstleistungen</h2>
				<p class="dp-k">Jährlich</p>
				{@render table(
					services,
					p.svc.map(row),
					`Leistungsumfang: ${scope(w.s).join(", ") || "nach Prüfung"}`,
					"Gesamtpreis Servicedienstleistungen pro Jahr netto",
					p.sS,
					"Gesamtpreis Servicedienstleistungen pro Jahr inkl. 19% MwSt.",
					gross(p.sS),
				)}
				{#if abr}
					{@render terms()}
				{:else}
					<h2 class="dp-h3">{p.buy ? "Gerätekauf" : "Gerätemiete"}</h2>
					<p class="dp-k">
						{p.buy ? "Einmalig, Preis auf Anfrage" : "Jährlich"}
					</p>
					{@render table(
						devices,
						p.rental.map((r) => [
							r.t,
							r.lz || "–",
							r.me,
							r.n,
							unitPrice(r),
							totalPrice(r),
						]),
						tech(w.s)
							? ""
							: "Gerätepositionen ergänzen wir nach Prüfung Ihrer Unterlagen.",
						"Gesamtpreis Gerätemiete pro Jahr netto",
						p.sM,
						"Gesamtpreis Gerätemiete pro Jahr inkl. 19% MwSt.",
						gross(p.sM),
					)}
				{/if}
			</div>
			{@render foot(3)}
		</section>
		{#if !abr}
			<section class="dp-pg">
				<div class="dp-in">
					{@render head(false)}
					<h2 class="dp-h3">Servicedienstleistungen</h2>
					<p class="dp-k">Einmalig</p>
					{@render table(
						servicesOnce,
						p.once.map(row),
						p.once.length
							? ""
							: c.self && tech(w.s)
								? "Montage durch Sie oder Ihren Hausinstallateur, keine Installationspauschale."
								: "Keine einmaligen Leistungen.",
						"Gesamtpreis einmalige Servicedienstleistungen netto",
						p.sO,
						"Gesamtpreis einmalige Servicedienstleistungen inkl. 19% MwSt.",
						gross(p.sO),
					)}
					{@render terms()}
					{#if c.self && tech(w.s)}
						<p class="dp-p dp-sm">
							Die Montage übernehmen Sie oder Ihr Hausinstallateur. Eine
							Installationspauschale fällt nicht an. Einbausätze, Rohr- und
							Sanitärarbeiten sind nicht enthalten.
						</p>
					{/if}
					{#if c.checks.length}
						<p class="dp-p dp-sm">
							<b
								>Grundlage dieses Angebots sind Ihre Angaben im Heidi
								Self-Service. Vor der Lieferung prüfen wir:</b
							>
						</p>
						<ul class="dp-ul">
							{#each c.checks.slice(0, 8) as x, i (i)}<li>{x}</li>{/each}
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

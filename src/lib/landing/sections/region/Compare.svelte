<!--
  "Große haben Größe. Lokale haben Nähe. Heidi hat beides.": Heidi against a
  large and a local meter service, 8 criteria. Each criterion opens a line on
  how Heidi does it; the filter dims the column that isn't compared. Once in
  view, the cells fade in row by row, the score bars fill and the first
  criterion opens. Reduced motion: shown as is, nothing opens by itself.

  The design's dividers and button outlines use `var(--hair)`, which it never
  defines, so they don't render there; they're left out here.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();

	type Value = "y" | "t" | "n";
	const VALUE_TEXT: Record<Value, string> = {
		y: "Ja",
		t: "Je nach Anbieter",
		n: "Nein",
	};
	const COLUMNS = ["Großer Messdienst", "Lokaler Messdienst", "Heidi"];
	/** [large, local]; Heidi is "Ja" everywhere. */
	const rows: { label: string; values: [Value, Value]; detail: string }[] = [
		{
			label: "Wechsel ohne Warten aufs Vertragsende",
			values: ["n", "n"],
			detail:
				"Heidi übernimmt bestehende Zähler und wertet sie sofort aus, egal wie lange der bisherige Vertrag noch läuft.",
		},
		{
			label: "Fernablesbare Funkzähler",
			values: ["y", "t"],
			detail:
				"Heidi installiert fernablesbare Funkzähler, wie sie ab 2027 vorgeschrieben sind.",
		},
		{
			label: "uVI jeden Monat automatisch",
			values: ["y", "t"],
			detail:
				"Ihre Mieter erhalten die Verbrauchsinformation jeden Monat automatisch nach § 6a HeizkostenV.",
		},
		{
			label: "Fester persönlicher Ansprechpartner",
			values: ["t", "y"],
			detail:
				"Ein fester Ansprechpartner, der Ihre Liegenschaften kennt, statt wechselnder Hotline-Kontakte.",
		},
		{
			label: "Monatliche Verbräuche im Dashboard",
			values: ["t", "n"],
			detail:
				"Die Verbräuche aller Objekte monatlich im Heidi Dashboard, Auffälligkeiten auf einen Blick.",
		},
		{
			label: "Abrechnung per Klick nach HKVO",
			values: ["t", "t"],
			detail:
				"Die Heizkostenabrechnung nach HKVO entsteht per Klick, für jede Einheit einzeln.",
		},
		{
			label: "Anbindung an Ihr ERP oder CRM",
			values: ["t", "n"],
			detail:
				"Abrechnungen und Verbrauchsdaten landen direkt in Ihrer Verwaltungssoftware.",
		},
		{
			label: "Montage 14 Tage vorher angekündigt, 1–2 h Zeitfenster",
			values: ["t", "t"],
			detail:
				"Mieter werden 14 Tage vor der Montage informiert. Am Termin gibt es ein Zeitfenster von 1 bis 2 Stunden.",
		},
	];
	const cells = (r: (typeof rows)[number]): Value[] => [...r.values, "y"];
	/** "Sicher erfüllt": the criteria a column meets for sure. */
	const scores = COLUMNS.map(
		(_, c) => rows.filter((r) => cells(r)[c] === "y").length,
	);
	const FILTERS = ["Allen", "Großem Messdienst", "Lokalem Messdienst"];
	const LEGEND: Value[] = ["y", "t", "n"];

	/** The design's "Anbieter im Detail" page doesn't exist yet: no link until it does. */
	const DETAIL_HREF: string | undefined = undefined;

	let open = $state<number>();
	let filter = $state(0);
	/** Set in the browser: the cells wait for the section to come into view. */
	let armed = $state(false);
	let shown = $state(false);
	/** Row-by-row delays of the entrance; dropped afterwards so hovers react at once. */
	let stagger = $state(true);
	let timers: ReturnType<typeof setTimeout>[] = [];

	function start() {
		shown = true;
		if (!armed) return;
		timers.push(setTimeout(() => (open ??= 0), 1500));
		timers.push(setTimeout(() => (stagger = false), 2800));
	}

	$effect(() => () => timers.forEach(clearTimeout));
</script>

{#snippet icon(v: Value)}
	<i>
		<svg viewBox="0 0 20 20" aria-hidden="true">
			{#if v === "y"}
				<path
					d="M5.5 10.5l3 3 6-7"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{:else if v === "t"}
				<path
					d="M6.5 10h7"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
			{:else}
				<path
					d="M7 7l6 6M13 7l-6 6"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
			{/if}
		</svg>
	</i>
{/snippet}

<section
	class={["vc wrap", armed && "armed", shown && "in"]}
	aria-labelledby="vc-h"
	{@attach (el) => {
		armed = !prefersReducedMotion();
		return inView({ threshold: 0.2, once: true, onEnter: start })(el);
	}}
>
	<div class="vc-g">
		<div class={["vc-t", filter && `f${filter}`]}>
			<div class="vc-seg" role="group" aria-label="Vergleichen mit">
				<span>Vergleichen mit</span>
				{#each FILTERS as label, i (label)}
					<button
						type="button"
						class={[filter === i && "on"]}
						aria-pressed={filter === i}
						onclick={() => (filter = i)}>{label}</button
					>
				{/each}
			</div>
			<div class="vc-hd" aria-hidden="true">
				<span></span><span>{COLUMNS[0]}</span><span>{COLUMNS[1]}</span><span
					class="h"><b>Heidi</b></span
				>
			</div>
			{#each rows as row, i (row.label)}
				<div class={["vc-r", open === i && "open"]}>
					<button
						type="button"
						class="vc-l"
						aria-expanded={open === i}
						aria-controls="vc-d{i}"
						onclick={() => (open = open === i ? undefined : i)}
					>
						<span>{row.label}</span><i class="pl" aria-hidden="true"></i>
					</button>
					{#each cells(row) as v, j (j)}
						<span
							class={["vc-c", v, j === 2 && "h"]}
							role="img"
							aria-label="{COLUMNS[j]}: {VALUE_TEXT[v]}"
							style:transition-delay={stagger
								? `${i * 0.09 + j * 0.05}s`
								: null}
						>
							{#if j === 2}
								<i
									style:transition-delay={stagger
										? `${0.35 + i * 0.09}s`
										: null}
									><svg viewBox="0 0 20 20" aria-hidden="true"
										><path
											d="M5.5 10.5l3 3 6-7"
											stroke="currentColor"
											stroke-width="2"
											fill="none"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									></i
								>
							{:else}
								{@render icon(v)}
							{/if}
						</span>
					{/each}
					<div class="vc-d" id="vc-d{i}">
						<div><span class="hb">Bei Heidi</span>{row.detail}</div>
					</div>
				</div>
			{/each}
			<div class="vc-sc">
				<span class="lab">Sicher erfüllt</span>
				{#each scores as score, c (c)}
					<span class={["sb", c === 2 && "h"]} data-c={c + 1}>
						<i><em style:--p={score / rows.length}></em></i>
						<b
							><span class="sr-only">{COLUMNS[c]}: </span>{score} von {rows.length}</b
						>
					</span>
				{/each}
			</div>
			<div class="vc-lg" aria-hidden="true">
				{#each LEGEND as v (v)}
					<span class={v}>{@render icon(v)}{VALUE_TEXT[v]}</span>
				{/each}
			</div>
			<p class="vc-note">
				Allgemeine Einordnung nach üblichem Leistungsumfang. Der konkrete Umfang
				hängt vom jeweiligen Anbieter und Vertrag ab.
			</p>
		</div>
		<div class="vc-side">
			<h2 id="vc-h">Große haben Größe. Lokale haben Nähe. Heidi hat beides.</h2>
			<p>{content.compare.text}</p>
			<div class="vc-ctas">
				<a
					class="p"
					href={DEMO_HREF}
					onclick={DEMO_HREF === START_HREF ? focusSignup : undefined}
					>Wechsel prüfen <span aria-hidden="true">→</span></a
				>
				{#if DETAIL_HREF}<a class="s" href={DETAIL_HREF}>Anbieter im Detail</a
					>{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.vc {
		padding-block: 0 110px;
	}
	.vc-g {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: center;
	}
	.vc-t {
		width: 100%;
	}
	.vc-hd,
	.vc-r {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 1fr));
		gap: 10px;
		align-items: center;
	}
	.vc-hd {
		padding-bottom: 14px;
	}
	.vc-hd span {
		text-align: center;
		font-size: 14.5px;
		font-weight: 600;
		line-height: 1.25;
	}
	.vc-hd span.h {
		color: var(--ink);
	}
	.vc-hd span.h b {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.vc-r {
		position: relative;
		padding: 10px 0;
		border-radius: 12px;
		transition: background 0.25s;
	}
	.vc-r:hover {
		background: #f6f7f6;
	}

	.vc-c {
		height: 54px;
		border-radius: 12px;
		background: #f2f3f2;
		display: grid;
		place-items: center;
	}
	.vc-c i {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: #c9cfcc;
		color: #fff;
	}
	.vc-c i svg {
		width: 14px;
		height: 14px;
	}
	.vc-c.t i {
		background: #dce1de;
		color: #6b7a74;
	}
	.vc-c.y i {
		background: #6b7a74;
	}
	.vc-c.h {
		background: #e4efe6;
	}
	.vc-c.h i {
		background: var(--ink);
		color: var(--accent);
		transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.armed .vc-c {
		opacity: 0;
		transform: scale(0.94);
	}
	.armed .vc-c.h i {
		transform: scale(0);
	}
	.armed.in .vc-c {
		opacity: 1;
		transform: none;
	}
	.armed.in .vc-c.h i {
		transform: scale(1);
	}
	.vc-r:hover .vc-c.h {
		background: #d6ebda;
	}
	.vc .vc-r:hover .vc-c.h i {
		transform: scale(1.12);
	}

	.vc-seg {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		margin-bottom: 22px;
		font-size: 13.5px;
	}
	.vc-seg span {
		color: var(--faint);
		margin-right: 4px;
	}
	.vc-seg button {
		border: 0;
		background: #fff;
		border-radius: 999px;
		padding: 7px 13px;
		font: inherit;
		font-size: 13.5px;
		font-weight: 500;
		color: var(--muted);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.vc-seg button:hover {
		color: var(--ink);
	}
	.vc-seg button.on {
		background: var(--ink);
		color: #fff;
	}

	.vc-l {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		background: none;
		border: 0;
		padding: 0 10px 0 0;
		font: inherit;
		font-size: 15px;
		line-height: 1.35;
		color: var(--ink);
		text-align: left;
		cursor: pointer;
		height: 100%;
	}
	.vc-l .pl {
		flex: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		position: relative;
		transition:
			background 0.2s,
			transform 0.3s;
	}
	.vc-l .pl::before,
	.vc-l .pl::after {
		content: "";
		position: absolute;
		left: 50%;
		top: 50%;
		width: 9px;
		height: 1.6px;
		background: var(--ink);
		transform: translate(-50%, -50%);
		border-radius: 1px;
		transition: transform 0.3s;
	}
	.vc-l .pl::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}
	.vc-r:hover .vc-l .pl {
		background: var(--accent);
	}
	.vc-r.open .vc-l .pl {
		background: var(--ink);
	}
	.vc-r.open .vc-l .pl::before,
	.vc-r.open .vc-l .pl::after {
		background: #fff;
	}
	.vc-r.open .vc-l .pl::after {
		transform: translate(-50%, -50%) rotate(0deg);
	}
	.vc-l:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 6px;
	}

	.vc-d {
		grid-column: 1/-1;
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.vc-d > div {
		overflow: hidden;
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--muted);
		display: flex;
		gap: 10px;
		align-items: baseline;
	}
	.vc-r.open .vc-d {
		grid-template-rows: 1fr;
	}
	.vc-r.open .vc-d > div {
		padding: 4px 0 6px;
	}
	.vc-d .hb {
		flex: none;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: #e4efe6;
		color: #245f33;
		border-radius: 6px;
		padding: 3px 8px;
	}

	.vc-t.f1 .vc-hd span:nth-child(3),
	.vc-t.f1 .vc-c:nth-of-type(2),
	.vc-t.f1 .sb[data-c="2"],
	.vc-t.f2 .vc-hd span:nth-child(2),
	.vc-t.f2 .vc-c:nth-of-type(1),
	.vc-t.f2 .sb[data-c="1"] {
		opacity: 0.22;
	}
	.vc-hd span,
	.vc-c,
	.sb {
		transition:
			opacity 0.35s,
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.25s;
	}

	.vc-sc {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 1fr));
		gap: 10px;
		align-items: center;
		padding: 16px 0 4px;
	}
	.vc-sc .lab {
		font-size: 13px;
		font-weight: 600;
		color: var(--muted);
	}
	.sb {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.sb i {
		display: block;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #eef1ef;
		position: relative;
		overflow: hidden;
	}
	.sb i em {
		display: block;
		height: 100%;
		width: calc(var(--p) * 100%);
		border-radius: 3px;
		background: #9aa8a2;
		transition: width 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s;
	}
	.armed:not(.in) .sb i em {
		width: 0;
	}
	.sb.h i em {
		background: var(--ok);
	}
	.sb b {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.sb.h b {
		color: var(--ink);
	}

	.vc-side h2 {
		font-size: clamp(32px, 3.3vw, 48px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1.03;
	}
	.vc-side p {
		color: var(--muted);
		font-size: clamp(16px, 1.35vw, 19px);
		line-height: 1.55;
		margin-top: 22px;
		max-width: 44ch;
	}
	.vc-ctas {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 30px;
	}
	.vc-ctas a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 999px;
		padding: 13px 20px;
		font-size: 15px;
		font-weight: 600;
	}
	.vc-ctas a.p {
		background: var(--ink);
		color: #fff;
	}
	.vc-ctas a.p:hover {
		background: #2a443d;
	}
	.vc-ctas a.s {
		color: var(--ink);
	}

	.vc-lg {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		margin-top: 18px;
		font-size: 12.5px;
		color: var(--faint);
	}
	.vc-lg span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.vc-lg i {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		color: #fff;
		background: #6b7a74;
	}
	.vc-lg .t i {
		background: #dce1de;
		color: #6b7a74;
	}
	.vc-lg .n i {
		background: #c9cfcc;
	}
	.vc-lg i svg {
		width: 10px;
		height: 10px;
	}
	.vc-note {
		font-size: 12.5px;
		color: var(--faint);
		margin-top: 12px;
		line-height: 1.45;
	}

	@media (max-width: 980px) {
		.vc-g {
			grid-template-columns: 1fr;
		}
		.vc-side {
			order: -1;
		}
	}
	@media (max-width: 620px) {
		.vc-hd {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.vc-hd span:first-child {
			display: none;
		}
		.vc-hd span {
			font-size: 12.5px;
		}
		.vc-r {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			row-gap: 8px;
		}
		.vc-l {
			grid-column: 1/-1;
			font-size: 14.5px;
			font-weight: 500;
			padding: 0;
		}
		.vc-sc {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.vc-sc .lab {
			grid-column: 1/-1;
		}
		.vc-seg span {
			width: 100%;
		}
		.vc-c {
			height: 44px;
		}
	}
</style>

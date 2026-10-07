<script lang="ts">
	import {
		ganttColumnPhase,
		ganttColumns,
		ganttKindLabels,
		ganttRows,
	} from "$lib/landing/pages/messdienstwechsel/data";

	const legend = [
		{ color: "var(--ink)", label: "Heidi übernimmt operativ" },
		{ color: "#CFE9D1", label: "Abstimmung mit der Hausverwaltung" },
		{ color: "var(--accent)", label: "uVI an alle Mieter" },
	];

	let active = $state<number | null>(null);
	const row = $derived(active === null ? null : ganttRows[active]);

	let card: HTMLElement;
	let tip = $state<HTMLElement>();
	const bars: HTMLElement[] = [];
	let tipPos = $state({ x: 0, y: 0, ax: 0, below: false });

	/** Places the tooltip above the active bar (below if there's no room). */
	function position() {
		if (active === null || !tip) return;
		const br = bars[active].getBoundingClientRect();
		const cr = card.getBoundingClientRect();
		const tw = tip.offsetWidth;
		const th = tip.offsetHeight;
		// Centre of the bar's visible part; the Gantt may be scrolled sideways.
		const cx = Math.min(
			Math.max(br.left, cr.left + 12) +
				Math.min(br.width, cr.right - br.left) / 2,
			cr.right - 12,
		);
		const x = Math.max(12, Math.min(cr.width - tw - 12, cx - cr.left - tw / 2));
		let y = br.top - cr.top - th - 12;
		const below = y < 8;
		if (below) y = br.bottom - cr.top + 12;
		tipPos = {
			x,
			y,
			below,
			ax: Math.max(16, Math.min(tw - 16, cx - cr.left - x)),
		};
	}

	// After the tooltip has rendered the new row, so its size is known.
	$effect(() => {
		if (active !== null && tip) position();
	});

	function onfocusin(event: FocusEvent, i: number) {
		// Keyboard focus only: a tap focuses the bar too, and is handled by click.
		if ((event.target as Element).matches(":focus-visible")) active = i;
	}

	function onfocusout(event: FocusEvent) {
		const gantt = event.currentTarget as HTMLElement;
		if (!gantt.contains(event.relatedTarget as Node)) active = null;
	}
</script>

<section class="rollout wrap" aria-labelledby="rollout-h">
	<div class="shead">
		<div class="eyebrow">Für Hausverwaltungen</div>
		<h2 id="rollout-h">Große Bestände strukturiert übernehmen.</h2>
		<p>
			Vom ersten Objekt bis zum laufenden Betrieb: ein mehrstufiger Rollout mit
			klaren Übergaben, voller Transparenz und skalierbarer Umsetzung.
		</p>
	</div>
	<div class="gcard" bind:this={card}>
		<div class="gtop">
			<div>
				<div class="gt">Beispielhafter Rolloutplan</div>
				<div class="gs">Vom Pilotobjekt zum gesamten Bestand</div>
			</div>
			<div class="legend">
				{#each legend as item (item.label)}
					<span><b style="background:{item.color}"></b>{item.label}</span>
				{/each}
			</div>
		</div>
		<div class="gscroll" onscroll={position}>
			<!-- The group and its rows only widen the bars' hover and focus area;
			     the bars themselves are buttons. -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				class="gantt"
				class:hovering={active !== null}
				role="group"
				aria-label="Rolloutplan: Portfolio-Check in Woche 1, Pilotobjekt Woche 2 bis 3, Rollout-Planung Woche 4, Installation Woche 5 bis 7, Inbetriebnahme Woche 7 bis 8, ab Woche 8 monatliche Verbrauchsinformation und laufende Abrechnung."
				onpointerleave={(event) => {
					if (event.pointerType === "mouse") active = null;
				}}
				{onfocusout}
				onkeydown={(event) => {
					if (event.key === "Escape") active = null;
				}}
			>
				<div class="g-phases" aria-hidden="true">
					<div class="phase ph0"><i></i>Analyse</div>
					<div class="phase ph1"><i></i>Pilot<small>W2–3</small></div>
					<div class="phase ph2"><i></i>Cluster-Rollout<small>W4–8</small></div>
					<div class="phase ph3"><i></i>Betrieb</div>
				</div>
				<div class="g-head" aria-hidden="true">
					<div>Arbeitspaket</div>
					{#each ganttColumns as column (column)}<div>{column}</div>{/each}
				</div>
				{#each ganttRows as r, i (r.label)}
					<div
						class="g-row"
						class:act={active === i}
						role="presentation"
						onpointerenter={(event) => {
							if (event.pointerType === "mouse") active = i;
						}}
						onfocusin={(event) => onfocusin(event, i)}
					>
						<div class="lab"><i aria-hidden="true">{i + 1}</i>{r.label}</div>
						<div class="lane">
							{#each ganttColumnPhase as phase, c (c)}
								<div class="c p{phase}" style="grid-column:{c + 1}"></div>
							{/each}
							<button
								type="button"
								class="bar {r.kind}"
								class:arrow={r.arrow}
								style="grid-column:{r.from} / {r.to + 1}"
								aria-label="{r.title}, {r.weeks}"
								aria-describedby={active === i ? "gtip" : undefined}
								bind:this={bars[i]}
								onclick={() => (active = active === i ? null : i)}
							>
								<span class="d"></span>{r.bar}
								{#if r.ticks}
									<span class="ticks" aria-hidden="true">
										{#each { length: r.ticks }, t (t)}<i></i>{/each}
									</span>
								{/if}
								{#if r.milestone}
									<span class="ms"><span>{r.milestone}</span></span>
								{/if}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="scroll-hint" aria-hidden="true">
			Zum Ansehen seitlich wischen →
		</div>
		{#if row}
			<div
				class="gtip"
				class:below={tipPos.below}
				id="gtip"
				role="tooltip"
				bind:this={tip}
				style="left:{tipPos.x}px;top:{tipPos.y}px;--ax:{tipPos.ax}px"
			>
				<div class="tt">
					<b>{row.title}</b><span class="wk">{row.weeks}</span>
				</div>
				<span class="who {row.kind}">{ganttKindLabels[row.kind]}</span>
				<ul>
					{#each row.points as point (point)}<li>{point}</li>{/each}
				</ul>
				{#if row.milestone}
					<div class="ms-t">◆ Meilenstein: {row.milestone}</div>
				{/if}
			</div>
		{/if}
		<div class="gfoot">
			<div>
				<strong
					>Die Verwaltung steuert, Heidi übernimmt Technik, Daten und Betrieb.</strong
				>
				<p>
					Erst analysieren, dann ein Pilotobjekt, dann der Bestand. Weitere
					Portfolios folgen im selben Ablauf.
				</p>
			</div>
			<div class="gpill"><b>8</b> Wochen bis zur ersten uVI</div>
		</div>
	</div>
</section>

<style>
	.rollout {
		padding-block: 40px 110px;
	}
	.gcard {
		position: relative;
		margin-top: 56px;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 22px;
		padding: 32px 36px 28px;
		box-shadow: 0 20px 60px -30px rgba(30, 50, 45, 0.25);
	}
	.gtop {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		flex-wrap: wrap;
	}
	.gt {
		font-size: 22px;
		font-weight: 500;
		letter-spacing: -0.01em;
	}
	.gs {
		color: var(--muted);
		font-size: 15px;
		margin-top: 2px;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		font-size: 13px;
		color: var(--muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.legend b {
		width: 18px;
		height: 10px;
		border-radius: 999px;
		display: inline-block;
	}
	.gscroll {
		overflow-x: auto;
		margin-top: 28px;
		padding-bottom: 6px;
	}
	.gantt {
		min-width: 960px;
	}
	.g-phases,
	.g-head,
	.g-row {
		display: grid;
		grid-template-columns: 200px repeat(8, 1fr) 1.6fr;
	}
	.g-phases {
		margin-bottom: 6px;
	}
	.phase {
		border-radius: 10px 10px 0 0;
		padding: 8px 10px;
		margin-inline: 3px;
		font-size: 13px;
		white-space: nowrap;
		overflow: hidden;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.phase i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: none;
	}
	.phase small {
		font-weight: 400;
		color: var(--muted);
		margin-left: auto;
		font-size: 12px;
	}
	.ph0 {
		background: #eef1f6;
		grid-column: 2 / 3;
	}
	.ph0 i {
		background: var(--blue);
	}
	.ph1 {
		background: #f1f3f2;
		grid-column: 3 / 5;
	}
	.ph1 i {
		background: var(--ink);
	}
	.ph2 {
		background: #eaf7eb;
		grid-column: 5 / 10;
	}
	.ph2 i {
		background: var(--accent-deep);
	}
	.ph3 {
		background: #f4f6f5;
		grid-column: 10 / 11;
	}
	.ph3 i {
		background: #b9c4c0;
	}
	.g-head {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.g-head div {
		padding: 10px 0;
		text-align: center;
	}
	.g-head div:first-child {
		text-align: left;
	}
	.g-row {
		min-height: 60px;
		border-radius: 10px;
		transition: background 0.2s;
	}
	.gantt.hovering .g-row {
		opacity: 0.45;
		transition: opacity 0.2s;
	}
	.gantt.hovering .g-row.act {
		opacity: 1;
		background: rgba(138, 214, 143, 0.08);
	}
	.lab {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 14.5px;
		white-space: nowrap;
		font-weight: 500;
		padding-right: 12px;
	}
	.lab i {
		font-style: normal;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #f1f3f2;
		color: var(--muted);
		display: grid;
		place-items: center;
		font-size: 12px;
		font-weight: 600;
		flex: none;
	}
	.lane {
		grid-column: 2 / -1;
		display: grid;
		grid-template-columns: repeat(8, 1fr) 1.6fr;
		position: relative;
	}
	.c {
		grid-row: 1;
		border-left: 1px dashed #e3e7e5;
	}
	.c.p0 {
		background: rgba(238, 241, 246, 0.6);
	}
	.c.p1 {
		background: rgba(241, 243, 242, 0.55);
	}
	.c.p2 {
		background: rgba(234, 247, 235, 0.55);
	}
	.c.p3 {
		background: rgba(244, 246, 245, 0.55);
	}
	.bar {
		grid-row: 1;
		align-self: center;
		height: 36px;
		border: 0;
		border-radius: 999px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 16px;
		font-size: 14px;
		font-weight: 500;
		position: relative;
		margin-inline: 5px;
		z-index: 1;
		white-space: nowrap;
		text-align: left;
		cursor: pointer;
		box-shadow: 0 4px 12px -6px rgba(30, 50, 45, 0.35);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.g-row.act .bar {
		box-shadow: 0 8px 18px -6px rgba(30, 50, 45, 0.45);
	}
	.bar.op {
		background: var(--ink);
		color: #fff;
	}
	.bar.co {
		background: #cfe9d1;
		color: #24452f;
	}
	.bar.uvi {
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
	}
	.bar.arrow {
		border-radius: 999px 0 0 999px;
		margin-right: 0;
		clip-path: polygon(
			0 0,
			calc(100% - 16px) 0,
			100% 50%,
			calc(100% - 16px) 100%,
			0 100%
		);
		padding-right: 28px;
		box-shadow: none;
	}
	.ticks {
		display: flex;
		gap: 9px;
		margin-left: auto;
		padding-left: 10px;
	}
	.ticks i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
		opacity: 0.55;
	}
	.d {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.6;
	}
	.ms {
		position: absolute;
		right: -7px;
		top: 50%;
		width: 14px;
		height: 14px;
		background: #fff;
		border: 2.5px solid var(--ink);
		transform: translateY(-50%) rotate(45deg);
		border-radius: 3px;
		z-index: 2;
	}
	.ms span {
		position: absolute;
		left: 14px;
		bottom: 12px;
		transform: rotate(-45deg);
		transform-origin: left bottom;
		white-space: nowrap;
		font-size: 12px;
		font-weight: 600;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 2px 9px;
		box-shadow: 0 2px 8px rgba(30, 50, 45, 0.08);
	}

	.gtip {
		position: absolute;
		z-index: 5;
		width: 300px;
		max-width: calc(100% - 24px);
		background: var(--ink);
		color: #fff;
		border-radius: 12px;
		padding: 14px 16px 12px;
		box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.4);
		pointer-events: none;
		font-size: 13px;
		line-height: 1.45;
	}
	.gtip::after {
		content: "";
		position: absolute;
		left: var(--ax, 50%);
		top: 100%;
		border: 7px solid transparent;
		border-top-color: var(--ink);
		transform: translateX(-50%);
	}
	.gtip.below::after {
		top: auto;
		bottom: 100%;
		border-top-color: transparent;
		border-bottom-color: var(--ink);
	}
	.tt {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: baseline;
	}
	.tt b {
		font-size: 14px;
		font-weight: 600;
	}
	.wk {
		color: #a9b8b3;
		font-size: 12px;
		white-space: nowrap;
	}
	.who {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 6px;
		font-size: 11.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 2px 9px;
	}
	.who.op {
		background: rgba(255, 255, 255, 0.12);
	}
	.who.co {
		background: #cfe9d1;
		color: #24452f;
	}
	.who.uvi {
		background: var(--accent);
		color: var(--ink);
	}
	.gtip ul {
		margin: 8px 0 0;
		padding-left: 16px;
		color: #dde7e3;
		list-style: disc;
	}
	.gtip li {
		margin-top: 3px;
	}
	.ms-t {
		margin-top: 8px;
		padding-top: 8px;
		border-top: 1px solid rgba(255, 255, 255, 0.14);
		color: #cff1d1;
		font-size: 12px;
	}

	.gfoot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px 24px;
		flex-wrap: wrap;
		margin-top: 26px;
		padding-top: 22px;
		border-top: 1px solid var(--line);
	}
	.gfoot strong {
		font-size: 18px;
		font-weight: 600;
		display: block;
	}
	.gfoot p {
		color: var(--muted);
		margin-top: 4px;
		font-size: 14px;
	}
	.gpill {
		background: var(--ink);
		color: #fff;
		border-radius: 999px;
		padding: 10px 18px;
		font-size: 14px;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
	}
	.gpill b {
		color: var(--accent);
		font-weight: 600;
		font-size: 16px;
	}
	.scroll-hint {
		display: none;
		font-size: 13px;
		color: var(--faint);
		text-align: center;
		margin-top: 10px;
	}

	@media (max-width: 980px) {
		.gcard {
			padding: 24px 18px;
		}
		.scroll-hint {
			display: block;
		}
	}
</style>

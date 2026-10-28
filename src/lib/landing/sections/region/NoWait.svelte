<!--
  "Ohne Wartezeit": the contract timeline. Pointing at it shows a dashed
  cursor with the month and a tooltip on who does what at that time, and
  highlights that bar (`#tl-hov-js`; the tooltip only from 900 px on).
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
	const s = $derived(content.noWait);

	// The timeline itself is the same in every design.
	const years = [2026, 2027, 2028, 2029, 2030];
	const MONTHS = [
		"Jan",
		"Feb",
		"Mär",
		"Apr",
		"Mai",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Okt",
		"Nov",
		"Dez",
	];
	/** Share of the timeline where the old contract ends (end of 2029). */
	const CONTRACT_END = 0.8;
	const TIP_WIDTH = 280;

	type Phase = "pre" | "now" | "new";
	type Hover = {
		x: number;
		label: string;
		phase: Phase;
		f: number;
		tip?: number;
	};
	let hover = $state<Hover>();
	let yearsRow = $state<HTMLElement>();
	let today = $state<HTMLElement>();

	const tipRows = $derived.by(() => {
		if (!hover) return [];
		const { phase, f } = hover;
		const running = f < CONTRACT_END;
		return [
			{
				color: "#C9CFCC",
				on: phase === "pre",
				title: running ? "Bisheriger Messdienst" : "Altvertrag beendet",
				text: running
					? "Vertrag und Gerätemiete laufen weiter. Heidi kündigt fristgerecht per Vollmacht."
					: "Der Vertrag ist zum Ende 2029 ausgelaufen.",
			},
			{
				color: phase === "new" ? "#1E322D" : "#8AD68F",
				on: phase !== "pre",
				title: {
					pre: "Heidi noch nicht beauftragt",
					now: "Heidi mit Ihren Bestandszählern",
					new: "Heidi-Funkzähler",
				}[phase],
				text: {
					pre: "Ab heute übernimmt Heidi Ablesung, uVI und Abrechnung.",
					now: "Ablesung, uVI und Heizkostenabrechnung, ohne auf das Vertragsende zu warten.",
					new: "Tausch zum Vertragsende. Mieter 14 Tage vorher informiert, 1 bis 2 Stunden Zeitfenster.",
				}[phase],
			},
		];
	});

	function pointer(tl: HTMLElement) {
		/** Position of a viewport x on the five year columns, 0–1. */
		function frac(x: number) {
			const cols = yearsRow?.children;
			if (!cols || cols.length < 6) return -1;
			const a = cols[1].getBoundingClientRect();
			const b = cols[5].getBoundingClientRect();
			return (x - a.left) / (b.right - a.left);
		}
		function onmove(e: PointerEvent) {
			const f = frac(e.clientX);
			if (f < 0 || f > 1 || !today) {
				hover = undefined;
				return;
			}
			const box = tl.getBoundingClientRect();
			const x = e.clientX - box.left;
			const t = years[0] + f * years.length;
			const year = Math.floor(t);
			const month = Math.min(11, Math.floor((t - year) * 12));
			const phase: Phase =
				f < frac(today.getBoundingClientRect().left)
					? "pre"
					: f < CONTRACT_END
						? "now"
						: "new";
			let tip: number | undefined = x + 16;
			if (tip + TIP_WIDTH > box.width) tip = x - TIP_WIDTH - 16;
			tip = innerWidth < 900 ? undefined : Math.max(0, tip);
			hover = { x, label: `${MONTHS[month]} ${year}`, phase, f, tip };
		}
		const onleave = () => (hover = undefined);
		tl.addEventListener("pointermove", onmove);
		tl.addEventListener("pointerleave", onleave);
		return () => {
			tl.removeEventListener("pointermove", onmove);
			tl.removeEventListener("pointerleave", onleave);
		};
	}
</script>

<section class="nowait wrap" aria-labelledby="nw-h">
	<div class="shead">
		<div class="eyebrow">{s.eyebrow}</div>
		<h2 id="nw-h">{s.title}</h2>
		<p>{s.text}</p>
	</div>
	<div class="tl-card">
		<div class="tl-scroll">
			<div
				class={["tl", hover && "hov"]}
				{@attach pointer}
				role="img"
				aria-label="Zeitstrahl: Der Altvertrag läuft bis 2029 weiter. Heidi übernimmt ab heute Auswertung und Abrechnung mit den bestehenden Zählern und tauscht 2029 auf Heidi-Funkzähler."
			>
				<div class="tl-years" bind:this={yearsRow}>
					<div></div>
					{#each years as year (year)}<div>{year}</div>{/each}
				</div>
				<div class="tl-row">
					<div class="lab">
						Bisheriger Messdienst<small>Gerätemiete läuft weiter</small>
					</div>
					<div class="tl-lane">
						<div class={["tl-bar old", hover?.phase === "pre" && "on"]}>
							Vertrag läuft bis Ende 2029
						</div>
					</div>
				</div>
				<div class="tl-row">
					<div class="lab">Heidi<small>ab heute zuständig</small></div>
					<div class="tl-lane">
						<div class={["tl-bar now", hover?.phase === "now" && "on"]}>
							Ablesung, uVI und Abrechnung mit Ihren Bestandszählern
						</div>
						<div class={["tl-bar new", hover?.phase === "new" && "on"]}>
							Funkzähler
						</div>
					</div>
				</div>
				<div class="tl-today" bind:this={today}><span>Heute</span></div>
				<div class="tl-cur" style:left="{hover?.x ?? 0}px">
					<b>{hover?.label}</b>
				</div>
				<div
					class="tl-tip"
					style:left="{hover?.tip ?? 0}px"
					style:display={hover && hover.tip === undefined ? "none" : null}
				>
					<div class="d">{hover?.label}</div>
					{#each tipRows as row (row.color + row.title)}
						<div class={["r", row.on && "on"]}>
							<i style:background={row.color}></i><b>{row.title}</b><small
								>{row.text}</small
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="tl-note">
			{#each s.notes as note (note)}
				<span><span class="okb"><Check /></span>{note}</span>
			{/each}
		</div>
	</div>
</section>

<style>
	.nowait {
		padding-block: 96px;
	}
	.tl-card {
		margin-top: 56px;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 22px;
		padding: 32px 36px;
		box-shadow: 0 20px 60px -30px rgba(30, 50, 45, 0.25);
	}
	.tl-scroll {
		overflow-x: auto;
	}
	@media (min-width: 900px) {
		.tl-scroll {
			overflow: visible;
		}
	}
	.tl {
		min-width: 760px;
		position: relative;
		padding-top: 34px;
	}
	.tl-years {
		display: grid;
		grid-template-columns: 180px repeat(5, 1fr);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--faint);
		text-transform: uppercase;
	}
	.tl-years div {
		padding: 0 0 10px;
		border-left: 1px dashed #e3e7e5;
		padding-left: 10px;
	}
	.tl-years div:first-child {
		border: 0;
		padding-left: 0;
	}
	.tl-row {
		display: grid;
		grid-template-columns: 180px 1fr;
		align-items: center;
		min-height: 74px;
		border-top: 1px solid var(--line);
	}
	.lab {
		font-weight: 500;
		font-size: 15px;
	}
	.lab small {
		display: block;
		color: var(--muted);
		font-weight: 400;
		font-size: 13px;
	}
	.tl-lane {
		position: relative;
		height: 74px;
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(20% - 1px),
			#eef0ef calc(20% - 1px) 20%
		);
	}
	.tl-bar {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 38px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		padding: 0 16px;
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
	}
	.tl-bar.old {
		left: 0;
		width: 79.5%;
		background: repeating-linear-gradient(
			135deg,
			#eceeed 0 6px,
			#f4f5f4 6px 12px
		);
		color: var(--muted);
		border: 1px solid #e1e5e3;
	}
	.tl-bar.now {
		left: 15%;
		width: 64.5%;
		background: var(--accent);
		color: var(--ink);
	}
	.tl-bar.new {
		left: 80.5%;
		right: 0;
		background: var(--ink);
		color: #fff;
		border-radius: 999px 0 0 999px;
	}
	.tl-today {
		position: absolute;
		top: 28px;
		bottom: 0;
		left: calc(180px + (100% - 180px) * 0.15);
		width: 0;
		border-left: 2px solid var(--orange);
		z-index: 2;
	}
	.tl-today span {
		position: absolute;
		top: -22px;
		left: -26px;
		background: var(--orange);
		color: #fff;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		padding: 2px 9px;
		white-space: nowrap;
	}
	/* Pointer cursor and tooltip */
	.tl {
		cursor: crosshair;
	}
	.tl-bar {
		transition:
			opacity 0.3s,
			box-shadow 0.3s,
			filter 0.3s;
	}
	.tl.hov .tl-bar {
		opacity: 0.4;
	}
	.tl.hov .tl-bar.on {
		opacity: 1;
		box-shadow:
			0 0 0 3px rgba(138, 214, 143, 0.35),
			0 10px 24px -14px rgba(30, 50, 45, 0.5);
	}
	.tl.hov .tl-bar.old.on {
		box-shadow: 0 0 0 3px rgba(30, 50, 45, 0.12);
	}
	.tl-cur {
		position: absolute;
		top: 28px;
		bottom: 0;
		width: 0;
		border-left: 1.5px dashed #1e322d;
		opacity: 0;
		pointer-events: none;
		z-index: 3;
		transition: opacity 0.2s;
	}
	.tl-cur b {
		position: absolute;
		top: -24px;
		left: 0;
		transform: translateX(-50%);
		background: #1e322d;
		color: #fff;
		font-size: 11px;
		font-weight: 600;
		border-radius: 999px;
		padding: 2px 9px;
		white-space: nowrap;
	}
	.tl.hov .tl-cur {
		opacity: 1;
	}
	.tl-tip {
		position: absolute;
		top: 40px;
		z-index: 4;
		width: 280px;
		background: #fff;
		border: 1px solid #e1e5e3;
		border-radius: 14px;
		padding: 12px 14px;
		box-shadow: 0 18px 40px -18px rgba(30, 50, 45, 0.45);
		pointer-events: none;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.2s,
			transform 0.2s;
	}
	.tl.hov .tl-tip {
		opacity: 1;
		transform: none;
	}
	.tl-tip .d {
		font-size: 12px;
		font-weight: 600;
		color: #7a8783;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.tl-tip .r {
		display: grid;
		grid-template-columns: 10px minmax(0, 1fr);
		gap: 2px 10px;
		margin-top: 10px;
		font-size: 13.5px;
		line-height: 1.35;
	}
	.tl-tip .r i {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-top: 4px;
	}
	.tl-tip .r small {
		grid-column: 2;
		color: #5b6b66;
		font-size: 12.5px;
	}
	.tl-tip .r.on b {
		color: #1e322d;
	}
	.tl-tip .r:not(.on) {
		opacity: 0.75;
	}
	@media (hover: none) {
		.tl {
			cursor: default;
		}
	}

	.tl-note {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 28px;
		margin-top: 22px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
		font-size: 15px;
	}
	.tl-note > span {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
</style>

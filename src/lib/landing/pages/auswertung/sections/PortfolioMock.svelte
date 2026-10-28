<!--
  The hero's mock-up (`.ax`): the window "Auswertung" with three KPIs, the
  heating values of the seven properties against the portfolio's average and
  three notes. Server-rendered finished; below the fold it plays once when
  it scrolls into view: the bars grow, the figures count, the notes slide in.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { tweenNumber } from "$lib/landing/motion";
	import { de } from "$lib/landing/pages/dashboard/chart";
	import Icon from "$lib/landing/pages/dashboard/components/Icon.svelte";
	import Mark from "../components/Mark.svelte";
	import { metrics, mock, properties } from "../content";
	import { average, scaleMax, share } from "../metrics";

	const values = metrics.heiz.values;
	const max = scaleMax(values, 1.1);
	const avg = average(values);

	let played = $state(true);
	let kpiShown = $state(mock.kpis.map((k) => k.value));
	let valueShown = $state(values.slice());

	const entrance = enterView({
		threshold: 0.25,
		prepare: () => {
			played = false;
			// Writes only: a read here would make the attachment re-run (and
			// cancel the tweens) on their first frame.
			kpiShown = mock.kpis.map(() => 0);
			valueShown = values.map(() => 0);
		},
		play: () => {
			played = true;
			const stops = [
				...values.map((v, i) =>
					tweenNumber(0, v, 1000, (n) => (valueShown[i] = n)),
				),
				...mock.kpis.map((k, i) =>
					tweenNumber(0, k.value, 1100, (n) => (kpiShown[i] = n)),
				),
			];
			return () => stops.forEach((stop) => stop());
		},
	});
</script>

<div
	class={["ax rv", played && "in"]}
	role="group"
	aria-label={mock.label}
	{@attach entrance}
>
	<div class="ax-top">
		<span class="ax-logo"><Mark /></span>
		<span class="ax-t"><b>{mock.title}</b><small>{mock.sub}</small></span>
		<span class="ax-chip">{mock.chip}</span>
		<span class="ax-tag">{mock.tag}</span>
		<span class="ax-exp"><Icon name="file" /> {mock.export}</span>
	</div>
	<div class="ax-body">
		<div class="ax-k">
			{#each mock.kpis as kpi, i (kpi.label)}
				<div>
					<small>{kpi.label}</small>
					<b
						><span>{de(kpiShown[i], kpi.digits)}</span>
						{#if kpi.unit}<em>{kpi.unit}</em>{/if}</b
					>
					<span class={["ax-d", kpi.tone]}>{kpi.delta}</span>
				</div>
			{/each}
		</div>
		<div class="ax-main">
			<div class="ax-h">
				<b>{mock.chartTitle}</b><span>{mock.average} {de(avg)}</span>
			</div>
			<div class="ax-list" style:--f={avg / max}>
				{#each properties as p, i (p.name)}
					<div class={["ax-r", values[i] > avg * 1.1 && "hi"]} style:--i={i}>
						<span class="ax-n">{p.name}</span>
						<span class="ax-b"
							><i style:width="{played ? share(values[i], max) : 0}%"></i></span
						>
						<b class="ax-v">{de(valueShown[i])}</b>
					</div>
				{/each}
				<i class="ax-avg" aria-hidden="true"><span>Ø</span></i>
			</div>
		</div>
		<div class="ax-ins">
			{#each mock.notes as note, i (note.title)}
				<div class={["ax-i", note.urgent && "o"]} style:--i={i}>
					<span aria-hidden="true">{note.mark}</span>
					<p><b>{note.title}</b>{note.text}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.ax {
		margin: 56px auto 0;
		max-width: 1080px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		box-shadow: 0 40px 90px -50px rgba(30, 50, 45, 0.45);
		text-align: left;
		overflow: hidden;
		font-size: 13px;
		color: var(--ink);
	}
	.ax-top {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 16px;
		border-bottom: 1px solid var(--hair);
	}
	.ax-logo {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: var(--g1);
		display: grid;
		place-items: center;
		flex: none;
	}
	.ax-logo :global(svg) {
		width: 15px;
		height: 15px;
	}
	.ax-t b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.ax-t small {
		color: var(--muted);
		font-size: 11.5px;
	}
	.ax-chip {
		margin-left: auto;
		background: var(--soft);
		border-radius: 999px;
		padding: 5px 11px;
		font-size: 12px;
		font-weight: 500;
	}
	.ax-tag {
		background: #e6f5e7;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 5px 10px;
		font-size: 11px;
		font-weight: 600;
	}
	.ax-exp {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--g1);
		color: #fff;
		border-radius: 9px;
		padding: 8px 12px;
		font-size: 12px;
		font-weight: 600;
	}
	.ax-exp :global(svg) {
		width: 14px;
		height: 14px;
	}
	.ax-body {
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr) 250px;
		gap: 0;
		background: var(--bg);
	}
	.ax-k {
		display: grid;
		gap: 10px;
		padding: 16px;
		border-right: 1px solid var(--hair);
		align-content: start;
	}
	.ax-k > div {
		background: #fff;
		border-radius: 12px;
		padding: 12px;
	}
	.ax-k small {
		display: block;
		color: var(--muted);
		font-size: 11px;
	}
	.ax-k b {
		display: block;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 2px;
		font-variant-numeric: tabular-nums;
	}
	.ax-k b em {
		font-style: normal;
		font-size: 11px;
		font-weight: 500;
		color: var(--muted);
	}
	.ax-d {
		display: inline-block;
		margin-top: 6px;
		font-size: 10.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 2px 8px;
	}
	.ax-d.g {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.ax-d.o {
		background: #fbefdf;
		color: #8a5410;
	}
	.ax-main {
		padding: 16px 20px;
	}
	.ax-h {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.ax-h b {
		font-size: 14px;
		font-weight: 600;
	}
	.ax-h span {
		font-size: 11.5px;
		color: var(--muted);
	}
	.ax-list {
		position: relative;
		margin-top: 14px;
		display: grid;
		gap: 9px;
		/* The bar's column: after the 120 px name and the gap, before the gap
		   and the 40 px value (the design measures the bar instead). */
		--bar-x: 130px;
		--bar-w: calc(100% - 180px);
	}
	.ax-r {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr) 40px;
		gap: 10px;
		align-items: center;
	}
	.ax-n {
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ax-b {
		height: 14px;
		border-radius: 4px;
		background: #fff;
		position: relative;
		overflow: hidden;
	}
	.ax-b i {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		border-radius: 4px;
		background: #b9d7c0;
		transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1)
			calc(0.2s + var(--i) * 0.08s);
	}
	.ax-r.hi .ax-b i {
		background: var(--g4);
	}
	.ax-v {
		text-align: right;
		font-size: 12px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.ax-avg {
		position: absolute;
		top: -6px;
		bottom: -6px;
		left: calc(var(--bar-x) + var(--bar-w) * var(--f));
		width: 0;
		border-left: 1.5px dashed #7a8783;
		opacity: 0;
		transition: opacity 0.4s 1.1s;
	}
	.ax-avg span {
		position: absolute;
		top: -16px;
		left: -8px;
		font-style: normal;
		font-size: 10px;
		font-weight: 700;
		color: var(--muted);
	}
	.ax.in .ax-avg {
		opacity: 1;
	}
	.ax-ins {
		padding: 16px;
		border-left: 1px solid var(--hair);
		display: grid;
		gap: 10px;
		align-content: start;
	}
	.ax-i {
		display: grid;
		grid-template-columns: 26px 1fr;
		gap: 10px;
		background: #fff;
		border-radius: 12px;
		padding: 11px;
		opacity: 0;
		transform: translateX(10px);
		transition:
			opacity 0.45s calc(1.3s + var(--i) * 0.35s),
			transform 0.45s calc(1.3s + var(--i) * 0.35s);
	}
	.ax.in .ax-i {
		opacity: 1;
		transform: none;
	}
	.ax-i > span {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: #e6f5e7;
		color: #2f7a3c;
		display: grid;
		place-items: center;
		font-weight: 700;
		font-size: 13px;
	}
	.ax-i.o > span {
		background: #fbe6da;
		color: #b4461e;
	}
	.ax-i p {
		margin: 0;
		font-size: 11.5px;
		color: var(--muted);
		line-height: 1.4;
	}
	.ax-i b {
		display: block;
		color: var(--ink);
		font-size: 12.5px;
		font-weight: 600;
	}
	@media (max-width: 1080px) {
		.ax-body {
			grid-template-columns: 1fr;
		}
		.ax-k {
			grid-template-columns: repeat(3, 1fr);
			border-right: 0;
			border-bottom: 1px solid var(--hair);
		}
		.ax-ins {
			border-left: 0;
			border-top: 1px solid var(--hair);
		}
		.ax-chip,
		.ax-tag {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.ax-exp {
			display: none;
		}
		.ax-k {
			grid-template-columns: 1fr;
		}
		.ax-list {
			--bar-x: 110px;
			--bar-w: calc(100% - 154px);
		}
		.ax-r {
			grid-template-columns: 100px minmax(0, 1fr) 34px;
		}
	}
</style>

<!--
  The hero's middle panel: the tenant portal showing a month's uVI, with four
  KPIs and twelve monthly bars (the design's #uv-app). Server-rendered in its
  end state; when it comes into view later (not on screen at load), the KPIs
  fade up and the bars grow once (plan 03 §3.1). Hidden from screen readers;
  a sentence states the KPIs.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import AppFrame from "$lib/landing/sections/uv/AppFrame.svelte";
	import { mock } from "../content";

	const NB = " ";
	const full = mock.bars.map((v) => Math.round((v / mock.barMax) * 100));

	let go = $state(true);
	/** Bar heights in % while growing; `null`: the full heights. */
	let heights = $state<number[] | null>(null);
	let timers: ReturnType<typeof setTimeout>[] = [];

	function prepare() {
		go = false;
		heights = full.map(() => 4);
	}

	function play() {
		go = true;
		timers = full.map((h, i) =>
			setTimeout(() => (heights![i] = h), 250 + i * 60),
		);
		timers.push(setTimeout(() => (heights = null), 250 + full.length * 60));
		return () => timers.forEach(clearTimeout);
	}
</script>

<AppFrame
	label={mock.label}
	brand={mock.brand}
	nav={mock.nav}
	navFoot={mock.navFoot}
	{@attach enterView({ prepare, play })}
>
	<div class="mh"><span class="demo">{mock.tag}</span></div>
	<h3>{mock.title} {mock.month}.</h3>
	<p class="ms">{mock.sub}</p>
	<div class={["kpis", go && "go"]}>
		{#each mock.kpis as kpi (kpi.label)}
			<div>
				<small>{kpi.label}</small>
				<b>{kpi.value}{NB}{mock.unit}</b>
			</div>
		{/each}
	</div>
	<div class="bars">
		{#each heights ?? full as h, i (i)}
			<i class={[i === full.length - 1 && "cur"]} style:height="{h}%"></i>
		{/each}
	</div>
	<div class="ml">
		{#each mock.monthLabels as m (m)}<span>{m}</span>{/each}
	</div>
	{#snippet sr()}
		<p class="sr-only">
			{mock.title}
			{mock.month}: {mock.kpis
				.map((k) => `${k.label} ${k.value} ${mock.unit}`)
				.join(", ")}.
		</p>
	{/snippet}
</AppFrame>

<style>
	.mh {
		display: flex;
		justify-content: flex-end;
	}
	.demo {
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--faint);
		border: 1px solid var(--hair);
		border-radius: 6px;
		padding: 3px 7px;
	}
	/* Beats the landing heading reset (tokens.css). */
	.mh + h3 {
		font-size: clamp(20px, 2.2vw, 30px);
		font-weight: 500;
		letter-spacing: -0.03em;
		text-align: center;
		margin: 10px 0 0;
	}
	.ms {
		text-align: center;
		color: var(--muted);
		font-size: 12.5px;
		margin: 4px 0 0;
	}
	.kpis {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 18px;
	}
	.kpis div {
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 9px 10px;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.5s,
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.kpis small {
		display: block;
		font-size: 10.5px;
		color: var(--muted);
	}
	.kpis b {
		display: block;
		font-size: clamp(14px, 1.4vw, 19px);
		font-weight: 500;
		letter-spacing: -0.02em;
		margin-top: 3px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.kpis div:first-child {
		background: #eef6ef;
		border-color: #d4e8d7;
	}
	.go div {
		opacity: 1;
		transform: none;
	}
	.go div:nth-child(2) {
		transition-delay: 0.12s;
	}
	.go div:nth-child(3) {
		transition-delay: 0.24s;
	}
	.go div:nth-child(4) {
		transition-delay: 0.36s;
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 5px;
		height: 96px;
		margin-top: 18px;
		padding-top: 4px;
		border-bottom: 1px solid var(--hair);
	}
	.bars i {
		flex: 1;
		background: #d7e3da;
		border-radius: 4px 4px 0 0;
		transition: height 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bars i.cur {
		background: var(--ok);
	}
	.ml {
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		color: var(--faint);
		margin-top: 6px;
	}
	@media (max-width: 620px) {
		.kpis {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.kpis div,
		.bars i {
			transition: none;
		}
	}
</style>

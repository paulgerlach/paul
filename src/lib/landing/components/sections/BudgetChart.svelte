<!--
  Consumption against plan: a ring with the share of the year used so far and
  twelve monthly bars, switchable between three cost types. Months after
  BUDGET_NOW are a forecast.
-->
<script lang="ts">
	import { playOnView } from "../../attachments/playOnView";
	import {
		BUDGET_NOW,
		budgetSeries,
		budgetShare,
		budgetSoFar,
		eur,
		MONTHS,
		type BudgetKey,
	} from "../../data";

	const keys = Object.keys(budgetSeries) as BudgetKey[];

	let current = $state<BudgetKey>("hz");
	const series = $derived(budgetSeries[current]);
	const heights = $derived.by(() => {
		const max = Math.max(...series.values);
		return series.values.map((v) => Math.max(6, Math.round((v / max) * 100)));
	});
	const share = $derived(budgetShare(series.values));

	let box: HTMLElement;
	let tip = $state<HTMLElement>();
	const bars: HTMLElement[] = [];
	let tipIndex = $state<number | null>(null);
	let tipPos = $state({ x: 0, y: 0 });

	$effect(() => {
		if (tipIndex === null || !tip) return;
		const r = bars[tipIndex].getBoundingClientRect();
		const br = box.getBoundingClientRect();
		const hw = tip.offsetWidth / 2 + 6;
		const x = Math.max(
			hw,
			Math.min(br.width - hw, r.left + r.width / 2 - br.left),
		);
		tipPos = { x, y: r.top - br.top - 6 };
	});

	const tabs: HTMLElement[] = [];
	function onTabKey(event: KeyboardEvent, i: number) {
		const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
			event.key
		];
		if (!step) return;
		event.preventDefault();
		const next = (i + step + keys.length) % keys.length;
		current = keys[next];
		tabs[next].focus();
	}
</script>

<div
	class="bud"
	style="--c:{series.color}"
	bind:this={box}
	{@attach playOnView()}
>
	<div class="bud-top">
		<div class="h">Übersichtliche Verbrauchsanalyse</div>
		<div class="bud-yr">2026</div>
	</div>
	<div class="row">
		<div class="bring" style="--p:{share}%" aria-hidden="true">
			<span><b>{share} %</b><small>des Jahres</small></span>
		</div>
		<div class="bchart">
			<div
				class="bars"
				id="bud-bars"
				role="group"
				aria-label="Monatliche Kosten {series.label}"
				onpointerleave={() => (tipIndex = null)}
				onfocusout={() => (tipIndex = null)}
			>
				{#each heights as height, i (i)}
					<button
						type="button"
						class:fc={i >= BUDGET_NOW}
						style="height:{height}%"
						aria-label="{MONTHS[i]}: {eur(series.values[i])}{i >= BUDGET_NOW
							? ' (Prognose)'
							: ''}"
						bind:this={bars[i]}
						onpointerenter={() => (tipIndex = i)}
						onfocus={() => (tipIndex = i)}
						onclick={() => (tipIndex = i)}
					></button>
				{/each}
			</div>
			<div class="bmonths" aria-hidden="true">
				{#each MONTHS as month, i (i)}<span>{month[0]}</span>{/each}
			</div>
		</div>
	</div>
	{#if tipIndex !== null}
		<div
			class="btip"
			bind:this={tip}
			style="left:{tipPos.x}px;top:{tipPos.y}px"
			aria-hidden="true"
		>
			<b>{MONTHS[tipIndex]}</b> · {eur(series.values[tipIndex])}
			{#if tipIndex >= BUDGET_NOW}<span class="fc-l">Prognose</span>{/if}
		</div>
	{/if}
	<div class="tbl" role="tablist" aria-label="Kostenart">
		{#each keys as key, i (key)}
			<button
				type="button"
				role="tab"
				class:on={current === key}
				aria-selected={current === key}
				aria-controls="bud-bars"
				tabindex={current === key ? 0 : -1}
				bind:this={tabs[i]}
				onclick={() => (current = key)}
				onkeydown={(event) => onTabKey(event, i)}
			>
				<span
					><i style="background:{budgetSeries[key].color}"></i>{budgetSeries[
						key
					].label}</span
				>
				<span>bisher {eur(budgetSoFar(budgetSeries[key].values))}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.bud {
		background: #fff;
		border-radius: 10px;
		width: 100%;
		padding: 16px 18px;
		font-size: 12px;
		position: relative;
	}
	.bud-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 12px;
	}
	.h {
		font-size: 15px;
		font-weight: 500;
	}
	.bud-yr {
		color: var(--faint);
		font-size: 12px;
	}
	.row {
		display: flex;
		gap: 14px;
		align-items: flex-end;
	}
	.bring {
		width: 84px;
		height: 84px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		flex: none;
		background: conic-gradient(var(--c) 0 var(--p), #e7eae9 var(--p) 100%);
		transition: --p 0.6s;
	}
	.bud:global(.play) .bring {
		animation: a-ring 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both;
	}
	.bring span {
		width: 64px;
		height: 64px;
		background: #fff;
		border-radius: 50%;
		display: grid;
		place-content: center;
		text-align: center;
		line-height: 1.1;
	}
	.bring b {
		font-size: 15px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.bring small {
		font-size: 9.5px;
		color: var(--muted);
	}
	.bchart {
		flex: 1;
		min-width: 0;
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 92px;
	}
	.bars button {
		flex: 1;
		min-width: 0;
		border: 0;
		padding: 0;
		border-radius: 3px 3px 1px 1px;
		background: var(--c);
		cursor: pointer;
		transition:
			height 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.2s,
			background 0.3s;
	}
	.bars button.fc {
		background: repeating-linear-gradient(
			135deg,
			#e3e7e5 0 3px,
			#eef0ef 3px 6px
		);
	}
	.bars:hover button {
		opacity: 0.45;
	}
	.bars button:hover,
	.bars button:focus-visible {
		opacity: 1;
	}
	.bmonths {
		display: flex;
		gap: 4px;
		margin-top: 5px;
		color: var(--faint);
		font-size: 9.5px;
	}
	.bmonths span {
		flex: 1;
		text-align: center;
	}
	.btip {
		position: absolute;
		z-index: 3;
		background: var(--ink);
		color: #fff;
		border-radius: 6px;
		padding: 5px 9px;
		font-size: 11.5px;
		white-space: nowrap;
		pointer-events: none;
		transform: translate(-50%, -100%);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
	}
	.btip b {
		font-weight: 600;
	}
	.fc-l {
		opacity: 0.7;
	}
	.tbl {
		margin-top: 12px;
		display: grid;
		gap: 2px;
	}
	.tbl button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		border: 0;
		background: none;
		color: var(--muted);
		border-top: 1px solid var(--line);
		padding: 6px;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
		border-radius: 4px;
		text-align: left;
	}
	.tbl button:hover {
		background: #f4f6f5;
	}
	.tbl button.on {
		background: #eef3f0;
		color: var(--ink);
		font-weight: 500;
	}
	.tbl button span:first-child {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}
	.tbl i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}
</style>

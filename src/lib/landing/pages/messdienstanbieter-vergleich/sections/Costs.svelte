<!--
  Step 2 (#kosten): the six fields in two groups and the dark result card
  (.mv-cout). The fields are plain `$state` strings without `name` or a
  form (nothing is stored or sent); the costs come from the pure `cost.ts`.
  The legend and the stack follow at once, the three figures tween from the
  shown value (450 ms, `tweenNumber`). Server-rendered with the start
  values' result; below the fold with motion the figures count up from 0
  the first time the card shows (`enterView`), as the design's `onShow`.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import { enterView } from "$lib/landing/attachments/enterView";
	import { tweenNumber } from "$lib/landing/motion";
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { type CostKey, costs, COSTS_ID } from "../content";
	import { costs as compute, euro, formatDe, parseField } from "../cost";

	const fields = costs.groups.flatMap((g) => g.fields);
	const values: Record<CostKey, string> = $state(
		Object.fromEntries(fields.map((f) => [f.key, f.value])) as Record<
			CostKey,
			string
		>,
	);
	const result = $derived(
		compute(
			Object.fromEntries(
				fields.map((f) => [f.key, parseField(values[f.key])]),
			) as Record<CostKey, number>,
		),
	);

	// The tweened figures: per flat, per year, over six years.
	const start = compute(
		Object.fromEntries(
			fields.map((f) => [f.key, parseField(f.value)]),
		) as Record<CostKey, number>,
	);
	const shown = $state([start.perFlat, start.perYear, start.sixYears]);
	let stops: (() => void)[] = [];

	function tweenTo(targets: number[]) {
		for (const stop of stops) stop();
		stops = targets.map((to, i) =>
			tweenNumber(shown[i], to, 450, (v) => (shown[i] = v)),
		);
	}

	function input(key: CostKey, value: string) {
		values[key] = value;
		tweenTo([result.perFlat, result.perYear, result.sixYears]);
	}

	onDestroy(() => {
		for (const stop of stops) stop();
	});

	const legend = $derived([result.allocators, result.water, result.billing]);
	const parts = ["a", "b", "c"];
</script>

<section class="pg-sec" id={COSTS_ID} aria-labelledby="cost-h">
	<div class="wrap">
		<Head
			id="cost-h"
			pill={costs.pill}
			symbol="euro"
			heading={costs.h2}
			lead={costs.lead}
		/>
		<div class="cost rv">
			<div class="cin">
				{#each costs.groups as group (group.title)}
					<div class="cg">
						<h3>
							{group.title}{#if group.small}
								<small>{group.small}</small>{/if}
						</h3>
						{#each group.fields as field (field.key)}
							<label class="nf">
								<span>{field.label}</span>
								{#if field.euro}
									<em
										><input
											type="text"
											value={values[field.key]}
											autocomplete="off"
											inputmode="decimal"
											oninput={(e) => input(field.key, e.currentTarget.value)}
										/>€</em
									>
								{:else}
									<input
										type="number"
										value={values[field.key]}
										min={field.min}
										max={field.max}
										inputmode="numeric"
										oninput={(e) => input(field.key, e.currentTarget.value)}
									/>
								{/if}
							</label>
						{/each}
					</div>
				{/each}
			</div>
			<div
				class="cout"
				{@attach enterView({
					prepare: () => {
						for (const stop of stops) stop();
						shown[0] = shown[1] = shown[2] = 0;
					},
					play: () =>
						tweenTo([result.perFlat, result.perYear, result.sixYears]),
				})}
			>
				<span class="ol">{costs.result.label}</span>
				<div class="on">
					<b>{formatDe(shown[0], 2)}</b><i>{costs.result.unit}</i>
				</div>
				<div class="stack">
					{#each parts as part, i (part)}
						<i class={part} style:width="{result.shares[i]}%"></i>
					{/each}
				</div>
				<ul class="leg">
					{#each costs.result.legend as label, i (label)}
						<li><i class={parts[i]}></i>{label}<b>{euro(legend[i], 2)}</b></li>
					{/each}
				</ul>
				<div class="tot">
					<div>
						<small>{costs.result.year}</small><b>{euro(shown[1])}</b>
					</div>
					<div>
						<small
							>{costs.result.six}
							<button type="button" class="tip" aria-labelledby="mv-tip"
								><Icon name="info" /><span id="mv-tip" role="tooltip"
									>{costs.result.tip}</span
								></button
							></small
						><b>{euro(shown[2])}</b>
					</div>
				</div>
				<a class="bk-next inv cta" href={costs.result.cta.href}
					>{costs.result.cta.text}
					<span class="ar" aria-hidden="true">→</span></a
				>
			</div>
		</div>
		<p class="src rv">{costs.note}</p>
	</div>
</section>

<style>
	.cost {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 20px;
		margin-top: 44px;
		align-items: stretch;
	}
	.cin {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.cg {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px;
	}
	/* `.cg h3`: beats the landing reset of heading margins. */
	.cg h3 {
		font-size: 16px;
		font-weight: 600;
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 6px;
	}
	.cg h3 small {
		font-size: 12.5px;
		color: var(--muted);
		font-weight: 500;
	}
	.nf {
		display: block;
		margin-top: 14px;
	}
	.nf > span {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-bottom: 6px;
	}
	.nf input {
		width: 100%;
		font: inherit;
		font-size: 18px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 11px;
		padding: 11px 14px;
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		-moz-appearance: textfield;
		appearance: textfield;
	}
	.nf input::-webkit-outer-spin-button,
	.nf input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.nf input:focus {
		border-color: var(--ink);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	.nf em {
		display: flex;
		align-items: center;
		gap: 8px;
		font-style: normal;
		font-weight: 600;
		color: var(--muted);
	}

	/* The result card (.mv-cout) */
	.cout {
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 28px 26px;
		display: flex;
		flex-direction: column;
	}
	.ol {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.65);
	}
	.on {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 8px;
	}
	.on b {
		font-size: clamp(48px, 5.4vw, 72px);
		font-weight: 500;
		letter-spacing: -0.045em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		color: var(--accent);
	}
	.on i {
		font-style: normal;
		font-size: 15px;
		color: rgba(255, 255, 255, 0.65);
	}
	.stack {
		display: flex;
		height: 12px;
		border-radius: 999px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.1);
		margin-top: 24px;
		gap: 2px;
	}
	.stack i {
		height: 100%;
		transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.a {
		background: var(--accent);
	}
	.b {
		background: #9db4f0;
	}
	.c {
		background: #f2c14e;
	}
	.leg {
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.leg li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.75);
	}
	.leg li i {
		width: 10px;
		height: 10px;
		border-radius: 3px;
	}
	.leg b {
		margin-left: auto;
		color: #fff;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.tot {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 22px;
	}
	.tot div {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 14px;
		padding: 12px 14px;
	}
	.tot small {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.6);
	}
	.tot b {
		display: block;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 4px;
		font-variant-numeric: tabular-nums;
	}
	/* .mv-tip: a button here, so it has a role and a name (the tooltip). */
	.tip {
		position: relative;
		display: inline-flex;
		cursor: help;
		outline: none;
		border: 0;
		background: none;
		padding: 0;
		color: inherit;
		font: inherit;
	}
	.tip:focus-visible {
		border-radius: 50%;
		box-shadow: 0 0 0 2px var(--accent);
	}
	.tip :global(svg) {
		width: 13px;
		height: 13px;
	}
	.tip span {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background: #fff;
		color: var(--ink);
		font-size: 12px;
		border-radius: 8px;
		padding: 6px 9px;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s;
		box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.4);
	}
	.tip:hover span,
	.tip:focus span {
		opacity: 1;
	}
	/* .mv-cout .bk-next */
	.cout .cta {
		margin-top: 22px;
	}
	/* .pg-src */
	.src {
		margin-top: 18px;
		font-size: 13px;
		color: var(--faint);
	}

	@media (max-width: 1040px) {
		.cost {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.cin {
			grid-template-columns: minmax(0, 1fr);
		}
		.tot {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 700px) {
		.tip span {
			white-space: normal;
			width: max-content;
			max-width: min(220px, 70vw);
		}
	}
</style>

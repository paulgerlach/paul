<!--
  Heating energy per property against the portfolio average. Hovering or
  focusing a bar shows its details; leaving resets to the first property.
-->
<script lang="ts">
	import {
		isRiskHigh,
		RISK_MAX,
		riskAverage,
		riskLabels,
		riskProperties,
	} from "$lib/landing/pages/messdienstwechsel/data";

	let active = $state(0);
	let tipOn = $state(false);
	const property = $derived(riskProperties[active]);
	const diff = $derived(Math.round((property.value / riskAverage - 1) * 100));

	let chart: HTMLElement;
	let tip = $state<HTMLElement>();
	const bars: HTMLElement[] = [];
	let tipPos = $state({ x: 0, bottom: 0 });

	$effect(() => {
		if (!tipOn || !tip) return;
		const bar = bars[active];
		const hw = tip.offsetWidth / 2;
		const x = bar.offsetLeft + bar.offsetWidth / 2;
		tipPos = {
			x: Math.max(hw, Math.min(chart.clientWidth - hw, x)),
			bottom: bar.offsetHeight + 8,
		};
	});

	const show = (i: number) => {
		active = i;
		tipOn = true;
	};
	const reset = () => {
		active = 0;
		tipOn = false;
	};
</script>

<div class="risk">
	<span class="tag" class:warn={isRiskHigh(property.value)} aria-live="polite">
		✳ {property.tag}
	</span>
	<span class="adj">{property.action} <span class="ar">→</span></span>
	<div
		class="rchart"
		role="group"
		aria-label="Heizenergie je Liegenschaft"
		bind:this={chart}
		onpointerleave={reset}
		onfocusout={(event) => {
			if (!chart.contains(event.relatedTarget as Node)) reset();
		}}
	>
		<div class="avg" style="bottom:{(riskAverage / RISK_MAX) * 100}%">
			<span>Ø {riskAverage}</span>
		</div>
		{#each riskProperties as p, i (p.name)}
			<button
				type="button"
				class:hi={isRiskHigh(p.value)}
				class:act={tipOn && active === i}
				style="height:{(p.value / RISK_MAX) * 100}%"
				aria-label="{p.name}: {p.value} kWh pro m²"
				bind:this={bars[i]}
				onpointerenter={() => show(i)}
				onfocus={() => show(i)}
				onclick={() => show(i)}
			></button>
		{/each}
		{#if tipOn}
			<div
				class="rtip"
				bind:this={tip}
				style="left:{tipPos.x}px;bottom:{tipPos.bottom}px"
				aria-hidden="true"
			>
				<b>{property.name}</b><br />
				{property.value} kWh/m² ·
				<span class={diff > 0 ? "up" : "dn"}
					>{diff > 0 ? "+" : "−"}{Math.abs(diff)} % zum Ø</span
				><br />
				Einheiten über Ø: {property.unitsAbove}
			</div>
		{/if}
	</div>
	<div class="rlab" aria-hidden="true">
		{#each riskLabels as label, i (label)}
			<span class:act={tipOn && active === i}>{label}</span>
		{/each}
	</div>
	<div class="runit">Heizenergie in kWh/m² pro Jahr</div>
</div>

<style>
	.risk {
		width: 100%;
	}
	.tag {
		background: #fff;
		border-radius: 6px;
		padding: 6px 10px;
		color: var(--blue);
		font-size: 14px;
		display: flex;
		align-items: center;
		min-height: calc(2 * 1.5em + 12px);
		transition: color 0.2s;
	}
	.tag.warn {
		color: var(--orange);
	}
	.adj {
		display: inline-block;
		font-size: 15px;
		margin-top: 10px;
		color: var(--ink);
	}
	.rchart {
		position: relative;
		height: 180px;
		margin-top: 20px;
		border-bottom: 1px solid #dde0de;
		display: flex;
		align-items: flex-end;
		gap: 10px;
		padding: 0 4px;
	}
	.rchart button {
		flex: 1;
		border: 0;
		padding: 0;
		background: var(--blue);
		border-radius: 4px 4px 0 0;
		cursor: pointer;
		transition:
			opacity 0.2s,
			filter 0.2s;
	}
	.rchart button.hi {
		background: var(--orange);
	}
	.rchart:hover button {
		opacity: 0.4;
	}
	.rchart button:hover,
	.rchart button:focus-visible,
	.rchart button.act {
		opacity: 1 !important;
		filter: saturate(1.1);
	}
	.avg {
		position: absolute;
		left: -6px;
		right: 0;
		border-top: 1.5px dashed #9aa5a1;
		z-index: 1;
		pointer-events: none;
	}
	.avg span {
		position: absolute;
		left: 0;
		top: -11px;
		background: var(--ink);
		color: #fff;
		border-radius: 999px;
		font-size: 11px;
		padding: 2px 8px;
		font-variant-numeric: tabular-nums;
	}
	.rtip {
		position: absolute;
		z-index: 3;
		background: var(--ink);
		color: #fff;
		border-radius: 8px;
		padding: 8px 11px;
		font-size: 12px;
		line-height: 1.45;
		white-space: nowrap;
		pointer-events: none;
		transform: translateX(-50%);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}
	.rtip b {
		font-size: 13px;
		font-weight: 600;
	}
	.up {
		color: #f4a77e;
	}
	.dn {
		color: #cff1d1;
	}
	.rlab {
		display: flex;
		gap: 10px;
		padding: 6px 4px 0;
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
	}
	.rlab span {
		flex: 1;
		text-align: center;
		transition: color 0.2s;
	}
	.rlab span.act {
		color: var(--ink);
		font-weight: 600;
	}
	.runit {
		font-size: 11px;
		color: var(--faint);
		margin-top: 6px;
	}
</style>

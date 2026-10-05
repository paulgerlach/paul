<!--
  Phone with a tenant's monthly heating costs (uVI). Month tabs, or moving
  over the chart, select a month: the value tweens, the delta to the previous
  year and the chart marker follow. The data is the same in every design;
  the line is computed here, so the server renders it.
-->
<script lang="ts">
	import { tweenNumber } from "$lib/landing/motion";

	let { address }: { address: string } = $props();

	const MONTHS = ["April", "Mai", "Juni", "Juli", "August", "September"];
	const VALUES = [64.2, 41.5, 22.8, 18.3, 19.1, 38.4];
	/** Same months a year earlier */
	const PREVIOUS = [71.9, 45.1, 24.6, 19.4, 21.3, 43.6];

	const n = VALUES.length;
	const max = Math.max(...VALUES, ...PREVIOUS);
	// Chart coordinates in the 300 × 100 viewBox (the design's formulas)
	const X = VALUES.map((_, i) => 14 + (i * 272) / (n - 1));
	const Y = VALUES.map((v) => 10 + (1 - v / max) * 62);
	const line = `M${X.map((x, i) => `${x.toFixed(1)} ${Y[i].toFixed(1)}`).join(" L")}`;
	const area = `${line} L${X[n - 1]} 100 L${X[0]} 100Z`;

	const euro = new Intl.NumberFormat("de-DE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	let active = $state(n - 1);
	let shown = $state(VALUES[n - 1]);
	let cancel = () => {};

	const delta = $derived(
		Math.round((VALUES[active] / PREVIOUS[active] - 1) * 100),
	);

	function select(i: number) {
		if (i === active) return;
		const from = shown;
		active = i;
		cancel();
		cancel = tweenNumber(from, VALUES[i], 320, (v) => (shown = v));
	}

	let tabs: HTMLButtonElement[] = $state([]);
	function onkeydown(event: KeyboardEvent) {
		const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
		const to =
			event.key === "Home"
				? 0
				: event.key === "End"
					? n - 1
					: step === undefined
						? -1
						: (active + step + n) % n;
		if (to < 0) return;
		event.preventDefault();
		select(to);
		tabs[to]?.focus();
	}

	function nearest(event: PointerEvent) {
		const r = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = ((event.clientX - r.left) / r.width) * 300;
		let best = 0;
		X.forEach((xx, j) => {
			if (Math.abs(xx - x) < Math.abs(X[best] - x)) best = j;
		});
		select(best);
	}

	$effect(() => () => cancel());
</script>

<div class="ph">
	<div class="ph-in">
		<div class="ph-notch"></div>
		<div class="ph-acc">
			<i>
				<svg
					viewBox="0 0 20 20"
					fill="none"
					stroke="#1E322D"
					stroke-width="1.6"
					aria-hidden="true"
				>
					<path d="M3 9l7-6 7 6v8H3z" /><path d="M8 17v-5h4v5" />
				</svg>
			</i>
			<div><b>{address}</b><small>Wohnung 07 · 2. OG links</small></div>
		</div>
		<div
			id="ph-panel"
			role="tabpanel"
			aria-label="Heizkosten im {MONTHS[active]}"
		>
			<div class="ph-k">Heizkosten im {MONTHS[active]}</div>
			<div class="ph-v">
				<span>{euro.format(shown)} €</span>
				<svg viewBox="0 0 8 12" fill="none" aria-hidden="true">
					<path d="M1.5 1l5 5-5 5" stroke="#1E322D" stroke-width="1.6" />
				</svg>
			</div>
			<div class="ph-d">
				<em class={[delta > 0 && "up"]}
					>{delta < 0 ? "−" : "+"}{Math.abs(delta)} %</em
				>
				zum Vorjahresmonat
			</div>
		</div>
		<div class="ph-mo" role="tablist" aria-label="Monat wählen">
			{#each MONTHS as month, i (month)}
				<button
					type="button"
					role="tab"
					aria-label={month}
					aria-selected={i === active}
					aria-controls="ph-panel"
					tabindex={i === active ? 0 : -1}
					class={[i === active && "on"]}
					bind:this={tabs[i]}
					onclick={() => select(i)}
					onmouseenter={() => select(i)}
					{onkeydown}>{month.slice(0, 3)}</button
				>
			{/each}
		</div>
		<!-- Pointer shortcut to the tabs above, which stay the keyboard path. -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="ph-chart" onpointermove={nearest} onpointerdown={nearest}>
			<svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
				<defs>
					<linearGradient id="phg" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#8AD68F" stop-opacity=".55" />
						<stop offset="1" stop-color="#8AD68F" stop-opacity=".12" />
					</linearGradient>
				</defs>
				<path d={area} fill="url(#phg)" />
				<path
					d={line}
					fill="none"
					stroke="#4E8F55"
					stroke-width="1.4"
					vector-effect="non-scaling-stroke"
				/>
			</svg>
			<i class="ph-vl" style:left="{X[active] / 3}%"></i>
			<i class="ph-dot" style:left="{X[active] / 3}%" style:top="{Y[active]}%"
			></i>
		</div>
	</div>
</div>

<style>
	.ph {
		position: absolute;
		left: 50%;
		bottom: -4px;
		transform: translateX(-50%);
		width: min(420px, 72%);
		height: 372px;
		background: #fff;
		border: 1px solid #e2e4e1;
		border-radius: 64px 64px 0 0;
		padding: 14px 14px 0;
		box-shadow: 0 30px 60px -30px rgba(30, 50, 45, 0.18);
	}
	.ph-in {
		height: 100%;
		border: 1px solid #ecedeb;
		border-radius: 52px 52px 0 0;
		padding: 16px 24px 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.ph-notch {
		width: 80px;
		height: 16px;
		border-radius: 10px;
		background: #f1f2f0;
		border: 1px solid #e6e7e5;
		margin: 0 auto 14px;
	}
	.ph-acc {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-top: 4px;
	}
	.ph-acc i {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: #f1f3f2;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ph-acc i svg {
		width: 15px;
	}
	.ph-acc b {
		display: block;
		font-weight: 500;
		font-size: 14px;
	}
	.ph-acc small {
		color: var(--muted);
		font-size: 12px;
	}
	.ph-k {
		color: var(--muted);
		font-size: 13px;
		margin-top: 16px;
	}
	.ph-v {
		font-size: 28px;
		letter-spacing: -0.02em;
		margin-top: 2px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-variant-numeric: tabular-nums;
	}
	.ph-v svg {
		width: 14px;
	}
	.ph-d {
		font-size: 13px;
		color: var(--muted);
		margin-top: 4px;
	}
	.ph-d em {
		font-style: normal;
		color: #2f7a3c;
		font-weight: 600;
	}
	.ph-d em.up {
		color: var(--orange);
	}
	.ph-mo {
		display: flex;
		gap: 4px;
		margin-top: 12px;
	}
	.ph-mo button {
		flex: 1;
		border: 0;
		background: #f3f4f2;
		color: var(--muted);
		font: inherit;
		font-size: 11.5px;
		font-weight: 500;
		border-radius: 6px;
		padding: 5px 0;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.ph-mo button:hover {
		background: #e8ece9;
		color: var(--ink);
	}
	.ph-mo button.on {
		background: var(--ink);
		color: #fff;
	}
	.ph-chart {
		position: relative;
		margin: 10px -24px 0;
		flex: 1;
		min-height: 84px;
		cursor: crosshair;
		touch-action: pan-y;
	}
	.ph-chart svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.ph-vl {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		border-left: 1px dashed #9ab8a0;
		transition: left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ph-dot {
		position: absolute;
		width: 11px;
		height: 11px;
		margin: -5.5px 0 0 -5.5px;
		border-radius: 50%;
		background: #fff;
		border: 2.5px solid #2f7a3c;
		box-shadow: 0 2px 6px rgba(30, 50, 45, 0.25);
		transition:
			left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
			top 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	@media (max-width: 560px) {
		.ph {
			width: 82%;
			height: 360px;
		}
	}
</style>

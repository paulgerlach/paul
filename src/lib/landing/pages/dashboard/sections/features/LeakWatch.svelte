<!--
  Bento "Leckage-Wächter" (`.lkw`): 14 days of cold water against the normal
  value, three days flagged. The chart is computed from the values in content
  (plan 01 §1.3); the server shows it complete with the badge.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { leak } from "../../content";

	const W = 560;
	const x = (i: number) => 48 + (i * 492) / 13;
	const y = (v: number) => 141.4 - (v - leak.baseline) * 1.186;
	const f = (n: number) => n.toFixed(1);

	const points = leak.values.map((v, i) => [x(i), y(v)] as const);
	const line = points.map(([px, py]) => `${f(px)},${f(py)}`).join(" ");
	const area = `M${f(x(0))} 200 L${line.replaceAll(" ", " L")} L${f(x(13))} 200 Z`;
	const flagged = new Set(leak.flagged);
	const bandX = x(leak.flagged[0] - 1) - 24;
	const bandW = x(leak.flagged[leak.flagged.length - 1] - 1) - bandX + 24;

	/** Days revealed by the scan (all on the server). */
	let shown = $state(leak.values.length);
	let alert = $state(true);
	/** The scan line's x (null: not scanning) and the fade before a new pass. */
	let scanX = $state<number | null>(null);
	let fading = $state(false);
	let clipW = $state(W);
	const X0 = x(0);
	const X1 = x(leak.values.length - 1);
	const scanDay = $derived(
		scanX === null
			? 1
			: Math.max(
					1,
					Math.min(14, Math.round(((scanX - X0) / (X1 - X0)) * 13) + 1),
				),
	);
	const scanAlert = $derived(
		scanX !== null &&
			scanDay >= leak.flagged[0] &&
			scanDay <= leak.flagged[leak.flagged.length - 1],
	);

	/** One pass (plan 03, 3B.4): sweep 4.2 s, hold 5.2 s, fade 0.7 s. */
	function run() {
		let frame = 0;
		const timers: ReturnType<typeof setTimeout>[] = [];
		fading = false;
		alert = false;
		shown = 0;
		clipW = 0;
		scanX = X0 - 6;
		const t0 = performance.now();
		const tick = (now: number) => {
			const p = Math.min(1, (now - t0) / 4200);
			const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
			const xx = X0 - 6 + (X1 - X0 + 12) * e;
			scanX = xx;
			clipW = xx;
			shown = points.filter(([px]) => px <= xx + 1).length;
			if (
				!alert &&
				points.some(([px], i) => px <= xx + 1 && flagged.has(i + 1))
			)
				alert = true;
			if (p < 1) frame = requestAnimationFrame(tick);
			else {
				scanX = null;
				clipW = W;
				timers.push(setTimeout(() => (fading = true), 5200));
			}
		};
		frame = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(frame);
			for (const t of timers) clearTimeout(t);
			scanX = null;
			clipW = W;
			shown = leak.values.length;
			alert = true;
			fading = false;
		};
	}

	let hovered = $state<number | null>(null);
</script>

<div
	class={["lkw", alert && "alert", fading && "fade"]}
	{@attach loopInView({ run, every: 10100, threshold: 0.35, delay: 300 })}
>
	<div class="h">
		<span class="l">{leak.label} <em class="lg"><i></i>{leak.legend}</em></span>
		<span class="badge-l"><i></i>{leak.badge}</span>
	</div>
	<div class="pw">
		<svg
			class="svg"
			viewBox="0 0 {W} 236"
			role="img"
			aria-label={leak.chartLabel}
		>
			<defs>
				<linearGradient id="lk-ag" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stop-color="#8E9DD4" stop-opacity=".22" />
					<stop offset="1" stop-color="#8E9DD4" stop-opacity="0" />
				</linearGradient>
				<clipPath id="lk-cp"
					><rect x="0" y="0" width={clipW} height="236" /></clipPath
				>
			</defs>
			<rect
				class="band"
				x={f(bandX)}
				y="12"
				width={f(bandW)}
				height="220"
				rx="12"
			/>
			{#each leak.grid as g (g)}
				<line x1="40" x2="548" y1={f(y(g))} y2={f(y(g))} class="g" />
				<text x="34" y={f(y(g) + 4)} class="t" text-anchor="end">{g} l</text>
			{/each}
			<line x1="40" x2="548" y1="200" y2="200" class="base" />
			<line
				class="n"
				x1="40"
				x2="548"
				y1={f(y(leak.baseline))}
				y2={f(y(leak.baseline))}
			/>
			<g class="data" clip-path="url(#lk-cp)">
				<path class="area" d={area} />
				<polyline class="line" points={line} />
			</g>
			{#if scanX !== null}
				<g
					class={["scan", scanAlert && "al"]}
					transform="translate({f(scanX)} 0)"
				>
					<line x1="0" x2="0" y1="12" y2="200" />
					<rect class="sl-bg" x="-36" y="-12" width="72" height="20" rx="10" />
					<text class="sl" x="0" y="2" text-anchor="middle"
						>{leak.day} {scanDay}</text
					>
				</g>
			{/if}
			{#each points as [px, py], i (i)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<circle
					onpointerenter={() => (hovered = i < shown ? i : null)}
					onpointerleave={() => (hovered = null)}
					class={["d", flagged.has(i + 1) && "a", i < shown && "on"]}
					cx={f(px)}
					cy={f(py)}
					r={flagged.has(i + 1) ? 2.8 : 2.3}
				/>
			{/each}
			{#each leak.xLabels as day (day)}
				<text x={f(x(day - 1))} y="226" class="t" text-anchor="middle"
					>{leak.day} {day}</text
				>
			{/each}
		</svg>
		{#if hovered !== null}
			{@const [px, py] = points[hovered]}
			<div
				class={["tip", flagged.has(hovered + 1) && "al"]}
				style:left="{(px / W) * 100}%"
				style:top="{(py / 236) * 100}%"
				aria-hidden="true"
			>
				{leak.values[hovered]}
				{leak.litres}<small
					>{leak.day}
					{hovered + 1}{flagged.has(hovered + 1)
						? ` · ${leak.flaggedTip}`
						: ""}</small
				>
			</div>
		{/if}
	</div>
	<p class="foot">{leak.footnote}</p>
</div>

<style>
	.lkw {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.h {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		min-height: 30px;
	}
	.l {
		font-size: 12.5px;
		color: var(--muted);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 14px;
	}
	.lg {
		font-style: normal;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.lg i {
		width: 16px;
		border-top: 1.5px dashed #a9b0ac;
	}
	.badge-l {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 12.5px;
		font-weight: 600;
		color: #a4545b;
		background: #f8ecec;
		border-radius: 999px;
		padding: 5px 11px;
		opacity: 0;
		transform: translateY(-4px) scale(0.96);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.badge-l i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #b5656b;
	}
	.alert .badge-l {
		opacity: 1;
		transform: none;
	}
	.alert .badge-l i {
		animation: lk-ping 1.6s ease-out infinite;
	}
	@keyframes lk-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(181, 101, 107, 0.5);
		}
		70%,
		100% {
			box-shadow: 0 0 0 8px rgba(181, 101, 107, 0);
		}
	}
	.pw {
		position: relative;
		margin-top: 14px;
	}
	.svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.g {
		stroke: #eef0ee;
	}
	.base {
		stroke: #e4e8e5;
	}
	.t {
		font-size: 11.5px;
		fill: #9aa39f;
	}
	.n {
		stroke: #a9b0ac;
		stroke-width: 1.5;
		stroke-dasharray: 6 5;
	}
	.band {
		fill: #f8f1f1;
		opacity: 0;
		transition: opacity 0.6s;
	}
	.alert .band {
		opacity: 1;
	}
	.area {
		fill: url(#lk-ag);
	}
	.line {
		fill: none;
		stroke: #8e9dd4;
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.d {
		fill: #fff;
		stroke: #8e9dd4;
		stroke-width: 1.6;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(0.2);
		transition:
			opacity 0.25s,
			transform 0.4s cubic-bezier(0.3, 1.7, 0.5, 1),
			stroke 0.3s;
	}
	.d.on {
		opacity: 1;
		transform: none;
	}
	.d.a.on {
		stroke: #b5656b;
	}
	.fade .d,
	.fade .line,
	.fade .area,
	.fade .band {
		transition: opacity 0.5s;
	}
	.fade .d {
		opacity: 0;
	}
	.scan line {
		stroke: #1e322d;
		stroke-width: 1.2;
		stroke-dasharray: 3 4;
		opacity: 0.35;
	}
	.sl-bg {
		fill: #1e322d;
	}
	.al .sl-bg {
		fill: #b5656b;
	}
	.sl {
		font-size: 11px;
		font-weight: 600;
		fill: #fff;
	}
	.d {
		cursor: pointer;
	}
	.d.a.on {
		animation: lk-hit 1.8s ease-in-out infinite;
	}
	@keyframes lk-hit {
		0%,
		100% {
			stroke-width: 1.6;
		}
		50% {
			stroke-width: 2.2;
		}
	}
	.tip {
		position: absolute;
		pointer-events: none;
		background: #1e322d;
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		border-radius: 8px;
		padding: 6px 9px;
		white-space: nowrap;
		transform: translate(-50%, calc(-100% - 12px));
		z-index: 3;
	}
	.tip small {
		display: block;
		font-weight: 400;
		opacity: 0.75;
		font-size: 11px;
	}
	.tip.al {
		background: #a4545b;
	}
	.foot {
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--muted);
		margin: 14px 0 0;
		padding-top: 12px;
		border-top: 1px solid #eef0ee;
	}
	@media (max-width: 640px) {
		.t {
			font-size: 19px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.alert .badge-l i {
			animation: none;
		}
	}
</style>

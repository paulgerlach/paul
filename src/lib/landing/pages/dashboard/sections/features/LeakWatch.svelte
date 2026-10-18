<!--
  Bento "Leckage-Wächter" (`.lkw`): 14 days of cold water against the normal
  value, three days flagged. The chart is computed from the values in content
  (plan 01 §1.3); the server shows it complete with the badge.
-->
<script lang="ts">
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
</script>

<div class={["lkw", alert && "alert"]}>
	<div class="h">
		<span class="l">{leak.label} <em class="lg"><i></i>{leak.legend}</em></span>
		<span class="badge-l"><i></i>{leak.badge}</span>
	</div>
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
		<g class="data">
			<path class="area" d={area} />
			<polyline class="line" points={line} />
		</g>
		{#each points as [px, py], i (i)}
			<circle
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
	.svg {
		width: 100%;
		height: auto;
		margin-top: 14px;
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

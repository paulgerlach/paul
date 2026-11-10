<!--
  "Vier Schritte. Ein Ansprechpartner." (the template's steps, the design's
  #pb-steps-css): the house searched for lead, the sample bottled at the
  tap, the lab's bars scanned, the ticked report. Decorative.
-->
<script lang="ts">
	import SvcSteps from "$lib/landing/sections/svc/Steps.svelte";
	import { stepVisuals as v, steps } from "../content";

	/** Step 3's bars: x, y, height; the fifth is the lead's. */
	const bars: [number, number, number][] = [
		[30, 76, 18],
		[50, 64, 30],
		[70, 72, 22],
		[90, 54, 40],
		[110, 36, 58],
		[130, 68, 26],
		[150, 80, 14],
		[170, 74, 20],
	];
	/** Step 4's three ticked lines: y and width. */
	const rows: [number, number][] = [
		[34, 46],
		[48, 40],
		[62, 34],
	];
</script>

{#snippet visual(index: number)}
	{#if index === 0}
		<svg viewBox="0 0 200 110" class="sv sv1">
			<path class="ln" d="M36 44L80 16L124 44" />
			<rect class="ln" x="44" y="44" width="72" height="56" rx="3" />
			<path class="pp" d="M66 100V60H100" />
			<path class="hlp" d="M66 82V60H84" />
			<g class="tag"
				><rect x="132" y="12" width="60" height="20" rx="6" /><text
					x="162"
					y="26">{v.year}</text
				></g
			>
			<g class="lb"
				><rect x="128" y="68" width="48" height="20" rx="6" /><text
					x="152"
					y="82">{v.lead}</text
				></g
			>
			<g class="mag"
				><circle cx="160" cy="54" r="11" /><path d="M168 62l9 9" /></g
			>
		</svg>
	{:else if index === 1}
		<svg viewBox="0 0 200 110" class="sv sv2">
			<path class="pipe" d="M20 24H82" />
			<rect class="tb" x="70" y="14" width="26" height="18" rx="6" />
			<rect class="kn" x="77" y="7" width="12" height="7" rx="2" />
			<path class="sp" d="M92 28h8a6 6 0 0 1 6 6v6" />
			<path class="st" d="M106 44V74" />
			<g class="bt"
				><rect class="gl" x="92" y="62" width="28" height="40" rx="6" /><rect
					class="wt"
					x="93.5"
					y="63.5"
					width="25"
					height="37"
					rx="5"
				/><rect class="cp" x="98" y="52" width="16" height="8" rx="2" /></g
			>
			<g class="ck"
				><circle cx="160" cy="80" r="12" /><path d="M154 80l4 4 8-8" /></g
			>
		</svg>
	{:else if index === 2}
		<svg viewBox="0 0 200 110" class="sv sv3">
			<path class="ax" d="M24 94H180" />
			{#each bars as [x, y, h], i (x)}
				<rect
					class={["br", i === 4 && "pb"]}
					{x}
					{y}
					width="12"
					height={h}
					rx="2"
					style:--i={i}
				/>
			{/each}
			<line class="scan" x1="26" y1="18" x2="26" y2="94" />
			<g class="lb"
				><rect x="96" y="10" width="64" height="20" rx="6" /><text
					x="128"
					y="24">{v.value}</text
				></g
			>
		</svg>
	{:else}
		<svg viewBox="0 0 200 110" class="sv sv4">
			<g class="doc">
				<rect class="pg" x="58" y="8" width="84" height="96" rx="6" />
				<rect class="hd" x="58" y="8" width="84" height="16" rx="6" />
				<rect class="hd2" x="58" y="18" width="84" height="6" />
				<text class="tt" x="66" y="19.5">{v.report}</text>
				{#each rows as [y, w], i (y)}
					<g class="row" style:--i={i}
						><rect class="li" x="66" {y} width={w} height="5" rx="2.5" /><circle
							class="dt"
							cx="132"
							cy={y + 2}
							r="4"
						/><path class="ck" d={`M130 ${y + 2}l1.5 1.5 3-3.2`} /></g
					>
				{/each}
				<rect class="val" x="66" y="78" width="68" height="18" rx="5" />
				<text class="vt" x="100" y="90.5">{v.result}</text>
			</g>
			<g class="pill"
				><rect x="148" y="30" width="46" height="18" rx="9" /><text
					x="171"
					y="42.5">{v.pill}</text
				></g
			>
		</svg>
	{/if}
{/snippet}

<SvcSteps {steps} {visual} />

<style>
	/* .pb-sv .sv, .sv text */
	.sv {
		width: 100%;
		height: 100%;
		font-family: inherit;
	}
	.sv text {
		font-size: 10px;
		font-weight: 600;
		text-anchor: middle;
	}
	/* 1 */
	.sv1 .ln {
		fill: none;
		stroke: #c9d2ce;
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.sv1 .pp {
		fill: none;
		stroke: #b9c4c0;
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sv1 .hlp {
		fill: none;
		stroke: #d9622b;
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 44;
		stroke-dashoffset: 44;
		transition: stroke-dashoffset 0.6s ease 0.7s;
	}
	.sv1 .tag rect {
		fill: #eef1ef;
	}
	.sv1 .tag text {
		fill: var(--muted);
	}
	.sv1 .lb {
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.3s 1.2s,
			transform 0.3s 1.2s;
	}
	.sv1 .lb rect {
		fill: #fcede8;
	}
	.sv1 .lb text {
		fill: #a8452e;
	}
	.sv1 .mag circle {
		fill: rgba(255, 255, 255, 0.6);
		stroke: var(--ink);
		stroke-width: 2.5;
	}
	.sv1 .mag path {
		stroke: var(--ink);
		stroke-width: 3.5;
		stroke-linecap: round;
	}
	.sv1 .mag {
		transition: transform 0.9s cubic-bezier(0.5, 0, 0.2, 1);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv1 .mag {
		transform: translate(-80px, 10px);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv1 .hlp {
		stroke-dashoffset: 0;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv1 .lb {
		opacity: 1;
		transform: none;
	}
	/* 2 */
	.sv2 .pipe {
		stroke: #c9d2ce;
		stroke-width: 7;
		stroke-linecap: round;
	}
	.sv2 .tb,
	.sv2 .kn {
		fill: #dde3e0;
		stroke: #b9c4c0;
		stroke-width: 1.5;
	}
	.sv2 .kn {
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 0.4s;
	}
	.sv2 .sp {
		fill: none;
		stroke: #b9c4c0;
		stroke-width: 7;
		stroke-linecap: round;
	}
	.sv2 .st {
		stroke: #8dbee3;
		stroke-width: 3.5;
		stroke-linecap: round;
		stroke-dasharray: 30;
		stroke-dashoffset: 30;
		transition: stroke-dashoffset 0.35s ease-in 0.3s;
	}
	.sv2 .gl {
		fill: #fff;
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.sv2 .wt {
		fill: #9cc7e8;
		transform-box: fill-box;
		transform-origin: 50% 100%;
		transform: scaleY(0);
		transition: transform 1.3s ease-in 0.55s;
	}
	.sv2 .cp {
		fill: var(--ink);
		transform: translateY(-8px);
		transition: transform 0.35s 2s;
	}
	.sv2 .ck {
		opacity: 0;
		transform: scale(0.6);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 0.3s 2.3s,
			transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) 2.3s;
	}
	.sv2 .ck circle {
		fill: var(--accent);
	}
	.sv2 .ck path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv2 .kn {
		transform: rotate(-35deg);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv2 .st {
		stroke-dashoffset: 0;
		transition:
			stroke-dashoffset 0.35s ease-in 0.3s,
			opacity 0.3s 1.9s;
		opacity: 0;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv2 .wt {
		transform: scaleY(0.8);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv2 .cp {
		transform: none;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv2 .ck {
		opacity: 1;
		transform: none;
	}
	/* 3 */
	.sv3 .ax {
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.sv3 .br {
		fill: #dde3e0;
		transform-box: fill-box;
		transform-origin: 50% 100%;
		transform: scaleY(0.15);
		transition:
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)
				calc(0.2s + var(--i) * 0.09s),
			fill 0.3s;
	}
	.sv3 .scan {
		stroke: var(--accent-deep);
		stroke-width: 2;
		opacity: 0;
		transition:
			transform 1s linear 0.15s,
			opacity 0.2s;
	}
	.sv3 .lb {
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.3s 1.3s,
			transform 0.3s 1.3s;
	}
	.sv3 .lb rect {
		fill: var(--ink);
	}
	.sv3 .lb text {
		fill: #fff;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv3 .br {
		transform: none;
		fill: #b9d8ef;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv3 .br.pb {
		fill: #d9a12b;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv3 .scan {
		opacity: 1;
		transform: translateX(152px);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv3 .lb {
		opacity: 1;
		transform: none;
	}
	/* 4 */
	.sv4 .pg {
		fill: #fff;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.sv4 .hd,
	.sv4 .hd2 {
		fill: var(--ink);
	}
	.sv4 .tt {
		fill: #fff;
		font-size: 7.5px;
		text-anchor: start;
	}
	.sv4 .li {
		fill: #e3e8e6;
		transform-box: fill-box;
		transform-origin: 0 50%;
		transform: scaleX(0.2);
		transition: transform 0.45s ease calc(0.15s + var(--i) * 0.22s);
	}
	.sv4 .dt {
		fill: #eef1ef;
		transition: fill 0.3s calc(0.4s + var(--i) * 0.22s);
	}
	.sv4 .ck {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0;
		transition: opacity 0.2s calc(0.45s + var(--i) * 0.22s);
	}
	.sv4 .val {
		fill: #eef1ef;
		transition: fill 0.4s 1.1s;
	}
	.sv4 .vt {
		fill: var(--muted);
		font-size: 11px;
		transition: fill 0.4s 1.1s;
	}
	.sv4 .pill {
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.3s 1.4s,
			transform 0.35s 1.4s;
	}
	.sv4 .pill rect {
		fill: var(--accent);
	}
	.sv4 .pill text {
		fill: var(--ink);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv4 .li {
		transform: none;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv4 .dt {
		fill: var(--accent);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv4 .ck {
		opacity: 1;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv4 .val {
		fill: #fbf4e2;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv4 .vt {
		fill: #7a5a12;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .sv4 .pill {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.sv * {
			transition: none !important;
		}
	}
</style>

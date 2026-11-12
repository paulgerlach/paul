<!--
  "Vier Schritte. Ein Ansprechpartner." (the template's steps, the design's
  #ha-steps-css): the rooms ticked off, the heat loads, the valve, pump and
  flow temperature, the stamped confirmation. Decorative.
-->
<script lang="ts">
	import SvcSteps from "$lib/landing/sections/svc/Steps.svelte";
	import { STEPS_ID, stepVisuals as v, steps } from "../content";

	/** Step 1's four rooms: the radiator's and the tick's places. */
	const rooms = [
		[50, 40, 65, 30],
		[110, 40, 125, 30],
		[60, 88, 75, 78],
		[120, 88, 135, 78],
	];
	/** Step 2's four rooms. */
	const loads = [
		{ x: 24, y: 14, w: 54, h: 36, tx: 51, ty: 36 },
		{ x: 82, y: 14, w: 56, h: 36, tx: 110, ty: 36 },
		{ x: 24, y: 54, w: 74, h: 44, tx: 61, ty: 80 },
		{ x: 102, y: 54, w: 36, h: 44, tx: 120, ty: 80 },
	];
	/** Step 3's dial numbers. */
	const dial: [string, number, number][] = [
		["1", -19.1, 14.0],
		["2", -20.1, -5.9],
		["3", -4.6, -18.5],
		["4", 14.7, -13.3],
		["5", 21.9, 5.3],
		["6", 11.0, 22.1],
	];
</script>

{#snippet visual(index: number)}
	{#if index === 0}
		<svg viewBox="0 0 200 110" class="sv h1s">
			<rect class="wl" x="22" y="12" width="118" height="88" rx="4" />
			<path class="wl" d="M80 12v40M22 52h118M100 52v48" />
			{#each rooms as [rx, ry, ox, oy], i (rx + ry)}
				<g class="rm" style:--i={i}
					><g class="rd" transform={`translate(${rx} ${ry})`}
						><rect x="-9" y="-5" width="18" height="10" rx="2" /><path
							d="M-5-3v6M-1-3v6M3-3v6"
						/></g
					><g transform={`translate(${ox} ${oy})`}
						><g class="ok"><circle r="6" /><path d="M-3 0l2 2 4-4.2" /></g></g
					></g
				>
			{/each}
			<g class="pill"
				><rect x="148" y="40" width="46" height="30" rx="8" /><text
					class="t1"
					x="171"
					y="53">{v.captured[0]}</text
				><text class="t2" x="171" y="63">{v.captured[1]}</text></g
			>
		</svg>
	{:else if index === 1}
		<svg viewBox="0 0 200 110" class="sv h2s">
			<rect class="wl" x="22" y="12" width="118" height="88" rx="4" />
			<path class="wl" d="M80 12v40M22 52h118M100 52v48" />
			{#each loads as r, i (r.x + r.y)}
				<g class="hv" style:--i={i}
					><rect
						class="hf"
						x={r.x}
						y={r.y}
						width={r.w}
						height={r.h}
						rx="2"
					/><text x={r.tx} y={r.ty}>{v.loads[i]}</text></g
				>
			{/each}
			<g class="pill"
				><rect x="146" y="44" width="50" height="20" rx="10" /><text
					x="171"
					y="57.5">{v.norm}</text
				></g
			>
		</svg>
	{:else if index === 2}
		<svg viewBox="0 0 200 110" class="sv h3s">
			<g transform="translate(52 55)">
				<circle class="vb" r="30" />
				{#each dial as [n, x, y] (n)}
					<text class="vn" {x} {y}>{n}</text>
				{/each}
				<g class="kn"
					><circle class="gh" r="18" /><circle r="11" /><path d="M0-11v-7" /></g
				>
			</g>
			<g transform="translate(122 55)">
				<circle class="pb" r="18" />
				<g class="imp"
					><circle r="13" fill="none" /><path
						d="M0 0L0-13M0 0L11 6.5M0 0L-11 6.5"
					/></g
				>
				<circle class="hub" r="3" />
			</g>
			<g class="tm">
				<rect x="156" y="22" width="34" height="62" rx="8" />
				<text class="tl" x="173" y="36">{v.flow}</text>
				<text class="tv a" x="173" y="58">{v.temps[0]}</text>
				<text class="tv b" x="173" y="58">{v.temps[1]}</text>
				<rect class="tb" x="164" y="66" width="18" height="6" rx="3" />
				<rect class="tf" x="164" y="66" width="18" height="6" rx="3" />
			</g>
		</svg>
	{:else}
		<svg viewBox="0 0 200 110" class="sv h4s">
			<rect class="pg" x="44" y="8" width="96" height="96" rx="6" />
			<text class="tt" x="54" y="23">{v.report}</text>
			{#each v.settings as setting, i (setting)}
				<g class="row" style:--i={i}
					><rect
						class="li"
						x="54"
						y={33 + 13 * i}
						width="46"
						height="5"
						rx="2.5"
					/><text class="vv" x="128" y={38 + 13 * i}>{setting}</text></g
				>
			{/each}
			<path class="sig" d="M56 90c6-8 10 4 15-3s8-6 11 1 7-4 12-2" />
			<path class="sl" d="M54 94h48" />
			<g class="stp"
				><circle cx="152" cy="74" r="20" /><circle
					class="in"
					cx="152"
					cy="74"
					r="16"
				/><text x="152" y="77.5">{v.stamp}</text></g
			>
		</svg>
	{/if}
{/snippet}

<SvcSteps {steps} id={STEPS_ID} {visual} />

<style>
	/* .pb-sv .sv, .sv text, .sv .wl */
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
	.sv .wl {
		fill: none;
		stroke: #c9d2ce;
		stroke-width: 2;
	}
	/* 1 */
	.h1s .rd rect {
		fill: #eef1ef;
		stroke: #b9c4c0;
		stroke-width: 1.3;
		transition:
			fill 0.3s calc(0.2s + var(--i) * 0.25s),
			stroke 0.3s calc(0.2s + var(--i) * 0.25s);
	}
	.h1s .rd path {
		stroke: #b9c4c0;
		stroke-width: 1.2;
	}
	.h1s .ok {
		opacity: 0;
		transform: scale(0.4);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 0.25s calc(0.3s + var(--i) * 0.25s),
			transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1)
				calc(0.3s + var(--i) * 0.25s);
	}
	.h1s .ok circle {
		fill: var(--accent);
	}
	.h1s .ok path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.h1s .pill {
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s 1.3s,
			transform 0.35s 1.3s;
	}
	.h1s .pill rect {
		fill: var(--ink);
	}
	.h1s .t1 {
		fill: #fff;
		font-size: 9.5px;
	}
	.h1s .t2 {
		fill: rgba(255, 255, 255, 0.7);
		font-size: 8px;
		font-weight: 500;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h1s .rd rect {
		fill: #e7f6e8;
		stroke: #8ad68f;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h1s .ok,
	:global(li.step:is(:hover, :focus-visible, .play)) .h1s .pill {
		opacity: 1;
		transform: none;
	}
	/* 2 */
	.h2s .hf {
		fill: #e8835a;
		opacity: 0;
		transition:
			opacity 0.4s calc(0.15s + var(--i) * 0.22s),
			fill 0.4s;
	}
	.h2s .hv text {
		fill: var(--ink);
		font-size: 9.5px;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.3s calc(0.3s + var(--i) * 0.22s),
			transform 0.35s calc(0.3s + var(--i) * 0.22s);
	}
	/* The design's :nth-child(3…6) of the rooms (after the two wall shapes). */
	.h2s .hv:nth-of-type(1) .hf {
		fill: #f2b08f;
	}
	.h2s .hv:nth-of-type(2) .hf {
		fill: #f6c9b0;
	}
	.h2s .hv:nth-of-type(3) .hf {
		fill: #e8835a;
	}
	.h2s .hv:nth-of-type(4) .hf {
		fill: #f9dccb;
	}
	.h2s .pill {
		opacity: 0;
		transition: opacity 0.3s 1.2s;
	}
	.h2s .pill rect {
		fill: var(--ink);
	}
	.h2s .pill text {
		fill: #fff;
		font-size: 8.5px;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h2s .hf {
		opacity: 0.55;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h2s .hv text {
		opacity: 1;
		transform: none;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h2s .pill {
		opacity: 1;
	}
	/* 3 */
	.h3s .vb {
		fill: #eef1ef;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.h3s .vn {
		fill: var(--muted);
		font-size: 7.5px;
		font-weight: 600;
	}
	.h3s .kn circle:not(.gh) {
		fill: #fff;
		stroke: var(--ink);
		stroke-width: 1.6;
	}
	.h3s .kn path {
		stroke: var(--ink);
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.h3s .kn {
		transform: rotate(-120deg);
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 0.9s cubic-bezier(0.3, 1.3, 0.5, 1) 0.15s;
	}
	.h3s .kn .gh {
		fill: none;
		stroke: none;
	}
	.h3s .pb {
		fill: #fff;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.h3s .imp {
		transform-box: fill-box;
		transform-origin: center;
	}
	.h3s .imp path {
		stroke: var(--ink);
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.h3s .hub {
		fill: var(--ink);
	}
	.h3s .tm > rect:first-child {
		fill: #fbf4f0;
		stroke: #f0d5c7;
		stroke-width: 1;
	}
	.h3s .tl {
		fill: var(--muted);
		font-size: 7.5px;
	}
	.h3s .tv {
		font-size: 15px;
		transition:
			opacity 0.35s 0.9s,
			transform 0.4s 0.9s;
	}
	.h3s .tv.a {
		fill: #c8582e;
	}
	.h3s .tv.b {
		fill: #2f6b37;
		opacity: 0;
		transform: translateY(6px);
	}
	.h3s .tb {
		fill: #eef1ef;
	}
	.h3s .tf {
		fill: #e8835a;
		transform-box: fill-box;
		transform-origin: 0 50%;
		transition:
			transform 0.8s 0.9s,
			fill 0.4s 0.9s;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h3s .kn {
		transform: rotate(42deg);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h3s .imp {
		animation: hs-spin 0.9s linear infinite;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h3s .tv.a {
		opacity: 0;
		transform: translateY(-6px);
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h3s .tv.b {
		opacity: 1;
		transform: none;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h3s .tf {
		transform: scaleX(0.6);
		fill: #8ad68f;
	}
	@keyframes hs-spin {
		to {
			transform: rotate(360deg);
		}
	}
	/* 4 */
	.h4s .pg {
		fill: #fff;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.h4s .tt {
		fill: var(--ink);
		font-size: 8px;
		text-anchor: start;
	}
	.h4s .li {
		fill: #e3e8e6;
		transform-box: fill-box;
		transform-origin: 0 50%;
		transform: scaleX(0.25);
		transition: transform 0.45s ease calc(0.15s + var(--i) * 0.2s);
	}
	.h4s .vv {
		fill: var(--ink);
		font-size: 8px;
		text-anchor: end;
		opacity: 0;
		transition: opacity 0.3s calc(0.35s + var(--i) * 0.2s);
	}
	.h4s .sig {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-dasharray: 60;
		stroke-dashoffset: 60;
		transition: stroke-dashoffset 0.7s ease 0.85s;
	}
	.h4s .sl {
		stroke: #c9d2ce;
		stroke-width: 1;
	}
	.h4s .stp {
		opacity: 0;
		transform: scale(1.5) rotate(-18deg);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 0.2s 1.5s,
			transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1) 1.5s;
	}
	.h4s .stp circle {
		fill: none;
		stroke: #3f8a48;
		stroke-width: 2;
	}
	.h4s .stp .in {
		stroke-width: 1;
		stroke-dasharray: 2 2;
	}
	.h4s .stp text {
		fill: #3f8a48;
		font-size: 7.5px;
		font-weight: 700;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h4s .li {
		transform: none;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h4s .vv {
		opacity: 1;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h4s .sig {
		stroke-dashoffset: 0;
	}
	:global(li.step:is(:hover, :focus-visible, .play)) .h4s .stp {
		opacity: 1;
		transform: rotate(-12deg);
	}
</style>

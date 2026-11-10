<!--
  "Vier Schritte. Ein Ansprechpartner." (.pg-sec#ablauf, the design's
  .lg-steps.pb-steps with #lg-steps-css / #lg-steps-js): four cards, each
  with a small picture that plays on hover and focus (the cards are
  focusable, as in the design); on touch screens it plays while 60 % of the
  card is in view. The number turns green as the card reveals
  (server-rendered green). The pictures are decorative.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { STEPS_ID, steps } from "../content";

	const v = steps.visuals;
	/** Touch screens: no hover, so a picture plays while its card is in view. */
	let touch = false;
	let playing = $state(steps.items.map(() => false));

	onMount(() => {
		touch = window.matchMedia("(hover: none)").matches;
	});
</script>

{#snippet visual(index: number)}
	{#if index === 0}
		<svg viewBox="0 0 200 110" class="sv sv5">
			{#each [18, 48, 78] as y, i (y)}
				<g class="r5" style:--i={i}
					><path class="hs" d={`M28 ${y}l9-7 9 7v10h-18z`} /><rect
						class="lb5"
						x="56"
						y={y + 2}
						width={[70, 54, 62][i]}
						height="6"
						rx="3"
					/><g class="ok" transform={`translate(150 ${y + 5})`}
						><circle r="7" /><path d="M-3 0l2 2 4-4.2" /></g
					></g
				>
			{/each}
			<g class="tag"
				><rect x="110" y="44" width="76" height="18" rx="6" /><text
					x="148"
					y="56.5">{v.due}</text
				></g
			>
		</svg>
	{:else if index === 1}
		<svg viewBox="0 0 200 110" class="sv sv6">
			<g
				><rect class="pg" x="22" y="12" width="96" height="86" rx="8" /><rect
					class="hd"
					x="22"
					y="12"
					width="96"
					height="18"
					rx="8"
				/><rect class="hd" x="22" y="22" width="96" height="8" />
				{#each [38, 57, 76] as y (y)}
					{#each [30, 51, 72, 93] as x (x)}
						<rect class="dy" {x} {y} width="16" height="14" rx="3" />
					{/each}
				{/each}
				<g class="pin"
					><circle cx="81" cy="64" r="11" /><text x="81" y="68">{v.day}</text
					></g
				></g
			>
			<g class="note"
				><rect x="132" y="30" width="54" height="62" rx="5" /><rect
					class="nl"
					x="140"
					y="42"
					width="38"
					height="4"
					rx="2"
				/><rect class="nl" x="140" y="51" width="30" height="4" rx="2" /><rect
					class="nl"
					x="140"
					y="60"
					width="34"
					height="4"
					rx="2"
				/><path class="tack" d="M159 26v8" /></g
			>
			<g class="pill"
				><rect x="128" y="76" width="62" height="18" rx="9" /><text
					x="159"
					y="88.5">{v.informed}</text
				></g
			>
		</svg>
	{:else if index === 2}
		<svg viewBox="0 0 200 110" class="sv sv7">
			<path class="pp" d="M16 30H184" />
			<path class="fl" d="M16 30H184" />
			{#each [50, 100, 150] as x, i (x)}
				<g class="tp" style:--i={i}
					><path class="spp" d={`M${x} 30v14`} /><rect
						class="vl"
						x={x - 7}
						y="54"
						width="14"
						height="38"
						rx="5"
					/><rect
						class="vw"
						x={x - 6}
						y="55.5"
						width="11"
						height="35"
						rx="4"
					/><rect
						class="vc"
						x={x - 8}
						y="48"
						width="16"
						height="6"
						rx="2"
					/><text class="vn" {x} y="104">{v.taps[i]}</text></g
				>
			{/each}
			<circle class="dot" cx="16" cy="30" r="5" />
		</svg>
	{:else}
		<svg viewBox="0 0 200 110" class="sv sv8">
			<rect class="pg" x="20" y="10" width="112" height="92" rx="7" />
			<text class="tt" x="30" y="26">{v.report}</text>
			<path class="ax" d="M34 88H120" />
			<rect class="b1" x="44" y="58" width="16" height="30" rx="3" />
			<rect class="b2" x="70" y="76" width="16" height="12" rx="3" />
			<rect class="b3" x="96" y="38" width="16" height="50" rx="3" />
			<path class="lim" d="M34 62H120" />
			<text class="lt" x="120" y="58">{v.limit}</text>
			<g class="warn"
				><rect x="140" y="24" width="52" height="38" rx="8" /><text
					class="w1"
					x="166"
					y="40">{v.value}</text
				><text class="w2" x="166" y="53">{v.unit}</text></g
			>
			<g class="pill"
				><rect x="140" y="70" width="52" height="18" rx="9" /><text
					x="166"
					y="82.5">{v.action}</text
				></g
			>
		</svg>
	{/if}
{/snippet}

<section class="pg-sec stp" id={STEPS_ID} aria-labelledby="ab-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="ab-h" eyebrow={steps.pill} heading={steps.h2}>
				{#snippet icon()}
					<path d="M3 10h14M13 6l4 4-4 4" />
				{/snippet}
			</SectionHead>
		</div>
		<ol class="steps">
			{#each steps.items as item, i (item.title)}
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<li
					class={["rv", playing[i] && "play"]}
					tabindex="0"
					style:--d={`${i * 0.08}s`}
					{@attach inView({
						threshold: 0.6,
						onEnter: () => (playing[i] = touch),
						onLeave: () => (playing[i] = false),
					})}
				>
					<div class="sv-box" aria-hidden="true">{@render visual(i)}</div>
					<span class="n">{i + 1}</span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.stp .head :global(h2) {
		margin-top: 18px;
	}
	.head {
		max-width: 760px;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 40px 0 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		position: relative;
	}
	.steps li {
		position: relative;
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px;
		outline: none;
	}
	.steps li:focus-visible {
		box-shadow: 0 0 0 2px var(--accent-deep);
	}
	/* The reveal's transition keeps the design's per-card delay. */
	ol.steps > li:global(.rv.rv-anim) {
		transition-delay: var(--d);
	}
	.n {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		font-size: 14px;
		font-weight: 600;
		transition:
			background 0.4s calc(var(--d) + 0.3s),
			color 0.4s calc(var(--d) + 0.3s);
	}
	li:global(.rv-wait) .n {
		background: var(--ink);
		color: #fff;
	}
	/* `.steps h3`: beats the landing reset of heading margins. */
	.steps h3 {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 16px;
	}
	.steps p {
		font-size: 14.5px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
	}
	/* .pb-sv */
	.sv-box {
		height: 120px;
		margin: -6px -6px 18px;
		border-radius: 14px;
		background: #fff;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		overflow: hidden;
	}
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
	.sv5 .hs {
		fill: #eef1ef;
		stroke: #b9c4c0;
		stroke-width: 1.5;
		stroke-linejoin: round;
		transition: fill 0.3s calc(0.2s + var(--i) * 0.25s);
	}
	.sv5 .lb5 {
		fill: #e3e8e6;
		transform-box: fill-box;
		transform-origin: 0 50%;
		transform: scaleX(0.25);
		transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)
			calc(0.1s + var(--i) * 0.25s);
	}
	.sv5 .ok circle {
		fill: #eef1ef;
		transition: fill 0.3s calc(0.45s + var(--i) * 0.25s);
	}
	.sv5 .ok path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0;
		transition: opacity 0.2s calc(0.5s + var(--i) * 0.25s);
	}
	.sv5 .tag {
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s 1.1s,
			transform 0.35s 1.1s;
	}
	.sv5 .tag rect {
		fill: #fcede8;
	}
	.sv5 .tag text {
		fill: #a8452e;
	}
	li:is(:hover, :focus-visible, .play) .sv5 .lb5 {
		transform: none;
	}
	li:is(:hover, :focus-visible, .play) .sv5 .ok circle {
		fill: var(--accent);
	}
	li:is(:hover, :focus-visible, .play) .sv5 .r5:nth-child(2) .ok circle {
		fill: #f3b9a4;
	}
	li:is(:hover, :focus-visible, .play) .sv5 .ok path {
		opacity: 1;
	}
	li:is(:hover, :focus-visible, .play) .sv5 .r5:nth-child(2) .hs {
		fill: #fcede8;
	}
	li:is(:hover, :focus-visible, .play) .sv5 .r5:nth-child(2) .ok {
		opacity: 0;
	}
	li:is(:hover, :focus-visible, .play) .sv5 .tag {
		opacity: 1;
		transform: none;
	}
	/* 2 */
	.sv6 .pg {
		fill: #fff;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.sv6 .hd {
		fill: var(--ink);
	}
	.sv6 .dy {
		fill: #eef1ef;
	}
	.sv6 .pin {
		opacity: 0;
		transform: translateY(-14px) scale(0.6);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 0.3s 0.35s,
			transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1) 0.35s;
	}
	.sv6 .pin circle {
		fill: var(--accent);
	}
	.sv6 .pin text {
		fill: var(--ink);
		font-size: 10px;
	}
	.sv6 .note {
		transform: translate(30px, -6px) rotate(8deg);
		opacity: 0;
		transform-box: fill-box;
		transform-origin: 50% 0;
		transition:
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s,
			opacity 0.3s 0.8s;
	}
	.sv6 .note > rect:first-child {
		fill: #fff8e4;
		stroke: #e8d9a8;
		stroke-width: 1;
	}
	.sv6 .nl {
		fill: #e5d9b5;
	}
	.sv6 .tack {
		stroke: #d9622b;
		stroke-width: 3;
		stroke-linecap: round;
	}
	.sv6 .pill {
		opacity: 0;
		transition: opacity 0.3s 1.4s;
	}
	.sv6 .pill rect,
	.sv8 .pill rect {
		fill: var(--ink);
	}
	.sv6 .pill text,
	.sv8 .pill text {
		fill: #fff;
	}
	li:is(:hover, :focus-visible, .play) .sv6 .pin {
		opacity: 1;
		transform: none;
	}
	li:is(:hover, :focus-visible, .play) .sv6 .note {
		transform: none;
		opacity: 1;
	}
	li:is(:hover, :focus-visible, .play) .sv6 .pill {
		opacity: 1;
	}
	/* 3 */
	.sv7 .pp {
		stroke: #dde3e0;
		stroke-width: 8;
		stroke-linecap: round;
	}
	.sv7 .fl {
		stroke: #9cc7e8;
		stroke-width: 3;
		stroke-linecap: round;
		stroke-dasharray: 6 8;
		opacity: 0;
		transition: opacity 0.3s;
	}
	.sv7 .spp {
		stroke: #c9d2ce;
		stroke-width: 4;
		stroke-linecap: round;
	}
	.sv7 .vl {
		fill: #fff;
		stroke: var(--ink);
		stroke-width: 1.4;
	}
	.sv7 .vw {
		fill: #9cc7e8;
		transform-box: fill-box;
		transform-origin: 50% 100%;
		transform: scaleY(0);
		transition: transform 0.5s ease-in calc(0.35s + var(--i) * 0.45s);
	}
	.sv7 .vc {
		fill: #c9d2ce;
		transition: fill 0.3s calc(0.8s + var(--i) * 0.45s);
	}
	.sv7 .vn {
		fill: var(--muted);
		font-size: 8.5px;
		font-weight: 500;
	}
	.sv7 .dot {
		fill: var(--accent-deep, #4a9a52);
		opacity: 0;
		transition:
			transform 1.4s cubic-bezier(0.45, 0, 0.3, 1) 0.2s,
			opacity 0.2s;
	}
	li:is(:hover, :focus-visible, .play) .sv7 .fl {
		opacity: 1;
		animation: lgs-fl 1s linear infinite;
	}
	li:is(:hover, :focus-visible, .play) .sv7 .vw {
		transform: scaleY(0.75);
	}
	li:is(:hover, :focus-visible, .play) .sv7 .vc {
		fill: var(--ink);
	}
	li:is(:hover, :focus-visible, .play) .sv7 .dot {
		opacity: 1;
		transform: translateX(134px);
	}
	@keyframes lgs-fl {
		to {
			stroke-dashoffset: -28;
		}
	}
	/* 4 */
	.sv8 .pg {
		fill: #fff;
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.sv8 .tt {
		fill: var(--ink);
		font-size: 8.5px;
		text-anchor: start;
	}
	.sv8 .ax {
		stroke: #c9d2ce;
		stroke-width: 1.5;
	}
	.sv8 .b1,
	.sv8 .b2,
	.sv8 .b3 {
		fill: #dde3e0;
		transform-box: fill-box;
		transform-origin: 50% 100%;
		transform: scaleY(0.12);
		transition:
			transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1),
			fill 0.3s;
	}
	.sv8 .b2 {
		transition-delay: 0.12s;
	}
	.sv8 .b3 {
		transition-delay: 0.24s, 0.7s;
	}
	.sv8 .lim {
		stroke: #d9622b;
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
		opacity: 0.35;
		transition: opacity 0.3s 0.5s;
	}
	.sv8 .lt {
		fill: #a8452e;
		font-size: 7.5px;
		text-anchor: end;
		opacity: 0.4;
		transition: opacity 0.3s 0.5s;
	}
	.sv8 .warn {
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.3s 0.95s,
			transform 0.35s 0.95s;
	}
	.sv8 .warn rect {
		fill: #fcede8;
	}
	.sv8 .w1 {
		fill: #a8452e;
		font-size: 13px;
	}
	.sv8 .w2 {
		fill: #a8452e;
		font-size: 7px;
		font-weight: 500;
	}
	.sv8 .pill {
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.3s 1.2s,
			transform 0.35s 1.2s;
	}
	.sv8 .pill text {
		font-size: 9px;
	}
	li:is(:hover, :focus-visible, .play) .sv8 .b1,
	li:is(:hover, :focus-visible, .play) .sv8 .b2 {
		transform: none;
		fill: #b9d8ef;
	}
	li:is(:hover, :focus-visible, .play) .sv8 .b3 {
		transform: none;
		fill: #e8835a;
	}
	li:is(:hover, :focus-visible, .play) .sv8 .lim,
	li:is(:hover, :focus-visible, .play) .sv8 .lt {
		opacity: 1;
	}
	li:is(:hover, :focus-visible, .play) .sv8 .warn,
	li:is(:hover, :focus-visible, .play) .sv8 .pill {
		opacity: 1;
		transform: none;
	}
	@media (max-width: 1040px) {
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.steps {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sv-box :global(*) {
			transition: none !important;
			animation: none !important;
		}
	}
</style>

<!--
  The design's closing card (`.db-end .cta`): the shared dark CtaCard with the
  page's signup form (in place of the design's own e-mail form) and the
  animated chart below. It's the page's only form, so it carries the `start`
  anchor. "Lieber direkt eine Demo buchen" is left out while DEMO_HREF is
  this form (plan README, open question 2).
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { tweenNumber } from "$lib/landing/motion";
	import CtaCard from "$lib/landing/sections/CtaCard.svelte";
	import { stepCurve } from "../chart";
	import { closing } from "../content";
	import { enterView } from "../enterView";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();

	const W = 1000;
	const H = 210;
	let current = $state(closing.chart.current.slice());
	let previous = $state(closing.chart.previous.slice());
	/** Share of the width drawn (the grow-in; all on the server). */
	let drawn = $state(1);
	const line = $derived(stepCurve(current, W));

	/** Grows in from the left once, on first view (plan 03, 3B.8). */
	const growIn = enterView({
		prepare: () => (drawn = 0),
		play: () => tweenNumber(0, 1, 2000, (v) => (drawn = v)),
	});

	/** Then drifts to new nearby values every 3.2 s while in view. */
	function drift() {
		const fromA = current.slice();
		const fromB = previous.slice();
		const { current: a, previous: b } = closing.chart;
		const toA = a.map((v) => v + (Math.random() - 0.5) * 14);
		toA[toA.length - 1] = a[a.length - 1] - Math.random() * 10;
		const toB = b.map((v) => v + (Math.random() - 0.5) * 8);
		return tweenNumber(0, 1, 1500, (k) => {
			current = fromA.map((v, i) => v + (toA[i] - v) * k);
			previous = fromB.map((v, i) => v + (toB[i] - v) * k);
		});
	}
</script>

<div class="closing">
	<CtaCard
		id="db-closing-h"
		title={closing.h2}
		accent={closing.h2Accent}
		text={closing.text}
		sectionId="start"
		final
	>
		{#snippet action()}
			<SignupForm
				{form}
				placement="final"
				inputId="email-bottom"
				submitLabel={closing.submitLabel}
			/>
		{/snippet}
		{#snippet visual()}
			<div
				class="vis"
				aria-hidden="true"
				{@attach growIn}
				{@attach loopInView({ run: drift, every: 3200, delay: 2200 })}
			>
				<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none">
					<defs>
						<linearGradient id="db-cg" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stop-color="#8AD68F" stop-opacity=".30" />
							<stop offset="1" stop-color="#8AD68F" stop-opacity="0" />
						</linearGradient>
						<clipPath id="db-ccp">
							<rect x="0" y="0" width={W * drawn} height={H} />
						</clipPath>
					</defs>
					<g clip-path="url(#db-ccp)">
						<path class="ca" d="{line} L{W} {H} L0 {H}Z" />
						<path class="cl2" d={stepCurve(previous, W)} />
						<path class="cl" d={line} />
					</g>
				</svg>
				{#if drawn >= 1}
					<span
						class="dot"
						style:top="{(current[current.length - 1] / H) * 100}%"><i></i></span
					>
				{/if}
			</div>
		{/snippet}
	</CtaCard>
</div>

<style>
	.closing :global(.end) {
		padding: 12px 0 120px;
	}
	.closing :global(.end > .wrap) {
		padding-top: 100px;
	}
	.closing :global(.cta.has-text) {
		position: relative;
		overflow: hidden;
		display: block;
		border-radius: 22px;
		padding: 84px clamp(24px, 6vw, 88px) 0;
		min-height: 560px;
	}
	.closing :global(.cta::before) {
		content: "";
		position: absolute;
		left: 30%;
		bottom: -30%;
		width: 70%;
		height: 90%;
		background: radial-gradient(
			closest-side,
			rgba(138, 214, 143, 0.22),
			transparent
		);
		pointer-events: none;
	}
	.closing :global(.cta::after) {
		content: "";
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size: 48px 48px;
		-webkit-mask-image: linear-gradient(180deg, transparent, #000 60%);
		mask-image: linear-gradient(180deg, transparent, #000 60%);
		pointer-events: none;
	}
	.closing :global(.cta .t) {
		position: relative;
		z-index: 1;
		max-width: none;
		gap: 18px;
	}
	.closing :global(.cta .t h2) {
		font-size: clamp(34px, 4.6vw, 64px);
		line-height: 1.04;
		letter-spacing: -0.04em;
		max-width: 21ch;
	}
	.closing :global(.cta .t h2 span) {
		color: #8fa29c;
	}
	.closing :global(.cta .t p) {
		color: #b7c4bf;
		font-size: 18px;
		max-width: 46ch;
	}
	.closing :global(.cta .signup-box.final) {
		position: relative;
		z-index: 1;
		margin-top: 32px;
		max-width: 540px;
	}
	.vis {
		position: relative;
		z-index: 1;
		margin-top: 56px;
		height: 210px;
	}
	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.ca {
		fill: url(#db-cg);
	}
	.cl {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	.cl2 {
		fill: none;
		stroke: rgba(255, 255, 255, 0.25);
		stroke-width: 1.6;
		stroke-dasharray: 4 6;
		vector-effect: non-scaling-stroke;
	}
	.dot {
		position: absolute;
		right: 0;
		width: 10px;
		height: 10px;
		transform: translate(50%, -50%);
	}
	.dot::before,
	.dot i {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--accent);
	}
	.dot i {
		opacity: 0.25;
		animation: halo 2.4s ease-out infinite;
	}
	@keyframes halo {
		0% {
			transform: scale(1);
			opacity: 0.35;
		}
		100% {
			transform: scale(3.2);
			opacity: 0;
		}
	}
	@media (max-width: 640px) {
		.closing :global(.cta.has-text) {
			padding-top: 56px;
			min-height: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dot i {
			animation: none;
		}
	}
</style>

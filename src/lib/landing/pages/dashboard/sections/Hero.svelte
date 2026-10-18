<!--
  The design's hero (`.db-hero`): pill, two-line H1, the line with three
  chips (hover popovers, decorative), the CTAs, and the dashboard preview.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { countUp } from "$lib/landing/attachments/countUp";
	import { focusSignup } from "$lib/landing/cta";
	import { de } from "../chart";
	import Icon from "../components/Icon.svelte";
	import Pill from "../components/Pill.svelte";
	import { hero } from "../content";
	import DashboardDemo from "../demo/DashboardDemo.svelte";

	const { usage, costs, alerts } = hero.chips;
	let mounted = $state(false);
	onMount(() => (mounted = true));
</script>

<section class="sec hero" aria-labelledby="db-h1">
	<div class="wrap in">
		<Pill text={hero.pill} live class="rv" />
		<h1 id="db-h1" data-hs class="rv">
			{hero.h1[0]}
			<span>{hero.h1[1]}</span>
		</h1>
		<p class="sub rv">
			<span class="l1">{hero.line1}</span>
			<span class="l2"
				>{hero.line2}
				<span class="chip v"
					><Icon name={usage.icon} />{usage.text}<span
						class="pop"
						aria-hidden="true"
						><span class="bars"
							>{#each usage.bars as h, i (i)}<i
									class={[i === usage.bars.length - 1 && "c"]}
									style:--h="{h}%"
								></i>{/each}</span
						><small>{usage.caption}</small></span
					></span
				>,
				<span class="chip k"
					><Icon name={costs.icon} />{costs.text}<span
						class="pop"
						aria-hidden="true"
						><b
							class="n"
							{@attach countUp({
								to: costs.count,
								duration: 900,
								onView: false,
								hoverTarget: ".chip",
								hoverDelay: 0,
								format: (n) => `${de(Math.round(n))} €`,
							})}>{de(costs.count)} €</b
						><small>{costs.caption}</small></span
					></span
				>
				und
				<span class="chip b"
					><Icon name={alerts.icon} />{alerts.text}<span
						class="pop"
						aria-hidden="true"
						><span class="nt"
							><i></i><span
								><b>{alerts.title}</b><small>{alerts.sub}</small></span
							></span
						></span
					></span
				>.</span
			>
		</p>
		<div class="ctas rv">
			<a class="db-btn w" href={hero.primary.href} onclick={focusSignup}
				><i class="sq" aria-hidden="true"></i>{hero.primary.text}</a
			>
			<a class="db-btn k" href={hero.secondary.href} onclick={focusSignup}
				>{hero.secondary.text} <span class="ar" aria-hidden="true">→</span></a
			>
		</div>
		<div class="preview rv">
			<p class={["hint", mounted && "on"]} aria-hidden="true">
				<span class="pulse"></span>{hero.hint}
			</p>
			<DashboardDemo label={hero.previewLabel} />
		</div>
	</div>
</section>

<style>
	.hero {
		padding-top: 84px;
		overflow: hidden;
	}
	.in {
		text-align: center;
	}
	.hero h1 {
		font-size: clamp(40px, 6vw, 80px);
		line-height: 1;
		letter-spacing: -0.045em;
		font-weight: 500;
		margin-top: 26px;
	}
	.hero h1 span {
		display: block;
		color: #8a9792;
	}
	.sub {
		color: var(--muted);
		font-size: clamp(16px, 1.6vw, 20px);
		line-height: 1.6;
		max-width: 760px;
		margin: 24px auto 0;
	}
	@media (min-width: 1000px) {
		.sub {
			max-width: none;
		}
		.l1,
		.l2 {
			display: block;
			white-space: nowrap;
		}
	}
	.chip {
		font-size: 0.92em;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 8px;
		padding: 1px 10px 1px 8px;
		color: var(--ink);
		font-weight: 500;
		white-space: nowrap;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.05);
		vertical-align: 1px;
		line-height: 1.7;
		position: relative;
		cursor: default;
		transition:
			transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.25s,
			border-color 0.25s;
	}
	.chip > :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--muted);
		transition: color 0.25s;
	}
	.chip:hover {
		transform: translateY(-2px);
		border-color: #cfe3d3;
		box-shadow: 0 10px 24px -14px rgba(30, 50, 45, 0.35);
	}
	.chip:hover > :global(svg) {
		color: var(--ok);
	}
	.chip.v:hover > :global(svg) {
		animation: dc-flick 0.9s ease-in-out infinite;
	}
	.chip.k:hover > :global(svg) {
		animation: dc-coin 0.7s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.chip.b:hover > :global(svg) {
		animation: dc-ring 0.9s ease-in-out;
		transform-origin: 50% 10%;
	}
	@keyframes dc-flick {
		0%,
		100% {
			transform: scale(1) rotate(0);
		}
		30% {
			transform: scale(1.18) rotate(-6deg);
		}
		60% {
			transform: scale(0.94) rotate(5deg);
		}
	}
	@keyframes dc-coin {
		to {
			transform: rotateY(360deg);
		}
	}
	@keyframes dc-ring {
		0%,
		100% {
			transform: rotate(0);
		}
		15% {
			transform: rotate(16deg);
		}
		30% {
			transform: rotate(-14deg);
		}
		45% {
			transform: rotate(10deg);
		}
		60% {
			transform: rotate(-6deg);
		}
		75% {
			transform: rotate(3deg);
		}
	}
	.pop {
		position: absolute;
		left: 50%;
		bottom: calc(100% + 10px);
		transform: translate(-50%, 6px);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 10px 12px;
		box-shadow: 0 18px 40px -22px rgba(30, 50, 45, 0.45);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.2s,
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
		white-space: nowrap;
		z-index: 5;
		line-height: 1.3;
		text-align: left;
		font-size: 13px;
	}
	.pop::after {
		content: "";
		position: absolute;
		left: 50%;
		bottom: -6px;
		width: 10px;
		height: 10px;
		background: #fff;
		border-right: 1px solid var(--hair);
		border-bottom: 1px solid var(--hair);
		transform: translateX(-50%) rotate(45deg);
	}
	.chip:hover .pop {
		opacity: 1;
		transform: translate(-50%, 0);
	}
	.pop small {
		display: block;
		font-size: 11.5px;
		color: var(--muted);
		font-weight: 400;
		margin-top: 4px;
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 42px;
		width: 120px;
	}
	.bars i {
		flex: 1;
		height: 6%;
		background: #d7e3da;
		border-radius: 3px 3px 0 0;
		transition: height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bars i.c {
		background: var(--ok);
	}
	.chip:hover .bars i {
		height: var(--h);
	}
	.bars i:nth-child(2) {
		transition-delay: 0.05s;
	}
	.bars i:nth-child(3) {
		transition-delay: 0.1s;
	}
	.bars i:nth-child(4) {
		transition-delay: 0.15s;
	}
	.bars i:nth-child(5) {
		transition-delay: 0.2s;
	}
	.bars i:nth-child(6) {
		transition-delay: 0.25s;
	}
	.n {
		display: block;
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}
	.nt {
		display: flex;
		gap: 9px;
		align-items: center;
	}
	.nt i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #e0893a;
		flex: none;
	}
	.chip:hover .nt i {
		animation: dc-ping 1.4s infinite;
	}
	@keyframes dc-ping {
		70% {
			box-shadow: 0 0 0 7px rgba(224, 137, 58, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(224, 137, 58, 0);
		}
	}
	.nt b {
		display: block;
		font-size: 13px;
	}
	@media (hover: none) {
		.pop {
			display: none;
		}
	}
	.ctas {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-top: 36px;
		flex-wrap: wrap;
	}
	.preview {
		position: relative;
		margin-top: 64px;
		padding-bottom: 40px;
	}
	.hint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 13.5px;
		color: var(--muted);
		margin: -26px 0 16px;
		visibility: hidden;
	}
	.hint.on {
		visibility: visible;
	}
	.pulse {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-deep);
		box-shadow: 0 0 0 0 rgba(62, 154, 87, 0.5);
		animation: hd-pl 2s infinite;
	}
	@keyframes hd-pl {
		70% {
			box-shadow: 0 0 0 8px rgba(62, 154, 87, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0);
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding-top: 56px;
		}
		.hint {
			margin-top: -10px;
			font-size: 12.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.chip > :global(svg),
		.chip:hover > :global(svg),
		.pulse,
		.chip:hover .nt i {
			animation: none;
		}
	}
</style>

<!--
  The hero's comparison (.si-stage): a switch between "Zwei Plattformen" (the
  provider's portal, a hand in the middle, every ERP entry "Manuell
  nachtragen") and "Mit Heidi" (the portal turns into Heidi, the line fills,
  every entry "Synchronisiert"). The server renders "Zwei Plattformen"; the
  state is a `Stage` (`stage.svelte.ts`). The mode is a `data-mode` attribute
  (the design's `.one` class on the stage).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import type { Attachment } from "svelte/attachments";
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { stage as t } from "../content";
	import { AUTO_SWITCH_MS, Stage } from "../stage.svelte";

	const stage = new Stage(t.erp.items.length, () => prefersReducedMotion());
	const steps = $derived(t.steps[stage.mode]);

	let wrap = $state<HTMLElement>();
	let list = $state<HTMLElement>();
	let canvas = $state<HTMLCanvasElement>();
	let stopConfetti = () => {};
	let autoTimer: ReturnType<typeof setTimeout> | undefined;

	// The design's #pg-common burst: 120 pieces from the ERP list.
	function confetti() {
		if (!wrap || !list || !canvas) return;
		// The canvas reaches 80 px past the stage on every side.
		const r = wrap.getBoundingClientRect();
		const l = list.getBoundingClientRect();
		stopConfetti();
		stopConfetti = burst(
			canvas,
			{ width: r.width + 160, height: r.height + 160 },
			{
				x: l.left - r.left + l.width / 2 + 80,
				y: l.top - r.top + l.height / 2 + 80,
				width: l.width,
			},
			{ count: 120, speed: [2.6, 4.2] },
		);
	}

	onMount(() => {
		stage.onSynced = confetti;
		return () => {
			stage.destroy();
			clearTimeout(autoTimer);
			stopConfetti();
		};
	});

	// 3.4 s after the stage first comes into view, switch to "Mit Heidi" once
	// (not with reduced motion); leaving the view before then cancels it.
	const autoSwitch = inView({
		threshold: 0.15,
		onEnter: () => {
			if (prefersReducedMotion() || stage.chosen || stage.celebrated) return;
			autoTimer = setTimeout(() => stage.autoSwitch(), AUTO_SWITCH_MS);
		},
		onLeave: () => clearTimeout(autoTimer),
	});

	// The wire's CSS packets and dots run only while the stage is in view and
	// the tab is visible (nothing with reduced motion).
	const wireLoop: Attachment<HTMLElement> = (el) =>
		loopInView({
			run: () => {
				el.classList.add("wire-on");
				return () => el.classList.remove("wire-on");
			},
			every: 60_000,
		})(el);
</script>

<div class="stage-wrap" bind:this={wrap}>
	<figure
		class="stage rv"
		data-mode={stage.mode}
		aria-label={t.label}
		{@attach autoSwitch}
		{@attach wireLoop}
	>
		<div class="top">
			<Segmented
				options={t.modes}
				bind:value={stage.mode}
				label={t.modesLabel}
			/>
			<span class="demo">{t.tag}</span>
		</div>
		<div class="board">
			<div class="src">
				<div class="win-h">
					<span class="wi"><Icon name="globe" /></span>
					<span><b>{t.portal.title}</b><small>{t.portal.sub}</small></span>
				</div>
				<ul class="src-l">
					{#each t.portal.files as file (file)}
						<li><Icon name="doc" />{file}</li>
					{/each}
				</ul>
				<div class="hd" aria-hidden="true">
					<Icon name="heidi" /><b>{t.portal.synced.title}</b><small
						>{t.portal.synced.sub}</small
					>
				</div>
			</div>
			<div class="wire" aria-hidden="true">
				<span class="hand"><Icon name="person" /></span>
				<i class="pk p1"><Icon name="doc" /></i><i class="pk p2"
					><Icon name="doc" /></i
				>
				<i class="wire-fill"></i><i class="bd b1"></i><i class="bd b2"></i><i
					class="bd b3"
				></i>
			</div>
			<div class="erp">
				<div class="win-h">
					<span class="wi dark"><Icon name="erp" /></span>
					<span><b>{t.erp.title}</b><small>{t.erp.sub}</small></span>
				</div>
				<ul class="erp-l" bind:this={list}>
					{#each t.erp.items as item, i (item.title)}
						<li>
							<span class="ei"><Icon name={item.icon} /></span>
							<span><b>{item.title}</b><small>{item.sub}</small></span>
							<em class={["st", stage.statuses[i]]}
								>{t.status[stage.statuses[i]]}</em
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="foot">
			<p class="steps" aria-live="polite"><b>{steps.n}</b>{steps.text}</p>
		</div>
	</figure>
	<canvas class="confetti" bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.stage-wrap {
		position: relative;
		min-width: 0;
	}
	.confetti {
		position: absolute;
		left: -80px;
		top: -80px;
		width: calc(100% + 160px);
		height: calc(100% + 160px);
		pointer-events: none;
		z-index: 5;
	}
	.stage {
		position: relative;
		margin: 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
		padding: 18px;
		overflow: hidden;
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}
	.demo {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.board {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) 64px minmax(0, 1.15fr);
		align-items: stretch;
		min-height: 300px;
	}
	.src,
	.erp {
		border: 1px solid var(--hair);
		border-radius: 16px;
		background: #fff;
		position: relative;
		overflow: hidden;
		transition:
			opacity 0.5s,
			transform 0.5s,
			border-color 0.5s,
			background 0.5s;
	}
	.win-h {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 13px 14px;
		border-bottom: 1px solid var(--hair);
		background: #fafbfa;
	}
	.win-h b {
		display: block;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2;
	}
	.win-h small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 1px;
	}
	.wi {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--bg);
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.wi :global(svg) {
		width: 15px;
		height: 15px;
	}
	.wi.dark {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--accent);
	}
	.src-l {
		list-style: none;
		margin: 0;
		padding: 10px 12px;
		display: grid;
		gap: 8px;
		transition: opacity 0.4s;
	}
	.src-l li {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 12.5px;
		color: var(--muted);
		background: var(--bg);
		border-radius: 9px;
		padding: 8px 10px;
		font-variant-numeric: tabular-nums;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.src-l :global(svg) {
		width: 14px;
		height: 14px;
		flex: none;
		color: var(--faint);
	}
	.hd {
		position: absolute;
		inset: 52px 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		opacity: 0;
		transform: scale(0.9);
		transition:
			opacity 0.5s,
			transform 0.5s;
		pointer-events: none;
		color: var(--ink);
	}
	.hd :global(svg) {
		width: 40px;
		height: 34px;
	}
	.hd b {
		font-size: 17px;
		font-weight: 600;
	}
	.hd small {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--ok);
		font-weight: 600;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
	}
	.hd small::before {
		content: "";
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ok);
	}

	/* The connection */
	.wire {
		position: relative;
	}
	.wire::before {
		content: "";
		position: absolute;
		left: 6px;
		right: 6px;
		top: 50%;
		border-top: 2px dashed #cfd8d3;
		transition: opacity 0.4s;
	}
	.hand {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 34px;
		height: 34px;
		margin: -17px 0 0 -17px;
		border-radius: 50%;
		background: #fff4e5;
		border: 1px solid #f2d5a8;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #b26a00;
		z-index: 2;
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.hand :global(svg) {
		width: 16px;
		height: 16px;
	}
	.pk {
		position: absolute;
		top: 50%;
		left: 0;
		width: 22px;
		height: 22px;
		margin-top: -30px;
		border-radius: 6px;
		background: #fff;
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--faint);
		opacity: 0;
	}
	.pk :global(svg) {
		width: 12px;
		height: 12px;
	}
	.stage:global(.wire-on)[data-mode="two"] .pk.p1 {
		animation: carry 3.2s ease-in-out infinite;
	}
	.stage:global(.wire-on)[data-mode="two"] .pk.p2 {
		animation: carry 3.2s ease-in-out 1.6s infinite;
	}
	@keyframes carry {
		0% {
			left: 0;
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		45% {
			left: calc(50% - 11px);
			opacity: 1;
		}
		55% {
			left: calc(50% - 11px);
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 22px);
			opacity: 0;
		}
	}
	.wire-fill {
		position: absolute;
		left: 6px;
		right: 6px;
		top: 50%;
		height: 3px;
		margin-top: -1px;
		border-radius: 3px;
		background: var(--accent-deep);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bd {
		position: absolute;
		top: 50%;
		left: 6px;
		width: 9px;
		height: 9px;
		margin-top: -4px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.25);
		opacity: 0;
	}
	[data-mode="one"] .wire-fill {
		transform: scaleX(1);
	}
	[data-mode="one"] .wire::before {
		opacity: 0;
	}
	[data-mode="one"] .hand {
		opacity: 0;
		transform: scale(0.6);
	}
	.stage:global(.wire-on)[data-mode="one"] .bd {
		animation: run 1.8s linear infinite;
	}
	.stage:global(.wire-on)[data-mode="one"] .bd.b2 {
		animation-delay: 0.6s;
	}
	.stage:global(.wire-on)[data-mode="one"] .bd.b3 {
		animation-delay: 1.2s;
	}
	@keyframes run {
		0% {
			left: 6px;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 15px);
			opacity: 0;
		}
	}

	/* "Mit Heidi" */
	[data-mode="one"] .src {
		background: var(--bg);
		border-color: var(--bg);
	}
	[data-mode="one"] .src .win-h,
	[data-mode="one"] .src-l {
		opacity: 0;
	}
	[data-mode="one"] .hd {
		opacity: 1;
		transform: none;
	}
	[data-mode="one"] .erp {
		border-color: var(--accent-deep);
	}

	/* The ERP list */
	.erp-l {
		list-style: none;
		margin: 0;
		padding: 6px 14px 8px;
	}
	.erp-l li {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		gap: 0 10px;
		align-items: start;
		padding: 10px 0;
		border-bottom: 1px solid #eff2f0;
	}
	.erp-l li:last-child {
		border-bottom: 0;
	}
	.ei {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--bg);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ei :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--muted);
	}
	.erp-l b {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.erp-l small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 1px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.st {
		grid-column: 2;
		justify-self: start;
		margin-top: 6px;
		font-style: normal;
		font-size: 11.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 9px;
		white-space: nowrap;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.st.man {
		background: #fff4e5;
		color: #9a5b00;
	}
	.st.ok {
		background: #e6f5e7;
		color: #2f7a3c;
		animation: pop 0.5s ease;
	}
	@keyframes pop {
		0% {
			transform: scale(0.8);
		}
		60% {
			transform: scale(1.08);
		}
		100% {
			transform: none;
		}
	}

	.foot {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid var(--hair);
	}
	.steps {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 13.5px;
		color: var(--muted);
		line-height: 1.4;
		margin: 0;
	}
	.steps b {
		flex: none;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #fff4e5;
		color: #9a5b00;
		font-size: 20px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		font-variant-numeric: tabular-nums;
		transition:
			background 0.4s,
			color 0.4s;
	}
	[data-mode="one"] .steps b {
		background: var(--accent);
		color: var(--ink);
	}

	@media (max-width: 640px) {
		.board {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto 56px auto;
			min-height: 0;
		}
		.src {
			min-height: 150px;
		}
		.src-l li:nth-child(3) {
			display: none;
		}
		.wire::before {
			left: 50%;
			right: auto;
			top: 6px;
			bottom: 6px;
			border-top: 0;
			border-left: 2px dashed #cfd8d3;
		}
		.wire-fill {
			left: 50%;
			right: auto;
			top: 6px;
			bottom: 6px;
			width: 3px;
			height: auto;
			margin: 0 0 0 -1px;
			transform: scaleY(0);
			transform-origin: top;
		}
		[data-mode="one"] .wire-fill {
			transform: scaleY(1);
		}
		.pk {
			left: 50%;
			margin: 0 0 0 -40px;
		}
		.stage:global(.wire-on)[data-mode="two"] .pk.p1,
		.stage:global(.wire-on)[data-mode="two"] .pk.p2 {
			animation-name: carry-v;
		}
		.bd {
			left: 50%;
			margin: 0 0 0 -4px;
			top: 6px;
		}
		.stage:global(.wire-on)[data-mode="one"] .bd {
			animation-name: run-v;
		}
	}
	@keyframes carry-v {
		0% {
			top: 0;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			top: calc(100% - 22px);
			opacity: 0;
		}
	}
	@keyframes run-v {
		0% {
			top: 6px;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			top: calc(100% - 15px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pk,
		.bd {
			animation: none !important;
			opacity: 0 !important;
		}
		.st.ok {
			animation: none;
		}
	}
</style>

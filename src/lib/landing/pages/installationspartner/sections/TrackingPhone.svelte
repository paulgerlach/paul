<!--
  Row 4's tile (the design's #ipt): what the tenant of WE 08 sees on the
  day. A drawn house with the fitter moving from flat to flat, the push
  "noch 2 Wohnungen", and the card with the steps and the count. Every
  12.5 s in view it plays `TRACKING_STEPS`; the server renders the resting
  step (the design's reduced-motion state).
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "$lib/landing/sections/uv/Tick.svelte";
	import PhoneFrame from "../components/PhoneFrame.svelte";
	import { tracking } from "../content";
	import {
		countLabel,
		markerAt,
		PASS_MS,
		RESTING_STEP,
		TRACKING_STEPS,
		type TrackingStep,
	} from "../tracking";

	let step = $state<TrackingStep>(RESTING_STEP);
	/** The count pops on change, once the loop runs (not on the first paint). */
	let pop = $state(false);

	const marker = $derived(markerAt(step.current));
	const last = tracking.units.length - 1;

	function run() {
		pop = true;
		const timers = TRACKING_STEPS.map((s) =>
			setTimeout(() => (step = s), s.at),
		);
		return () => timers.forEach(clearTimeout);
	}

	/** The drawing's flat boxes: two per floor, from the ground floor up. */
	const boxes = tracking.units.map((label, i) => ({
		label,
		x: 62 + (i % 2) * 90,
		y: 166 - Math.floor(i / 2) * 40,
	}));
</script>

<PhoneFrame
	time={tracking.time}
	app={tracking.app}
	class={["ipt", step.push && "push"].filter(Boolean).join(" ")}
	{@attach loopInView({ run, every: PASS_MS, threshold: 0.3 })}
>
	<div class="push">
		<span class="ni">
			<svg viewBox="0 0 14 14"
				><rect x="1" y="2" width="3" height="10" rx="1.5" fill="#fff" /><rect
					x="5.5"
					y="2"
					width="3"
					height="10"
					rx="1.5"
					fill="#fff"
				/><rect x="10" y="2" width="3" height="10" rx="1.5" fill="#fff" /></svg
			>
		</span>
		<span>
			<b>{tracking.push.title}</b>
			<small
				>{tracking.push.before}<em>{tracking.push.strong}</em>{tracking.push
					.after}</small
			>
		</span>
	</div>
	<div class="map">
		<svg viewBox="0 0 300 214" preserveAspectRatio="xMidYMid meet">
			<path class="roof" d="M54 40 L149.0 12 L244 40 Z" />
			<rect class="wall" x="54" y="40" width="190" height="168" rx="4" />
			{#each tracking.floors as floor, f (floor)}
				<text class="fl" x="48" y={187 - f * 40} text-anchor="end">{floor}</text
				>
			{/each}
			{#each boxes as box, i (box.label)}
				<g
					class={[
						"unit",
						i === last && "me",
						i < step.done && "done",
						i === step.current && "cur",
					]}
				>
					<rect x={box.x} y={box.y} width="84" height="34" rx="6" />
					<text x={box.x + 10} y={box.y + 21}>{box.label}</text>
					<g class="ck" transform="translate({box.x + 67} {box.y + 17})">
						<circle r="7" />
						<path
							d="M-3 0l2 2 4-4"
							fill="none"
							stroke="#fff"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
				</g>
			{/each}
			<g class="pin" transform="translate({boxes[last].x + 42} 40)">
				<rect x="-28" y="-10" width="56" height="18" rx="9" />
				<text x="0" y="3" text-anchor="middle">{tracking.pin}</text>
			</g>
			<g
				class="marker"
				transform="translate({marker[0]} {marker[1]})"
				style:transform="translate({marker[0]}px, {marker[1]}px)"
			>
				<circle r="10" />
				<path
					d="M0-4.5a2 2 0 1 0 0 .1M-4 4.5c.5-2.6 2-3.8 4-3.8s3.5 1.2 4 3.8"
					fill="none"
					stroke="#fff"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</g>
			<line class="ground" x1="20" x2="280" y1="209" y2="209" />
		</svg>
	</div>
	<div class="card">
		<b class="h">{step.here ? tracking.heading.here : tracking.heading.house}</b
		>
		<small class="sub">{tracking.sub}</small>
		<div class="steps">
			<i class="bar"><i style:width="{step.bar}%"></i></i>
			{#each tracking.steps as label, i (label)}
				<span class={[(i < 2 || (i === 2 && step.here)) && "on"]}
					><i><Tick /></i>{label}</span
				>
			{/each}
		</div>
		<div class="cnt">
			{#key step.count}
				<b class={[pop && "pop"]}>{step.count ?? ""}</b>
			{/key}
			<span>{countLabel(step.count, tracking.count)}</span>
		</div>
	</div>
	<span class="tag">{tracking.tag}</span>
</PhoneFrame>

<style>
	:global(.ipt) {
		overflow: hidden;
	}
	.push {
		position: absolute;
		left: 12px;
		right: 12px;
		top: 36px;
		z-index: 3;
		display: flex;
		gap: 10px;
		align-items: center;
		background: rgba(255, 255, 255, 0.96);
		border-radius: 16px;
		padding: 10px 12px;
		box-shadow: 0 14px 30px -14px rgba(30, 50, 45, 0.5);
		opacity: 0;
		transform: translateY(-130%);
		transition:
			opacity 0.4s,
			transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	:global(.ipt.push) .push {
		opacity: 1;
		transform: none;
	}
	.ni {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--ink);
		display: grid;
		place-items: center;
		flex: none;
	}
	.ni svg {
		width: 14px;
		height: 14px;
	}
	.push b {
		display: block;
		font-size: 11.5px;
	}
	.push small {
		display: block;
		font-size: 12px;
		line-height: 1.35;
	}
	.push em {
		font-style: normal;
		font-weight: 700;
	}

	/* The house */
	.map {
		position: relative;
		height: 200px;
		border-radius: 16px;
		overflow: hidden;
		background: #eef2ef;
	}
	.map svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.wall {
		fill: #fff;
		stroke: #dce3df;
		stroke-width: 1.5;
	}
	.roof {
		fill: #dce3df;
	}
	.ground {
		stroke: #c9d2cd;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.fl {
		font-size: 9px;
		fill: #8a9792;
		font-family: inherit;
	}
	.unit rect {
		fill: #f3f5f4;
		stroke: #e2e8e4;
		stroke-width: 1;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.unit text {
		font-size: 10px;
		font-weight: 600;
		fill: #5b6b66;
		font-family: inherit;
	}
	.unit.cur rect {
		fill: #eef6ef;
		stroke: #8ad68f;
		stroke-width: 2;
	}
	.unit.done rect {
		fill: #e6f5e7;
		stroke: #cdebd0;
	}
	.ck {
		opacity: 0;
		transition: opacity 0.3s;
	}
	.ck circle {
		fill: #3e9a57;
	}
	.unit.done .ck {
		opacity: 1;
	}
	.unit.me rect {
		fill: #fff;
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
	}
	.unit.me text {
		fill: var(--ink);
	}
	.unit.me.cur rect {
		stroke: #3e9a57;
		stroke-dasharray: none;
		fill: #eef6ef;
		stroke-width: 2;
	}
	.pin rect {
		fill: var(--ink);
	}
	.pin text {
		font-size: 9.5px;
		font-weight: 700;
		fill: #fff;
		font-family: inherit;
	}
	.marker {
		transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1);
	}
	.marker circle {
		fill: #3e9a57;
		stroke: #fff;
		stroke-width: 2.5;
	}

	/* The card */
	.card {
		position: relative;
		margin-top: -18px;
		background: #fff;
		border-radius: 18px;
		padding: 14px 14px 12px;
		box-shadow: 0 -8px 24px -18px rgba(30, 50, 45, 0.45);
		border: 1px solid #e5e9e7;
	}
	.h {
		display: block;
		font-size: 15px;
		font-weight: 600;
		text-align: center;
		transition: color 0.3s;
	}
	.sub {
		display: block;
		font-size: 11px;
		color: #7a8783;
		text-align: center;
		margin-top: 2px;
	}
	.steps {
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin-top: 14px;
		text-align: center;
	}
	.bar {
		position: absolute;
		left: 12.5%;
		right: 12.5%;
		top: 9px;
		height: 4px;
		border-radius: 2px;
		background: #e5e9e7;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 2px;
		background: #3e9a57;
		transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.steps span {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		font-size: 9.5px;
		color: #7a8783;
	}
	.steps span i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid #c9d2cd;
		display: grid;
		place-items: center;
		transition:
			background 0.4s,
			border-color 0.4s;
	}
	.steps span i :global(svg) {
		width: 10px;
		height: 10px;
		opacity: 0;
		transition: opacity 0.3s;
	}
	.steps span i :global(path) {
		stroke: #fff;
	}
	.steps span.on {
		color: var(--ink);
		font-weight: 600;
	}
	.steps span.on i {
		background: #3e9a57;
		border-color: #3e9a57;
	}
	.steps span.on i :global(svg) {
		opacity: 1;
	}
	.cnt {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 8px;
		margin-top: 14px;
		background: #eef6ef;
		border-radius: 12px;
		padding: 9px;
	}
	.cnt b {
		font-size: 24px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: #2f7a3c;
	}
	.cnt b.pop {
		animation: pop 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	@keyframes pop {
		0% {
			transform: scale(0.6);
		}
		100% {
			transform: none;
		}
	}
	.cnt span {
		font-size: 12px;
		color: #2f7a3c;
		font-weight: 600;
	}
	.tag {
		position: absolute;
		right: 16px;
		top: 212px;
		font-size: 9.5px;
		font-weight: 600;
		color: #5b6b66;
		background: rgba(255, 255, 255, 0.85);
		border-radius: 999px;
		padding: 2px 7px;
	}
</style>

<!--
  The hero's card (.ea-card): the efficiency scale A+ to H with the dark
  marker, and the two buttons that move it to their example value. The
  server renders the end state the design reaches (the Verbrauchsausweis at
  118, class D current). With motion, the card goes to the design's start
  state on mount (the marker at the left, "0") and plays 300 ms after it
  first shows: the marker slides, the figure counts.
-->
<script lang="ts">
	import { onDestroy, untrack } from "svelte";
	import type { Attachment } from "svelte/attachments";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import { type AusweisType, scale } from "../content";
	import { formatKwh, markerLeft, scaleClass } from "../scale";

	let chosen = $state<AusweisType>("v");
	const value = $derived(scale.types.find((t) => t.key === chosen)?.value ?? 0);
	const current = $derived(scaleClass(value));
	/** The figure as shown (counts between values). */
	let shown = $state(untrack(() => value));
	/** The design's state before the first show: marker left, nothing marked. */
	let waiting = $state(false);
	/** Jump without the marker's transition (into the start state). */
	let still = $state(false);

	let stopTween = () => {};
	let timer: ReturnType<typeof setTimeout> | undefined;

	function countTo(to: number) {
		stopTween();
		stopTween = tweenNumber(shown, to, 900, (v) => (shown = v));
	}

	function choose(key: AusweisType) {
		clearTimeout(timer);
		waiting = false;
		still = false;
		chosen = key;
		countTo(value);
	}

	const intro: Attachment<HTMLElement> = (el) => {
		if (prefersReducedMotion()) return;
		untrack(() => {
			still = true;
			waiting = true;
			shown = 0;
		});
		return inView({
			threshold: 0.15,
			once: true,
			onEnter: () => {
				timer = setTimeout(() => {
					still = false;
					waiting = false;
					countTo(value);
				}, 300);
			},
		})(el);
	};

	onDestroy(() => {
		clearTimeout(timer);
		stopTween();
	});

	const srValue = $derived(
		scale.srValue
			.replace("{value}", formatKwh(value))
			.replace("{class}", scale.classes[current]),
	);
</script>

<div class="card rv" role="group" aria-label={scale.label} {@attach intro}>
	<div class="head">
		<div>
			<b>{scale.title}</b>
			<small>{scale.sub}</small>
		</div>
		<span class="valid">{scale.valid}</span>
	</div>
	<div class="scale">
		<div class="bar" aria-hidden="true">
			{#each scale.classes as label, i (label)}
				<i
					class={[
						`c${i}`,
						!waiting && i === current && "cur",
						!waiting && i !== current && "dim",
					]}>{label}</i
				>
			{/each}
		</div>
		<div
			class={["mark", still && "still"]}
			style:left={`${waiting ? 0 : markerLeft(value)}%`}
		>
			<b aria-hidden="true">{formatKwh(shown)}</b>
			<span class="sr-only">{srValue}</span>
			<small aria-hidden="true">{scale.unit}</small>
		</div>
	</div>
	<div class="types">
		{#each scale.types as type (type.key)}
			<button
				type="button"
				class={[chosen === type.key && "on"]}
				aria-pressed={chosen === type.key}
				onclick={() => choose(type.key)}
			>
				<b>{type.title}</b>
				<small>{type.sub}</small>
			</button>
		{/each}
	</div>
	<span class="tag">{scale.tag}</span>
</div>

<style>
	.card {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 24px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}
	.head b {
		display: block;
		font-size: 18px;
		font-weight: 600;
	}
	.head small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.valid {
		font-size: 12px;
		font-weight: 600;
		background: #e3f3e4;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 4px 10px;
		white-space: nowrap;
	}
	.scale {
		position: relative;
		margin-top: 30px;
		padding-top: 58px;
	}
	.bar {
		display: grid;
		grid-template-columns: repeat(9, minmax(0, 1fr));
		gap: 3px;
	}
	.bar i {
		font-style: normal;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		border-radius: 6px;
		transition:
			transform 0.3s,
			opacity 0.3s;
	}
	.bar .c0 {
		background: #2e8b45;
	}
	.bar .c1 {
		background: #43a04f;
	}
	.bar .c2 {
		background: #7dba48;
	}
	.bar .c3 {
		background: #b6cf3c;
	}
	.bar .c4 {
		background: #e6d33a;
		color: var(--ink);
	}
	.bar .c5 {
		background: #f0b53a;
		color: var(--ink);
	}
	.bar .c6 {
		background: #ec8b37;
	}
	.bar .c7 {
		background: #e2603a;
	}
	.bar .c8 {
		background: #c9403a;
	}
	.bar i.dim {
		opacity: 0.35;
	}
	.bar i.cur {
		transform: scaleY(1.18);
	}
	.mark {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--ink);
		color: #fff;
		border-radius: 10px;
		padding: 6px 10px;
		transition: left 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
		white-space: nowrap;
	}
	.mark.still {
		transition: none;
	}
	.mark::after {
		content: "";
		position: absolute;
		bottom: -6px;
		left: 50%;
		margin-left: -6px;
		border: 6px solid transparent;
		border-bottom: 0;
		border-top-color: var(--ink);
	}
	.mark b {
		font-size: 18px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		line-height: 1.1;
	}
	.mark small {
		font-size: 10.5px;
		color: rgba(255, 255, 255, 0.65);
	}
	.types {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		margin-top: 24px;
	}
	.types button {
		min-width: 0;
		overflow-wrap: anywhere;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 12px;
		padding: 12px 14px;
		text-align: left;
		font: inherit;
		cursor: pointer;
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.types b {
		display: block;
		font-size: 14.5px;
	}
	.types small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 2px;
	}
	.types button.on {
		border-color: var(--ink);
		background: var(--bg);
	}
	/* .dbm-demo.ea-tag */
	.tag {
		position: absolute;
		right: 14px;
		bottom: -12px;
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	@media (max-width: 640px) {
		.bar i {
			height: 32px;
			font-size: 11px;
		}
	}
</style>

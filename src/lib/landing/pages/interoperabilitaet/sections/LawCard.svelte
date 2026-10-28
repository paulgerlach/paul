<!--
  Card 3's picture (the design's #iq-a3, "§ 5 Abs. 5"): a scan line ticks
  the three clauses one by one, then the meter of one provider connects to
  the reading of another and the stamp "Pflicht seit 1.12.2022" lands. A
  pass every 8.9 s while 30 % of it is in view; stopping leaves it finished.
  Server-rendered finished (the design's reduced-motion state). Hidden from
  screen readers.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import BrandMark from "../components/BrandMark.svelte";
	import BrowserFrame from "../components/BrowserFrame.svelte";
	import { lawCard } from "../content";
	import { lawTimes } from "../scenes";

	const n = lawCard.clauses.length;
	const times = lawTimes(n);

	let ticked = $state(n);
	let connected = $state(true);
	let stamped = $state(true);
	let scanShown = $state(false);
	let scanY = $state(0);
	const clauseEls: HTMLElement[] = $state([]);

	function run() {
		ticked = 0;
		connected = false;
		stamped = false;
		scanShown = false;
		scanY = 0;
		const timers = [
			setTimeout(() => (scanShown = true), times.scan),
			...lawCard.clauses.flatMap((_, i) => [
				setTimeout(() => (scanY = clauseEls[i].offsetTop - 2), times.reach(i)),
				setTimeout(() => (ticked = i + 1), times.tick(i)),
			]),
			setTimeout(() => {
				scanShown = false;
				connected = true;
			}, times.connect),
			setTimeout(() => (stamped = true), times.stamp),
		];
		return () => {
			timers.forEach(clearTimeout);
			ticked = n;
			connected = true;
			stamped = true;
			scanShown = false;
		};
	}
</script>

{#snippet check()}
	<svg
		width="11"
		height="11"
		viewBox="0 0 20 20"
		fill="none"
		stroke="currentColor"
		stroke-width="2.6"
		stroke-linecap="round"
		stroke-linejoin="round"><path d="M5 10.5l3 3 7-7" /></svg
	>
{/snippet}

<BrowserFrame
	style="--bw-pad: 20px 64px 0 28px"
	{@attach loopInView({ run, every: times.every, threshold: 0.3 })}
>
	<div class={["lw", connected && "io", stamped && "st"]}>
		<div class="lh">
			<span><small>{lawCard.sub}</small><b class="h4">{lawCard.title}</b></span>
			<span class="stp">{lawCard.stamp[0]}<b>{lawCard.stamp[1]}</b></span>
		</div>
		<div class="cls">
			<i
				class="scan"
				style:opacity={scanShown ? 1 : 0}
				style:transform="translateY({scanY}px)"
			></i>
			{#each lawCard.clauses as clause, i (clause)}
				<div class={["cl", i < ticked && "on"]} bind:this={clauseEls[i]}>
					<span class="bx">{@render check()}</span><mark>{clause}</mark>
				</div>
			{/each}
		</div>
		<div class="io-row">
			<span class="dv"
				><BrandMark brand={0} size={13} /><span
					><b>{lawCard.meter.name}</b><small>{lawCard.meter.sub}</small></span
				></span
			>
			<span class="ln"><i></i><em>{@render check()}</em></span>
			<span class="dv"
				><BrandMark brand={1} size={13} /><span
					><b>{lawCard.reader.name}</b><small>{lawCard.reader.sub}</small></span
				></span
			>
		</div>
		<small class="io-l">{lawCard.note}</small>
	</div>
</BrowserFrame>

<style>
	.lh {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}
	.lh small {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: rgba(30, 50, 45, 0.55);
	}
	/* The design's h4 (a decorative mock-up: no heading here) */
	.h4 {
		display: block;
		margin: 2px 0 0;
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.stp {
		flex: none;
		margin-right: 14px;
		font-size: 10px;
		line-height: 1.25;
		text-align: center;
		color: #1e322d;
		border: 1.5px solid #1e322d;
		border-radius: 8px;
		padding: 5px 9px;
		rotate: -6deg;
		opacity: 0;
		scale: 1.6;
		transition:
			opacity 0.25s,
			scale 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.stp b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.st .stp {
		opacity: 1;
		scale: 1;
	}
	.cls {
		position: relative;
		margin-top: 12px;
		padding: 4px 0;
	}
	.scan {
		position: absolute;
		left: -28px;
		right: -60px;
		top: 0;
		height: 30px;
		background: rgba(138, 214, 143, 0.16);
		border-top: 1.5px solid rgba(138, 214, 143, 0.9);
		transition:
			transform 0.7s cubic-bezier(0.5, 0, 0.2, 1),
			opacity 0.3s;
		pointer-events: none;
	}
	.cl {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 5px 0;
		font-size: 13px;
		position: relative;
	}
	.bx {
		flex: none;
		width: 20px;
		height: 20px;
		border-radius: 6px;
		border: 1.5px solid rgba(30, 50, 45, 0.22);
		display: grid;
		place-items: center;
		color: transparent;
		transition:
			background 0.3s,
			border-color 0.3s,
			color 0.3s,
			scale 0.3s;
	}
	mark {
		background: linear-gradient(
				rgba(138, 214, 143, 0.5),
				rgba(138, 214, 143, 0.5)
			)
			no-repeat 0 88% / 0% 40%;
		color: rgba(30, 50, 45, 0.6);
		padding: 0 2px;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		transition:
			background-size 0.6s cubic-bezier(0.3, 0.7, 0.2, 1) 0.1s,
			color 0.3s;
	}
	.cl.on .bx {
		background: #8ad68f;
		border-color: #8ad68f;
		color: #1e322d;
		animation: iq-pop 0.35s;
	}
	.cl.on mark {
		background-size: 100% 40%;
		color: #1e322d;
	}
	@keyframes iq-pop {
		50% {
			scale: 1.25;
		}
	}
	.io-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px solid rgba(30, 50, 45, 0.08);
	}
	.dv {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid rgba(30, 50, 45, 0.12);
		border-radius: 10px;
		padding: 7px 10px;
		background: #fff;
		transition: border-color 0.3s;
	}
	.dv b {
		display: block;
		font-size: 11.5px;
		font-weight: 500;
	}
	.dv small {
		display: block;
		font-size: 9.5px;
		color: rgba(30, 50, 45, 0.5);
	}
	.ln {
		position: relative;
		flex: 1;
		max-width: 120px;
		height: 20px;
	}
	.ln::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		border-top: 1.5px dashed rgba(30, 50, 45, 0.2);
	}
	.ln i {
		position: absolute;
		left: 0;
		top: calc(50% - 0.75px);
		height: 1.5px;
		width: 0;
		background: #2e7a45;
		transition: width 0.8s cubic-bezier(0.5, 0, 0.2, 1);
	}
	.ln em {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #8ad68f;
		color: #1e322d;
		display: grid;
		place-items: center;
		scale: 0;
		transition: scale 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) 0.7s;
	}
	.io-l {
		display: block;
		margin-top: 8px;
		font-size: 10.5px;
		color: rgba(30, 50, 45, 0.55);
		opacity: 0;
		transition: opacity 0.5s 0.9s;
	}
	.io .ln i {
		width: 100%;
	}
	.io .ln em {
		scale: 1;
	}
	.io .dv {
		border-color: rgba(46, 122, 69, 0.45);
	}
	.io .io-l {
		opacity: 1;
	}
	@media (max-width: 560px) {
		.cl {
			font-size: 12px;
		}
		.dv {
			padding: 6px 8px;
		}
		.stp {
			margin-right: 0;
		}
	}
</style>

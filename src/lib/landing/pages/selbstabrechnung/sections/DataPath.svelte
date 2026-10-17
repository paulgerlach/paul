<!--
  "Vom Zähler in Ihre Abrechnung.": five stations on a dashed line. While in
  view and the tab is visible, one station after the other lights up (every
  second) and a dot runs along the line; with reduced motion all are lit and
  nothing moves.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { dataPath } from "../content";

	let lit = $state(-1);
	let allLit = $state(false);
	let running = $state(false);

	function pulse(el: HTMLElement) {
		if (prefersReducedMotion()) {
			allLit = true;
			return;
		}
		let visible = false;
		let timer: ReturnType<typeof setInterval> | undefined;
		let i = 0;
		const update = () => {
			const on = visible && document.visibilityState === "visible";
			if (on === running) return;
			running = on;
			clearInterval(timer);
			if (!on) return;
			const step = () => (lit = i++ % dataPath.stations.length);
			step();
			timer = setInterval(step, 1000);
		};
		const stopObserving = inView({
			threshold: 0.15,
			onEnter: () => {
				visible = true;
				update();
			},
			onLeave: () => {
				visible = false;
				update();
			},
		})(el);
		document.addEventListener("visibilitychange", update);
		return () => {
			stopObserving?.();
			document.removeEventListener("visibilitychange", update);
			clearInterval(timer);
		};
	}
</script>

<section class="sec" aria-labelledby="flow-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="flow-h"
				eyebrow={dataPath.pill}
				heading={dataPath.h2}
				center
			>
				{#snippet icon()}
					<path
						d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
					/><circle cx="10" cy="16" r=".8" fill="currentColor" />
				{/snippet}
			</SectionHead>
		</div>
		<div class={["track rv", running && "run"]} {@attach pulse}>
			<ol class="pipe">
				{#each dataPath.stations as station, i (station.title)}
					<li
						class={[
							i === dataPath.stations.length - 1 && "end",
							(allLit || lit === i) && "lit",
						]}
					>
						<span class="pi"><Icon name={station.icon} /></span>
						<b>{station.title}</b>
						<small>{station.sub}</small>
					</li>
				{/each}
			</ol>
			<i class="dot" aria-hidden="true"></i>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.track {
		position: relative;
		margin-top: 56px;
	}
	.pipe {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 14px;
		position: relative;
	}
	.pipe::before {
		content: "";
		position: absolute;
		left: 10%;
		right: 10%;
		top: 31px;
		height: 2px;
		background: repeating-linear-gradient(
			90deg,
			#cfd8d3 0 6px,
			transparent 6px 12px
		);
	}
	li {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 6px;
	}
	.pi {
		width: 62px;
		height: 62px;
		border-radius: 18px;
		background: #fff;
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 1;
		box-shadow: 0 10px 24px -16px rgba(30, 50, 45, 0.4);
		transition:
			transform 0.3s,
			border-color 0.3s;
		color: var(--ink);
	}
	.pi :global(svg) {
		width: 26px;
		height: 26px;
	}
	.pi :global(svg.heidi) {
		width: 22px;
		height: 22px;
	}
	.end .pi {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--accent);
	}
	.lit .pi {
		border-color: var(--accent-deep);
		transform: translateY(-3px);
	}
	b {
		display: block;
		font-size: 16px;
		font-weight: 600;
		margin-top: 18px;
	}
	small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.45;
		max-width: 22ch;
	}
	.dot {
		position: absolute;
		top: 26px;
		left: 10%;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--accent-deep);
		box-shadow: 0 0 0 4px rgba(138, 214, 143, 0.3);
		z-index: 2;
		opacity: 0;
	}
	.run .dot {
		animation: run 5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
	}
	@keyframes run {
		0% {
			left: 10%;
			opacity: 0;
		}
		6% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			left: calc(90% - 12px);
			opacity: 0;
		}
	}

	@media (max-width: 1040px) {
		.pipe {
			grid-template-columns: minmax(0, 1fr);
			gap: 22px;
			padding-left: 4px;
		}
		.pipe::before {
			left: 31px;
			right: auto;
			top: 20px;
			bottom: 20px;
			width: 2px;
			height: auto;
			background: repeating-linear-gradient(
				180deg,
				#cfd8d3 0 6px,
				transparent 6px 12px
			);
		}
		li {
			display: grid;
			grid-template-columns: 62px 1fr;
			column-gap: 16px;
			row-gap: 2px;
			text-align: left;
			align-items: center;
			padding: 0;
		}
		li > b,
		li > small {
			grid-column: 2;
		}
		.pi {
			grid-row: span 2;
		}
		b {
			margin-top: 0;
			align-self: end;
		}
		small {
			margin-top: 0;
			max-width: none;
			align-self: start;
		}
		.dot {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pi {
			transition: none;
		}
	}
</style>

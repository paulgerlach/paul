<!--
  "Was Ihnen das Dashboard abnimmt" (`.db-strike`). The server renders the
  design's reduced-motion layout, a plain list with every line struck; after
  mount, when motion is allowed, the scroll scene takes over: 520 vh with a
  sticky stage, the lines coming in, struck and leaving one by one (plan
  README, Scroll scene; plan 03, 3B.3).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { strike } from "../content";
	import { currentLine, strikeFrame, strikeTime } from "../strike";

	const N = strike.lines.length + 1;
	let scene = $state(false);
	let current = $state(0);
	let section = $state<HTMLElement>();
	let frame = 0;

	function update() {
		frame = 0;
		if (!section) return;
		const lines = [...section.querySelectorAll<HTMLElement>(".l")];
		const r = section.getBoundingClientRect();
		const total = r.height - window.innerHeight;
		const t = strikeTime(total > 0 ? -r.top / total : 0, N);
		lines.forEach((line, i) => {
			const f = strikeFrame(
				i,
				t,
				N,
				line.offsetHeight,
				lines[Math.max(0, i - 1)].offsetHeight,
			);
			line.style.opacity = String(f.opacity);
			line.style.transform = `translate(-50%, calc(-50% + ${f.y.toFixed(1)}px)) scale(${f.scale})`;
			line.style.filter =
				f.blur > 0.05 ? `blur(${f.blur.toFixed(2)}px)` : "none";
			line.style.setProperty("--s", f.strike.toFixed(3));
			line.classList.toggle("faded", f.faded);
		});
		current = currentLine(t, N);
	}

	function schedule() {
		if (scene && !frame) frame = requestAnimationFrame(update);
	}

	onMount(() => {
		if (prefersReducedMotion()) return;
		scene = true;
		requestAnimationFrame(update);
		return () => cancelAnimationFrame(frame);
	});
</script>

<svelte:window onscroll={schedule} onresize={schedule} />

<section
	class={["sec strike", scene && "scene"]}
	id="strike"
	aria-label={strike.label}
	bind:this={section}
>
	<div class="pin">
		<p class="k">{strike.label}</p>
		<div class="stage">
			<ul>
				{#each strike.lines as line (line)}
					<li class="l"><span class="tx">{line}</span></li>
				{/each}
			</ul>
			<p class="l fin">{strike.final} <span>{strike.finalAccent}</span></p>
		</div>
		{#if scene}
			<div class="dots" aria-hidden="true">
				{#each { length: N }, i (i)}<i class={[i === current && "on"]}
					></i>{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	/* Two classes: the page's section background would win a tie. */
	.sec.strike {
		background: #fff;
		padding: 96px 0;
	}
	.k {
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
		margin: 0 0 24px;
	}
	.stage,
	ul {
		display: grid;
		gap: 14px;
		justify-items: center;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0 16px;
	}
	.l {
		margin: 0;
		font-size: clamp(26px, 3.6vw, 46px);
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1.2;
		text-align: center;
		color: var(--faint);
	}
	.tx {
		background: linear-gradient(currentColor, currentColor) no-repeat 0 58% /
			calc(var(--s, 1) * 100%) 2px;
	}
	.l.fin {
		font-weight: 500;
		color: var(--ink);
		padding: 0 16px;
	}
	.fin span {
		color: var(--accent-deep);
	}

	/* The scene (after mount, motion allowed) */
	.scene {
		height: 520vh;
		padding: 0;
	}
	.scene .pin {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.scene .k {
		position: absolute;
		top: 18vh;
		left: 0;
		right: 0;
		margin: 0;
	}
	.scene .stage {
		display: block;
		position: relative;
		width: 100%;
		height: 200px;
	}
	.scene ul {
		display: contents;
	}
	.scene .l {
		position: absolute;
		left: 50%;
		top: 50%;
		white-space: nowrap;
		color: var(--ink);
		opacity: 0;
		transform: translate(-50%, -50%);
		will-change: transform, opacity, filter;
		padding: 0;
	}
	.scene :global(.l.faded) {
		color: #9aa5a1;
	}
	.dots {
		position: absolute;
		bottom: 14vh;
		display: flex;
		gap: 8px;
	}
	.dots i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #dde3e0;
		transition:
			background 0.3s,
			transform 0.3s;
	}
	.dots i.on {
		background: var(--ink);
		transform: scale(1.3);
	}
	@media (max-width: 640px) {
		.l {
			font-size: clamp(24px, 7vw, 32px);
		}
		.scene .l {
			white-space: normal;
			width: 88vw;
		}
	}
</style>

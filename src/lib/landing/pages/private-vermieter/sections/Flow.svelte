<!--
  "So funktioniert’s" (.pv-flow): five steps beside their mock-ups. Above
  900 px the section is tall and sticky and the step follows the scroll
  (`flowStep`), each step's line filling; a click scrolls to the step. At
  900 px and below it's short, a click shows the step, and the steps advance
  every 4.2 s once the section has been in view (not with reduced motion).
  The server renders step 1; without JS the section is short.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { flow } from "../content";
	import { flowStep, progress } from "../scene";
	import FlowPanel from "./FlowPanel.svelte";

	const MOBILE = "(max-width: 900px)";
	const EVERY = 4200;
	const count = flow.steps.length;

	let section = $state<HTMLElement>();
	let cur = $state(0);
	/** The current step's line, 0–1. */
	let fill = $state(0);
	/** The text under the steps, faded out while it changes. */
	let text = $state(flow.steps[0].text);
	let fading = $state(false);

	let mobile = false;
	let auto: ReturnType<typeof setInterval> | undefined;
	let fadeTimer: ReturnType<typeof setTimeout> | undefined;

	function show(i: number, f: number) {
		fill = f;
		if (i === cur) return;
		cur = i;
		fading = true;
		clearTimeout(fadeTimer);
		fadeTimer = setTimeout(() => {
			text = flow.steps[i].text;
			fading = false;
		}, 150);
	}

	function restart() {
		clearInterval(auto);
		if (prefersReducedMotion()) return;
		auto = setInterval(() => show((cur + 1) % count, 1), EVERY);
	}

	function choose(k: number) {
		if (mobile || !section) {
			show(k, 1);
			restart();
			return;
		}
		const top = section.getBoundingClientRect().top + scrollY;
		const total = section.offsetHeight - innerHeight;
		scrollTo({
			top: top + (total * (k + 0.5)) / count,
			behavior: prefersReducedMotion() ? "auto" : "smooth",
		});
	}

	onMount(() => {
		const query = matchMedia(MOBILE);
		let frameId = 0;
		let seen: IntersectionObserver | undefined;

		const update = () => {
			frameId = 0;
			if (mobile || !section) return;
			const r = section.getBoundingClientRect();
			const { step, fill: f } = flowStep(
				progress(r.top, section.offsetHeight, innerHeight),
				count,
			);
			show(step, f);
		};
		const onScroll = () => {
			if (!frameId) frameId = requestAnimationFrame(update);
		};
		const mode = () => {
			mobile = query.matches;
			seen?.disconnect();
			clearInterval(auto);
			if (mobile) {
				show(cur, 1);
				// The auto-advance starts once the section has been in view.
				seen = new IntersectionObserver(
					([entry]) => {
						if (!entry.isIntersecting) return;
						seen?.disconnect();
						restart();
					},
					{ threshold: 0.15 },
				);
				if (section) seen.observe(section);
			} else {
				update();
			}
		};

		mode();
		query.addEventListener("change", mode);
		addEventListener("scroll", onScroll, { passive: true });
		addEventListener("resize", onScroll);
		return () => {
			query.removeEventListener("change", mode);
			removeEventListener("scroll", onScroll);
			removeEventListener("resize", onScroll);
			cancelAnimationFrame(frameId);
			seen?.disconnect();
			clearInterval(auto);
			clearTimeout(fadeTimer);
		};
	});
</script>

<section class="flow" id={flow.id} aria-labelledby="pv-fh" bind:this={section}>
	<div class="fstick">
		<div class="wrap fg">
			<div class="fl">
				<Eyebrow text={flow.eyebrow} />
				<h2 id="pv-fh">{flow.h2}</h2>
				<ol class="steps">
					{#each flow.steps as step, k (step.label)}
						<li class={[k === cur && "on", k < cur && "done"]}>
							<button
								type="button"
								aria-current={k === cur ? "step" : undefined}
								onclick={() => choose(k)}
								><span class="n">{String(k + 1).padStart(2, "0")}</span
								>{step.label}<i
									><b
										style:width="{k < cur ? 100 : k === cur ? fill * 100 : 0}%"
									></b></i
								></button
							>
						</li>
					{/each}
				</ol>
				<p class="fd" style:opacity={fading ? 0 : 1} aria-live="polite">
					{text}
				</p>
			</div>
			<div class="fr">
				{#each flow.panels as panel, k (panel.title)}
					<FlowPanel {panel} on={k === cur} />
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.flow {
		position: relative;
		height: 420vh;
	}
	.fstick {
		position: sticky;
		top: var(--top);
		height: calc(100vh - var(--top));
		display: flex;
		align-items: center;
	}
	.fg {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: center;
		width: 100%;
	}
	/* The size stays plain `h2`, so #hs-css's sizes (the page) win below
	   1040 px as in the design. */
	h2 {
		font-size: clamp(28px, 3vw, 42px);
		line-height: 1.1;
	}
	/* `.fl h2`: beats the landing reset of heading margins. */
	.fl h2 {
		font-weight: 400;
		letter-spacing: -0.035em;
		margin-top: 14px;
		max-width: 16ch;
	}
	.steps {
		list-style: none;
		margin: 32px 0 0;
		padding: 0;
		display: grid;
		gap: 4px;
	}
	.steps button {
		width: 100%;
		display: grid;
		grid-template-columns: 34px 1fr;
		align-items: center;
		row-gap: 8px;
		background: none;
		border: 0;
		color: rgba(255, 255, 255, 0.42);
		font: inherit;
		font-size: clamp(17px, 1.5vw, 20px);
		text-align: left;
		padding: 10px 0;
		cursor: pointer;
		transition: color 0.3s;
	}
	.n {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		color: inherit;
	}
	.steps i {
		grid-column: 2;
		height: 2px;
		background: var(--line);
		border-radius: 1px;
		overflow: hidden;
		display: block;
	}
	.steps i b {
		display: block;
		height: 100%;
		background: var(--accent);
	}
	li.on button {
		color: #fff;
	}
	li.on .n {
		background: var(--accent);
		color: var(--ink);
		border-radius: 5px;
		padding: 2px 5px;
		justify-self: start;
		font-weight: 600;
	}
	.fd {
		color: var(--mute);
		font-size: 16px;
		line-height: 1.55;
		margin-top: 26px;
		max-width: 46ch;
		min-height: 5em;
		transition: opacity 0.3s;
	}
	.fr {
		position: relative;
		height: min(64vh, 560px);
		border-radius: 24px;
		background: #e4efe6;
		overflow: hidden;
	}
	@media (max-width: 900px) {
		.flow {
			height: auto;
		}
		.fstick {
			position: static;
			height: auto;
			padding: 100px 0 60px;
		}
		.fg {
			grid-template-columns: 1fr;
		}
		.fr {
			height: 440px;
		}
	}
	/* Without JS nothing follows the scroll: short, step 1. */
	@media (scripting: none) {
		.flow {
			height: auto;
		}
		.fstick {
			position: static;
			height: auto;
			padding: 100px 0 60px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.steps button,
		.fd {
			transition: none;
		}
	}
</style>

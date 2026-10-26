<!--
  "Aufgabenteilung" (the design's #jy): the visitor's three steps on the soft
  card, Heidi's eight tasks on the dark one. Server-rendered in its end state
  (every task ticked, "8 Aufgaben"). With motion, a block below the fold on
  load goes to its start state; each time it comes into view the tasks tick
  one by one while the count runs up, and leaving the view entirely resets
  it (as in the design).
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import Head from "../components/Head.svelte";
	import { split } from "../content";

	const total = split.heidi.tasks.length;

	let on = $state(true);
	let tasks = $state(total);

	const stage: Attachment<HTMLElement> = (el) => {
		if (prefersReducedMotion()) return;
		let cancel = () => {};
		const reset = () => {
			cancel();
			on = false;
			tasks = 0;
		};
		if (el.getBoundingClientRect().top >= innerHeight) reset();
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (on) return;
					on = true;
					cancel = tweenNumber(
						0,
						total,
						300 + total * 220,
						(n) => (tasks = Math.round(n)),
					);
				} else if (entry.intersectionRatio === 0) reset();
			},
			{ threshold: [0, 0.35] },
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			cancel();
		};
	};
</script>

<section class="blk" aria-labelledby="vg-split-h">
	<div class="wrap">
		<Head id="vg-split-h" eyebrow={split.eyebrow} title={split.h2} center />
		<!-- `rv` on a wrapper: the reveal sets classes the dynamic list would drop. -->
		<div class="rv">
			<div class={["jy", on && "in"]} {@attach stage}>
				<div class="you">
					<span class="l">{split.you.label}</span>
					<b class="big"
						><span>{split.you.steps.length}</span> {split.you.unit}</b
					>
					<ol>
						{#each split.you.steps as step, i (step.title)}
							<li>
								<span class="n">{i + 1}</span>
								<span><b>{step.title}</b><small>{step.text}</small></span>
							</li>
						{/each}
					</ol>
				</div>
				<div class="heidi">
					<span class="l">{split.heidi.label}</span>
					<b class="big"><span>{tasks}</span> {split.heidi.unit}</b>
					<ul>
						{#each split.heidi.tasks as task, i (task)}
							<li style:--i={i}>
								<i
									><svg viewBox="0 0 12 10" width="10" aria-hidden="true"
										><path
											d="M1 5l3.5 3.5L11 1"
											stroke="#1E322D"
											stroke-width="2"
											fill="none"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									></i
								>{task}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.blk {
		padding-top: clamp(72px, 9vw, 128px);
	}
	.wrap {
		max-width: 1280px;
	}
	.jy {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 16px;
		margin-top: 44px;
	}
	.jy > div {
		border-radius: 22px;
		padding: clamp(24px, 3.4vw, 44px);
	}
	.you {
		background: var(--soft);
	}
	.heidi {
		background: var(--ink);
		color: #fff;
	}
	.l {
		font-size: 13px;
		font-weight: 600;
		color: var(--muted);
	}
	.heidi .l {
		color: var(--accent);
	}
	.big {
		display: block;
		font-size: clamp(30px, 3.4vw, 44px);
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 10px;
	}
	.big span {
		font-family: var(--mono);
		font-variant-numeric: tabular-nums;
	}
	ol {
		list-style: none;
		margin: 26px 0 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	ol li {
		display: grid;
		grid-template-columns: 32px 1fr;
		gap: 14px;
		align-items: center;
		background: #fff;
		border-radius: 14px;
		padding: 14px 16px;
	}
	.n {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--ink);
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 14px;
	}
	ol b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	ol small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
	}
	ul {
		list-style: none;
		margin: 26px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	ul li {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		padding: 12px 14px;
		font-size: 14px;
		line-height: 1.35;
		opacity: 0.35;
	}
	ul li i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		flex: none;
		background: rgba(255, 255, 255, 0.12);
		color: transparent;
		display: grid;
		place-items: center;
	}
	ul li svg {
		width: 12px;
		height: 12px;
	}
	.in ul li {
		opacity: 1;
		transition: opacity 0.35s calc(0.3s + var(--i) * 0.22s);
	}
	.in ul li i {
		background: var(--accent);
		color: var(--ink);
		transition:
			background 0.3s calc(0.35s + var(--i) * 0.22s),
			color 0.3s calc(0.35s + var(--i) * 0.22s);
	}
	@media (max-width: 640px) {
		.jy,
		ul {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.jy * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>

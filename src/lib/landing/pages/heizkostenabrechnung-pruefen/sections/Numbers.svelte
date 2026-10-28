<!--
  "Fehler sind die Regel. Nicht die Ausnahme." (#zahlen): the dot card with
  the study switch (the shared `Segmented`) and four stats. A switch tweens
  the figure (900 ms) and changes the dots one by one, 8 ms apart. Server,
  no JS and reduced motion: the first study in its end state; below the
  fold with motion it starts empty and plays on first view (`enterView`).
  "60" and "565" count up on view (`countUp`).
-->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import { enterView } from "$lib/landing/attachments/enterView";
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import Head from "../components/Head.svelte";
	import { numbers, NUMBERS_ID, type StudyKey } from "../content";
	import { formatNumber } from "../rules";

	const DOTS = 100;
	const STAGGER = 8;
	const options = numbers.studies.map((s) => ({
		value: s.key,
		label: s.label,
	}));

	let study = $state<StudyKey>("vz");
	const current = $derived(numbers.studies.find((s) => s.key === study)!);

	let shown = $state(numbers.studies[0].value);
	/** The dots lit before the change and after it; dot i has changed once `reached` passes it. */
	let litFrom = $state(numbers.studies[0].value);
	let litTo = $state(numbers.studies[0].value);
	let reached = $state(DOTS);

	let stopTween = () => {};
	let frame = 0;

	function select(key: StudyKey) {
		study = key;
		const to = numbers.studies.find((s) => s.key === key)!.value;
		stopTween();
		stopTween = tweenNumber(shown, to, 900, (v) => (shown = v));
		cancelAnimationFrame(frame);
		litFrom = litTo;
		litTo = to;
		if (prefersReducedMotion()) {
			reached = DOTS;
			return;
		}
		reached = -1;
		const start = performance.now();
		frame = requestAnimationFrame(function step(now) {
			reached = Math.floor((now - start) / STAGGER);
			if (reached < DOTS) frame = requestAnimationFrame(step);
		});
	}

	const lit = (i: number) => (i <= reached ? i < litTo : i < litFrom);

	$effect(() => () => {
		stopTween();
		cancelAnimationFrame(frame);
	});

	const entrance = enterView({
		threshold: 0.15,
		prepare: () => {
			shown = 0;
			litFrom = litTo = 0;
		},
		play: () => select("vz"),
	});
</script>

<section class="pg-sec" id={NUMBERS_ID} aria-labelledby="zs-h">
	<div class="wrap">
		<Head id="zs-h" pill={numbers.pill} symbol="chart" heading={numbers.h2} />
		<div class="dots-w rv" {@attach entrance}>
			<div class="dots-l">
				<Segmented
					{options}
					label={numbers.switchLabel}
					bind:value={() => study, select}
				/>
				<div class="dbig">
					<b>{formatNumber(shown, 0)}</b><span>{numbers.of}</span>
				</div>
				<p>{current.text}</p>
				<small class="src">{numbers.sourcePrefix}{current.source}</small>
			</div>
			<div class="dots" aria-hidden="true">
				{#each { length: DOTS }, i (i)}
					<i class={[lit(i) && "on"]}></i>
				{/each}
			</div>
		</div>
		<div class="stats">
			{#each numbers.stats as stat (stat.text)}
				<article class={["rv", stat.dark && "dark"]}>
					<b
						>{#if stat.count !== undefined}<span
								{@attach countUp({
									to: stat.count,
									duration: 1200,
									viewDelay: 0,
									threshold: 0.15,
								})}>{stat.count}</span
							>{stat.unit}{:else}{stat.value}{/if}</b
					>
					<p>{stat.text}</p>
					<small>{stat.source}</small>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.dots-w {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 48px;
		align-items: center;
		margin-top: 44px;
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 32px;
	}
	/* The design's .pg-seg lets its labels wrap (the shared one doesn't). */
	.dots-l :global(.seg.track button) {
		white-space: normal;
	}
	.dbig {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-top: 26px;
	}
	.dbig b {
		font-size: clamp(64px, 7vw, 96px);
		font-weight: 500;
		letter-spacing: -0.05em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.dbig span {
		font-size: 20px;
		color: var(--muted);
	}
	.dots-l p {
		font-size: 16px;
		line-height: 1.5;
		margin-top: 12px;
		max-width: 40ch;
	}
	.src {
		display: block;
		font-size: 12.5px;
		color: var(--faint);
		margin-top: 14px;
		line-height: 1.45;
	}
	.dots {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 7px;
		width: 100%;
		max-width: 380px;
		justify-self: center;
	}
	.dots i {
		aspect-ratio: 1;
		border-radius: 50%;
		background: #dde3e0;
		transition:
			background 0.35s,
			transform 0.35s;
	}
	.dots i.on {
		background: #d9622b;
		transform: scale(1.04);
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 16px;
	}
	.stats article {
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 24px;
		background: #fff;
		display: flex;
		flex-direction: column;
	}
	.stats article.dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.stats b {
		font-size: clamp(34px, 3.4vw, 46px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.dark b {
		color: var(--accent);
	}
	.stats p {
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 12px;
		line-height: 1.45;
	}
	.dark p {
		color: rgba(255, 255, 255, 0.75);
	}
	.stats small {
		margin-top: auto;
		padding-top: 14px;
		font-size: 12px;
		color: var(--faint);
		line-height: 1.4;
	}
	.dark small {
		color: rgba(255, 255, 255, 0.5);
	}
	@media (max-width: 1040px) {
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.dots-w {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
	@media (max-width: 640px) {
		.stats {
			grid-template-columns: minmax(0, 1fr);
		}
		.dots-w {
			padding: 24px;
		}
	}
</style>

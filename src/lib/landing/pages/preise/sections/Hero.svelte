<!--
  Hero (.pg-hero with #pr-css): pill, H1, lead, the two CTAs, three ticks and
  the example bill. The server renders the bill finished. Below the fold on
  load (narrow screens), its lines come in one by one when it scrolls into
  view (the design's #pr-js); after that, and at once when it's already on
  screen, the line "Heidi → Betriebskosten → Mieter" flows while the bill is
  in view. Nothing moves with reduced motion.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { enterView } from "$lib/landing/attachments/enterView";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { bill, hero } from "../content";

	/** Lines shown so far; all of them on the server. */
	let shown = $state(bill.lines.length);
	/** The build-up is waiting or running (the design's `.go`). */
	let building = $state(false);
	let visible = $state(false);
	const run = $derived(visible && !building);

	function play() {
		const timers = bill.lines.map((_, i) =>
			setTimeout(() => (shown = i + 1), 200 + i * 220),
		);
		timers.push(
			setTimeout(() => (building = false), 200 + bill.lines.length * 220 + 200),
		);
		return () => timers.forEach(clearTimeout);
	}
</script>

<section class="hero" aria-labelledby="pr-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="euro" />{hero.pill}</span>
			<h1 data-hs class="rv" id="pr-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="bk" href={hero.request.href}
					>{hero.request.text} <span class="ar" aria-hidden="true">→</span></a
				>
				<a class="ghost" href={hero.contracts.href}>{hero.contracts.text}</a>
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="tk"><Check /></span>{tick}</li>
				{/each}
			</ul>
		</div>

		<div class="hv rv" role="group" aria-label={bill.label}>
			<div
				class={["bill", building && "go"]}
				{@attach enterView({
					prepare: () => {
						shown = 0;
						building = true;
					},
					play,
				})}
				{@attach inView({
					onEnter: () => (visible = !prefersReducedMotion()),
					onLeave: () => (visible = false),
				})}
			>
				<div class="bh">
					<span><small>{bill.eyebrow}</small><b>{bill.title}</b></span><span
						class="tag">{bill.tag}</span
					>
				</div>
				{#each bill.lines as line, i (i)}
					<div class={["bl", i < shown && "on"]}>
						<span>{line.before}<b>{line.count}</b>{line.after}</span><em
							>{line.unit}</em
						>
					</div>
				{/each}
				<div class="bw">
					<div class="bw-n">
						<small>{bill.sumLabel}</small><b>{bill.sum}</b>
					</div>
					<div class={["flow", run && "run"]} aria-hidden="true">
						{#each bill.flow as stop, i (stop)}
							{#if i > 0}<i></i>{/if}
							<span class={["fs", i === bill.flow.length - 1 && "on"]}
								>{stop}</span
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		background: var(--bg);
		padding: 72px 0 88px;
		border-bottom: 1px solid var(--hair);
	}
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: center;
	}
	/* `.cols h1`: beats the landing reset of heading margins. */
	.cols h1 {
		font-size: clamp(38px, 4.8vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.04em;
		font-weight: 500;
		margin-top: 22px;
		text-wrap: balance;
	}
	h1 em {
		font-style: normal;
		color: var(--ok);
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 18px;
		max-width: 52ch;
		line-height: 1.55;
	}
	.ctas {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 32px;
	}
	/* .bk-next (dark) */
	.bk {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 20px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #2a443d;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.bk .ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.ticks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 22px;
		/* The design keeps the list's default bottom margin. */
		margin: 28px 0 1em;
		font-size: 14.5px;
		color: var(--muted);
		list-style: none;
		padding: 0;
	}
	.ticks li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.tk {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e3f3e4;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.tk :global(svg) {
		width: 10px;
	}

	/* The example bill (#pr-css) */
	.bill {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 22px 24px;
		box-shadow: 0 40px 80px -50px rgba(30, 50, 45, 0.55);
	}
	.bh {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		padding-bottom: 14px;
		border-bottom: 1px solid #eef1ef;
	}
	.bh small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	.bh b {
		font-size: 16px;
		font-weight: 600;
	}
	.tag {
		font-size: 12px;
		font-weight: 600;
		color: #2f6a39;
		background: #e3f3e4;
		border-radius: 999px;
		padding: 4px 10px;
		white-space: nowrap;
	}
	.bl {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid #f1f4f2;
		font-size: 14.5px;
		color: var(--muted);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.bl b {
		color: var(--ink);
		font-weight: 600;
	}
	.bl em {
		font-style: normal;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		color: #2f7a3c;
		font-weight: 600;
		font-size: 13px;
	}
	.go .bl {
		opacity: 0;
		transform: translateY(6px);
	}
	.go .bl.on {
		opacity: 1;
		transform: none;
	}
	.bw {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-top: 12px;
		background: var(--ink);
		color: #fff;
		border-radius: 16px;
		padding: 16px 18px;
		flex-wrap: wrap;
	}
	.bw-n small {
		display: block;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.7);
	}
	.bw-n b {
		font-size: 28px;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #8ad68f;
		font-variant-numeric: tabular-nums;
	}
	.flow {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.fs {
		font-size: 12px;
		font-weight: 600;
		padding: 5px 9px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.8);
		transition:
			background 0.4s,
			color 0.4s;
	}
	.fs.on {
		background: #8ad68f;
		color: #1e322d;
	}
	.flow i {
		position: relative;
		display: block;
		width: 18px;
		height: 2px;
		background: rgba(255, 255, 255, 0.25);
		overflow: hidden;
	}
	.flow i::after {
		content: "";
		position: absolute;
		inset: 0;
		background: #8ad68f;
		transform: translateX(-100%);
	}
	.flow.run i::after {
		animation: pr-flow 1.6s ease-in-out infinite;
	}
	.flow.run i:nth-of-type(2)::after {
		animation-delay: 0.4s;
	}
	@keyframes pr-flow {
		0% {
			transform: translateX(-100%);
		}
		60%,
		100% {
			transform: translateX(100%);
		}
	}

	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
	}
	@media (max-width: 640px) {
		.hero {
			padding: 44px 0 60px;
		}
		.ctas {
			flex-direction: column;
		}
		.bk,
		.ghost {
			justify-content: center;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bl {
			transition: none;
		}
		.flow.run i::after {
			animation: none;
		}
	}
</style>

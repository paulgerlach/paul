<!--
  Step 1 (#vergleich): the eight criteria, each with "Ja" / "Nein" / "?"
  for the visitor's provider and Heidi's tick, beside the sticky score card
  (.mv-score). The picks are plain `$state` (nothing is stored or sent); the
  counts, the verdict and the list come from the pure `score.ts`. Heidi's
  bar grows the first time the card shows (`enterView`), server-rendered
  full. Without JS the toggles, the "Ihr Anbieter" row and the verdict are
  hidden (plan open question 2).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { DEMO_HREF, focusSignup } from "$lib/landing/cta";
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { COMPARE_ID, criteria, score } from "../content";
	import { type Answer, gaps, tally, toggle, verdict } from "../score";

	const total = criteria.items.length;
	const answers: Answer[] = $state(criteria.items.map(() => null));
	/** Re-keys the list on every pick, so its rows replay their entrance as in the design. */
	let picks = $state(0);
	let heidiGrown = $state(true);

	const counts = $derived(tally(answers));
	const text = $derived(verdict(answers));
	const missing = $derived(gaps(answers));

	function pick(index: number, value: Exclude<Answer, null>) {
		answers[index] = toggle(answers[index], value);
		picks++;
	}
</script>

<section class="pg-sec alt" id={COMPARE_ID} aria-labelledby="cmp-h">
	<div class="wrap">
		<Head id="cmp-h" pill={criteria.pill} symbol="list" heading={criteria.h2} />
		<div class="cmp">
			<div class="crit rv" role="list">
				{#each criteria.items as item, i (item.key)}
					{@const answer = answers[i]}
					<div class={["c", answer]} role="listitem">
						<span class="ci"><Icon name={item.icon} /></span>
						<span class="ct"><b>{item.title}</b><small>{item.text}</small></span
						>
						<span
							class="tg"
							role="group"
							aria-label={criteria.groupLabel.replace("{title}", item.title)}
						>
							{#each criteria.answers as a (a.value)}
								<button
									type="button"
									class={[`v-${a.value}`, answer === a.value && "on"]}
									aria-pressed={answer === a.value}
									onclick={() => pick(i, a.value as Exclude<Answer, null>)}
									>{a.label}</button
								>
							{/each}
						</span>
						<span class="hd" title={criteria.heidi}><Icon name="tick" /></span>
					</div>
				{/each}
			</div>
			<aside
				class="score rv"
				{@attach enterView({
					threshold: 0.15,
					prepare: () => (heidiGrown = false),
					play: () => {
						heidiGrown = true;
					},
				})}
			>
				<span class="sl">{score.label}</span>
				<div class="bars">
					<div class="you">
						<span>{score.you}</span>
						<div class="bar">
							<i style:width="{(counts.yes / total) * 100}%"></i>
						</div>
						<b>{counts.yes} / {total}</b>
					</div>
					<div class="h">
						<span>{score.heidi}</span>
						<div class="bar">
							<i style:width={heidiGrown ? "100%" : "0%"}></i>
						</div>
						<b>{score.heidiCount}</b>
					</div>
				</div>
				<p class="verdict" aria-live="polite">{text}</p>
				<div class="gaps">
					{#if missing.length}
						{#key picks}
							<span class="gl">{score.gapsLabel}</span>
							{#each missing as gap (gap.index)}
								<div>
									<i><Icon name="tick" /></i>{criteria.items[gap.index]
										.title}{#if gap.unsure}<em>{score.unsure}</em>{/if}
								</div>
							{/each}
						{/key}
					{/if}
				</div>
				<a
					class="bk-next inv cta"
					href={score.cta.href}
					onclick={score.cta.href === DEMO_HREF ? focusSignup : undefined}
					>{score.cta.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</aside>
		</div>
	</div>
</section>

<style>
	.cmp {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 360px;
		gap: 20px;
		margin-top: 44px;
		align-items: start;
	}
	.crit {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.c {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) auto 36px;
		align-items: center;
		gap: 14px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 14px 16px;
		transition:
			border-color 0.25s,
			box-shadow 0.25s;
	}
	.c.y {
		border-color: #bfe3c2;
	}
	.c.n {
		border-color: #f2c5ba;
	}
	.c.u {
		border-color: #efdca6;
	}
	.ci {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: var(--bg);
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ci :global(svg) {
		width: 19px;
		height: 19px;
	}
	.ct b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	.ct small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 2px;
		line-height: 1.4;
	}
	/* .mv-tg */
	.tg {
		display: inline-flex;
		background: #eef1ef;
		border-radius: 10px;
		padding: 3px;
		gap: 2px;
	}
	/* Scoped, `.tg button` outweighs the landing reset's
	   `:is(button, input) { font: inherit; color: inherit }`. */
	.tg button {
		border: 0;
		background: none;
		font: inherit;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--muted);
		min-width: 44px;
		padding: 7px 10px;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.tg button:hover {
		color: var(--ink);
	}
	.tg button.on {
		color: #fff;
	}
	.tg button.on.v-y {
		background: var(--ok);
	}
	.tg button.on.v-n {
		background: #d9664f;
	}
	.tg button.on.v-u {
		background: #e3b341;
	}
	.hd {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--ink);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.hd :global(svg) {
		width: 15px;
		height: 15px;
	}

	/* The score card (.mv-score) */
	.score {
		position: sticky;
		top: 96px;
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 26px 24px 24px;
	}
	.sl {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 500;
	}
	.bars {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 16px;
	}
	.bars > div {
		display: grid;
		grid-template-columns: 96px minmax(0, 1fr) 46px;
		align-items: center;
		gap: 12px;
		font-size: 14px;
	}
	.bars b {
		text-align: right;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}
	.bar {
		height: 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.1);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.55);
		transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bars .h .bar i {
		background: var(--accent);
		transition-duration: 1.2s;
	}
	.bars .h span,
	.bars .h b {
		color: var(--accent);
	}
	.verdict {
		font-size: 15px;
		line-height: 1.5;
		margin-top: 20px;
		color: rgba(255, 255, 255, 0.85);
		min-height: 3em;
	}
	.gaps {
		margin-top: 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.gl {
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 600;
		margin: 8px 0 6px;
	}
	.gaps div {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		padding: 6px 0;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		animation: mv-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.gaps div i {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		background: rgba(138, 214, 143, 0.18);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.gaps div i :global(svg) {
		width: 11px;
		height: 11px;
	}
	.gaps em {
		margin-left: auto;
		font-style: normal;
		font-size: 12px;
		color: #e9c46a;
	}
	@keyframes mv-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	/* .mv-score .bk-next */
	.score .cta {
		margin-top: 20px;
		width: 100%;
		display: flex;
	}

	@media (max-width: 1040px) {
		.cmp {
			grid-template-columns: minmax(0, 1fr);
		}
		.score {
			position: static;
		}
	}
	@media (max-width: 640px) {
		.c {
			grid-template-columns: 38px minmax(0, 1fr) 32px;
			gap: 10px 12px;
			padding: 14px;
		}
		.ci {
			width: 38px;
			height: 38px;
		}
		.tg {
			grid-column: 1 / -1;
			order: 4;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
		}
		.hd {
			width: 32px;
			height: 32px;
		}
	}
	/* Nothing to pick without JS (plan open question 2). */
	@media (scripting: none) {
		.tg,
		.bars > .you,
		.verdict {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.gaps div {
			animation: none;
		}
	}
</style>

<!--
  "Interoperabilität ist Pflicht." (#recht, the design's .iq-law): the
  heading and lead, a timeline of the four deadlines (the line grows to the
  two passed ones, which turn lime; the next is marked "Nächste Frist"),
  four cards on § 5 Abs. 5 and § 12, the summary with its two links and the
  "keine Rechtsberatung" note. The timeline is server-rendered grown; below
  the fold on load it grows once when it scrolls into view (`enterView`).
  Below 980 px two columns without the line, below 560 px one.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { law } from "../content";

	let grown = $state(true);
</script>

<section class="law" id="recht" aria-labelledby="iop-law-h">
	<div class="wrap">
		<h2 class="h rv" id="iop-law-h">{law.h2[0]}<br />{law.h2[1]}</h2>
		<p class="lead rv">{law.lead}</p>
		<ol
			class={["tl", grown && "in"]}
			{@attach enterView({
				prepare: () => (grown = false),
				play: () => {
					grown = true;
				},
			})}
		>
			{#each law.timeline as step, i (step.date)}
				<li
					class={[step.badge && "nx", i < law.passed && "done"]}
					style:--i={i}
				>
					<span class="dt">{step.date}</span>
					{#if step.badge}<em>{step.badge}</em>{/if}
					<p>{step.text}</p>
					<small>{step.source}</small>
				</li>
			{/each}
		</ol>
		<div class="lg">
			{#each law.cards as card (card.title)}
				<article class="rv">
					<small>{card.source}</small>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
				</article>
			{/each}
		</div>
		<div class="lx rv">
			<div>
				<h3>{law.summary.title}</h3>
				<p>{law.summary.text}</p>
			</div>
			<div class="lb">
				<a class="uv-btn w" href={law.summary.guide.href}
					>{law.summary.guide.text}</a
				>
				<a class="ll" href={law.summary.upgrade.href}
					>{law.summary.upgrade.text}
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg
					></a
				>
			</div>
		</div>
		<p class="note rv">{law.note}</p>
	</div>
</section>

<style>
	.law {
		padding: 20px 0 120px;
		scroll-margin-top: 72px;
	}
	/* The design's .uv-h; beats the landing heading reset (tokens.css). */
	.law .h {
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1.05;
	}
	.lead {
		max-width: 640px;
		margin: 22px 0 0;
		font-size: 18px;
		line-height: 1.5;
		color: var(--mute);
	}
	.tl {
		list-style: none;
		margin: clamp(40px, 6vw, 72px) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 18px;
		position: relative;
	}
	.tl::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 7px;
		height: 1px;
		background: rgba(255, 255, 255, 0.18);
	}
	.tl::after {
		content: "";
		position: absolute;
		left: 0;
		top: 7px;
		height: 1px;
		width: 0;
		background: var(--accent);
		transition: width 1.8s cubic-bezier(0.3, 0.7, 0.2, 1) 0.3s;
	}
	/* The line reaches the second dot (the passed deadlines). */
	.tl.in::after {
		width: 49%;
	}
	.tl li {
		position: relative;
		padding-top: 34px;
	}
	.tl li::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: var(--ink);
		border: 1px solid rgba(255, 255, 255, 0.4);
		box-sizing: border-box;
		transition:
			background 0.4s calc(0.4s + var(--i) * 0.35s),
			border-color 0.4s calc(0.4s + var(--i) * 0.35s);
	}
	.tl.in li.done::before {
		background: var(--accent);
		border-color: var(--accent);
	}
	.tl li.nx::before {
		box-shadow: 0 0 0 6px rgba(138, 214, 143, 0.18);
	}
	.dt {
		display: block;
		font-size: clamp(22px, 2vw, 28px);
		letter-spacing: -0.03em;
	}
	.tl em {
		display: inline-block;
		font-style: normal;
		font-size: 12px;
		background: var(--accent);
		color: #1e322d;
		border-radius: 6px;
		padding: 2px 8px;
		margin-top: 8px;
	}
	.tl p {
		margin: 10px 0 0;
		font-size: 15px;
		line-height: 1.5;
		color: var(--mute);
	}
	.tl small {
		display: block;
		margin-top: 10px;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.5);
	}
	.lg {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 18px;
		margin-top: 56px;
	}
	.lg article {
		background: var(--card);
		border-radius: 20px;
		padding: 26px;
	}
	.lg small {
		font-size: 12.5px;
		color: var(--accent);
	}
	.lg h3 {
		margin: 10px 0 0;
		font-size: 20px;
		font-weight: 400;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}
	.lg p {
		margin: 10px 0 0;
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--mute);
	}
	.lx {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) auto;
		gap: 32px;
		align-items: center;
		margin-top: 18px;
		background: var(--card2);
		border-radius: 20px;
		padding: clamp(24px, 3vw, 36px);
	}
	.lx h3 {
		margin: 0;
		font-size: 22px;
		font-weight: 400;
		letter-spacing: -0.02em;
	}
	.lx p {
		margin: 10px 0 0;
		max-width: 640px;
		font-size: 15.5px;
		line-height: 1.5;
		color: var(--mute);
	}
	.lb {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
	}
	.ll {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		color: #fff;
		text-decoration: none;
		font-size: 15px;
	}
	.ll svg {
		transition: translate 0.25s;
	}
	.ll:hover svg {
		translate: 3px 0;
	}
	.note {
		margin: 18px 0 0;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.5);
	}
	@media (max-width: 980px) {
		.tl,
		.lg {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.tl {
			row-gap: 34px;
		}
		.tl::before,
		.tl::after {
			display: none;
		}
		.tl li {
			border-top: 1px solid rgba(255, 255, 255, 0.18);
		}
		.tl li::before {
			top: -8px;
		}
	}
	@media (max-width: 820px) {
		.lx {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.tl,
		.lg {
			grid-template-columns: 1fr;
		}
		.lead {
			font-size: 16px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tl::after,
		.tl li::before {
			transition: none;
		}
	}
</style>

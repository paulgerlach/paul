<!--
  "Der ganze Weg" (the design's #ablauf, #jw-css / #jw-js): the three phases,
  then the eleven stations as cards beside a sticky table of contents with a
  progress rail (above 1100 px). The current station is the last card whose
  top is above 45 % of the viewport, from one passive scroll listener; the
  server renders the first current. The links are plain anchors that scroll
  smoothly with JS.

  Each card's picture (`journey/Visual`) is server-rendered in its end state.
  With motion, a card below the fold on load goes to its start state and plays
  once 40 % of it is in view; leaving the view entirely resets it, so it
  plays again on return (as in the design).
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Head from "../components/Head.svelte";
	import { journey } from "../content";
	import Visual from "./journey/Visual.svelte";

	const count = journey.stations.length;
	const number = (i: number) => String(i + 1).padStart(2, "0");
	const cardId = (i: number) => `jw-${i + 1}`;
	/** The stations of each phase, by index. */
	const phases = journey.phases.map((phase, p) => {
		const from = journey.phases.slice(0, p).reduce((n, x) => n + x.count, 0);
		return {
			...phase,
			items: Array.from({ length: phase.count }, (_, k) => from + k),
		};
	});

	let current = $state(0);
	let shown = $state(journey.stations.map(() => true));

	/** The current station, from the cards' positions. */
	const track: Attachment<HTMLElement> = (el) => {
		const cards = [...el.querySelectorAll<HTMLElement>(".card")];
		const update = () => {
			const mid = innerHeight * 0.45;
			let cur = 0;
			cards.forEach((c, i) => {
				if (c.getBoundingClientRect().top < mid) cur = i;
			});
			current = cur;
		};
		update();
		addEventListener("scroll", update, { passive: true });
		return () => removeEventListener("scroll", update);
	};

	/** Plays card `i`'s picture as it comes into view (see the top). */
	const stage =
		(i: number): Attachment<HTMLElement> =>
		(el) => {
			if (prefersReducedMotion()) return;
			if (el.getBoundingClientRect().top >= innerHeight) shown[i] = false;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.intersectionRatio >= 0.4) shown[i] = true;
					else if (entry.intersectionRatio === 0) shown[i] = false;
				},
				{ threshold: [0, 0.4] },
			);
			observer.observe(el);
			return () => observer.disconnect();
		};

	function go(e: MouseEvent, i: number) {
		const target = document.getElementById(cardId(i));
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({
			behavior: prefersReducedMotion() ? "auto" : "smooth",
			block: "start",
		});
	}
</script>

<section class="blk" id="ablauf" aria-labelledby="vg-journey-h">
	<div class="wrap">
		<Head
			id="vg-journey-h"
			eyebrow={journey.eyebrow}
			title={journey.h2}
			center
		/>
		<p class="hp rv">{journey.lead}</p>
		<div class="phs rv">
			{#each journey.phases as phase, p (phase.name)}
				<div class="pc">
					<span>{p + 1}</span><b>{phase.name}</b><small>{phase.sub}</small>
				</div>
			{/each}
		</div>
		<div class="jw" {@attach track}>
			<nav aria-label={journey.navLabel}>
				<div class="rail">
					<i style:height="{((current + 1) / count) * 100}%"></i>
				</div>
				{#each phases as phase (phase.name)}
					<div class="ph">
						<b>{phase.name}</b>
						<small>{phase.sub}</small>
						<ol>
							{#each phase.items as i (i)}
								<li>
									<a
										href="#{cardId(i)}"
										class={{ on: i === current, done: i < current }}
										aria-current={i === current ? "location" : undefined}
										onclick={(e) => go(e, i)}
										><span class="nn">{number(i)}</span>{journey.stations[i]
											.name}</a
									>
								</li>
							{/each}
						</ol>
					</div>
				{/each}
			</nav>
			<div class="cards">
				{#each journey.stations as station, i (station.name)}
					<article class="card" id={cardId(i)} {@attach stage(i)}>
						<Visual visual={station.visual} on={shown[i]} />
						<div class="t">
							<span class="tag"
								><span class="nn">{number(i)}</span>{station.phase} · {station.name}</span
							>
							<h3>{station.h3}</h3>
							<p>{station.text}</p>
							{#if station.link?.href}
								<a class="link" href={station.link.href}
									>{station.link.text} <span aria-hidden="true">→</span></a
								>
							{/if}
						</div>
					</article>
				{/each}
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
	.hp {
		color: var(--muted);
		font-size: 17px;
		line-height: 1.55;
		margin: 14px auto 0;
		max-width: 56ch;
		text-align: center;
	}

	/* The phases */
	.phs {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		margin-top: 44px;
	}
	.pc {
		background: var(--soft);
		border-radius: 16px;
		padding: 16px 18px;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2px 12px;
		align-items: center;
	}
	.pc span {
		grid-row: span 2;
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
	.pc b {
		font-size: 16px;
		font-weight: 600;
	}
	.pc small {
		font-size: 13.5px;
		color: var(--muted);
	}

	/* Layout */
	.jw {
		display: grid;
		grid-template-columns: 260px minmax(0, 1fr);
		gap: clamp(28px, 4vw, 64px);
		margin-top: 48px;
		align-items: start;
	}
	nav {
		position: sticky;
		top: 96px;
		padding-left: 18px;
	}
	.rail {
		position: absolute;
		left: 0;
		top: 6px;
		bottom: 6px;
		width: 2px;
		background: var(--hair);
		border-radius: 2px;
		overflow: hidden;
	}
	.rail i {
		display: block;
		width: 100%;
		background: var(--ink);
		transition: height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ph + .ph {
		margin-top: 18px;
	}
	.ph > b {
		display: block;
		font-size: 12px;
		font-weight: 600;
		color: var(--faint);
	}
	.ph > small {
		display: block;
		font-size: 12.5px;
		color: var(--faint);
		margin-top: 1px;
	}
	.ph ol {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
		display: grid;
		gap: 1px;
	}
	.ph a {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 8px;
		margin-left: -8px;
		border-radius: 9px;
		font-size: 14.5px;
		color: var(--faint);
		text-decoration: none;
		transition:
			color 0.25s,
			background 0.25s;
	}
	.ph a:hover {
		color: var(--muted);
	}
	.ph a.on {
		color: var(--ink);
		background: var(--soft);
	}
	.ph a.done {
		color: var(--muted);
	}
	.nn {
		font-family: var(--mono);
		font-size: 11px;
		border-radius: 6px;
		padding: 2px 6px;
		background: var(--soft);
		color: var(--muted);
		transition:
			background 0.25s,
			color 0.25s;
	}
	.ph a.on .nn {
		background: var(--accent);
		color: var(--ink);
	}

	/* The cards */
	.cards {
		display: grid;
		gap: 16px;
	}
	.card {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		background: var(--soft);
		border-radius: 22px;
		overflow: hidden;
		scroll-margin-top: 96px;
	}
	.t {
		padding: clamp(24px, 3vw, 40px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--muted);
		font-weight: 500;
	}
	/* More specific than the landing heading reset (README). */
	.card h3 {
		font-size: clamp(22px, 2.1vw, 28px);
		line-height: 1.15;
		letter-spacing: -0.025em;
		font-weight: 500;
		margin: 14px 0 0;
	}
	.t p {
		font-size: 15.5px;
		line-height: 1.6;
		color: var(--muted);
		margin: 12px 0 0;
		max-width: 46ch;
	}
	.link {
		display: inline-flex;
		gap: 6px;
		margin-top: 18px;
		font-weight: 600;
		font-size: 15px;
	}
	.link span {
		transition: transform 0.2s;
	}
	.link:hover span {
		transform: translateX(3px);
	}

	@media (max-width: 1100px) {
		.jw {
			grid-template-columns: 1fr;
		}
		nav {
			display: none;
		}
		.card {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 640px) {
		.phs {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rail i,
		.link span {
			transition: none;
		}
	}
</style>

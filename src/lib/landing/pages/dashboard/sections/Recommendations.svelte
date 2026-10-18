<!--
  "Für jede Liegenschaft der nächste Schritt" (`.db-rep`): the checked list of
  properties with a recommendation each (filters, search, toggletips), and
  the three small cards. The server renders the list checked.
-->
<script lang="ts">
	import p1 from "$lib/assets/landing/dashboard/property-1.jpg";
	import p2 from "$lib/assets/landing/dashboard/property-2.jpg";
	import p3 from "$lib/assets/landing/dashboard/property-3.jpg";
	import p4 from "$lib/assets/landing/dashboard/property-4.jpg";
	import p5 from "$lib/assets/landing/dashboard/property-5.jpg";
	import p6 from "$lib/assets/landing/dashboard/property-6.jpg";
	import p7 from "$lib/assets/landing/dashboard/property-7.jpg";
	import Icon from "../components/Icon.svelte";
	import { enterView } from "$lib/landing/attachments/enterView";
	import Pill from "../components/Pill.svelte";
	import { recommendations as rec } from "../content";
	import {
		countByKind,
		filterRecommendations,
		type RecommendationFilter,
	} from "../recommendations";

	const PHOTOS = [p1, p2, p3, p4, p5, p6, p7];
	const FILTERS: RecommendationFilter[] = ["all", "take", "cancel", "bill"];
	const totals = countByKind(rec.rows);

	let filter = $state<RecommendationFilter>("all");
	let query = $state("");
	/** Rows checked so far (all on the server). */
	let checked = $state(rec.rows.length);
	/** Rows shown so far (they come in, then get checked). */
	let entered = $state(rec.rows.length);

	/** The check run, once on first view (plan 03, 3B.6). */
	const checkRun = enterView({
		prepare: () => {
			checked = 0;
			entered = 0;
		},
		play: () => {
			const timers = rec.rows.flatMap((_, i) => [
				setTimeout(() => (entered = Math.max(entered, i + 1)), i * 140),
				setTimeout(() => (checked = Math.max(checked, i + 1)), 700 + i * 420),
			]);
			return () => {
				for (const t of timers) clearTimeout(t);
			};
		},
	});
	const visible = $derived(
		new Set(filterRecommendations(rec.rows, filter, query)),
	);
	const counts = $derived(
		checked >= rec.rows.length
			? totals
			: countByKind(rec.rows.slice(0, checked)),
	);
	let openTip = $state<number | null>(null);
</script>

<section class="sec rep" aria-labelledby="rep-h">
	<div class="wrap db-c">
		<Pill text={rec.pill} icon="sparkle" class="rv" />
		<h2 class="db-h2 rv" id="rep-h">{rec.h2}</h2>
		<p class="db-lead rv">{rec.lead}</p>
	</div>
	<div class="wrap">
		<div class="pl rv" {@attach checkRun}>
			<div class="top">
				<div class="f" role="group" aria-label={rec.filterLabel}>
					{#each FILTERS as key (key)}
						<button
							type="button"
							class={[filter === key && "on"]}
							aria-pressed={filter === key}
							onclick={() => (filter = key)}
							>{rec.filters[key]} <b>{counts[key]}</b></button
						>
					{/each}
				</div>
				<label class="s">
					<Icon name="search" />
					<input
						type="search"
						placeholder={rec.search}
						aria-label={rec.search}
						bind:value={query}
					/>
				</label>
			</div>
			<div class="h" aria-hidden="true">
				{#each rec.columns as column (column)}<span>{column}</span>{/each}
			</div>
			<ul class="l">
				{#each rec.rows as row, i (row.name)}
					{@const info = rec.info[row.kind]}
					<li
						class={[
							"r",
							i < entered && "in",
							i < checked && "ok",
							i < entered && i >= checked && "scan",
						]}
						hidden={!visible.has(row)}
					>
						<div class="n">
							<span class="ph"
								><img
									src={PHOTOS[row.photo - 1]}
									alt=""
									width="44"
									height="44"
									loading="lazy"
								/></span
							>
							<span><b>{row.name}</b><small>{row.units}</small></span>
						</div>
						<div class="st"><b>{row.status}</b>{row.detail}</div>
						<div class="a">
							<span class="spin" aria-hidden="true"><i></i>{rec.checking}</span>
							<button
								type="button"
								class={["chip", row.kind]}
								aria-expanded={openTip === i}
								aria-controls="pl-pop-{i}"
								onclick={() => (openTip = openTip === i ? null : i)}
							>
								<Icon name={row.kind} />{rec.filters[row.kind]}<i
									class="pi"
									aria-hidden="true">i</i
								>
							</button>
							<div
								class={["pop", row.kind, openTip === i && "open"]}
								id="pl-pop-{i}"
							>
								<b>{info.title} · {row.name}</b>
								<p>{info.text}</p>
								<ol>
									{#each info.steps as step (step)}<li>{step}</li>{/each}
								</ol>
								<div class="t">{info.note}</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>
			<div class="ft">
				<span class="demo-badge">{rec.badge}</span>
				<span class="done">
					{#if checked >= rec.rows.length}
						<span class="okb"><Icon name="check" /></span>{rec.done(
							rec.rows.length,
						)}
					{:else}{rec.running}{/if}
				</span>
			</div>
			<p class="sr-only" role="status">{rec.results(visible.size)}</p>
		</div>
		<ul class="cards rv">
			{#each rec.cards as card (card.title)}
				<li>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.rep {
		padding: 112px 0 12px;
	}
	.pl {
		margin-top: 56px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px 24px 18px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
	}
	.f {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.f button {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 7px 12px;
		font-size: 13.5px;
		font-weight: 500;
		color: var(--muted);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;
	}
	.f b {
		font-size: 12px;
		font-weight: 600;
		background: #eef1ef;
		color: var(--ink);
		border-radius: 999px;
		padding: 1px 7px;
		min-width: 22px;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
	.f button.on {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.f button.on b {
		background: var(--accent);
		color: var(--ink);
	}
	.s {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 8px 12px;
		min-width: 220px;
		color: var(--faint);
	}
	.s :global(svg) {
		width: 15px;
		height: 15px;
	}
	.s input {
		border: 0;
		outline: 0;
		font-size: 14px;
		flex: 1;
		min-width: 0;
		background: transparent;
		color: var(--ink);
	}
	.s:focus-within {
		border-color: var(--accent-deep);
	}
	.h,
	.r {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.2fr) 300px;
		gap: 16px;
	}
	.h {
		padding: 18px 14px 8px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.l {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.r {
		align-items: center;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 12px 14px;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.45s,
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.4s,
			border-color 0.4s;
	}
	.r.scan {
		background: #fafbfa;
	}
	.r.in {
		opacity: 1;
		transform: none;
	}
	.r[hidden] {
		display: none;
	}
	.r:hover {
		z-index: 5;
		position: relative;
	}
	.n {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	.ph {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		overflow: hidden;
		background: #eef1ef;
		box-shadow: inset 0 0 0 1px rgba(30, 50, 45, 0.06);
		flex: none;
	}
	.ph img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s;
	}
	.r:hover .ph img {
		transform: scale(1.08);
	}
	.n b {
		display: block;
		font-size: 15px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.n small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	.st {
		font-size: 13.5px;
		color: var(--muted);
		line-height: 1.35;
	}
	.st b {
		display: block;
		color: var(--ink);
		font-weight: 500;
	}
	.a {
		position: relative;
		height: 36px;
		display: flex;
		align-items: center;
		z-index: 1;
	}
	.spin {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--faint);
		transition: opacity 0.25s;
	}
	.spin i {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid #d7dfda;
		border-top-color: var(--ok);
		animation: rot 0.8s linear infinite;
	}
	@keyframes rot {
		to {
			transform: rotate(360deg);
		}
	}
	.r.ok .spin {
		opacity: 0;
	}
	.chip {
		position: absolute;
		left: 0;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 0;
		border-radius: 999px;
		padding: 8px 14px 8px 10px;
		font-size: 13.5px;
		font-weight: 600;
		white-space: nowrap;
		cursor: help;
		opacity: 0;
		transform: scale(0.85);
		transition:
			opacity 0.3s,
			transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1),
			box-shadow 0.25s;
	}
	.chip :global(svg) {
		width: 16px;
		height: 16px;
		flex: none;
	}
	.chip.take {
		background: var(--ink);
		color: #fff;
	}
	.chip.cancel {
		background: #fbefdf;
		color: #8a5410;
	}
	.chip.bill {
		background: #e4f3e6;
		color: #245f33;
	}
	.r.ok .chip {
		opacity: 1;
		transform: none;
	}
	.r.ok .a:hover .chip,
	.r.ok .chip:focus-visible {
		transform: translateY(-1px);
		box-shadow: 0 8px 18px -10px rgba(30, 50, 45, 0.45);
	}
	.pi {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 10.5px;
		font-weight: 700;
		font-style: normal;
		margin-left: 2px;
		background: rgba(255, 255, 255, 0.18);
	}
	.cancel .pi {
		background: rgba(138, 84, 16, 0.14);
	}
	.bill .pi {
		background: rgba(36, 95, 51, 0.14);
	}
	.pop {
		position: absolute;
		left: 0;
		top: calc(100% + 10px);
		width: 310px;
		max-width: 80vw;
		background: var(--ink);
		color: #fff;
		border-radius: 14px;
		padding: 16px 16px 14px;
		box-shadow: 0 24px 50px -24px rgba(30, 50, 45, 0.6);
		z-index: 20;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-6px);
		transition:
			opacity 0.2s,
			transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
			visibility 0s 0.25s;
		text-align: left;
	}
	.pop::before {
		content: "";
		position: absolute;
		top: -6px;
		left: 26px;
		width: 12px;
		height: 12px;
		background: inherit;
		transform: rotate(45deg);
		border-radius: 2px;
	}
	.pop b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
	}
	.pop p {
		font-size: 13px;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.75);
		margin: 6px 0 0;
	}
	.pop ol {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 7px;
		counter-reset: s;
	}
	.pop li {
		display: flex;
		gap: 9px;
		align-items: center;
		font-size: 13px;
		counter-increment: s;
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.3s,
			transform 0.3s;
	}
	.pop li::before {
		content: counter(s);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		font-size: 11px;
		font-weight: 700;
		display: grid;
		place-items: center;
		flex: none;
	}
	.pop li:nth-child(2) {
		transition-delay: 0.07s;
	}
	.pop li:nth-child(3) {
		transition-delay: 0.14s;
	}
	.pop .t {
		margin-top: 12px;
		padding-top: 10px;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		font-size: 12px;
		color: var(--accent);
	}
	.r.ok .a:hover .pop,
	.r.ok .a:focus-within .pop,
	.pop.open {
		opacity: 1;
		visibility: visible;
		transform: none;
		transition:
			opacity 0.2s,
			transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
			visibility 0s;
	}
	.r.ok .a:hover .pop li,
	.r.ok .a:focus-within .pop li,
	.pop.open li {
		opacity: 1;
		transform: none;
	}
	.pop.bill {
		background: #e4f3e6;
		color: #1e322d;
		box-shadow: 0 24px 50px -24px rgba(30, 50, 45, 0.35);
		border: 1px solid #cbe7ce;
	}
	.pop.bill p {
		color: #3f5a4e;
	}
	.pop.bill .t {
		color: #2f7a3c;
		border-top-color: rgba(30, 50, 45, 0.12);
	}
	.pop.bill li::before {
		background: #fff;
		color: #245f33;
	}
	.pop.cancel {
		background: #fbefdf;
		color: #4a2e0a;
		box-shadow: 0 24px 50px -24px rgba(138, 84, 16, 0.35);
		border: 1px solid #f0d9b8;
	}
	.pop.cancel p {
		color: #6b4a1f;
	}
	.pop.cancel .t {
		color: #8a5410;
		border-top-color: rgba(138, 84, 16, 0.15);
	}
	.pop.cancel li::before {
		background: #fff;
		color: #8a5410;
	}
	.ft {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-top: 14px;
		font-size: 13px;
		color: var(--muted);
	}
	.demo-badge {
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
	}
	.done {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.done :global(.okb) {
		width: 18px;
		height: 18px;
	}
	.cards {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		margin: 12px 0 0;
		padding: 32px 8px;
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.3);
	}
	.cards li {
		padding: 0 28px;
		border-left: 1px solid var(--hair);
	}
	.cards li:first-child {
		border-left: 0;
	}
	.cards h3 {
		font-size: 19px;
		font-weight: 600;
	}
	.cards p {
		color: var(--muted);
		margin: 10px 0 0;
		font-size: 16px;
	}
	@media (max-width: 900px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
			padding: 28px 0;
		}
		.cards li {
			border-left: 0;
		}
	}
	@media (max-width: 860px) {
		.pl {
			padding: 16px;
		}
		.h {
			display: none;
		}
		.r {
			grid-template-columns: minmax(0, 1fr);
			gap: 8px;
		}
		.st,
		.a {
			padding-left: 56px;
		}
		.chip {
			left: 56px;
			font-size: 13px;
			padding: 7px 12px 7px 9px;
		}
		.pi {
			display: none;
		}
		.pop {
			left: 0;
			right: 0;
			width: auto;
			max-width: none;
		}
		.pop::before {
			left: 70px;
		}
		.s {
			min-width: 0;
			flex: 1;
		}
		.f {
			overflow-x: auto;
			flex-wrap: nowrap;
			max-width: 100%;
			padding-bottom: 2px;
		}
		.f button {
			white-space: nowrap;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.r {
			transition: none;
		}
		.spin i {
			animation: none;
		}
	}
</style>

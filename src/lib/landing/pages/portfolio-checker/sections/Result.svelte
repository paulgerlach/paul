<!--
  The evaluation (.pg-sec.pc-res-sec), shown below the hero once a run ends
  (client-only): with the example the four figures, the three properties
  (Overview) and "Als CSV herunterladen"; with the visitor's files the panel
  of what's ready. It scrolls into view on arrival and its heading takes the
  focus; with the example the dark figure bursts confetti once it's fully on
  screen (plan 03 §3.2).
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { getPortfolioCheck } from "../check.svelte";
	import { toCsv } from "../checker";
	import Head from "../components/Head.svelte";
	import Icon from "../components/Icon.svelte";
	import { CHECKER_ID, RESULT_ID, result } from "../content";
	import Overview from "./Overview.svelte";

	const check = getPortfolioCheck();
	let message = $state("");
	let timers: ReturnType<typeof setTimeout>[] = [];
	onDestroy(() => timers.forEach(clearTimeout));

	const onStart = (href: string) =>
		href === START_HREF ? focusSignup : undefined;

	/** On arrival: scroll here, focus the heading, the confetti (the design's `show()`). */
	function arrive(section: HTMLElement) {
		const reduce = prefersReducedMotion();
		const pending: ReturnType<typeof setTimeout>[] = [];
		let stopConfetti = () => {};
		message = "";
		const heading = section.querySelector("h2");
		heading?.setAttribute("tabindex", "-1");
		heading?.focus({ preventScroll: true });
		pending.push(
			setTimeout(
				() =>
					window.scrollTo({
						top: section.getBoundingClientRect().top + window.scrollY - 90,
						behavior: reduce ? "auto" : "smooth",
					}),
				reduce ? 0 : 250,
			),
		);
		if (check.shown?.mode === "example" && !reduce) {
			let tries = 0;
			const wait = () => {
				const hot = section.querySelector(".hot");
				const r = hot?.getBoundingClientRect();
				if (hot && r && r.width > 0 && r.top > 60 && r.bottom < innerHeight) {
					pending.push(
						setTimeout(() => (stopConfetti = confettiFrom(hot)), 250),
					);
					return;
				}
				if (++tries < 67) pending.push(setTimeout(wait, 120));
			};
			wait();
		}
		return () => {
			pending.forEach(clearTimeout);
			stopConfetti();
		};
	}

	/** "Beispielauswertung ansehen": the example, back at the tool. */
	function showExample() {
		check.useExamples();
		const el = document.getElementById(CHECKER_ID);
		if (el)
			window.scrollTo({
				top: el.getBoundingClientRect().top + window.scrollY - 100,
				behavior: prefersReducedMotion() ? "auto" : "smooth",
			});
	}

	function saveCsv() {
		const shown = check.shown;
		if (shown?.mode !== "example") return;
		try {
			const blob = new Blob([toCsv(shown.properties)], {
				type: "text/csv;charset=utf-8",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = result.fileName;
			document.body.append(a);
			a.click();
			const t = setTimeout(() => {
				URL.revokeObjectURL(url);
				a.remove();
				timers = timers.filter((x) => x !== t);
			}, 1500);
			timers.push(t);
			message = result.saved + result.fileName;
		} catch {
			message = result.failed;
		}
	}
</script>

{#if check.shown}
	{@const shown = check.shown}
	<section
		class="pg-sec res"
		id={RESULT_ID}
		aria-labelledby="pc-rh"
		{@attach arrive}
	>
		<div class="wrap">
			<div class="rh">
				<Head
					id="pc-rh"
					pill={result.pill}
					symbol="doc"
					heading={result.heading}
					wide
				/>
				{#if shown.mode === "example"}<span class="demo">{result.tag}</span
					>{/if}
			</div>
			<div class="kpis">
				{#if shown.mode === "example"}
					{@const k = shown.kpis}
					<div>
						<small>{result.kpis.documents}</small><b>{k.documents}</b>
					</div>
					<div>
						<small>{result.kpis.properties}</small><b>{k.properties}</b>
					</div>
					<div class="hot">
						<small>{result.kpis.next}</small><b>{k.next.date}</b><em
							>{result.kpis.nextNote(k.next.name, k.next.days)}</em
						>
					</div>
					<div>
						<small>{result.kpis.urgent}</small><b>{k.urgent}</b><em
							>{result.kpis.urgentNote(k.urgent)}</em
						>
					</div>
				{/if}
			</div>
			<div class="cards">
				{#if shown.mode === "example"}
					<Overview properties={shown.properties} />
				{/if}
			</div>
			{#if shown.mode === "own"}
				{@const ready = shown.files.filter((f) => f.ok).length}
				<div class="own">
					<div>
						<h3>{result.own.title(ready, shown.files.length)}</h3>
						<p>{result.own.text}</p>
						<a
							class="bk"
							href={result.own.request.href}
							onclick={onStart(result.own.request.href)}
							>{result.own.request.text}
							<span class="ar" aria-hidden="true">→</span></a
						>
						<button type="button" class="ghost" onclick={showExample}
							>{result.own.example}</button
						>
					</div>
					<ul>
						{#each shown.files as file, i (i)}
							<li>
								<span>{file.name}</span><em class={[!file.ok && "w"]}
									>{file.ok ? result.own.ready : result.own.check}</em
								>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<div class="bot">
				{#if shown.mode === "example"}
					<button type="button" class="ghost" onclick={saveCsv}
						><Icon name="download" />{result.csv}</button
					>
				{/if}
				<a class="bk" href={result.cta.href} onclick={onStart(result.cta.href)}
					>{result.cta.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
			<p class="msg" aria-live="polite">{message}</p>
		</div>
	</section>
{/if}

<style>
	/* .pc-res-sec: beats the page's .pg-sec padding at every width */
	section.pg-sec.res {
		padding-top: 24px;
		scroll-margin-top: 90px;
	}
	.rh {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 16px;
		flex-wrap: wrap;
	}
	.rh :global(h2:focus) {
		outline: none;
	}
	/* .dbm-demo */
	.demo {
		display: inline-flex;
		margin-left: auto;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.kpis {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
		margin-top: 28px;
	}
	.kpis > div {
		background: #f2f4f3;
		border-radius: 16px;
		padding: 16px 18px;
		animation: pcIn 0.5s both;
	}
	@keyframes pcIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.kpis small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.kpis b {
		display: block;
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.03em;
		margin-top: 4px;
		font-variant-numeric: tabular-nums;
	}
	.kpis em {
		display: block;
		font-style: normal;
		font-size: 12px;
		color: #a8431a;
		margin-top: 2px;
	}
	.kpis .hot {
		background: var(--ink);
		color: #fff;
	}
	.kpis .hot small {
		color: rgba(255, 255, 255, 0.65);
	}
	.kpis .hot em {
		color: var(--accent);
	}
	.cards {
		display: grid;
		gap: 14px;
		margin-top: 16px;
	}
	.own {
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px;
		margin-top: 16px;
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
		gap: 26px;
		align-items: center;
	}
	.own h3 {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.own p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.55;
		margin-top: 8px;
	}
	.own .bk {
		margin-top: 16px;
	}
	.own .ghost {
		margin-left: 8px;
		font: inherit;
	}
	.own ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.own li {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 13.5px;
		border-bottom: 1px solid var(--hair);
		padding-bottom: 8px;
	}
	.own li span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.own li em {
		font-style: normal;
		font-weight: 600;
		color: #2f7a3c;
		flex: none;
	}
	.own li em.w {
		color: #a8431a;
	}
	/* .bk-next, auto width (its 18 px top margin as the design) */
	.bk {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-top: 18px;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
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
	/* .pg-ghost */
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
		cursor: pointer;
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.bot {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 18px;
		flex-wrap: wrap;
	}
	/* "Gleich grosse Buttons" */
	.bot .ghost,
	.bot .bk {
		height: 54px;
		padding: 0 22px;
		font-size: 16px;
		font-weight: 600;
		border-radius: 12px;
		margin: 0;
		box-sizing: border-box;
		gap: 10px;
	}
	.bot .ghost :global(svg) {
		width: 15px;
		height: 15px;
	}
	.msg {
		text-align: right;
		font-size: 13px;
		color: var(--muted);
		margin-top: 8px;
		min-height: 18px;
	}
	@media (max-width: 980px) {
		.kpis {
			grid-template-columns: 1fr 1fr;
		}
		.own {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 560px) {
		.bot {
			justify-content: stretch;
		}
		.bot > * {
			flex: 1;
			justify-content: center;
		}
		/* The design's later `.pc-bot .bk-next { flex: none }` wins: the CTA
		   keeps its width and wraps under the CSV button. */
		.bot .bk {
			flex: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.kpis > div {
			animation: none;
		}
	}
</style>

<!--
  "So sieht die Abrechnung aus." (#musterabrechnung, .hd-sec): a sample
  statement (example data) beside four numbered keys; each key outlines its
  part of the paper. The keys take turns every 2.6 s while the paper is in
  view (the design's `#hd-js`, which runs on forever once seen), a hovered
  key holds its part. Server-rendered with the paper shown and no key
  current; below the fold on load the paper rises in once (`enterView`).
  Nothing turns with reduced motion.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { sample, SAMPLE_QR } from "../content";

	const { paper } = sample;
	const EVERY = 2600;
	const FIRST = 900;

	let shown = $state(true);
	/** The current key, 1–4, or 0. */
	let current = $state(0);
	let visible = false;
	let hovering = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	function stop() {
		clearTimeout(timer);
		timer = undefined;
	}
	function start(delay = EVERY) {
		stop();
		if (prefersReducedMotion() || !visible || hovering) return;
		timer = setTimeout(() => {
			current = (current % sample.keys.length) + 1;
			start();
		}, delay);
	}
	$effect(() => stop);

	const qr = SAMPLE_QR.flatMap((row, y) =>
		[...row].flatMap((cell, x) => (cell === "1" ? [{ x, y }] : [])),
	);
</script>

<section class="pg-sec alt" id="musterabrechnung" aria-labelledby="hd-h">
	<div class="wrap grid">
		<div
			class={["pw rv", shown && "in"]}
			{@attach enterView({
				prepare: () => (shown = false),
				play: () => {
					shown = true;
				},
				threshold: 0.25,
			})}
			{@attach inView({
				threshold: 0.25,
				onEnter: () => {
					visible = true;
					start(FIRST);
				},
				onLeave: () => {
					visible = false;
					stop();
				},
			})}
		>
			<article class="paper" aria-label={paper.label}>
				<header class={["top", current === 1 && "hl"]}>
					<div class="addr">
						<small class="snd">{paper.sender}</small>
						{#each paper.recipient as line (line)}<b>{line}</b>{/each}
					</div>
					<div class="ttl">
						<span class="logo"
							>{paper.logo}
							<svg viewBox="0 0 14 14" aria-hidden="true"
								><rect
									x="1"
									y="2"
									width="3"
									height="10"
									rx="1.5"
									fill="#1E322D"
								/><rect
									x="5.5"
									y="2"
									width="3"
									height="10"
									rx="1.5"
									fill="#1E322D"
								/><rect
									x="10"
									y="2"
									width="3"
									height="10"
									rx="1.5"
									fill="#1E322D"
								/></svg
							></span
						>
						<b>{paper.title}</b>
						<small>{paper.subtitle}</small>
					</div>
				</header>
				<div class="meta">
					{#each paper.meta as list, i (i)}
						<dl>
							{#each list as [term, value] (term)}
								<dt>{term}</dt>
								<dd>
									{#each value.split("\n") as part, k (k)}{#if k}<br
											/>{/if}{part}{/each}
								</dd>
							{/each}
						</dl>
					{/each}
				</div>
				<p class="intro">{paper.intro[0]}<br />{paper.intro[1]}</p>
				<div class={["sum", current === 2 && "hl"]}>
					<small>{paper.sum.small}</small><span>{paper.sum.label}</span><b
						>{paper.sum.value}</b
					>
				</div>
				<div class="notes">
					<b>{paper.notes.title}</b>
					{#each paper.notes.items as note (note)}<p>{note}</p>{/each}
				</div>
				<div class={["portal", current === 3 && "hl"]}>
					<div>
						<b>{paper.portal.title}</b>
						<p>{paper.portal.text}</p>
						{#each paper.portal.credentials as [label, value] (label)}
							<span class="cred">{label}<i>{value}</i></span>
						{/each}
					</div>
					<figure class="qr">
						<svg viewBox="-1 -1 23 23" aria-hidden="true"
							><rect x="-1" y="-1" width="23" height="23" fill="#fff" /><g
								fill="#1E322D"
								>{#each qr as { x, y } (`${x}-${y}`)}<rect
										{x}
										{y}
										width="1"
										height="1"
									/>{/each}</g
							></svg
						>
						<figcaption>{paper.portal.qr}</figcaption>
					</figure>
				</div>
				<div class={["obj", current === 4 && "hl"]}>
					<b>{paper.objects.title}</b>
					<ul>
						{#each paper.objects.items as item (item)}<li>{item}</li>{/each}
					</ul>
				</div>
				<span class="stamp">{paper.stamp}</span>
			</article>
		</div>
		<div>
			<span class="pill rv"><Icon name="doc" />{sample.pill}</span>
			<h2 class="h2 rv" id="hd-h">{sample.h2} <span>{sample.h2Muted}</span></h2>
			<p class="lead rv">{sample.lead}</p>
			<ol class="keys rv">
				{#each sample.keys as key, i (key.title)}
					<li
						class={[current === i + 1 && "on"]}
						onmouseenter={() => {
							hovering = true;
							stop();
							current = i + 1;
						}}
						onmouseleave={() => {
							hovering = false;
							start();
						}}
					>
						<span aria-hidden="true">{i + 1}</span><b>{key.title}</b><small
							>{key.text}</small
						>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: 72px;
		align-items: center;
	}
	.pw {
		perspective: 1600px;
	}
	.paper {
		position: relative;
		background: #fff;
		border-radius: 10px;
		box-shadow:
			0 40px 80px -40px rgba(30, 50, 45, 0.45),
			0 2px 6px rgba(30, 50, 45, 0.06);
		padding: 22px 22px 28px;
		font-size: 10.5px;
		line-height: 1.45;
		color: var(--ink);
		transform: translateY(24px);
		opacity: 0;
		transition:
			transform 1s cubic-bezier(0.2, 0.7, 0.2, 1),
			opacity 0.8s;
	}
	.pw.in .paper {
		transform: none;
		opacity: 1;
	}
	.top,
	.sum,
	.portal,
	.obj {
		position: relative;
		transition:
			box-shadow 0.35s,
			background 0.35s;
		border-radius: 8px;
	}
	.hl {
		box-shadow:
			0 0 0 3px #1e322d,
			0 12px 26px -12px rgba(30, 50, 45, 0.45);
	}
	.top {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 16px;
		background: #e4efe5;
		padding: 14px 16px;
	}
	.snd {
		display: block;
		font-size: 8.5px;
		font-weight: 600;
		border-bottom: 1px solid #1e322d;
		padding-bottom: 4px;
		margin-bottom: 8px;
	}
	.addr b {
		display: block;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.3;
	}
	.logo {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 5px;
		font-size: 15px;
		font-weight: 500;
		margin-bottom: 6px;
	}
	.logo svg {
		width: 20px;
		height: 14px;
	}
	.ttl b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
		line-height: 1.3;
	}
	.ttl small {
		display: block;
		font-size: 9px;
		font-weight: 600;
		margin-top: 5px;
	}
	.meta {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		padding: 14px 4px 4px;
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px 10px;
		margin: 0;
	}
	dt {
		font-weight: 600;
	}
	dd {
		margin: 0;
		color: var(--muted);
	}
	.intro {
		margin: 10px 4px 12px;
		color: var(--muted);
	}
	.sum {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		background: #5e8a6a;
		color: #fff;
		padding: 10px 16px 12px;
	}
	.sum small {
		grid-column: 2;
		text-align: right;
		font-size: 9px;
		opacity: 0.8;
	}
	.sum span {
		font-size: 13px;
	}
	.sum b {
		font-size: 15px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.notes {
		padding: 12px 4px 4px;
	}
	.notes b {
		display: block;
		font-size: 10.5px;
		margin-bottom: 4px;
	}
	.notes p {
		margin: 0 0 4px;
		padding-left: 16px;
		position: relative;
		color: var(--muted);
	}
	.notes p::before {
		content: "";
		position: absolute;
		left: 0;
		top: 3px;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: #e4eae6;
	}
	.portal {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 14px;
		align-items: center;
		background: #e4efe5;
		padding: 12px 14px;
		margin-top: 10px;
	}
	.portal b {
		display: block;
		font-size: 10.5px;
	}
	.portal p {
		margin: 4px 0 6px;
		color: var(--muted);
	}
	.cred {
		display: inline-block;
		font-weight: 600;
		margin-right: 14px;
	}
	.cred i {
		font-style: normal;
		font-weight: 400;
	}
	.qr {
		margin: 0;
		text-align: center;
	}
	.qr svg {
		width: 64px;
		height: 64px;
		display: block;
	}
	.qr figcaption {
		font-size: 8px;
		color: var(--faint);
		margin-top: 2px;
	}
	.obj {
		padding: 12px 4px 0;
	}
	.obj b {
		display: block;
		font-size: 10.5px;
		margin-bottom: 5px;
	}
	.obj ul {
		list-style: none;
		margin: 0;
		padding: 6px 0 0;
		border-top: 1px solid #e4eae6;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3px 10px;
		color: var(--muted);
	}
	.stamp {
		position: absolute;
		right: 16px;
		bottom: -30px;
		font-size: 11.5px;
		color: var(--faint);
	}
	.lead {
		font-size: 17px;
		line-height: 1.6;
		color: var(--muted);
		margin: 18px 0 0;
		max-width: 48ch;
	}
	.keys {
		list-style: none;
		margin: 28px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.keys li {
		display: grid;
		grid-template-columns: 32px 1fr;
		gap: 2px 14px;
		padding: 14px 16px;
		border-radius: 14px;
		cursor: default;
		transition: background 0.3s;
	}
	.keys li:hover,
	.keys li.on {
		background: #fff;
	}
	.keys li span {
		grid-row: span 2;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 600;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.keys li.on span,
	.keys li:hover span {
		background: #1e322d;
		border-color: #1e322d;
		color: #fff;
	}
	.keys b {
		font-size: 15.5px;
		font-weight: 600;
	}
	.keys small {
		font-size: 14px;
		color: var(--muted);
		line-height: 1.5;
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 48px;
		}
		.grid > div:last-child {
			order: -1;
		}
		.pw {
			max-width: 620px;
			margin: 0 auto;
			width: 100%;
		}
	}
	@media (max-width: 640px) {
		.paper {
			padding: 14px 14px 20px;
			font-size: 9.5px;
		}
		.top {
			grid-template-columns: 1fr;
			gap: 10px;
		}
		.logo {
			justify-content: flex-start;
		}
		.meta {
			grid-template-columns: 1fr;
		}
		.obj ul {
			grid-template-columns: 1fr 1fr;
		}
		.portal {
			grid-template-columns: 1fr;
		}
		.qr {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.paper {
			transition: none;
			transform: none;
			opacity: 1;
		}
	}
</style>

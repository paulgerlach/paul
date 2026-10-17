<!--
  "So sieht die Abrechnung aus.": a sample statement as HTML (with example
  data) and four keys that point into it. Once in view, the paper settles and
  the keys cycle every 2.6 s (only while in view and the tab is visible);
  hovering, focusing or tapping a key shows it and pauses the cycle. Without
  JS or with reduced motion the paper is static and nothing cycles.
-->
<script lang="ts">
	import qr from "$lib/assets/landing/selbstabrechnung/qr.svg";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { sample } from "../content";

	const p = sample.paper;

	/** The highlighted key, 1–4 (0: none). */
	let active = $state(0);
	let armed = $state(false);
	let shown = $state(false);
	/** A key is hovered, focused or was tapped. */
	let held = false;
	let resume = () => {};

	function cycle(el: HTMLElement) {
		const reduced = prefersReducedMotion();
		armed = !reduced;
		let visible = false;
		let started = false;
		let timer: ReturnType<typeof setInterval> | undefined;
		let delay: ReturnType<typeof setTimeout> | undefined;
		const next = () => (active = (active % sample.keys.length) + 1);
		const update = () => {
			clearInterval(timer);
			clearTimeout(delay);
			if (reduced || held || !visible) return;
			if (document.visibilityState !== "visible") return;
			// The first key after the paper has settled, then every 2.6 s.
			delay = setTimeout(
				() => {
					started = true;
					next();
					timer = setInterval(next, 2600);
				},
				started ? 2600 : 900,
			);
		};
		resume = update;
		const stop = inView({
			threshold: 0.25,
			onEnter: () => {
				shown = true;
				visible = true;
				update();
			},
			onLeave: () => {
				visible = false;
				update();
			},
		})(el);
		document.addEventListener("visibilitychange", update);
		return () => {
			stop?.();
			document.removeEventListener("visibilitychange", update);
			clearInterval(timer);
			clearTimeout(delay);
		};
	}

	function hold(k: number) {
		held = true;
		active = k;
		resume();
	}
	function release() {
		held = false;
		resume();
	}
</script>

<section class="sec alt" id="musterabrechnung" aria-labelledby="hd-h">
	<div class="wrap grid" {@attach cycle}>
		<div class={["paper-wrap rv", armed && "armed", shown && "in"]}>
			<article class="paper" aria-label={p.label}>
				<header class={["top", active === 1 && "hl"]}>
					<div class="addr">
						<small class="snd">{p.sender}</small>
						{#each p.recipient as line (line)}<b>{line}</b>{/each}
					</div>
					<div class="ttl">
						<span class="logo">{p.logo} <HeidiMark /></span>
						<b>{p.title}</b>
						<small>{p.subtitle}</small>
					</div>
				</header>
				<div class="meta">
					{#each p.meta as list, i (i)}
						<dl>
							{#each list as [term, lines] (term)}
								<dt>{term}</dt>
								<dd>
									{#each lines as line, j (j)}{#if j > 0}<br
											/>{/if}{line}{/each}
								</dd>
							{/each}
						</dl>
					{/each}
				</div>
				<p class="intro">{p.intro[0]}<br />{p.intro[1]}</p>
				<div class={["sum", active === 2 && "hl"]}>
					<small>{p.amountLabel}</small><span>{p.totalLabel}</span><b
						>{p.amount}</b
					>
				</div>
				<div class="notes">
					<b>{p.notesTitle}</b>
					{#each p.notes as note (note)}<p>{note}</p>{/each}
				</div>
				<div class={["portal", active === 3 && "hl"]}>
					<div>
						<b>{p.portal.title}</b>
						<p>{p.portal.text}</p>
						{#each p.portal.credentials as [label, value] (label)}
							<span class="cred">{label} <i>{value}</i></span>
						{/each}
					</div>
					<figure class="qr">
						<img src={qr} alt="" width="64" height="64" />
						<figcaption>{p.portal.qrCaption}</figcaption>
					</figure>
				</div>
				<div class={["obj", active === 4 && "hl"]}>
					<b>{p.objectsTitle}</b>
					<ul>
						{#each p.objects as object (object)}<li>{object}</li>{/each}
					</ul>
				</div>
				<span class="stamp">{p.stamp}</span>
			</article>
		</div>
		<div class="txt">
			<SectionHead id="hd-h" eyebrow={sample.pill} heading={sample.h2}>
				{#snippet icon()}
					<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
						d="M12 2.5V6h3.5M8 10h5M8 13h5"
					/>
				{/snippet}
			</SectionHead>
			<p class="lead rv">{sample.lead}</p>
			<ol class="keys rv">
				{#each sample.keys as key, i (key.title)}
					<li>
						<button
							type="button"
							class={[active === i + 1 && "on"]}
							aria-pressed={active === i + 1}
							onmouseenter={() => hold(i + 1)}
							onmouseleave={release}
							onfocus={() => hold(i + 1)}
							onblur={release}
							onclick={() => hold(i + 1)}
						>
							<span>{i + 1}</span><b>{key.title}</b><small>{key.sub}</small>
						</button>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.alt {
		background: var(--bg);
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: 72px;
		align-items: center;
	}
	.paper-wrap {
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
		transform: rotate(-1.2deg);
		transition:
			transform 1s cubic-bezier(0.2, 0.7, 0.2, 1),
			opacity 0.8s;
	}
	.armed:not(.in) .paper {
		transform: rotate(-1.2deg) translateY(24px);
		opacity: 0;
	}
	.top,
	.sum,
	.portal,
	.obj {
		position: relative;
		border-radius: 8px;
		transition:
			box-shadow 0.35s,
			background 0.35s;
	}
	.hl {
		box-shadow: 0 0 0 3px var(--accent);
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
	.logo :global(svg) {
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
	.qr img {
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
	.keys button {
		display: grid;
		grid-template-columns: 32px 1fr;
		gap: 2px 14px;
		width: 100%;
		padding: 14px 16px;
		border: 0;
		border-radius: 14px;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: default;
		transition: background 0.3s;
	}
	.keys button.on {
		background: #fff;
	}
	.keys button:focus-visible {
		outline: 2px solid var(--accent-deep);
		outline-offset: 2px;
	}
	.keys span {
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
	.keys .on span {
		background: var(--accent);
		border-color: var(--accent);
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
		.txt {
			order: -1;
		}
		.paper-wrap {
			max-width: 620px;
			margin: 0 auto;
			width: 100%;
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
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
		.paper,
		.top,
		.sum,
		.portal,
		.obj,
		.keys button,
		.keys span {
			transition: none;
		}
	}
</style>

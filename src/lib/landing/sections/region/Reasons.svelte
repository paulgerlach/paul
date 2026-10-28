<!--
  "Vier gute Gründe für Heidi in Berlin": four cards with a small visual each.
  Only the title differs per page. Once in view, the contact's status shows
  "schreibt …" for a moment every few seconds, the billing tile replays every
  5.2 s (and on click) and the two notifications slide in. Reduced motion:
  the end state, no loops. The design also cycles chat messages in the first
  tile, but hides them, so they aren't ported.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import contactPhoto from "$lib/assets/landing/region/contact.webp?enhanced";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();

	const cards = [
		{
			title: "Persönlicher Ansprechpartner",
			text: "Ein fester Kontakt, der Ihre Liegenschaften kennt. Statt wechselnder Hotline-Kontakte sprechen Sie immer mit derselben Person.",
		},
		{
			title: "Alles aus einer Hand",
			text: "Funkzähler, Installation, Ablesung und Abrechnung kommen von Heidi. Ein Partner, ein Dashboard, keine Schnittstellen zwischen Dienstleistern.",
		},
		{
			title: "Abrechnung auf Knopfdruck",
			text: "Alle Verbräuche liegen per Funk vor. Ein Klick, und die Heizkostenabrechnung steht für jede Einheit.",
		},
		{
			title: "Mieterkommunikation und uVI",
			text: "Heidi informiert Mieter 14 Tage vor der Montage und schickt die unterjährige Verbrauchsinformation jeden Monat automatisch.",
		},
	];
	// Fan-out targets of the five documents in the billing tile
	const docs = [
		{ x: -70, y: -6, r: -14 },
		{ x: -36, y: -22, r: -6 },
		{ x: 0, y: -28, r: 0 },
		{ x: 36, y: -22, r: 6 },
		{ x: 70, y: -6, r: 14 },
	];

	/** Set in the browser: the notifications wait for the section to come into view. */
	let armed = $state(false);
	let shown = $state(false);
	let typing = $state(false);
	/** Restarts the billing animation: off for a frame, then on again. */
	let billing = $state(false);

	let timers: ReturnType<typeof setTimeout>[] = [];
	let loops: ReturnType<typeof setInterval>[] = [];
	let frame = 0;

	function replay() {
		billing = false;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => (billing = true));
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key !== "Enter" && e.key !== " ") return;
		e.preventDefault();
		replay();
	}

	function chat() {
		timers.push(setTimeout(() => (typing = true), 1300));
		timers.push(setTimeout(() => (typing = false), 2900));
	}

	function start() {
		shown = true;
		if (prefersReducedMotion()) {
			billing = true;
			return;
		}
		chat();
		loops.push(setInterval(chat, 7100));
		timers.push(setTimeout(replay, 700));
		loops.push(setInterval(replay, 5200));
	}

	$effect(() => () => {
		timers.forEach(clearTimeout);
		loops.forEach(clearInterval);
		cancelAnimationFrame(frame);
	});
</script>

{#snippet bell()}
	<StrokeIcon
		><path d="M5 8a5 5 0 0 1 10 0c0 4.5 1.8 6 1.8 6H3.2S5 12.5 5 8z" /><path
			d="M8.3 16.8a1.9 1.9 0 0 0 3.4 0"
		/></StrokeIcon
	>
{/snippet}
{#snippet doc()}
	<StrokeIcon
		><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
			d="M12 2.5V6h3.5M7.5 10h5M7.5 13h3.5"
		/></StrokeIcon
	>
{/snippet}
{#snippet bolt()}
	<StrokeIcon><path d="M11 2.5L4.5 11h5l-1 6.5L15.5 9h-5z" /></StrokeIcon>
{/snippet}

<section
	class={["hb wrap", armed && "armed", shown && "in"]}
	aria-labelledby="hb-h"
	{@attach (el) => {
		armed = !prefersReducedMotion();
		return inView({ threshold: 0.25, once: true, onEnter: start })(el);
	}}
>
	<div class="hb-head">
		<h2 id="hb-h">{content.reasons.title}</h2>
		<p>
			Messdienst ohne Koordinationsaufwand: Zähler rein, Abrechnung raus, Mieter
			informiert.
		</p>
	</div>
	<div class="hb-grid">
		{#each cards as card, i (card.title)}
			<article class="hb-card">
				{#if i === 0}
					<div class="hb-tile hb-t1">
						<Image
							class="hb-pt"
							src={contactPhoto}
							alt="Ihre persönliche Ansprechpartnerin bei Heidi"
							sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 300px"
						/>
						<div class="hb-ct">
							<small
								>Ihre Ansprechpartnerin · <em
									>{typing ? "schreibt …" : "erreichbar"}</em
								></small
							>
						</div>
						<div class="hb-chip">
							<StrokeIcon
								><path d="M4 11V9a6 6 0 0 1 12 0v2" /><rect
									x="2.8"
									y="10.5"
									width="3.4"
									height="5"
									rx="1.2"
								/><rect
									x="13.8"
									y="10.5"
									width="3.4"
									height="5"
									rx="1.2"
								/><path d="M16 15.5c0 1.5-1.6 2.3-4 2.3" /></StrokeIcon
							>Persönlich betreut
						</div>
					</div>
				{:else if i === 1}
					<div class="hb-tile hb-t2">
						<div class="hb-orb" aria-hidden="true">
							<i>{@render doc()}</i>
							<i>{@render bell()}</i>
							<i
								><StrokeIcon
									><rect x="5.5" y="2.5" width="9" height="15" rx="2" /><path
										d="M9 15h2"
									/></StrokeIcon
								></i
							>
							<i>{@render bolt()}</i>
						</div>
						<span class="hb-big">1</span><small>Partner für alles</small>
					</div>
				{:else if i === 2}
					<div
						class={["hb-tile hb-t3", billing && "go"]}
						role="button"
						tabindex="0"
						aria-label="Abrechnung erstellen (Animation)"
						onclick={replay}
						{onkeydown}
					>
						<div class="hb-docs" aria-hidden="true">
							{#each docs as d, j (j)}
								<i style:--x="{d.x}px" style:--y="{d.y}px" style:--r="{d.r}deg"
								></i>
							{/each}
						</div>
						<span class="hb-btn" aria-hidden="true">
							<span class="bi">
								<span class="bz">{@render bolt()}</span>
								<span class="bk">
									<svg viewBox="0 0 12 10"
										><path
											d="M1 5l3.5 3.5L11 1"
											stroke="#fff"
											stroke-width="2"
											fill="none"
										/></svg
									>
								</span>
							</span>
							Abrechnung erstellen
							<svg class="hb-cur" viewBox="0 0 24 28">
								<path
									d="M2 2l19 11-8.5 1.8L8 24z"
									fill="#fff"
									stroke="#1E322D"
									stroke-width="1.6"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
						<div class="hb-chip">{@render doc()}Per Klick, nach HKVO</div>
					</div>
				{:else}
					<div class="hb-tile hb-t4">
						<div class="hb-ph">
							<div class="hb-ph-t" aria-hidden="true">
								<span>9:41</span><span>Heidi</span>
							</div>
							<div class="hb-nt">
								<span class="ni">{@render bell()}</span>
								<span
									><b>Ihre Verbrauchsinfo September</b><small
										>Jetzt im Mieterportal ansehen</small
									></span
								>
							</div>
							<div class="hb-nt">
								<span class="ni">{@render doc()}</span>
								<span
									><b>Montage in 14 Tagen</b><small
										>Zeitfenster: 1 bis 2 Stunden</small
									></span
								>
							</div>
						</div>
						<div class="hb-chip">{@render bell()}Monatlich automatisch</div>
					</div>
				{/if}
				<span class="hb-n">{String(i + 1).padStart(2, "0")}</span>
				<h3>{card.title}</h3>
				<p>{card.text}</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.hb {
		padding-block: 0 110px;
	}
	.hb-head {
		max-width: 820px;
	}
	.hb-head h2 {
		font-size: clamp(34px, 4.4vw, 60px);
		font-weight: 500;
		letter-spacing: -0.035em;
		line-height: 1.04;
	}
	.hb-head p {
		color: var(--muted);
		font-size: clamp(16px, 1.4vw, 19px);
		margin-top: 18px;
		max-width: 52ch;
		line-height: 1.5;
	}
	.hb-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
		margin-top: 52px;
	}
	.hb-card {
		display: flex;
		flex-direction: column;
	}
	.hb-tile {
		position: relative;
		height: clamp(220px, 19vw, 270px);
		border-radius: 18px;
		overflow: hidden;
		background: var(--stone);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.hb-chip {
		position: absolute;
		left: 14px;
		right: 14px;
		bottom: 14px;
		display: flex;
		align-items: center;
		gap: 10px;
		background: #fff;
		border-radius: 12px;
		padding: 11px 14px;
		font-size: 14.5px;
		font-weight: 600;
		box-shadow: 0 6px 18px -10px rgba(30, 50, 45, 0.35);
		z-index: 2;
	}
	.hb-chip :global(svg) {
		width: 18px;
		height: 18px;
		color: var(--ok);
		flex: none;
	}
	.hb-n {
		display: block;
		font-size: 15px;
		font-weight: 600;
		color: var(--ok);
		margin-top: 22px;
		font-variant-numeric: tabular-nums;
	}
	.hb-card h3 {
		font-size: clamp(19px, 1.6vw, 22px);
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 8px;
	}
	.hb-card p {
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.5;
		margin-top: 10px;
	}

	/* 1 Ansprechpartner: full photo with a status pill */
	.hb-t1 {
		justify-content: flex-start;
		align-items: flex-start;
	}
	.hb-t1 :global(.hb-pt) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 22%;
		transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.hb-card:hover :global(.hb-pt) {
		transform: scale(1.04);
	}
	.hb-ct {
		position: absolute;
		left: 12px;
		top: 12px;
		z-index: 2;
		max-width: calc(100% - 24px);
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border-radius: 999px;
		padding: 7px 12px 7px 10px;
		box-shadow: 0 8px 22px -12px rgba(30, 50, 45, 0.45);
	}
	.hb-ct::before {
		content: "";
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3e9a57;
		flex: none;
		animation: hbPulse 2.4s infinite;
	}
	.hb-ct small {
		display: block;
		min-width: 0;
		font-size: 12.5px;
		font-weight: 500;
		color: var(--ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.hb-ct em {
		font-style: normal;
		color: #2f7a3c;
	}
	@keyframes hbPulse {
		0% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0.45);
		}
		70% {
			box-shadow: 0 0 0 7px rgba(62, 154, 87, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0);
		}
	}

	/* 2 Aus einer Hand */
	.hb-t2 {
		background: var(--accent);
		flex-direction: column;
		color: var(--ink);
	}
	.hb-big {
		font-size: clamp(84px, 8vw, 118px);
		font-weight: 500;
		letter-spacing: -0.06em;
		line-height: 0.9;
	}
	.hb-t2 small {
		font-size: 15px;
		font-weight: 500;
		margin-top: 12px;
	}
	.hb-orb {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.hb-orb i {
		position: absolute;
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background: rgba(255, 255, 255, 0.55);
		display: grid;
		place-items: center;
		color: var(--ink);
		transition:
			transform 1s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.8s;
	}
	.hb-orb i :global(svg) {
		width: 18px;
		height: 18px;
	}
	.hb-orb i:nth-child(1) {
		left: 12%;
		top: 14%;
	}
	.hb-orb i:nth-child(2) {
		right: 12%;
		top: 14%;
	}
	.hb-orb i:nth-child(3) {
		left: 12%;
		bottom: 14%;
	}
	.hb-orb i:nth-child(4) {
		right: 12%;
		bottom: 14%;
	}
	.hb-t2:hover .hb-orb i:nth-child(1) {
		transform: translate(40%, 40%);
	}
	.hb-t2:hover .hb-orb i:nth-child(2) {
		transform: translate(-40%, 40%);
	}
	.hb-t2:hover .hb-orb i:nth-child(3) {
		transform: translate(40%, -40%);
	}
	.hb-t2:hover .hb-orb i:nth-child(4) {
		transform: translate(-40%, -40%);
	}

	/* 3 Abrechnung */
	.hb-t3 {
		background: var(--ink);
		cursor: pointer;
	}
	.hb-t3:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.hb-btn {
		position: relative;
		margin-top: -40px;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		font-size: 15px;
		border-radius: 11px;
		padding: 13px 18px;
		transition: background 0.3s;
	}
	.hb-btn .bi {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		position: relative;
	}
	.hb-btn .bi :global(svg) {
		width: 12px;
		height: 12px;
	}
	.hb-btn .bk {
		display: none;
	}
	.hb-btn .bk svg {
		width: 10px;
	}
	.hb-cur {
		position: absolute;
		width: 22px;
		right: -6px;
		bottom: -12px;
		transition: transform 0.3s;
	}
	.hb-t3.go .hb-btn {
		background: #fff;
	}
	.hb-t3.go .hb-btn .bi {
		background: #3e9a57;
	}
	.hb-t3.go .hb-btn .bz {
		display: none;
	}
	.hb-t3.go .hb-btn .bk {
		display: grid;
	}
	.hb-t3.go .hb-cur {
		transform: translate(-3px, -3px) scale(0.92);
	}
	.hb-docs {
		position: absolute;
		left: 50%;
		top: 22%;
		width: 0;
		height: 0;
	}
	.hb-docs i {
		position: absolute;
		width: 26px;
		height: 32px;
		margin: -16px 0 0 -13px;
		background: #fff;
		border-radius: 4px;
		opacity: 0;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}
	.hb-docs i::before {
		content: "";
		position: absolute;
		left: 5px;
		right: 5px;
		top: 8px;
		height: 2px;
		background: #d5dcd9;
		box-shadow:
			0 5px 0 #d5dcd9,
			0 10px 0 #e5eae7;
	}
	.hb-t3.go .hb-docs i {
		animation: hb-doc 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}
	.hb-t3.go .hb-docs i:nth-child(2) {
		animation-delay: 0.12s;
	}
	.hb-t3.go .hb-docs i:nth-child(3) {
		animation-delay: 0.24s;
	}
	.hb-t3.go .hb-docs i:nth-child(4) {
		animation-delay: 0.36s;
	}
	.hb-t3.go .hb-docs i:nth-child(5) {
		animation-delay: 0.48s;
	}
	@keyframes hb-doc {
		0% {
			opacity: 0;
			transform: translate(0, 40px) scale(0.6);
		}
		30% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(1);
		}
	}

	/* 4 Mieter */
	.hb-t4 {
		align-items: flex-end;
	}
	.hb-ph {
		width: 80%;
		background: #fff;
		border-radius: 22px 22px 0 0;
		padding: 12px 12px 60px;
		box-shadow: 0 18px 36px -24px rgba(30, 50, 45, 0.45);
		align-self: flex-end;
		margin-bottom: -2px;
	}
	.hb-ph-t {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		font-weight: 600;
		color: var(--muted);
		padding: 0 4px 9px;
	}
	.hb-nt {
		display: flex;
		gap: 9px;
		align-items: flex-start;
		background: var(--stone);
		border-radius: 12px;
		padding: 9px 10px;
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.hb-nt + .hb-nt {
		margin-top: 7px;
	}
	.hb-nt > span:last-child {
		min-width: 0;
	}
	.armed .hb-nt {
		opacity: 0;
		transform: translateY(-8px);
	}
	.armed.in .hb-nt {
		opacity: 1;
		transform: none;
	}
	.hb.in .hb-nt:nth-child(3) {
		transition-delay: 0.5s;
	}
	.hb.in .hb-nt:nth-child(4) {
		transition-delay: 1s;
	}
	.hb-nt .ni {
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		flex: none;
	}
	.hb-nt .ni :global(svg) {
		width: 14px;
		height: 14px;
	}
	.hb-nt b {
		display: block;
		font-size: 11.5px;
		font-weight: 600;
		line-height: 1.25;
	}
	.hb-nt small {
		display: block;
		font-size: 10.5px;
		color: var(--muted);
	}

	@media (max-width: 1100px) {
		.hb-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			row-gap: 44px;
		}
	}
	@media (max-width: 620px) {
		.hb-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.hb-tile {
			height: 250px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hb * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>

<script lang="ts">
	import { inView } from "../../attachments/inView";
	import { playOnView } from "../../attachments/playOnView";
	import { initials, oldWayTiles } from "../../data";
	import { prefersReducedMotion } from "../../motion";
	import HeidiMark from "../icons/HeidiMark.svelte";

	const FIRST = 400; // ms until the first tile
	const STEP = 650; // ms between tiles
	const HOLD = 3500; // ms all tiles stay up
	const FADE = 800; // ms for the fade-out
	const N = oldWayTiles.length;

	// SSR and reduced motion: every tile is shown, nothing moves.
	let animated = $state(false);
	let shown = $state(N);
	let fading = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];

	const stop = () => {
		timers.forEach(clearTimeout);
		timers = [];
	};

	function cycle() {
		stop();
		fading = false;
		shown = 0;
		for (let i = 0; i < N; i++)
			timers.push(setTimeout(() => (shown = i + 1), FIRST + i * STEP));
		const end = FIRST + N * STEP + HOLD;
		timers.push(setTimeout(() => (fading = true), end));
		timers.push(setTimeout(cycle, end + FADE));
	}

	$effect(() => {
		animated = !prefersReducedMotion();
		return stop;
	});

	// Pauses off screen and starts over on the way back in.
	const view = inView({
		threshold: 0.25,
		onEnter: () => animated && cycle(),
		onLeave: () => {
			stop();
			fading = false;
			shown = N;
		},
	});
</script>

<section class="sec wrap">
	<div class="shead">
		<h2>Weniger Nachfragen. Zufriedenere Mieter.</h2>
		<p>Wenn Ablesung, Montage und Abrechnung laufen, hören die Anfragen auf.</p>
	</div>
	<div class="ways">
		<div class="oldway" class:anim={animated} class:out={fading} {@attach view}>
			<h3 class="lbl">Der alte Weg.</h3>
			<p class="sr-only">
				Offene Mieteranfragen, verpasste Fristen und schlechte Bewertungen.
			</p>
			{#each oldWayTiles as tile, i (i)}
				<div
					class="tile"
					class:review={tile.kind === "review"}
					class:in={i < shown}
					style="left:{tile.left}%;top:{tile.top}%;z-index:{10 + i}"
					aria-hidden="true"
				>
					{#if tile.kind === "review"}
						<div class="av" style="background:#B7A08A">
							{initials(tile.author)}
						</div>
						<div>
							<div class="meta"><b></b>Neue Bewertung · jetzt</div>
							<div class="stars">
								{"★".repeat(tile.stars)}<s>{"★".repeat(5 - tile.stars)}</s>
							</div>
							<div class="q">„{tile.text}“</div>
							<div class="n">{tile.author}</div>
						</div>
					{:else}
						<div class="av" style="background:{tile.color}">
							{initials(tile.property)}
						</div>
						<div>
							<div class="meta"><b></b>{tile.source} · jetzt</div>
							<div class="n">{tile.property}</div>
							<div class="st">{tile.text}</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="newway">
			<h3>Der Heidi-Weg.</h3>
			<div class="phone" {@attach playOnView({ loop: 10000 })}>
				<div class="bar" aria-hidden="true">
					<span>9:41</span><span>●●● ◔ ▭</span>
				</div>
				<div class="app" aria-hidden="true">
					<div class="app-ic"><HeidiMark /></div>
					<span class="nm">
						Heidi
						<svg class="verified" viewBox="0 0 24 24">
							<path
								fill="#3B82F6"
								d="M12 1l2.4 1.9 3-.4 1.1 2.8 2.8 1.1-.4 3L23 12l-1.9 2.4.4 3-2.8 1.1-1.1 2.8-3-.4L12 23l-2.4-1.9-3 .4-1.1-2.8-2.8-1.1.4-3L1 12l1.9-2.4-.4-3 2.8-1.1 1.1-2.8 3 .4z"
							/>
							<path
								d="M7.5 12.3l3 3 6-6.3"
								stroke="#fff"
								stroke-width="2.2"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						›
					</span>
				</div>
				<div class="bubble a-pop" style="--d:.3s">
					<span class="heart a-pop" style="--d:3s" aria-hidden="true">💚</span>
					<span class="ln a-up" style="--d:.8s"
						>🏢 Lindenallee 8 läuft jetzt über Heidi.</span
					>
					<span class="ln a-up" style="--d:1.3s"
						>📊 142 Bestandszähler übernommen und ausgewertet.</span
					>
					<span class="ln a-up" style="--d:1.8s"
						>📄 Altvertrag läuft bis 2029, kein Warten nötig.</span
					>
					<span class="ln a-up" style="--d:2.3s"
						>✅ Erste Abrechnung vorbereitet.</span
					>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.ways {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		margin-top: 64px;
	}
	.oldway {
		position: relative;
		height: 620px;
		border-radius: 18px;
		overflow: hidden;
		background: #e9ebea;
	}
	.lbl {
		position: absolute;
		left: 50%;
		top: 50px;
		transform: translateX(-50%);
		line-height: 1.5;
		font-size: 38px;
		z-index: 100;
		white-space: nowrap;
		background: rgba(233, 235, 234, 0.82);
		backdrop-filter: blur(6px);
		padding: 6px 22px;
		border-radius: 14px;
	}
	.tile {
		position: absolute;
		background: #fff;
		border-radius: 16px;
		padding: 14px 22px 14px 14px;
		display: flex;
		align-items: center;
		gap: 14px;
		box-shadow: 0 8px 24px rgba(30, 50, 45, 0.08);
		white-space: nowrap;
	}
	.av {
		width: 56px;
		height: 56px;
		border-radius: 8px;
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 17px;
		color: #fff;
		flex: none;
	}
	.n {
		color: var(--muted);
		font-size: 15px;
	}
	.st {
		color: var(--orange);
		font-size: 19px;
	}
	.meta {
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
		display: flex;
		gap: 6px;
		align-items: center;
	}
	.meta b {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--orange);
		display: inline-block;
	}
	.tile.review {
		white-space: normal;
		width: 300px;
		align-items: flex-start;
	}
	.stars {
		color: #e0a526;
		font-size: 15px;
		letter-spacing: 2px;
	}
	.stars s {
		color: #dadfdd;
		text-decoration: none;
	}
	.q {
		font-size: 15px;
		line-height: 1.35;
		color: var(--ink);
		margin-top: 2px;
	}
	.oldway.anim .tile {
		opacity: 0;
		transform: scale(0.6) translateY(14px);
	}
	.oldway.anim .tile.in {
		animation: pop 0.55s cubic-bezier(0.2, 1.5, 0.4, 1) forwards;
	}
	.oldway.anim.out .tile.in {
		animation: none;
		opacity: 0;
		transform: scale(0.96);
		transition:
			opacity 0.6s,
			transform 0.6s;
	}

	.newway {
		border-radius: 18px;
		background: var(--stone);
		height: 620px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 56px;
	}
	.newway h3 {
		font-size: 38px;
	}
	.phone {
		margin-top: 40px;
		width: min(380px, 86%);
		flex: 1;
		background: #fff;
		border: 10px solid #edeeed;
		border-bottom: 0;
		border-radius: 44px 44px 0 0;
		padding: 18px 22px;
	}
	.phone .bar {
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		font-size: 15px;
	}
	.app {
		display: grid;
		justify-items: center;
		gap: 4px;
		margin-top: 18px;
		font-size: 13px;
	}
	.app-ic {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid var(--line);
		display: grid;
		place-items: center;
		color: var(--ink);
	}
	.app-ic :global(svg) {
		width: 26px;
	}
	.nm {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-weight: 500;
	}
	.verified {
		width: 15px;
		height: 15px;
		flex: none;
	}
	.bubble {
		margin-top: 22px;
		background: #e9eae9;
		border-radius: 22px;
		padding: 14px 18px;
		font-size: 16px;
		line-height: 1.45;
		position: relative;
		max-width: 92%;
		transform-origin: left top;
	}
	.heart {
		position: absolute;
		right: -12px;
		top: -14px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #3b82f6;
		display: grid;
		place-items: center;
		font-size: 14px;
	}
	.ln {
		display: block;
	}

	@media (max-width: 980px) {
		.ways {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 520px) {
		.oldway,
		.newway {
			height: 520px;
		}
		.newway h3,
		.lbl {
			font-size: 32px;
		}
	}
</style>

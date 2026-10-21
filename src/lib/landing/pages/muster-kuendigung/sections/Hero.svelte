<!--
  Hero (.pg-hero, light): pill, H1, lead, the two CTAs, three ticks and the
  drawn letter (.kd-hv, hidden from screen readers like the design). The
  letter is rendered in its end state; its signature draws and its badges pop
  in through CSS animations from the first paint, and the top sheet floats
  while the hero is in view. No `#start`: the page has no form.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { hero } from "../content";

	let away = $state(false);
</script>

{#snippet doc()}
	<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M8 10h5M8 13h5" />
{/snippet}

<section class="hero" aria-labelledby="mk-h1">
	<div class="wrap cols">
		<div>
			<span class="pill rv"
				><StrokeIcon>{@render doc()}</StrokeIcon>{hero.pill}</span
			>
			<h1 data-hs class="rv" id="mk-h1">
				{hero.h1} <em>{hero.h1Accent}</em>
			</h1>
			<p class="lead rv">{hero.lead}</p>
			<div class="ctas rv">
				<a class="bk" href={hero.create.href}
					>{hero.create.text} <span class="ar" aria-hidden="true">↓</span></a
				>
				<a class="ghost" href={hero.takeover.href}
					>{hero.takeover.text} <span class="ar" aria-hidden="true">→</span></a
				>
			</div>
			<ul class="ticks rv">
				{#each hero.ticks as tick (tick)}
					<li><span class="tk"><Check /></span>{tick}</li>
				{/each}
			</ul>
		</div>
		<div
			class={["hv", "rv", away && "away"]}
			aria-hidden="true"
			{@attach inView({
				onEnter: () => (away = false),
				onLeave: () => (away = true),
			})}
		>
			<div class="sheet back"></div>
			<div class="sheet front">
				<div class="addr"><i></i><i></i><i></i></div>
				<b>{hero.sheetTitle}</b>
				<div class="txt"><i></i><i></i><i></i><i></i><i></i></div>
				<svg class="sig" viewBox="0 0 160 40"
					><path
						pathLength="1"
						d="M4 30 C 9 18 12 6 15 9 C 18 12 15 28 18 30 C 21 20 26 6 29 9 C 32 12 28 28 33 29 C 38 30 40 18 44 12 C 46 9 47 20 46 30 C 45 22 52 14 56 12 C 52 18 50 22 58 30 C 62 33 64 22 70 22 C 74 22 72 28 68 28 C 64 28 66 20 72 20 C 78 20 78 29 82 29 C 86 29 86 8 89 8 C 92 8 88 30 92 30 C 96 30 96 8 99 8 C 102 8 98 30 102 30 C 106 30 108 22 112 22 C 116 22 114 28 110 28 C 106 28 108 20 116 21 C 120 22 120 30 124 28 C 128 26 128 20 132 21 C 136 22 128 36 156 25"
					/></svg
				>
			</div>
			{#each hero.badges as badge, i (badge)}
				<span class={["badge", i ? "b2" : "b1"]}
					><StrokeIcon>{@render doc()}</StrokeIcon>{badge}</span
				>
			{/each}
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
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* `.cols h1`: beats the landing reset of heading margins. .pg-h1.kd-h1 */
	.cols h1 {
		font-size: clamp(38px, 4.6vw, 62px);
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
	.ar {
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

	/* The letter (.kd-hv) */
	.hv {
		position: relative;
		height: 420px;
		display: grid;
		place-items: center;
	}
	.sheet {
		position: absolute;
		width: 300px;
		height: 390px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		box-shadow: 0 30px 60px -34px rgba(30, 50, 45, 0.4);
	}
	.back {
		transform: rotate(5deg) translate(26px, 10px);
		background: #fafbfa;
	}
	.front {
		transform: rotate(-2deg);
		padding: 30px 28px;
		display: flex;
		flex-direction: column;
		animation: mk-float 6s ease-in-out infinite;
	}
	.away .front {
		animation-play-state: paused;
	}
	@keyframes mk-float {
		50% {
			transform: rotate(-2deg) translateY(-6px);
		}
	}
	.addr {
		display: grid;
		gap: 6px;
		margin-bottom: 26px;
	}
	.addr i,
	.txt i {
		display: block;
		height: 6px;
		border-radius: 3px;
	}
	.addr i {
		background: #e6eae8;
		width: 44%;
	}
	.addr i:first-child {
		width: 56%;
		background: #d5dcd9;
	}
	.front b {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 14px;
	}
	.txt {
		display: grid;
		gap: 9px;
	}
	.txt i {
		background: #eef1ef;
	}
	.txt i:nth-child(3) {
		width: 86%;
	}
	.txt i:nth-child(5) {
		width: 60%;
	}
	.sig {
		width: 130px;
		margin-top: auto;
		overflow: visible;
	}
	/* Drawn at rest; the animation starts it undrawn (`both`). */
	.sig path {
		fill: none;
		stroke: #2b4a8c;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		animation: mk-draw 2.2s cubic-bezier(0.45, 0.1, 0.55, 0.9) 0.6s both;
	}
	@keyframes mk-draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	.badge {
		position: absolute;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--ink);
		color: #fff;
		font-size: 13px;
		font-weight: 600;
		border-radius: 11px;
		padding: 9px 13px;
		box-shadow: 0 14px 30px -14px rgba(30, 50, 45, 0.5);
		animation: mk-pop 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) 2.4s both;
	}
	.badge :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
	}
	.b1 {
		right: 8%;
		top: 22%;
	}
	.b2 {
		left: 10%;
		bottom: 18%;
		background: var(--accent);
		color: var(--ink);
		animation-delay: 2.6s;
	}
	.b2 :global(svg) {
		color: var(--ink);
	}
	/* The badges' transition (opacity .5s, transform .5s with the overshoot) */
	@keyframes mk-pop {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
		.hv {
			height: 380px;
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
		.hv {
			height: 340px;
		}
		.sheet {
			width: 240px;
			height: 320px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
		.front,
		.sig path,
		.badge {
			animation: none;
		}
	}
</style>

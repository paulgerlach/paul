<!-- Hero: eyebrow, the big H1, and the lead with two CTAs pushed to the right. No `#start`: that's the contact card's form. -->
<script lang="ts">
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import { hero } from "../content";
</script>

<section class="hero" aria-labelledby="vg-h1">
	<div class="wrap">
		<Eyebrow text={hero.eyebrow} class="rv" />
		<h1 data-hs class="rv" id="vg-h1">{hero.h1}</h1>
		<div class="lead rv">
			<p>{hero.lead}</p>
			<div class="btns">
				{#each hero.ctas as cta (cta.text)}
					<a
						class={["btn", cta.dark && "d"]}
						href={cta.href}
						onclick={cta.href === START_HREF ? focusSignup : undefined}
						>{cta.text}</a
					>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: clamp(56px, 7vw, 104px) 0 clamp(40px, 5vw, 72px);
	}
	.wrap {
		max-width: 1280px;
	}
	h1 {
		font-size: clamp(44px, 7vw, 104px);
		line-height: 0.98;
		letter-spacing: -0.045em;
		font-weight: 500;
		margin-top: 22px;
		max-width: 14ch;
		text-wrap: balance;
	}
	.lead {
		max-width: 440px;
		margin: clamp(28px, 4vw, 48px) 0 0 auto;
	}
	.lead p {
		font-size: 17px;
		line-height: 1.55;
		color: var(--muted);
	}
	.btns {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 22px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 46px;
		padding: 0 20px;
		border-radius: 11px;
		font-weight: 600;
		font-size: 15px;
		border: 1px solid var(--hair);
		background: #fff;
		color: var(--ink);
		text-decoration: none;
		transition:
			border-color 0.2s,
			background 0.25s,
			transform 0.15s;
	}
	.btn:hover {
		border-color: #c3cdc8;
	}
	.btn:active {
		transform: scale(0.98);
	}
	.btn.d {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.btn.d:hover {
		background: linear-gradient(180deg, #2a443d, #1e322d);
	}
	@media (max-width: 980px) {
		.lead {
			margin-left: 0;
		}
	}
	/* The design's #hs-css (it wins over .ar-h1's own 560 px rule) */
	@media (max-width: 1040px) and (min-width: 621px) {
		h1 {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
	}
	@media (max-width: 620px) {
		h1 {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
		.btn:active {
			transform: none;
		}
	}
</style>

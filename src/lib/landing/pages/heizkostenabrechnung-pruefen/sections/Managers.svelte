<!-- "Mit Heidi entstehen diese Fehler gar nicht erst." (.mc-vw): the dark band for managers with "Heizkostenabrechnung mit Heidi →" (/funktionen) and "Demo buchen" (the closing form). -->
<script lang="ts">
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import Icon from "../components/Icon.svelte";
	import { managers } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="vw-h">
	<div class="wrap">
		<div class="vw rv">
			<div>
				<span class="pill"><Icon name="building" />{managers.pill}</span>
				<h2 id="vw-h">{managers.h2}</h2>
				<p>{managers.text}</p>
			</div>
			<div class="btns">
				<a class="bk-next inv" href={managers.billing.href}
					>{managers.billing.text} <span class="ar">→</span></a
				>
				<a
					class="pg-ghost ghost"
					href={managers.demo.href}
					onclick={managers.demo.href === START_HREF ? focusSignup : undefined}
					>{managers.demo.text}</a
				>
			</div>
		</div>
	</div>
</section>

<style>
	.vw {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 32px;
		flex-wrap: wrap;
		background: var(--ink);
		color: #fff;
		border-radius: 24px;
		padding: 44px;
	}
	/* .pg-pill-d */
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.86);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.pill:hover :global(svg) {
		transform: scale(1.12);
	}
	/* The size stays below #hs-css's (the page's). */
	h2 {
		font-size: clamp(26px, 3vw, 38px);
		font-weight: 500;
		letter-spacing: -0.03em;
		max-width: 24ch;
	}
	/* Beats the landing reset of heading margins. */
	.vw h2 {
		margin-top: 16px;
	}
	p {
		color: rgba(255, 255, 255, 0.7);
		margin-top: 10px;
		max-width: 56ch;
	}
	.btns {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}
	.btns .bk-next {
		width: auto;
		margin: 0;
	}
	.btns .ghost {
		background: transparent;
		color: #fff;
		border-color: rgba(255, 255, 255, 0.3);
	}
	@media (max-width: 640px) {
		.vw {
			padding: 24px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>

<!--
  "Ihre Mieter wollen wissen, wo sie stehen. …": the words light up one by
  one as the paragraph scrolls through the viewport, and dim again scrolling
  back (the design's #uv-say). The server renders every word lit; with
  reduced motion it stays that way (plan 03 §3.2).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { statement } from "../content";

	const words = statement.text.split(" ");

	/** How many words are lit. */
	let lit = $state(words.length);
	let active = false;
	let el: HTMLParagraphElement;
	let ticking = false;

	function update() {
		ticking = false;
		const r = el.getBoundingClientRect();
		const vh = innerHeight;
		const p = (vh * 0.82 - r.top) / (r.height + vh * 0.3);
		lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
	}

	function onscroll() {
		if (!active || ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}

	onMount(() => {
		if (prefersReducedMotion()) return;
		active = true;
		update();
	});
</script>

<svelte:window {onscroll} onresize={onscroll} />

<section class="stm" aria-label={statement.label}>
	<div class="wrap">
		<p bind:this={el}>
			{#each words as word, i (i)}<span class={["w", i < lit && "on"]}
					>{word}</span
				>{i < words.length - 1 ? " " : ""}{/each}
		</p>
	</div>
</section>

<style>
	.stm {
		padding: 40px 0 140px;
	}
	p {
		max-width: 1040px;
		margin: 0 auto;
		text-align: center;
		font-size: clamp(28px, 4vw, 58px);
		line-height: 1.12;
		letter-spacing: -0.035em;
	}
	.w {
		color: rgba(255, 255, 255, 0.22);
		transition: color 0.35s;
	}
	.w.on {
		color: #fff;
	}
	@media (max-width: 620px) {
		.stm {
			padding-bottom: 90px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.w {
			color: #fff;
		}
	}
</style>

<!--
  "Fünf Schritte. Ein Ansprechpartner." (.fk-five): numbered circles on a
  line. The server renders the end state (line full, circles accent). If the
  list is still below the fold on mount, it's reset and plays once it scrolls
  in: the line grows and the circles turn one after another (plan 03 §3.3).
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import IconPaths from "../components/IconPaths.svelte";
	import Section from "../components/Section.svelte";
	import { steps } from "../content";

	let filled = $state(true);

	function play(el: HTMLElement) {
		if (prefersReducedMotion()) return;
		if (el.getBoundingClientRect().top < window.innerHeight) return;
		filled = false;
		return inView({
			threshold: 0.15,
			once: true,
			onEnter: () => (filled = true),
		})(el);
	}
</script>

<Section alt labelledby="fk-steps-h">
	<div class="head">
		<SectionHead id="fk-steps-h" eyebrow={steps.eyebrow} heading={steps.h2}>
			{#snippet icon()}<IconPaths name={steps.eyebrowIcon} />{/snippet}
		</SectionHead>
	</div>
	<ol class={["five", filled && "in"]} {@attach play}>
		{#each steps.items as step, i (step.title)}
			<li>
				<span aria-hidden="true">{i + 1}</span>
				<b>{step.title}</b>
				<small>{step.text}</small>
			</li>
		{/each}
	</ol>
</Section>

<style>
	.head {
		max-width: 760px;
	}
	.five {
		list-style: none;
		margin: 52px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 16px;
		position: relative;
	}
	.five::before,
	.five::after {
		content: "";
		position: absolute;
		left: 24px;
		top: 24px;
		height: 2px;
	}
	.five::before {
		right: 24px;
		background: var(--hair);
	}
	.five::after {
		width: 0;
		background: var(--accent);
		transition: width 2.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.five.in::after {
		width: calc(100% - 48px);
	}
	li {
		position: relative;
	}
	span {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--hair);
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 17px;
		position: relative;
		z-index: 1;
		transition:
			background 0.4s,
			border-color 0.4s;
	}
	.in span {
		background: var(--accent);
		border-color: var(--accent);
	}
	.in li:nth-child(2) span {
		transition-delay: 0.5s;
	}
	.in li:nth-child(3) span {
		transition-delay: 1s;
	}
	.in li:nth-child(4) span {
		transition-delay: 1.5s;
	}
	.in li:nth-child(5) span {
		transition-delay: 2s;
	}
	b {
		display: block;
		font-size: 17px;
		font-weight: 600;
		margin-top: 18px;
	}
	small {
		display: block;
		font-size: 14px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.4;
	}
	@media (max-width: 1040px) {
		.five {
			grid-template-columns: minmax(0, 1fr);
			gap: 22px;
		}
		.five::before,
		.five::after {
			display: none;
		}
		li {
			display: grid;
			grid-template-columns: 48px minmax(0, 1fr);
			column-gap: 16px;
		}
		span {
			grid-row: span 2;
		}
		b {
			margin-top: 2px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.five::after,
		span {
			transition: none;
		}
	}
</style>

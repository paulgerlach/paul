<!--
  "Deutsche Server. Deutsche Vorgaben. Ein deutsches Unternehmen." (.sc-3):
  three cards whose icons play once in turn when the row comes into view,
  and loop while a card is hovered (plan 03 §3.3).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { principles } from "../content";

	let playing = $state(principles.cards.map(() => false));

	/** Each icon plays for 1.8 s, 0.7 s after the one before. */
	function play() {
		const timers = principles.cards.flatMap((_, i) => [
			setTimeout(() => (playing[i] = true), 300 + i * 700),
			setTimeout(() => (playing[i] = false), 300 + i * 700 + 1800),
		]);
		return () => timers.forEach(clearTimeout);
	}
</script>

<section class="pg-sec" aria-labelledby="sc-ph">
	<div class="wrap">
		<h2 class="head rv" id="sc-ph">
			{principles.h2[0]}<br />{principles.h2[1]}
		</h2>
		<div
			class="cards"
			{@attach enterView({ prepare: () => {}, play, threshold: 0.15 })}
		>
			{#each principles.cards as card, i (card.title)}
				<article class={["rv", playing[i] && "play"]}>
					<span class="ic">
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							{#if card.icon === "servers"}
								<rect x="3" y="3" width="14" height="5.5" rx="1.5" />
								<rect x="3" y="11.5" width="14" height="5.5" rx="1.5" />
								<path class="led l1" d="M6 5.75h.01" />
								<path class="led l2" d="M6 14.25h.01" />
								<path d="M9.5 5.75h4.5M9.5 14.25h4.5" />
							{:else if card.icon === "shield"}
								<path
									d="M10 2.5l6 2.3v4.6c0 3.9-2.6 6.9-6 8.1-3.4-1.2-6-4.2-6-8.1V4.8z"
								/>
								<path class="tick" pathLength="1" d="M7.3 10l1.9 1.9 3.6-3.8" />
							{:else}
								<path
									class="pin"
									d="M10 17.5s-5.5-4.8-5.5-9a5.5 5.5 0 0 1 11 0c0 4.2-5.5 9-5.5 9z"
								/>
								<circle class="pin" cx="10" cy="8.5" r="2" />
							{/if}
						</svg>
					</span>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 48px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 26px;
	}
	.ic {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: #e4efe6;
		display: grid;
		place-items: center;
		transition: background 0.3s;
	}
	.ic svg {
		width: 22px;
		height: 22px;
	}
	article h3 {
		font-size: 18px;
		font-weight: 600;
		margin-top: 18px;
	}
	article p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.55;
		margin-top: 8px;
	}
	svg * {
		transform-box: fill-box;
		transform-origin: center;
	}
	article:hover .ic,
	article.play .ic {
		background: #d3e8d6;
	}
	.led {
		stroke-width: 2.4;
	}
	article:hover .l1,
	article.play .l1 {
		animation: led 0.9s steps(2) infinite;
	}
	article:hover .l2,
	article.play .l2 {
		animation: led 0.9s steps(2) 0.45s infinite;
	}
	@keyframes led {
		0% {
			stroke: #2f9e44;
		}
		100% {
			stroke: currentColor;
		}
	}
	.tick {
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
	}
	article:hover .tick,
	article.play .tick {
		animation: tick 1.6s ease-in-out infinite;
	}
	@keyframes tick {
		0% {
			stroke-dashoffset: 1;
		}
		45%,
		100% {
			stroke-dashoffset: 0;
		}
	}
	article:hover .pin,
	article.play .pin {
		animation: pin 1.2s cubic-bezier(0.3, 0, 0.3, 1) infinite;
	}
	@keyframes pin {
		0%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-2.5px);
		}
	}
	@media (max-width: 900px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		article * {
			animation: none !important;
		}
	}
</style>

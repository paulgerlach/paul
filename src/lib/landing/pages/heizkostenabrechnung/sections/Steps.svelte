<!--
  "Vier Schritte. Eine fertige Abrechnung." (.hk-steps): four cards whose
  icons move on hover, and once each in turn (1.6 s, 0.7 s apart) when the
  row first comes into view. Nothing moves with reduced motion.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { steps } from "../content";

	let playing = $state<boolean[]>(steps.items.map(() => false));
	let timers: ReturnType<typeof setTimeout>[] = [];
	$effect(() => () => timers.forEach(clearTimeout));

	function play() {
		if (prefersReducedMotion()) return;
		steps.items.forEach((_, i) =>
			timers.push(
				setTimeout(
					() => {
						playing[i] = true;
						timers.push(setTimeout(() => (playing[i] = false), 1600));
					},
					400 + i * 700,
				),
			),
		);
	}
</script>

<section class="pg-sec" aria-labelledby="hk-ah">
	<div class="wrap">
		<h2 class="h2 c rv" id="hk-ah">{steps.h2}</h2>
		<div
			class="steps"
			{@attach inView({ threshold: 0.15, once: true, onEnter: play })}
		>
			{#each steps.items as step, i (step.title)}
				<article class={["rv", playing[i] && "play"]}>
					<span class="n">{String(i + 1).padStart(2, "0")}</span>
					<span class="ic">
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							{#if step.icon === "radio"}
								<path class="a3" d="M3 8a10 10 0 0 1 14 0" /><path
									class="a2"
									d="M5.5 10.8a6.5 6.5 0 0 1 9 0"
								/><path class="a1" d="M8 13.6a3 3 0 0 1 4 0" /><circle
									cx="10"
									cy="16"
									r=".8"
									fill="currentColor"
								/>
							{:else if step.icon === "sparkle"}
								<path
									class="s1"
									d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6z"
								/><path
									class="s2"
									d="M15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
								/>
							{:else if step.icon === "calc"}
								<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
									d="M7.5 6h5"
								/>
								{#each ["7.5 10", "10 10", "12.5 10", "7.5 13", "10 13", "12.5 13"] as at, k (at)}
									<path
										class="k"
										style:animation-delay="{k * 0.12}s"
										d="M{at}h.01"
									/>
								{/each}
							{:else}
								<path
									d="M11.5 2.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 17.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5z"
								/><path d="M11.5 2.5v4h4" /><path
									class="l"
									pathLength="1"
									d="M7.5 10h5"
								/><path class="l l2" pathLength="1" d="M7.5 13h5" />
							{/if}
						</svg>
					</span>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.steps {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		margin-top: 44px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 22px;
		position: relative;
	}
	.n {
		position: absolute;
		top: 18px;
		right: 20px;
		font-size: 13px;
		color: var(--faint);
		font-variant-numeric: tabular-nums;
	}
	.ic {
		width: 44px;
		height: 44px;
		border-radius: 11px;
		background: #e4efe6;
		display: grid;
		place-items: center;
		transition: background 0.3s;
	}
	.ic svg {
		width: 20px;
		height: 20px;
	}
	.ic svg :global(*) {
		transform-box: fill-box;
		transform-origin: center;
	}
	/* `article h3`: beats the landing reset of heading margins. */
	article h3 {
		font-size: 17px;
		font-weight: 600;
		margin-top: 16px;
	}
	article p {
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.5;
		margin-top: 6px;
	}
	article:hover .ic,
	article.play .ic {
		background: #d3e8d6;
	}
	article:hover .a1,
	article.play .a1 {
		animation: hkwave 1.4s ease-in-out infinite;
	}
	article:hover .a2,
	article.play .a2 {
		animation: hkwave 1.4s ease-in-out 0.15s infinite;
	}
	article:hover .a3,
	article.play .a3 {
		animation: hkwave 1.4s ease-in-out 0.3s infinite;
	}
	@keyframes hkwave {
		0%,
		100% {
			opacity: 1;
		}
		40% {
			opacity: 0.15;
		}
	}
	article:hover .s1,
	article.play .s1 {
		animation: hkstar 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	article:hover .s2,
	article.play .s2 {
		animation: hktw 1.6s ease-in-out 0.2s infinite;
	}
	@keyframes hkstar {
		0% {
			transform: rotate(0) scale(1);
		}
		45% {
			transform: rotate(90deg) scale(1.18);
		}
		100% {
			transform: rotate(180deg) scale(1);
		}
	}
	@keyframes hktw {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(0.3);
			opacity: 0.3;
		}
	}
	/* The keys' delays are inline styles (the design's `.k2`–`.k6 !important`). */
	article:hover .k,
	article.play .k {
		animation-name: hkkey;
		animation-duration: 1.5s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}
	@keyframes hkkey {
		0%,
		100% {
			stroke-width: 1.6;
		}
		20% {
			stroke-width: 3.2;
			stroke: #2f9e44;
		}
	}
	.l {
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
	}
	article:hover .l,
	article.play .l {
		animation: hkline 1.6s ease-in-out infinite;
	}
	article:hover .l2,
	article.play .l2 {
		animation-delay: 0.25s;
	}
	@keyframes hkline {
		0% {
			stroke-dashoffset: 1;
		}
		45%,
		100% {
			stroke-dashoffset: 0;
		}
	}
	@media (max-width: 900px) {
		.steps {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ic svg :global(*) {
			animation: none !important;
		}
	}
</style>

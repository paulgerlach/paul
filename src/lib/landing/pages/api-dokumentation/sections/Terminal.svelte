<!--
  The hero's terminal (.ad-term): a call and its answer. Decorative: the same
  call is in the documentation as text. Its lines appear one by one, as CSS
  animations with the design's delays (plus its 250 ms start) and a `both`
  fill, so they play on load without JS and end in the server's state. Below
  the fold (phones) they wait until the terminal comes into view.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { terminal } from "../content";

	/** Each line's delay, s. */
	const DELAYS = [0.25, 0.6, 1.35, 1.6, 1.75, 1.9, 2.05, 2.2, 2.35];

	let wait = $state(false);
</script>

<div
	class={["term", "rv", wait && "wait"]}
	aria-hidden="true"
	{@attach enterView({
		prepare: () => (wait = true),
		play: () => {
			wait = false;
		},
		threshold: 0.15,
	})}
>
	<div class="top">
		<i></i><i></i><i></i><span>{terminal.title}</span>
	</div>
	<div class="b">
		{#each terminal.lines as line, i (i)}
			<span class="tl" style:animation-delay="{DELAYS[i]}s"
				>{#each line as part, j (j)}{#if typeof part === "string"}{part}{:else}<span
							class={part.kind}>{part.text}</span
						>{/if}{/each}</span
			>
		{/each}
	</div>
</div>

<style>
	.term {
		background: #1e322d;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 40px 80px -50px rgba(30, 50, 45, 0.6);
	}
	.top {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 14px 18px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.top i {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.16);
	}
	.top span {
		margin-left: 10px;
		font-family: var(--mono);
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.5);
	}
	/* The design's <pre>: each line keeps its spaces, the gaps between the
	   lines' markup don't count. */
	.b {
		padding: 22px 22px 26px;
		font-size: 13.5px;
		line-height: 1.75;
		color: rgba(255, 255, 255, 0.86);
		overflow: hidden;
	}
	.b,
	.b * {
		font-family: var(--mono);
	}
	.tl {
		display: block;
		white-space: pre;
		animation: line 0.5s ease both;
	}
	.wait .tl {
		animation-play-state: paused;
	}
	@keyframes line {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	.tl:nth-child(3) {
		margin: 10px 0 8px;
	}
	.m {
		color: #1e322d;
		background: #8ad68f;
		border-radius: 5px;
		padding: 1px 6px;
		font-weight: 500;
		margin-right: 6px;
	}
	.v {
		color: #8ad68f;
	}
	.c {
		color: rgba(255, 255, 255, 0.45);
	}
	.st {
		color: #8ad68f;
		font-weight: 500;
	}
	.k {
		color: #b9e6bc;
	}
	.s {
		color: #fff;
	}
	@media (max-width: 640px) {
		.b {
			font-size: 11.5px;
			padding: 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tl {
			animation: none;
		}
	}
</style>

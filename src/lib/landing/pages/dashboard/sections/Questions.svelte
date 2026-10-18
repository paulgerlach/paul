<!--
  The question marquee (`.db-mq`): three rows of questions drifting sideways.
  The first set of each row is the list assistive tech reads; the repeats are
  hidden. Runs only in view, pauses on hover, focus and the button (plan 03,
  3B.7; open question 4).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { type Question, questions } from "../content";

	let running = $state(false);
	let paused = $state(false);
	/** No pause button without motion (reduced motion, no JS). */
	let moving = $state(false);
	onMount(() => (moving = !prefersReducedMotion()));
</script>

<section
	class={["sec mq-sec", running && !paused && "run"]}
	aria-labelledby="mq-h"
	{@attach inView({
		onEnter: () => (running = true),
		onLeave: () => (running = false),
	})}
>
	<div class="wrap">
		<h2 class="rv" id="mq-h">{questions.h2}</h2>
	</div>
	<div class="mq">
		{#each questions.rows as row, r (r)}
			<div class={["row", row.reverse && "rev"]} style:--d="{row.seconds}s">
				<ul>{@render items(row.items)}</ul>
				{#each [1, 2, 3] as copy (copy)}
					<ul aria-hidden="true">{@render items(row.items)}</ul>
				{/each}
			</div>
		{/each}
	</div>
	{#if moving}
		<div class="wrap ctl">
			<button
				type="button"
				class="pause"
				aria-pressed={paused}
				onclick={() => (paused = !paused)}
				>{paused ? questions.play : questions.pause}</button
			>
		</div>
	{/if}
</section>

{#snippet items(list: Question[])}
	{#each list as q (q.text)}
		<li class="p">
			<i style:background={q.bg} style:color={q.fg}><Icon name={q.icon} /></i
			>{q.text}
		</li>
	{/each}
{/snippet}

<style>
	.mq-sec {
		padding: 112px 0;
	}
	.mq-sec h2 {
		text-align: center;
		font-size: clamp(26px, 3.2vw, 44px);
		line-height: 1.15;
		letter-spacing: -0.03em;
		font-weight: 500;
		max-width: 1000px;
		margin: 0 auto;
		text-wrap: balance;
	}
	.mq {
		margin-top: 56px;
		display: grid;
		gap: 14px;
		-webkit-mask-image: linear-gradient(
			90deg,
			transparent,
			#000 12%,
			#000 88%,
			transparent
		);
		mask-image: linear-gradient(
			90deg,
			transparent,
			#000 12%,
			#000 88%,
			transparent
		);
		overflow: hidden;
	}
	.row {
		display: flex;
		gap: 14px;
		width: max-content;
		animation: mq var(--d, 60s) linear infinite;
		animation-play-state: paused;
	}
	.row.rev {
		animation-direction: reverse;
	}
	.run .row {
		animation-play-state: running;
	}
	.run .mq:hover .row,
	.run .mq:focus-within .row {
		animation-play-state: paused;
	}
	@keyframes mq {
		to {
			transform: translateX(-50%);
		}
	}
	.ctl {
		display: flex;
		justify-content: flex-end;
		margin-top: 14px;
	}
	.pause {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 999px;
		padding: 5px 12px;
		font-size: 12.5px;
		color: var(--muted);
		cursor: pointer;
	}
	.pause:hover {
		color: var(--ink);
	}
	ul {
		display: flex;
		gap: 14px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.p {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 12px 18px;
		font-size: 15.5px;
		white-space: nowrap;
		box-shadow: 0 4px 12px -8px rgba(30, 50, 45, 0.25);
	}
	.p i {
		width: 26px;
		height: 26px;
		border-radius: 7px;
		display: grid;
		place-items: center;
		flex: none;
	}
	.p i :global(svg) {
		width: 14px;
	}
	@media (max-width: 640px) {
		.p {
			font-size: 14px;
			padding: 10px 14px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.row {
			animation: none;
		}
	}
</style>

<!--
  The question marquee (`.db-mq`): three rows of questions drifting sideways.
  The first set of each row is the list assistive tech reads; the repeats are
  hidden. Runs only in view, pauses on hover, focus and the button (plan 03,
  3B.7; open question 4).
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { type Question, questions } from "../content";

	let running = $state(false);
	let paused = $state(false);
</script>

<section
	class={["sec mq-sec", running && !paused && "run"]}
	aria-labelledby="mq-h"
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

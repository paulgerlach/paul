<!--
  "Worauf sich Kunden verlassen" (the design's `.rf-nums`): four figures, the
  first dark. The numbers count up from 0 once they come into view;
  server-rendered with their end values, nothing counts with reduced motion.
-->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import Icon from "../components/Icon.svelte";
	import { figures } from "../content";
</script>

<section class="pg-sec" aria-labelledby="nm-h">
	<div class="wrap">
		<div class="head c">
			<span class="pill rv"><Icon name="chart" />{figures.pill}</span>
			<h2 class="h2 c rv" id="nm-h">
				{figures.h2} <span>{figures.h2Accent}</span>
			</h2>
		</div>
		<div class="nums">
			{#each figures.items as item (item.label)}
				<div class={["rv", item.dark && "dark"]}>
					<b
						>{#if item.to !== undefined}<span
								{@attach countUp({
									to: item.to,
									duration: 1000,
									viewDelay: 0,
									threshold: 0.15,
								})}>{item.to}</span
							>{:else}{item.text}{/if}{#if item.unit}<i>{item.unit}</i>{/if}</b
					>
					<span>{item.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.nums {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 44px;
	}
	.nums > div {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px 24px;
	}
	.nums > div.dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	b {
		display: flex;
		align-items: baseline;
		gap: 6px;
		font-size: clamp(46px, 4.8vw, 64px);
		font-weight: 500;
		letter-spacing: -0.045em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.dark b {
		color: var(--accent);
	}
	b i {
		font-style: normal;
		font-size: 0.36em;
		letter-spacing: -0.01em;
		color: var(--faint);
	}
	.dark b i {
		color: rgba(255, 255, 255, 0.5);
	}
	.nums > div > span {
		display: block;
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 14px;
		line-height: 1.45;
	}
	.nums > .dark > span {
		color: rgba(255, 255, 255, 0.7);
	}

	@media (max-width: 1040px) {
		.nums {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.nums {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

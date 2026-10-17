<!--
  "Das Mieterportal in Zahlen": a bento of five figures and the animated mini
  dashboard (second). 12, 3 and 14 count up once when they come into view.
-->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import { numbers, type Figure } from "../content";
	import DashboardTile from "./DashboardTile.svelte";
</script>

{#snippet figure(f: Figure)}
	<li class="c rv">
		<p class={["fig", f.compact && "dt"]}>
			{#if f.count}
				<b
					><span
						{@attach countUp({ to: f.count, duration: 1100, viewDelay: 0 })}
						>{f.value}</span
					>{#if f.unit}<small>{f.unit}</small>{/if}</b
				>
			{:else}
				<b
					>{f.value}{#if f.unit}<small>{f.unit}</small>{/if}</b
				>
			{/if}
		</p>
		<p class="t">{f.text}</p>
	</li>
{/snippet}

<section class="num" aria-labelledby="mp-num-h">
	<div class="wrap">
		<h2 class="h rv" id="mp-num-h">{numbers.h2}</h2>
		<ul class="bento">
			{@render figure(numbers.first)}
			<li class="c rv tile"><DashboardTile /></li>
			{#each numbers.rest as f (f.text)}
				{@render figure(f)}
			{/each}
		</ul>
	</div>
</section>

<style>
	.num {
		padding: 40px 0 120px;
	}
	.num .h {
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1.05;
	}
	.bento {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
		margin: clamp(36px, 6vw, 80px) 0 0;
		padding: 0;
		list-style: none;
	}
	.c {
		background: var(--card);
		border-radius: 20px;
		padding: 26px 28px;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
	}
	.fig {
		margin: 0;
	}
	.fig b {
		font-size: clamp(46px, 5vw, 72px);
		font-weight: 400;
		letter-spacing: -0.05em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.fig.dt b {
		font-size: clamp(36px, 3.8vw, 56px);
	}
	.fig small {
		font-size: 0.5em;
		letter-spacing: -0.02em;
		margin-left: 4px;
	}
	.t {
		margin: auto 0 0;
		padding-top: 26px;
		color: var(--mute);
		font-size: 16px;
		line-height: 1.4;
		max-width: 30ch;
	}
	.tile {
		padding: 0;
		background: #e9eeeb;
		min-height: 312px;
	}
	@media (max-width: 980px) {
		.bento {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 620px) {
		.bento {
			grid-template-columns: 1fr;
		}
		.c {
			min-height: 170px;
		}
		.tile {
			min-height: 312px;
		}
	}
</style>

<!--
  "Zweimal zwölf Monate." (.mc-tl): three points on a line whose fill grows
  (1.6 s) when the block first shows (`enterView`); server, no JS and
  reduced motion: full.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Head from "../components/Head.svelte";
	import { deadlines } from "../content";

	let empty = $state(false);
	const entrance = enterView({
		prepare: () => (empty = true),
		play: () => {
			empty = false;
		},
	});
</script>

<section class="pg-sec" aria-labelledby="fr-h">
	<div class="wrap">
		<Head
			id="fr-h"
			pill={deadlines.pill}
			symbol="calendar"
			heading={deadlines.h2}
			center
		/>
		<div class="tl rv" {@attach entrance}>
			<div class="bar" aria-hidden="true">
				<i class={[empty && "empty"]}></i>
			</div>
			<ol>
				{#each deadlines.points as point, i (point.title)}
					<li>
						<span class="d" aria-hidden="true">{i + 1}</span>
						<b>{point.title}</b>
						<small>{point.text}</small>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.tl {
		position: relative;
		margin-top: 56px;
	}
	ol {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.bar {
		position: absolute;
		left: 16.6%;
		right: 16.6%;
		top: 21px;
		height: 2px;
		background: #dde3e0;
	}
	.bar i {
		display: block;
		height: 100%;
		width: 100%;
		background: var(--accent-deep, #5db864);
		transition: width 1.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.bar i.empty {
		width: 0;
		transition: none;
	}
	li {
		position: relative;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.d {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--accent-deep, #5db864);
		display: grid;
		place-items: center;
		font-weight: 600;
	}
	li:last-child .d {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--accent);
	}
	b {
		font-size: 17px;
		font-weight: 600;
		margin-top: 18px;
	}
	small {
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.5;
		max-width: 34ch;
	}
	@media (max-width: 760px) {
		ol {
			grid-template-columns: minmax(0, 1fr);
		}
		.bar {
			display: none;
		}
		li {
			text-align: left;
			align-items: flex-start;
			gap: 14px;
			display: grid;
			grid-template-columns: 44px 1fr;
		}
		b {
			margin-top: 0;
		}
		small {
			grid-column: 2;
		}
	}
</style>

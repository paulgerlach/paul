<!--
  "Aus Verbrauchsdaten werden klare Entscheidungen" (`.db-feat`): the bento of
  six features, each with its small demo.
-->
<script lang="ts">
	import type { Component } from "svelte";
	import Pill from "../components/Pill.svelte";
	import { type FeatureId, features } from "../content";
	import AddObject from "./features/AddObject.svelte";
	import BillingRun from "./features/BillingRun.svelte";
	import LeakWatch from "./features/LeakWatch.svelte";
	import Notifications from "./features/Notifications.svelte";
	import Share from "./features/Share.svelte";
	import TakeOver from "./features/TakeOver.svelte";

	const VISUALS: Record<FeatureId, Component> = {
		add: AddObject,
		notifications: Notifications,
		takeOver: TakeOver,
		leak: LeakWatch,
		billing: BillingRun,
		share: Share,
	};
</script>

<section class="sec feat" aria-labelledby="feat-h">
	<div class="wrap">
		<Pill text={features.pill} icon="key" class="rv" />
		<div class="fh">
			<h2 class="db-h2 rv" id="feat-h">{features.h2}</h2>
			<p class="db-lead rv">{features.lead}</p>
		</div>
		<ul class="bento">
			{#each features.cards as card (card.id)}
				{@const Visual = VISUALS[card.id]}
				<li class={["bc rv", `b${card.size}`, card.id]}>
					<article aria-labelledby="f-{card.id}-h">
						<h3 id="f-{card.id}-h">{card.title}</h3>
						<p>{card.text}</p>
						<div class="vs"><Visual /></div>
					</article>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.feat {
		padding: 112px 0 12px;
	}
	.fh {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 40px;
		align-items: end;
	}
	.fh :global(.db-lead) {
		border-left: 1px solid var(--hair);
		padding-left: 28px;
		margin: 0 0 6px;
	}
	.bento {
		list-style: none;
		padding: 0;
		margin: 48px 0 0;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 12px;
	}
	.bc {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 32px 32px 28px;
		display: flex;
		min-height: 440px;
		overflow: hidden;
		position: relative;
	}
	.b7 {
		grid-column: span 7;
	}
	.b5 {
		grid-column: span 5;
	}
	article {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}
	.bc h3 {
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.015em;
	}
	.bc p {
		color: var(--muted);
		font-size: 16px;
		margin: 8px 0 0;
		max-width: 44ch;
	}
	.vs {
		flex: 1;
		display: grid;
		place-items: center;
		padding-top: 26px;
		position: relative;
	}
	.leak .vs {
		place-items: stretch;
	}
	@media (max-width: 1120px) {
		.b7,
		.b5 {
			grid-column: span 12;
		}
		.bc {
			min-height: 0;
		}
	}
	@media (max-width: 900px) {
		.fh {
			grid-template-columns: minmax(0, 1fr);
			gap: 16px;
		}
		.fh :global(.db-lead) {
			border-left: 0;
			padding-left: 0;
		}
	}
	@media (max-width: 640px) {
		.bc {
			padding: 24px 20px 22px;
		}
	}
</style>

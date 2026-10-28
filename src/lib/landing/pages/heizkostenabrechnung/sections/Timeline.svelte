<!--
  "Wie lange dauert Ihre Heizkostenabrechnung?" (.hk-time): two bars, the
  classic metering service's four steps over 6–9 months against Heidi's
  sliver. Server-rendered grown; below the fold on load, the bars grow and
  the steps appear once it scrolls into view (`enterView`).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { timeline } from "../content";

	let grown = $state(true);
</script>

<section class="pg-sec" aria-labelledby="hk-th">
	<div class="wrap">
		<h2 class="h2 c rv" id="hk-th">{timeline.h2}</h2>
		<div
			class={["tl rv", grown && "in"]}
			{@attach enterView({
				prepare: () => (grown = false),
				play: () => {
					grown = true;
				},
			})}
		>
			<div class="tr old">
				<span class="lb">{timeline.old.label}</span>
				<div class="bar">
					<i></i>
					{#each timeline.old.steps as step (step)}
						<span class="ms">{step}</span>
					{/each}
				</div>
				<b>{timeline.old.result}</b>
			</div>
			<div class="tr new">
				<span class="lb">{timeline.heidi.label}</span>
				<div class="bar"><i></i></div>
				<b>{timeline.heidi.result}</b>
			</div>
			<div class="ax" aria-hidden="true">
				{#each timeline.axis as tick (tick)}
					<span>{tick}</span>
				{/each}
			</div>
		</div>
		<p class="hk-note rv">{timeline.note}</p>
	</div>
</section>

<style>
	.tl {
		max-width: 980px;
		margin: 48px auto 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 28px;
	}
	.tr {
		display: grid;
		grid-template-columns: 190px minmax(0, 1fr) 150px;
		gap: 18px;
		align-items: center;
		padding: 12px 0;
	}
	.lb {
		font-weight: 600;
		font-size: 15px;
	}
	.tr b {
		font-size: 18px;
		font-weight: 600;
		text-align: right;
		white-space: nowrap;
	}
	.old b {
		color: #b5471a;
	}
	.new b {
		color: var(--ok);
	}
	.bar {
		position: relative;
		height: 40px;
		border-radius: 10px;
		background: #f2f3f2;
		overflow: hidden;
		display: flex;
	}
	.bar > i {
		position: absolute;
		inset: 0 auto 0 0;
		width: 0;
		border-radius: 10px;
		transition: width 2.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.old .bar > i {
		background: #f4d6c9;
	}
	.new .bar > i {
		background: var(--accent);
		transition: width 0.5s cubic-bezier(0.3, 1.5, 0.5, 1) 0.2s;
	}
	.tl.in .old .bar > i {
		width: 100%;
	}
	.tl.in .new .bar > i {
		width: 4%;
	}
	.ms {
		position: relative;
		z-index: 1;
		flex: 1;
		display: grid;
		place-items: center;
		font-size: 12px;
		color: #8a4a2e;
		border-right: 1px dashed rgba(181, 71, 26, 0.25);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.ms:last-child {
		border-right: 0;
	}
	.tl.in .ms {
		opacity: 1;
	}
	/* The design's nth-child(2…5): the bar's <i> is child 1. */
	.tl.in .ms:nth-child(2) {
		transition-delay: 0.4s;
	}
	.tl.in .ms:nth-child(3) {
		transition-delay: 1s;
	}
	.tl.in .ms:nth-child(4) {
		transition-delay: 1.6s;
	}
	.tl.in .ms:nth-child(5) {
		transition-delay: 2.2s;
	}
	.ax {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin: 6px 168px 0 208px;
		font-size: 11.5px;
		color: var(--faint);
	}
	.ax span:not(:first-child) {
		text-align: center;
	}
	@media (max-width: 900px) {
		.tr {
			grid-template-columns: 1fr;
			gap: 8px;
		}
		.tr b {
			text-align: left;
		}
		.ax {
			display: none;
		}
		.ms {
			font-size: 10px;
		}
	}
</style>

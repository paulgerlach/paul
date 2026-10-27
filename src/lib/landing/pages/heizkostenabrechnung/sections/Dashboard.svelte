<!--
  "Ihre Abrechnung. Jederzeit griffbereit." (.hk-fr): a phone with the
  property's heating costs (example data) beside the text. Server-rendered
  with the total and the chart's line drawn; below the fold on load the line
  draws once it scrolls into view (`enterView`) and the total counts up from
  0 (`countUp`).
-->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import { enterView } from "$lib/landing/attachments/enterView";
	import Icon from "../components/Icon.svelte";
	import { dashboard } from "../content";
	import { formatAmount } from "../docuscan";

	let drawn = $state(true);
</script>

<section class="fr" aria-labelledby="hk-frh">
	<div class="wrap g">
		<div
			class={["frv rv", drawn && "in"]}
			{@attach enterView({
				prepare: () => (drawn = false),
				play: () => {
					drawn = true;
				},
			})}
		>
			<div class="hk-ph" aria-hidden="true">
				<i class="nt"></i>
				<div class="pt"><span>←</span><span class="gear">⚙</span></div>
				<div class="hk-pn">
					<span class="ic"><Icon name="building" /></span>
					<span
						><b>{dashboard.title}</b><small>{dashboard.property}</small></span
					>
				</div>
				<small class="hk-pl">{dashboard.totalLabel}</small>
				<b class="hk-pv"
					><span
						{@attach countUp({ to: dashboard.total, format: formatAmount })}
						>{formatAmount(dashboard.total)}</span
					> €&nbsp;→</b
				>
				<small class="hk-pl">{dashboard.units}</small>
				<svg class="chart" viewBox="0 0 300 110" preserveAspectRatio="none"
					><path
						class="a"
						d="M0 20 L60 20 L95 48 L140 56 L200 46 L260 36 L300 28 L300 110 L0 110Z"
					/><path
						class="l"
						d="M0 20 L60 20 L95 48 L140 56 L200 46 L260 36 L300 28"
					/></svg
				>
			</div>
		</div>
		<div class="frt rv">
			<h2 id="hk-frh">{dashboard.h2}</h2>
			<p>{dashboard.text}</p>
			<a class="hk-lk" href={dashboard.link.href}
				>{dashboard.link.text} <span class="ar" aria-hidden="true">→</span></a
			>
		</div>
	</div>
</section>

<style>
	.fr {
		padding: 40px 0 90px;
	}
	.g {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: center;
	}
	.frv {
		background: #efeeea;
		border-radius: 18px;
		height: 420px;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		overflow: hidden;
	}
	.pt {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 17px;
		color: var(--muted);
		margin-bottom: 14px;
	}
	.gear {
		width: 32px;
		height: 32px;
		border: 1px solid var(--hair);
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 14px;
	}
	.chart {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 110px;
	}
	.chart .a {
		fill: #c9d9cd;
	}
	.chart .l {
		fill: none;
		stroke: #6b8f75;
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
		stroke-dasharray: 400;
		stroke-dashoffset: 400;
		transition: stroke-dashoffset 1.6s ease;
	}
	.frv.in .chart .l {
		stroke-dashoffset: 0;
	}
	/* `.frt h2`: beats the landing reset of heading margins. */
	.frt h2 {
		font-size: clamp(28px, 2.8vw, 40px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}
	.frt p {
		color: var(--muted);
		font-size: 17px;
		line-height: 1.55;
		margin-top: 14px;
		max-width: 44ch;
	}
	@media (max-width: 900px) {
		.g {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.frv {
			height: 380px;
		}
	}
</style>

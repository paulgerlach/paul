<!-- "Service aus Berlin": section head and three KPIs that count up once in view. -->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
	const s = $derived(content.service);

	const count = (to: number) =>
		countUp({ to, duration: 1500, viewDelay: 0, threshold: 0.5 });
</script>

<section class="city-svc wrap" aria-labelledby="svc-h">
	<div class="shead">
		<div class="eyebrow">{s.eyebrow}</div>
		<h2 id="svc-h">{s.title}</h2>
		<p>{s.text}</p>
	</div>
	<!-- The KPIs are unconfirmed claims: see the go-live gate, plan §6.4. -->
	<div class="kpis">
		<div class="kpi">
			<b data-placeholder><span class="cu" {@attach count(92)}>92</span> %</b>
			<span>{s.kpis[0]}</span>
		</div>
		<div class="kpi">
			<b data-placeholder><span class="cu" {@attach count(14)}>14</span></b>
			<span>{s.kpis[1]}</span>
		</div>
		<div class="kpi">
			<b data-placeholder
				><span class="cu" {@attach count(1)}>1</span>–<span
					class="cu"
					{@attach count(2)}>2</span
				> h</b
			>
			<span>{s.kpis[2]}</span>
		</div>
	</div>
</section>

<style>
	.city-svc {
		padding-block: 96px 40px;
	}
	.kpis {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		margin-top: 48px;
	}
	.kpi {
		background: var(--stone);
		padding: 26px 24px;
		border-radius: 18px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.kpi b {
		font-size: 44px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}
	.kpi > span {
		font-size: 15px;
		color: var(--muted);
		line-height: 1.3;
	}
	.cu {
		display: inline-block;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 980px) {
		.kpis {
			grid-template-columns: 1fr;
		}
	}
</style>

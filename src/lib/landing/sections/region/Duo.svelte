<!-- Two cards: the tenants' monthly uVI (phone) and the portfolio dashboard (browser). -->
<script lang="ts">
	import { ROUTE_FUNKTIONEN } from "$lib/routes";
	import PortfolioBrowser from "./PortfolioBrowser.svelte";
	import type { RegionContent } from "./types";
	import UviPhone from "./UviPhone.svelte";

	let { content }: { content: RegionContent } = $props();
	const duo = $derived(content.duo);
</script>

<section class="duo wrap" aria-labelledby="duo-h">
	<h2 id="duo-h" class="sr-only">Heidi für Mieter und Verwaltung</h2>
	<div class="duo-grid">
		<div class="duo-card">
			<h3>{duo.uvi.title}</h3>
			<p>{duo.uvi.text}</p>
			<a class="duo-more" href={ROUTE_FUNKTIONEN}
				>Mehr erfahren <span class="ar">→</span></a
			>
			<UviPhone address={content.example.address} />
		</div>
		<div class="duo-card bw-card">
			<h3>{duo.portfolio.title}</h3>
			<p>{duo.portfolio.text}</p>
			<a class="duo-more" href={ROUTE_FUNKTIONEN}
				>Mehr erfahren <span class="ar">→</span></a
			>
			<PortfolioBrowser
				name={content.name}
				address={content.example.address}
				secondAddress={content.example.secondAddress}
			/>
		</div>
	</div>
</section>

<style>
	.duo {
		padding-block: 40px 110px;
	}
	.duo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}
	.duo-card {
		position: relative;
		background: var(--stone);
		border-radius: 22px;
		overflow: hidden;
		height: 660px;
		padding: 44px 40px 0;
		display: flex;
		flex-direction: column;
	}
	h3 {
		font-size: clamp(24px, 2.3vw, 30px);
		line-height: 1.15;
		letter-spacing: -0.025em;
		font-weight: 500;
		max-width: 19ch;
	}
	.duo-card > p {
		color: var(--muted);
		font-size: 16px;
		line-height: 1.5;
		margin-top: 14px;
		max-width: 44ch;
	}
	.duo-more {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 22px;
		font-size: 16px;
		color: var(--muted);
		align-self: flex-start;
	}
	.ar {
		display: inline-block;
		transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.duo-more:hover {
		color: var(--ink);
	}
	.duo-more:hover .ar {
		transform: translateX(4px);
	}

	@media (max-width: 980px) {
		.duo-grid {
			grid-template-columns: 1fr;
		}
		.duo-card {
			height: 600px;
		}
	}
	@media (max-width: 560px) {
		.duo-card {
			padding: 32px 24px 0;
			height: 620px;
		}
		.duo-card.bw-card {
			height: 700px;
		}
	}
</style>

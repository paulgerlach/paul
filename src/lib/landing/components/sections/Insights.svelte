<script lang="ts">
	import { ROUTE_FUNKTIONEN } from "$lib/routes";
	import { equalHeights } from "../../attachments/equalHeights";
	import { askSuggestions } from "../../data";
	import BudgetChart from "./BudgetChart.svelte";
	import RiskChart from "./RiskChart.svelte";
</script>

<section class="sec wrap insights">
	<div class="shead">
		<h2>Entscheiden mit Verbrauchsdaten in Echtzeit.</h2>
		<p>
			Verbräuche jederzeit abrufen, gegen den Wirtschaftsplan halten und
			Einsparpotenziale finden.
		</p>
		<a class="more-arrow see" href={ROUTE_FUNKTIONEN}>
			Auswertungen ansehen <span class="ar" aria-hidden="true">→</span>
		</a>
	</div>
	<div class="rep" {@attach equalHeights("h3")}>
		<div>
			<div class="shot"><BudgetChart /></div>
			<h3>Verbrauch gegen Plan im Blick.</h3>
			<p>
				Jede Fernablesung landet sofort im Wirtschaftsplan. Sie sehen, was
				verbraucht ist und was noch bleibt.
			</p>
		</div>
		<div>
			<div class="shot"><RiskChart /></div>
			<h3>Ausreißer früh erkennen.</h3>
			<p>
				Heidi zeigt, wo Verbräuche und Heizkosten aus dem Rahmen fallen, über
				Liegenschaften, Häuser und Einheiten hinweg.
			</p>
		</div>
		<div>
			<div class="shot" aria-hidden="true">
				<div class="ask">
					<div class="in">✳ Welche Auswertung brauchen Sie?</div>
					<div class="sug">
						{#each askSuggestions as suggestion (suggestion)}
							<span>{suggestion} →</span>
						{/each}
					</div>
				</div>
			</div>
			<h3>Sofort Antworten zum Verbrauch.</h3>
			<p>
				Neben fertigen Dashboards fragen Sie Heidi in normaler Sprache nach
				Liegenschaft, Zählerart oder Einheit.
			</p>
		</div>
	</div>
</section>

<style>
	.insights {
		padding-top: 40px;
	}
	.see {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 18px;
		font-size: 18px;
		font-weight: 500;
		color: #4a6fc4;
		padding: 10px 16px;
	}
	.rep {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin-top: 64px;
	}
	.shot {
		background: var(--stone);
		border-radius: 18px;
		height: 420px;
		display: grid;
		place-items: center;
		overflow: hidden;
		padding: 28px;
	}
	h3 {
		font-size: 22px;
		margin-top: 28px;
	}
	.rep p {
		color: var(--muted);
		font-size: 17px;
		margin-top: 10px;
	}
	.ask {
		width: 100%;
	}
	.in {
		background: #fff;
		border-radius: 6px;
		padding: 10px 12px;
		color: var(--faint);
		font-size: 15px;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.sug {
		display: grid;
		gap: 8px;
		margin-top: 14px;
		justify-items: start;
	}
	.sug span {
		background: #eaebea;
		border-radius: 999px;
		padding: 4px 12px;
		font-size: 14px;
	}

	@media (max-width: 980px) {
		.rep {
			grid-template-columns: 1fr;
		}
	}
</style>

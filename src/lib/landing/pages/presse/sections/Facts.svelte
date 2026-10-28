<!-- "Heidi auf einen Blick.": six tiles; "92 %" and "14 Tage" count up when their tile shows (the server renders the values). -->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import { facts } from "../content";
</script>

<section class="sec" aria-labelledby="pr-fh">
	<div class="wrap">
		<h2 class="pr-h rv" id="pr-fh">{facts.h2}</h2>
		<div class="facts">
			{#each facts.items as fact (fact.label)}
				<div class="rv">
					<small>{fact.label}</small>
					{#if typeof fact.value === "string"}
						<b>{fact.value}</b>
					{:else}
						<b
							><span
								class="n"
								{@attach countUp({
									to: fact.value.count,
									duration: 1100,
									viewDelay: 0,
									threshold: 0.15,
								})}>{fact.value.count}</span
							>
							{fact.value.unit}</b
						>
					{/if}
					<p>{fact.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 56px 0;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 36px;
	}
	.facts > div {
		background: #f2f4f3;
		border-radius: 18px;
		padding: 22px 24px;
		min-height: 170px;
		display: flex;
		flex-direction: column;
	}
	small {
		font-size: 11.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
		font-weight: 600;
	}
	b {
		font-size: clamp(22px, 2vw, 28px);
		font-weight: 500;
		letter-spacing: -0.025em;
		margin-top: 10px;
		font-variant-numeric: tabular-nums;
	}
	p {
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.45;
		margin-top: auto;
		padding-top: 14px;
	}

	@media (max-width: 900px) {
		.facts {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.facts {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

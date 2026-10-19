<!--
  "Elf Fehler, die Sie bares Geld kosten." (#fehler): the filter (the shared
  `Segmented`) and the eleven cards with their number, effect and law. Each
  filter change re-renders the shown cards with their entrance, 40 ms
  apart. Server and no JS: every card ("Alle").
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import Head from "../components/Head.svelte";
	import { errors, ERRORS_ID, type ErrorFilter } from "../content";

	let filter = $state<ErrorFilter>("all");
	const shown = $derived(
		errors.items
			.map((item, i) => ({ item, number: String(i + 1).padStart(2, "0") }))
			.filter(({ item }) => filter === "all" || item.kind === filter),
	);
</script>

<section class="pg-sec alt" id={ERRORS_ID} aria-labelledby="fl-h">
	<div class="wrap">
		<div class="fl-top">
			<Head id="fl-h" pill={errors.pill} symbol="warning" heading={errors.h2} />
			<Segmented
				class="rv"
				options={errors.filters}
				label={errors.filterLabel}
				bind:value={filter}
			/>
		</div>
		{#key filter}
			<div class="errs">
				{#each shown as { item, number }, j (number)}
					<article
						class={["err", item.kind]}
						style:animation-delay="{j * 40}ms"
					>
						<span class="en">{number}</span>
						<div>
							<h3>{item.title}</h3>
							<p>{item.text}</p>
							<div class="ef">
								<span class={[item.kind !== "r" && "c"]}>{item.effect}</span
								><span class="l">{item.law}</span>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/key}
	</div>
</section>

<style>
	.fl-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		flex-wrap: wrap;
	}
	/* The design's .pg-seg lets its labels wrap (the shared one doesn't). */
	.fl-top :global(.seg.track button) {
		white-space: normal;
	}
	.errs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin-top: 40px;
	}
	.err {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 20px 22px;
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		gap: 16px;
		animation: mc-in 0.4s both;
	}
	@keyframes mc-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.en {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--bg);
		display: grid;
		place-items: center;
		font-size: 14px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.err.k .en {
		background: var(--ink);
		color: var(--accent);
	}
	/* `.err h3`: beats the landing reset's letter-spacing. */
	.err h3 {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.err p {
		font-size: 14.5px;
		color: var(--muted);
		margin-top: 6px;
		line-height: 1.5;
	}
	.ef {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px;
	}
	.ef span {
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 4px 10px;
		background: var(--bg);
	}
	.ef span.c {
		background: #e6f5e7;
		color: #245f33;
	}
	.ef span.l {
		color: var(--faint);
		font-weight: 500;
	}
	@media (max-width: 760px) {
		.errs {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.err {
			grid-template-columns: minmax(0, 1fr);
			gap: 10px;
		}
	}
</style>

<!--
  "Nicht nur Zahlen. Konkrete nächste Schritte." (`.aw-2.rev` + `.afd`): the
  card with five notes and their filter beside the text. The notes rise in
  once when the card scrolls into view.
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Split from "../components/Split.svelte";
	import { hints, type HintFilter } from "../content";
	import { filterHints } from "../metrics";

	let filter = $state<HintFilter>("all");
	const shown = $derived(filterHints(hints.items, filter));
	/** The polite line, only after a pick. */
	let announce = $state("");
	let played = $state(true);

	function pick(value: HintFilter) {
		filter = value;
		announce = hints.count(shown.length);
	}

	const entrance = enterView({
		threshold: 0.3,
		prepare: () => (played = false),
		play: () => {
			played = true;
		},
	});
</script>

<Split
	id="afd-h"
	pill={hints.pill}
	h2={hints.h2}
	text={hints.text}
	list={hints.list}
	reverse
>
	{#snippet visual()}
		<div class={["afd rv", played && "in"]} {@attach entrance}>
			<div class="afd-top">
				<b>{hints.title}</b>
				<div class="afd-ch" role="group" aria-label={hints.filterLabel}>
					{#each hints.filters as f (f.value)}
						<button
							type="button"
							class={[f.value === filter && "on"]}
							aria-pressed={f.value === filter}
							onclick={() => pick(f.value)}
							>{f.value === "all"
								? `${f.label} `
								: f.label}{#if f.value === "all"}<b>{hints.items.length}</b
								>{/if}</button
						>
					{/each}
				</div>
			</div>
			<ul>
				{#each hints.items as item, i (item.title)}
					<li
						class={["afd-i", item.tone]}
						style:--i={i}
						hidden={!shown.includes(item)}
					>
						<span class="afd-s" aria-hidden="true"></span>
						<div>
							<small>{item.place}</small>
							<b>{item.title}</b>
							<p>{item.text}</p>
						</div>
						<span class="afd-a">{item.action}</span>
					</li>
				{/each}
			</ul>
			<p class="sr-only" aria-live="polite">{announce}</p>
		</div>
	{/snippet}
</Split>

<style>
	.afd {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 18px;
		box-shadow: 0 30px 70px -50px rgba(30, 50, 45, 0.45);
		text-align: left;
	}
	.afd-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}
	.afd-top > b {
		font-size: 16px;
		font-weight: 600;
	}
	.afd-ch {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	/* Two classes, to beat the landing reset of buttons */
	.afd-ch button {
		border: 1px solid var(--hair);
		background: #fff;
		font: inherit;
		font-size: 12.5px;
		font-weight: 500;
		border-radius: 999px;
		padding: 5px 11px;
		cursor: pointer;
		color: var(--muted);
	}
	.afd-ch button b {
		font-weight: 600;
		margin-left: 3px;
	}
	.afd-ch button.on {
		background: var(--g1);
		color: #fff;
		border-color: var(--g1);
	}
	ul {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.afd-i {
		display: grid;
		grid-template-columns: 4px minmax(0, 1fr) auto;
		gap: 14px;
		align-items: center;
		border: 1px solid #eef1ef;
		border-radius: 14px;
		padding: 12px 14px 12px 0;
		overflow: hidden;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.afd.in .afd-i {
		opacity: 1;
		transform: none;
		transition-delay: calc(0.2s + var(--i) * 0.15s);
	}
	.afd-s {
		align-self: stretch;
		margin: -12px 0;
		background: #7a8783;
	}
	.afd-i.o .afd-s {
		background: var(--g4);
	}
	.afd-i.y .afd-s {
		background: var(--g5);
	}
	.afd-i.b .afd-s {
		background: var(--g3);
	}
	.afd-i.g .afd-s {
		background: var(--g2);
	}
	.afd-i small {
		font-size: 11.5px;
		color: var(--muted);
	}
	.afd-i b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
		margin-top: 1px;
	}
	.afd-i p {
		margin: 2px 0 0;
		font-size: 13px;
		color: var(--muted);
	}
	.afd-a {
		font-size: 11.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 5px 10px;
		background: var(--bg);
		white-space: nowrap;
	}
	.afd-i.o .afd-a {
		background: #fbe6da;
		color: #b4461e;
	}
	@media (max-width: 640px) {
		.afd-i {
			grid-template-columns: 4px minmax(0, 1fr);
		}
		.afd-a {
			grid-column: 2;
			justify-self: start;
		}
	}
</style>

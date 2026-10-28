<!--
  "Vorbereitung" (.dm-prep): the heading on the left, four `aria-pressed`
  items to tick off on the right and the count under them in a polite live
  line. Nothing is stored. Without JS the items are a plain list: the
  buttons can't toggle, so the count is hidden.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { prep } from "../content";

	let ticked = $state(prep.items.map(() => false));
	const count = $derived(ticked.filter(Boolean).length);
	const status = $derived(
		count === prep.items.length
			? prep.done
			: prep.status(count, prep.items.length),
	);
</script>

<section class="prep-sec" aria-labelledby="prep-h">
	<div class="wrap g">
		<div>
			<span class="pill rv"><Icon name="clipboard" />{prep.pill}</span>
			<h2 class="h2 rv" id="prep-h">{prep.h2}</h2>
			<p class="lead rv">{prep.lead}</p>
		</div>
		<div class="prep rv">
			{#each prep.items as item, i (item.title)}
				<button
					type="button"
					class={["pi2", ticked[i] && "on"]}
					aria-pressed={ticked[i]}
					onclick={() => (ticked[i] = !ticked[i])}
				>
					<i><Check /></i><span
						><b>{item.title}</b><small>{item.text}</small></span
					>
				</button>
			{/each}
			<p class="prep-s" aria-live="polite">{status}</p>
		</div>
	</div>
</section>

<style>
	.prep-sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.g {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 64px;
		align-items: center;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.prep {
		display: grid;
		gap: 10px;
	}
	/* `.prep .pi2`: beats the landing reset of buttons' font and colour. */
	.prep .pi2 {
		display: flex;
		align-items: center;
		gap: 14px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 14px;
		padding: 16px 18px;
		font: inherit;
		text-align: left;
		cursor: pointer;
		color: var(--ink);
		transition: all 0.25s;
	}
	.pi2:hover {
		border-color: #c9d3ce;
		transform: translateX(3px);
	}
	.pi2 i {
		width: 26px;
		height: 26px;
		border-radius: 8px;
		border: 1.5px solid #c9d3ce;
		display: grid;
		place-items: center;
		flex: none;
		transition: all 0.2s;
	}
	.pi2 i :global(svg) {
		width: 11px;
		opacity: 0;
		transform: scale(0.4);
		transition: all 0.25s cubic-bezier(0.2, 1.6, 0.4, 1);
	}
	.pi2 b {
		display: block;
		font-size: 15.5px;
		font-weight: 600;
	}
	.pi2 small {
		color: var(--muted);
		font-size: 13.5px;
	}
	.pi2.on {
		background: #f4faf5;
		border-color: #cdebd0;
	}
	.pi2.on i {
		background: var(--accent);
		border-color: var(--accent);
	}
	.pi2.on i :global(svg) {
		opacity: 1;
		transform: none;
	}
	.pi2.on b {
		text-decoration: line-through;
		text-decoration-color: rgba(30, 50, 45, 0.35);
	}
	.prep-s {
		font-size: 13px;
		color: var(--faint);
		margin: 4px 0 0;
	}
	@media (scripting: none) {
		.prep-s {
			display: none;
		}
		.prep .pi2 {
			cursor: default;
		}
	}
	@media (max-width: 1040px) {
		.g {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
</style>

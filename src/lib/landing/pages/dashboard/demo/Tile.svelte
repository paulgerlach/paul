<!--
  One tile of the preview's Overview: a labelled region with its title
  (a button that enlarges the chart when `onexpand` is given), the legend and
  the body.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import Icon from "../components/Icon.svelte";
	import type { IconName } from "../icons";

	let {
		title,
		icon,
		onexpand,
		wide = false,
		badge,
		legend,
		children,
	}: {
		title: string;
		icon: IconName;
		onexpand?: (trigger: HTMLElement) => void;
		wide?: boolean;
		badge?: Snippet;
		legend?: Snippet;
		children: Snippet;
	} = $props();

	const uid = $props.id();
</script>

<section class={["t", wide && "wide"]} aria-labelledby="{uid}-h">
	<div class="th">
		{#if onexpand}
			<h3 id="{uid}-h" class="hx">
				<button
					type="button"
					class="exp"
					onclick={(event) => onexpand(event.currentTarget)}
				>
					{title}<span class="sr-only"> vergrößern</span>
					<span class="ex" aria-hidden="true"><Icon name="expand" /></span>
					<Icon name={icon} class="ti" />
				</button>
			</h3>
		{:else}
			<h3 id="{uid}-h">{title}</h3>
			{#if badge}{@render badge()}{:else}<Icon name={icon} class="ti" />{/if}
		{/if}
	</div>
	{#if legend}
		<div class="lg">{@render legend()}</div>
	{/if}
	<div class="body">{@render children()}</div>
</section>

<style>
	.t {
		min-width: 0;
		overflow: hidden;
		background: #fafaf8;
		border-radius: 12px;
		padding: 12px 14px;
		min-height: 228px;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	@media (min-width: 1121px) {
		.t.wide {
			grid-column: span 2;
		}
	}
	.th {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e6e8e5;
		padding-bottom: 9px;
		margin-bottom: 8px;
	}
	.t .th h3 {
		font-size: 18px;
		font-weight: 400;
		letter-spacing: -0.01em;
		line-height: 1.3;
	}
	.t .th .hx {
		width: 100%;
	}
	.exp {
		font: inherit;
		display: flex;
		align-items: center;
		width: 100%;
		border: 0;
		background: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
		color: inherit;
	}
	.ex {
		margin-left: auto;
		margin-right: 10px;
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 6px;
		color: var(--faint);
		opacity: 0;
		transition:
			opacity 0.2s,
			background 0.2s;
	}
	.ex :global(svg) {
		width: 13px;
		height: 13px;
	}
	.t:hover .ex,
	.exp:focus-visible .ex {
		opacity: 1;
	}
	.exp:hover .ex {
		background: #eef0ee;
		color: var(--ink);
	}
	.th :global(.ti) {
		width: 18px;
		height: 18px;
		color: #3e4f4a;
		flex: none;
	}
	.lg {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 6px;
		font-size: 11px;
		color: #3e4f4a;
		margin: 2px 0 4px;
		position: relative;
	}
	.body {
		flex: 1;
		min-height: 150px;
		position: relative;
		display: flex;
		flex-direction: column;
	}
</style>

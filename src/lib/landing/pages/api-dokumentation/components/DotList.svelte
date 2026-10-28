<!-- The design's list with green dots (.ad-li). -->
<script lang="ts">
	import type { Rich as RichText } from "../content";
	import Rich from "./Rich.svelte";

	let { items }: { items: RichText[] } = $props();
</script>

<ul>
	{#each items as item, i (i)}
		<li><Rich text={item} /></li>
	{/each}
</ul>

<style>
	ul {
		margin: 16px 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 8px;
	}
	li {
		position: relative;
		padding-left: 22px;
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.55;
	}
	li::before {
		content: "";
		position: absolute;
		left: 4px;
		top: 0.62em;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #8ad68f;
	}
</style>

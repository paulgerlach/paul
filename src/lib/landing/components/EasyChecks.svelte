<!-- The row of green checks under a landing hero's signup form. -->
<script lang="ts">
	import Check from "./icons/Check.svelte";

	let { items }: { items: readonly string[] } = $props();
</script>

<ul class="easy">
	{#each items as item (item)}
		<li><i><Check /></i>{item}</li>
	{/each}
</ul>

<style>
	.easy {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 22px;
		font-size: 15px;
	}
	li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	i {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		display: inline-grid;
		place-items: center;
		flex: none;
	}
	i :global(svg) {
		width: 10px;
	}
	@media (max-width: 980px) {
		.easy {
			justify-content: center;
		}
	}
</style>

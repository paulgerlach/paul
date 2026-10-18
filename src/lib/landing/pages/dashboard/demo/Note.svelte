<!-- The preview's short note at the bottom (`.hd-note`), announced once. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { getDemo } from "./demo.svelte";

	const demo = getDemo();
</script>

<div class={["note", demo.note && "show"]} role="status">
	{#if demo.note}
		{#key demo.note.id}
			<Icon name="check" /><span>{demo.note.text}</span>
		{/key}
	{/if}
</div>

<style>
	.note {
		position: absolute;
		left: 50%;
		bottom: 22px;
		transform: translate(-50%, 12px);
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--ink);
		color: #fff;
		border-radius: 999px;
		padding: 9px 16px 9px 12px;
		font-size: 13px;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.25s,
			transform 0.25s;
		z-index: 50;
		white-space: nowrap;
		max-width: calc(100% - 24px);
	}
	.note :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
		flex: none;
	}
	.note span {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.note.show {
		opacity: 1;
		transform: translate(-50%, 0);
	}
</style>

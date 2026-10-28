<!-- The customer-type tabs (.sg-tabs-w): links to the segment pages; the current page is marked, a page that doesn't exist yet is plain text. -->
<script lang="ts">
	import Icon from "./Icon.svelte";
	import type { SegmentTabs } from "./types";

	let { tabs }: { tabs: SegmentTabs } = $props();
</script>

<nav class="tabs-w" aria-label={tabs.label}>
	<div class="wrap">
		<div class="tabs">
			{#each tabs.items as tab (tab.text)}
				{#if tab.href}
					<a
						class={["tab", tab.current && "on"]}
						href={tab.href}
						aria-current={tab.current ? "page" : undefined}
						><Icon name={tab.icon} />{tab.text}</a
					>
				{:else}
					<span class="tab"><Icon name={tab.icon} />{tab.text}</span>
				{/if}
			{/each}
		</div>
	</div>
</nav>

<style>
	.tabs-w {
		border-bottom: 1px solid var(--hair);
		background: #fff;
		position: relative;
		z-index: 2;
	}
	.tabs {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding: 14px 0;
		scrollbar-width: none;
	}
	.tabs::-webkit-scrollbar {
		display: none;
	}
	.tab {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
		font-size: 14.5px;
		font-weight: 500;
		color: var(--muted);
		padding: 9px 14px;
		border-radius: 10px;
		border: 1px solid transparent;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;
	}
	.tab :global(svg) {
		width: 15px;
		height: 15px;
		flex: none;
	}
	a.tab:hover {
		color: var(--ink);
		background: var(--bg);
	}
	.tab.on {
		color: var(--ink);
		background: var(--bg);
		border-color: var(--hair);
		font-weight: 600;
	}
</style>

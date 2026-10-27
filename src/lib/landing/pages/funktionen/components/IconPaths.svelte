<!-- The shapes of one of the design's 20×20 line icons, for use inside an <svg> (Icon, SectionHead's pill). -->
<svelte:options namespace="svg" />

<script lang="ts">
	import type { IconName } from "../icons";

	let { name }: { name: IconName } = $props();
</script>

{#if name === "spark"}
	<circle cx="10" cy="10" r="2.6" /><path
		d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4"
	/>
{:else if name === "sparkles"}
	<path
		d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
	/>
{:else if name === "chart"}
	<path d="M3 17h14M6 14V9M10 14V5M14 14v-3" />
{:else if name === "list"}
	<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
{:else if name === "tool"}
	<path
		d="M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z"
	/>
{:else if name === "check"}
	<path d="M5 10.5l3.2 3L15 7" />
{:else if name === "lock"}
	<rect x="4.5" y="9" width="11" height="8" rx="2" /><path
		d="M7 9V6.5a3 3 0 0 1 6 0V9"
	/>
{:else if name === "key"}
	<circle cx="7" cy="13" r="3.5" /><path
		d="M9.5 10.5l6-6M13 7l2 2M15.5 4.5l1.5 1.5"
	/>
{:else if name === "server"}
	<rect x="3" y="3.5" width="14" height="5" rx="1.5" /><rect
		x="3"
		y="11.5"
		width="14"
		height="5"
		rx="1.5"
	/><path d="M6 6h.01M6 14h.01" />
{:else if name === "file"}
	<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M8 10h5M8 13h5" />
{:else if name === "users"}
	<circle cx="8" cy="7" r="3" /><path
		d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
	/>
{:else if name === "signal"}
	<path
		d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
	/><circle cx="10" cy="16" r=".8" fill="currentColor" />
{:else if name === "building"}
	<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
{:else if name === "bell"}
	<path d="M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0" />
{:else if name === "calc"}
	<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
		d="M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01"
	/>
{:else if name === "home"}
	<path d="M3 9.5L10 3.5l7 6V17H3z" /><path d="M8 17v-4.5h4V17" />
{:else if name === "drop"}
	<path
		d="M10 2.5S4.5 8.6 4.5 12.2a5.5 5.5 0 0 0 11 0C15.5 8.6 10 2.5 10 2.5z"
	/>
{:else if name === "link"}
	<path
		d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-1 1M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l1-1"
	/>
{/if}

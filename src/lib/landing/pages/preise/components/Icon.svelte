<!-- The design's line icons (20×20, stroke 1.6), by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";

	export type IconName =
		| "euro"
		| "list"
		| "users"
		| "mail"
		| "calc"
		| "calendar"
		| "tool"
		| "home"
		| "building"
		| "check";

	let { name }: { name: IconName } = $props();
</script>

<StrokeIcon>
	{#if name === "euro"}
		<path d="M14.5 5.5a5.5 5.5 0 1 0 0 9" /><path d="M3.5 8.5h7M3.5 11.5h7" />
	{:else if name === "list"}
		<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
	{:else if name === "users"}
		<circle cx="8" cy="7" r="3" /><path
			d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
		/>
	{:else if name === "mail"}
		<rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path
			d="M3 5.5l7 5.5 7-5.5"
		/>
	{:else if name === "calc"}
		<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
			d="M7 6h6M7 10h.01M10 10h.01M13 10h.01M7 13h.01M10 13h.01M13 13h.01"
		/>
	{:else if name === "calendar"}
		<rect x="3" y="4" width="14" height="13" rx="2" /><path
			d="M3 8h14M7 2.5v3M13 2.5v3"
		/>
	{:else if name === "tool"}
		<path
			d="M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z"
		/>
	{:else if name === "home"}
		<path d="M3 9.5L10 3.5l7 6V17H3z" /><path d="M8 17v-4.5h4V17" />
	{:else if name === "building"}
		<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
	{:else if name === "check"}
		<path d="M5 10.5l3.2 3L15 7" />
	{/if}
</StrokeIcon>

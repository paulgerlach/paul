<!-- The design's 20×20 line icon (stroke 1.6); pass the shapes as children. -->
<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		children,
		class: className = "",
	}: { children: Snippet; class?: string } = $props();
</script>

<svg
	class={className}
	width="16"
	height="16"
	viewBox="0 0 20 20"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true">{@render children()}</svg
>

<script lang="ts">
	let {
		width = 10,
		class: className = "",
	}: { width?: number; class?: string } = $props();
</script>

<svg class={className} {width} viewBox="0 0 10 6" aria-hidden="true">
	<path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" stroke-width="1.5" />
</svg>

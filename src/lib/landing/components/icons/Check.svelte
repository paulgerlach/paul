<script lang="ts">
	let {
		color = "#1E322D",
		class: className = "",
	}: { color?: string; class?: string } = $props();
</script>

<svg class={className} viewBox="0 0 12 10" aria-hidden="true">
	<path d="M1 5l3.5 3.5L11 1" stroke={color} stroke-width="2" fill="none" />
</svg>

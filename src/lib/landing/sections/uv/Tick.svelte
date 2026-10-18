<!-- The design's small tick (12×10, stroke 2), in the current colour. -->
<script lang="ts">
	let { width = 10 }: { width?: number } = $props();
</script>

<svg viewBox="0 0 12 10" {width} aria-hidden="true"
	><path
		d="M1 5l3.5 3.5L11 1"
		stroke="currentColor"
		stroke-width="2"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	/></svg
>

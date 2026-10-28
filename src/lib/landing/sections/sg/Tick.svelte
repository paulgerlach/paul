<!-- The design's small tick (12×10, stroke 2). `color` defaults to the ink; pass "currentColor" to inherit. -->
<script lang="ts">
	let { width = 10, color = "#1E322D" }: { width?: number; color?: string } =
		$props();
</script>

<svg viewBox="0 0 12 10" {width} aria-hidden="true"
	><path
		d="M1 5l3.5 3.5L11 1"
		stroke={color}
		stroke-width="2"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	/></svg
>

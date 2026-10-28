<!-- A section's eyebrow pill and H2 (the design's .pv-eb + .pv-h2); `lines` break with <br>. -->
<script lang="ts">
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";

	let {
		id,
		eyebrow,
		lines,
		center = false,
	}: {
		id: string;
		eyebrow: string;
		lines: string | string[];
		center?: boolean;
	} = $props();

	const parts = $derived(typeof lines === "string" ? [lines] : lines);
</script>

<Eyebrow class="rv" text={eyebrow} {center} />
<h2 class={["pv-h2 rv", center && "c"]} {id}>
	{#each parts as line, i (line)}{#if i > 0}<br />{/if}{line}{/each}
</h2>

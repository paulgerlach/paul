<!-- One of the page's 20×20 line icons, by name. The signal's dot is filled, as in the design. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { ICONS, type IconName } from "../icons";

	let { name }: { name: IconName } = $props();
</script>

<StrokeIcon>
	{#each ICONS[name] as shape, i (i)}
		{#if "d" in shape}
			<path d={shape.d} />
		{:else}
			<circle cx={shape.cx} cy={shape.cy} r={shape.r} fill="currentColor" />
		{/if}
	{/each}
</StrokeIcon>

<!-- One of the design's 20×20 line icons on /sicherheit, by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { ICONS, type IconName } from "../icons";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

<StrokeIcon class={className}>
	{#each ICONS[name] as shape, i (i)}
		{#if "d" in shape}
			<path d={shape.d} />
		{:else if "cx" in shape}
			<circle
				cx={shape.cx}
				cy={shape.cy}
				r={shape.r}
				fill={shape.fill ? "currentColor" : undefined}
			/>
		{:else}
			<rect
				x={shape.x}
				y={shape.y}
				width={shape.width}
				height={shape.height}
				rx={shape.rx}
			/>
		{/if}
	{/each}
</StrokeIcon>

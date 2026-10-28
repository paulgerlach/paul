<!-- One of the design's 20×20 line icons on /plattform/schnittstellen, by name; `heidi` is the shared Heidi mark. -->
<script lang="ts">
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { ICONS, type IconName } from "../icons";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

{#if name === "heidi"}
	<HeidiMark class={className} />
{:else}
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
{/if}

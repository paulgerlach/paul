<!-- The shapes of one of the page's icons, for an SVG that's already there (SectionHead's pill). -->
<script lang="ts">
	import { ICONS, type IconName } from "../icons";

	let { name }: { name: IconName } = $props();
</script>

{#each ICONS[name] as shape, i (i)}
	{#if "d" in shape}
		<path d={shape.d} />
	{:else if "cx" in shape}
		<circle cx={shape.cx} cy={shape.cy} r={shape.r} />
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

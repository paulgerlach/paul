<!-- One of the design's 20×20 line icons on /funktionen, by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "../icons";
	import IconPaths from "./IconPaths.svelte";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

<StrokeIcon class={className}><IconPaths {name} /></StrokeIcon>

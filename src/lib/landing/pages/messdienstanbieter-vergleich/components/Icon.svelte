<!-- One of the design's 20×20 line icons on /messdienst-vergleich, by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "../icons";
	import Shapes from "./Shapes.svelte";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

<StrokeIcon class={className}><Shapes {name} /></StrokeIcon>

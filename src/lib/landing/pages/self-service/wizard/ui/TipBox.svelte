<!--
  The tooltip's box (`.ss-tipb`), with an optional example photo or sketch
  (`svg`, an SVG's URL).
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";

	let {
		id,
		text,
		img,
		svg,
	}: { id: string; text: string; img?: ImageAsset; svg?: string } = $props();
</script>

<span class="ss-tipb" id="{id}-tip" role="note"
	>{#if img}<Image
			src={img}
			alt="Beispielfoto"
			width={720}
			height={720}
			sizes="340px"
		/>{:else if svg}<img src={svg} alt="Beispielfoto" />{/if}<span>{text}</span
	></span
>

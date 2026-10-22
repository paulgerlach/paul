<!-- The tooltip's box (`.ss-tipb`), with an optional example photo. -->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";

	let { id, text, img }: { id: string; text: string; img?: ImageAsset } =
		$props();
</script>

<span class="ss-tipb" id="{id}-tip" role="note"
	>{#if img}<Image
			src={img}
			alt="Beispielfoto"
			width={720}
			height={720}
			sizes="340px"
		/>{/if}<span>{text}</span></span
>

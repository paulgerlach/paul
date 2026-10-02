<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { arrow } from "$lib/assets/icons";

	let { text }: { text: string } = $props();
</script>

<p class="mb-5 flex items-center justify-between text-xl text-dark_text">
	{text}
	<Image
		width={0}
		height={0}
		sizes="100vw"
		class="size-2.5 max-h-2.5 max-w-2.5"
		style="width: 100%; height: auto"
		alt="arrow"
		src={arrow}
	/>
</p>

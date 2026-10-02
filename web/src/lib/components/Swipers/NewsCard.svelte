<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { newsSlides } from "./newsSlides";

	let { slide }: { slide: (typeof newsSlides)[number] } = $props();
</script>

<Image
	width={0}
	height={0}
	sizes="100vw"
	class="mb-2.5 block w-full"
	src={slide.image}
	alt="news image"
/>
<p class="mb-4 text-[30px] leading-9 text-dark_text">{slide.title}</p>
<p class="text-[17px] leading-5 text-dark_text">{slide.subtitle}</p>

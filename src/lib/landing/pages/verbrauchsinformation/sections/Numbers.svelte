<!-- "Die uVI in Zahlen" with a photo as the second cell; the deadline's figure comes from `load` (plan 01 §1.3). -->
<script lang="ts">
	import photo from "$lib/assets/landing/cities/leipzig/references.jpg?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Numbers from "$lib/landing/sections/uv/Numbers.svelte";
	import type { Figure } from "$lib/landing/sections/uv/types";
	import { numbers } from "../content";

	let { figures }: { figures: Figure[] } = $props();
</script>

<Numbers
	id="vi-num-h"
	h2={numbers.h2}
	first={numbers.first}
	rest={figures}
	mediaKind="photo"
>
	{#snippet media()}
		<Image src={photo} alt="" sizes="(max-width: 620px) 100vw, 33vw" />
	{/snippet}
</Numbers>

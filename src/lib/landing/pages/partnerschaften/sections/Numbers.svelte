<!-- "Partnerschaften in Zahlen" with a photo as the second cell; no figure counts. -->
<script lang="ts">
	import photo from "$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Numbers from "$lib/landing/sections/uv/Numbers.svelte";
	import { numbers } from "../content";
</script>

<Numbers
	id="ps-num-h"
	h2={numbers.h2}
	first={numbers.first}
	rest={numbers.rest}
	mediaKind="photo"
>
	{#snippet media()}
		<Image src={photo} alt="" sizes="(max-width: 620px) 100vw, 33vw" />
	{/snippet}
</Numbers>

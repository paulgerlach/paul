<script lang="ts">
	import template from "$lib/assets/landing/cities/berlin/references.jpg?enhanced";
	import notice from "$lib/assets/landing/mieterportal/building.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { notice, template };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="wv-who" label={audience.label} {cards} />

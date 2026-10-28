<script lang="ts">
	import conference from "$lib/assets/landing/verbaende/conference.webp?enhanced";
	import building from "$lib/assets/landing/mieterportal/building.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { conference, building };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="vb-who" label={audience.label} {cards} />

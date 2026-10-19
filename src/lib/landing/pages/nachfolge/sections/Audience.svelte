<script lang="ts">
	import technician from "$lib/assets/landing/nachfolge/technician.webp?enhanced";
	import consultation from "$lib/assets/landing/vorgehen/consultation.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { technician, consultation };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="nf-who" label={audience.label} {cards} />

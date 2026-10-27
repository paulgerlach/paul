<script lang="ts">
	import checker from "$lib/assets/landing/neuigkeiten/portfolio-checker.webp?enhanced";
	import letter from "$lib/assets/landing/vorgehen/office.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { checker, letter };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="mw-who" label={audience.label} {cards} />

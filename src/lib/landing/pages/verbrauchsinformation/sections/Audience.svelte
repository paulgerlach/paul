<script lang="ts">
	import verwalter from "$lib/assets/landing/cities/koeln/hero.jpg?enhanced";
	import mieter from "$lib/assets/landing/region/contact.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { verwalter, mieter };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="vi-who" label={audience.label} {cards} />

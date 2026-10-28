<script lang="ts">
	import team from "$lib/assets/landing/kontakt/team.webp?enhanced";
	import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";

	const images = { team, installer };
	const cards = audience.cards.map((card) => ({
		...card,
		image: images[card.image],
	}));
</script>

<Audience idPrefix="fz-who" label={audience.label} {cards} />

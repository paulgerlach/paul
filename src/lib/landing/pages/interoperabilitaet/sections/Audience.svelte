<!--
  "Sie haben einen gemischten Bestand?" with the team photo, and "Sie nutzen
  eine Verwaltungssoftware?" with the orb in place of a photo.
-->
<script lang="ts">
	import team from "$lib/assets/landing/kontakt/team.webp?enhanced";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";
	import Orb from "./Orb.svelte";
</script>

{#snippet orb()}<Orb />{/snippet}

<Audience
	idPrefix="iop-who"
	label={audience.label}
	cards={[
		{ ...audience.stock, image: team },
		{ ...audience.software, panel: orb },
	]}
/>

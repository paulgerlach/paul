<!--
  "Sie sind Softwareanbieter?" with the form "Anbindung anfragen" in place of
  a photo, and "Sie sind Installationsbetrieb?" with its photo.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
	import type { ConnectionInquiry } from "$lib/forms/connectionInquiry";
	import Audience from "$lib/landing/sections/uv/Audience.svelte";
	import { audience } from "../content";
	import ConnectionForm from "./ConnectionForm.svelte";

	let { form }: { form: SuperValidated<ConnectionInquiry> } = $props();
</script>

{#snippet panel()}<ConnectionForm {form} />{/snippet}

<Audience
	idPrefix="ps-who"
	label={audience.label}
	cards={[
		{ ...audience.software, panel },
		{ ...audience.installer, image: installer },
	]}
/>

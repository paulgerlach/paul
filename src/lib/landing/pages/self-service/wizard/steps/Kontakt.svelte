<!--
  Step "Ihre Kontaktdaten", with the consent, the nudge for three or more
  unknown answers and "So geht es weiter". The hidden `website` field is the
  honeypot the endpoint checks.
-->
<script lang="ts">
	import Markup from "../ui/Markup.svelte";
	import { ROUTE_DATENSCHUTZHINWEISE } from "$lib/routes";
	import { unknownCount } from "../model";
	import { CHECK } from "../svg";
	import NextSteps from "../ui/NextSteps.svelte";
	import Nudge from "../ui/Nudge.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const k = $derived(w.s.k);
</script>

<div class="f2">
	<Text label="Vorname*" bind:value={k.vn} autocomplete="given-name" />
	<Text label="Nachname*" bind:value={k.nn} autocomplete="family-name" />
</div>
<Text
	label="Firma oder Hausverwaltung (optional)"
	bind:value={k.firma}
	autocomplete="organization"
/>
<div class="f2">
	<Text
		label="E-Mail-Adresse*"
		bind:value={k.mail}
		placeholder="name@beispiel.de"
		type="email"
		autocomplete="email"
	/>
	<Text
		label="Telefon (optional)"
		bind:value={k.tel}
		placeholder="Für technische Rückfragen"
		type="tel"
		autocomplete="tel"
	/>
</div>
<div class="ss-hp" aria-hidden="true">
	<label
		>Website <input
			type="text"
			tabindex="-1"
			autocomplete="off"
			bind:value={w.website}
		/></label
	>
</div>
<label class="cb">
	<input type="checkbox" bind:checked={k.ok} /><i><Markup html={CHECK} /></i
	><span
		>Ich bin einverstanden, dass Heidi Systems meine Angaben zur Erstellung
		meines Angebots verarbeitet. Mehr dazu in der <a
			href={ROUTE_DATENSCHUTZHINWEISE}
			target="_blank"
			rel="noopener">Datenschutzerklärung</a
		>.</span
	>
</label>
{#if unknownCount(w.s) >= 3}<Nudge strong />{/if}
<NextSteps cur={0} />

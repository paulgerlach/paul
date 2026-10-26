<!-- Step "Haben Sie eine Geräteliste?" -->
<script lang="ts">
	import { LIST_OPTIONS } from "../data";
	import { ICONS } from "../svg";
	import Drop from "../ui/Drop.svelte";
	import Note from "../ui/Note.svelte";
	import Options, { cards } from "../ui/Options.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
</script>

<Options
	options={cards(LIST_OPTIONS, {
		liste: {
			icon: ICONS.list,
			small: "Zum Beispiel vom bisherigen Messdienst",
		},
		rechnung: { icon: ICONS.receipt, small: "Gerätemiet- oder Kaufrechnung" },
		beides: { icon: ICONS.both, small: "Geräteliste und Rechnung" },
		nein: { icon: ICONS.nodoc },
	})}
	value={w.s.liste}
	onpick={(v) => (w.s.liste = v)}
/>
{#if w.s.liste && w.s.liste !== "nein"}
	<div class="ss-cond">
		<div style:margin-top="18px">
			<Drop
				id="liste"
				label="Unterlagen hochladen"
				hint="PDF, Excel-Export oder Fotos, bis zu 6 Dateien."
				accept="application/pdf,image/*,.csv,.xls,.xlsx"
				max={6}
			/>
		</div>
		<Text
			area
			label="Anmerkung (optional)"
			bind:value={w.s.listeNote}
			placeholder="Zum Beispiel: Liste gilt nur für Haus A"
		/>
	</div>
{:else if w.s.liste === "nein"}
	<div class="ss-cond">
		<Note
			>Dann erfassen Sie Ihre Zähler in den nächsten Schritten. Das dauert nur
			wenige Minuten, und Fotos helfen uns sehr.</Note
		>
	</div>
{/if}

<!-- Step "Liegt eine Heizkostenabrechnung vor?" -->
<script lang="ts">
	import { BILL_OPTIONS } from "../data";
	import { ICONS } from "../svg";
	import Drop from "../ui/Drop.svelte";
	import Note from "../ui/Note.svelte";
	import Options, { cards } from "../ui/Options.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
</script>

<Options
	options={cards(BILL_OPTIONS, {
		ja: { icon: ICONS.doc, small: "PDF oder Foto hochladen" },
		nein: { icon: ICONS.none },
		unsicher: { icon: ICONS.q },
	})}
	value={w.s.abr}
	onpick={(v) => (w.s.abr = v)}
/>
{#if w.s.abr === "ja"}
	<div class="ss-cond">
		<div style:margin-top="18px">
			<Drop
				id="abr"
				label="Abrechnung hochladen"
				hint="PDF oder Fotos, bis zu 6 Dateien. Name und Adresse dürfen Sie schwärzen."
				accept="application/pdf,image/*"
				max={6}
			/>
		</div>
		<Text
			area
			label="Anmerkung (optional)"
			bind:value={w.s.abrNote}
			placeholder="Zum Beispiel: Abrechnung für zwei Häuser"
		/>
	</div>
{:else if w.s.abr}
	<div class="ss-cond">
		<Note>Kein Problem. Sie können ohne Abrechnung weitermachen.</Note>
	</div>
{/if}

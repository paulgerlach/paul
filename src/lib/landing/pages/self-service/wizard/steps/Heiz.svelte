<!-- Step "Heizung und gewünschte Leistungen". -->
<script lang="ts">
	import {
		fieldTip,
		HEATING,
		HOT_WATER,
		QUESTION_TIPS,
		BUY_OPTIONS,
		SERVICE_OPTIONS,
	} from "../data";
	import { ICONS } from "../svg";
	import MultiSelect from "../ui/MultiSelect.svelte";
	import Note from "../ui/Note.svelte";
	import Options, { cards } from "../ui/Options.svelte";
	import Question from "../ui/Question.svelte";
	import Select from "../ui/Select.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const floor = $derived(
		w.s.heiz.includes("etage") || w.s.heiz.includes("elektro"),
	);
</script>

<Question
	text="Welche Heizungsart ist vorhanden?"
	hint="Mehrfachauswahl möglich"
	tip={QUESTION_TIPS.heating}
/>
<MultiSelect
	label="Heizungsart"
	options={HEATING}
	value={w.s.heiz}
	placeholder="Heizungsarten auswählen"
	onchange={(v) => (w.s.heiz = v)}
/>
{#if floor}
	<div class="ss-cond">
		<Note warn
			>Bei Etagen- oder Elektroheizung gibt es meist keine gemeinsame
			Heizkostenabrechnung. Heidi prüft mit Ihnen, welche Messung sinnvoll ist.</Note
		>
	</div>
{/if}
<div style:margin-top="18px">
	<Select
		label="Wie erfolgt die Warmwasserbereitung?"
		bind:value={w.s.ww}
		options={HOT_WATER}
		tip={fieldTip("heiz", "ww")}
	/>
</div>
<Question
	text="Welche Leistungen wünschen Sie?"
	top={22}
	tip={QUESTION_TIPS.services}
/>
<Options
	class="leist"
	options={cards(SERVICE_OPTIONS, {
		a: { rec: true, icon: ICONS.spark, small: "Rundum aus einer Hand" },
		c: { icon: ICONS.keep },
		d: { icon: ICONS.q },
	})}
	value={w.s.leist}
	onpick={(v) => (w.s.leist = v)}
/>
<Question
	text="Möchten Sie die Geräte mieten oder kaufen?"
	top={22}
	tip={QUESTION_TIPS.buy}
/>
<Options
	class="grid3 kauf"
	options={cards(BUY_OPTIONS, {
		miete: { icon: ICONS.rent, small: "Kosten auf die Mieter umlegbar" },
		kauf: { icon: ICONS.cart, small: "Nicht auf die Mieter umlegbar" },
		offen: { icon: ICONS.q, small: "Heidi berät Sie" },
	})}
	value={w.s.kauf}
	onpick={(v) => (w.s.kauf = v)}
/>
{#if w.s.kauf === "kauf"}
	<div class="ss-cond">
		<Note warn
			><b>Gut zu wissen:</b> Gekaufte Geräte können nicht auf die Mieter umgelegt
			werden. Bei einem Mietmodell zählt die Gerätemiete zu den umlagefähigen Betriebskosten.
			Kaufpreise ergänzen wir im Angebot auf Anfrage.</Note
		>
	</div>
{:else if w.s.kauf === "miete"}
	<div class="ss-cond">
		<Note
			>Gemietete Geräte können Sie über die Betriebskosten auf die Mieter
			umlegen.</Note
		>
	</div>
{/if}

<!--
  Step "Heizung und gewünschte Leistungen", with the recommendations for a
  heat pump (a heat meter and an electricity meter) and for central hot
  water (a heat meter for it), each with a button that adds the device.
-->
<script lang="ts">
	import {
		fieldTip,
		HEATING,
		HOT_WATER,
		QUESTION_TIPS,
		BUY_OPTIONS,
		SERVICE_OPTIONS,
	} from "../data";
	import {
		centralHotWater,
		decentralHotWaterMeters,
		hasPowerMeter,
		tech,
	} from "../model";
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
	const byDevices = $derived(tech(w.s));
	const heatMeter = $derived(w.s.devs.includes("wmz"));
	const power = $derived(hasPowerMeter(w.s));

	function addForHeatPump() {
		w.addHeatMeter("heizung");
		if (!hasPowerMeter(w.s)) w.addPowerMeter();
	}
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
{#if w.s.heiz.includes("wp")}
	<p class="ss-note ss-ynote" style:margin-top="14px">
		<span
			><b>Empfehlung bei Wärmepumpe:</b> Wir empfehlen zusätzlich einen Wärmemengenzähler
			und einen Stromzähler für die Wärmepumpe. So werden erzeugte Wärme und Stromverbrauch
			erfasst, und die Abrechnung ist vollständig und sinnvoll.</span
		>{#if byDevices}<br />{#if heatMeter && power}<span
					>✓ Beide sind bereits in Ihrer Auswahl.</span
				>{:else}<button type="button" data-addwp onclick={addForHeatPump}
					>+ {!heatMeter && !power
						? "Wärmemengenzähler und Stromzähler"
						: !heatMeter
							? "Wärmemengenzähler"
							: "Stromzähler"} hinzufügen</button
				>{/if}{/if}
	</p>
{/if}
<div style:margin-top="18px">
	<Select
		label="Wie erfolgt die Warmwasserbereitung?"
		bind:value={w.s.ww}
		options={HOT_WATER}
		tip={fieldTip("heiz", "ww")}
	/>
</div>
{#if centralHotWater(w.s)}
	<p class="ss-note ss-ynote" style:margin-top="14px">
		<span
			><b>Wärmemengenzähler für Warmwasser:</b> Wenn die Heizungsanlage sowohl
			Raumheizung als auch Warmwasser versorgt, empfehlen wir aufgrund der
			Heizkostenverordnung (HKVO) einen Wärmemengenzähler für die zentrale
			Warmwasserbereitung.{#if byDevices && heatMeter}
				Sie haben bereits Wärmemengenzähler ausgewählt. Bitte erfassen Sie dort
				auch den Zähler für das Warmwasser.{/if}</span
		>{#if byDevices && !heatMeter}<br /><button
				type="button"
				data-addwmz
				onclick={() => w.addHeatMeter("ww")}
				>+ Wärmemengenzähler hinzufügen</button
			>{/if}
	</p>
{:else if decentralHotWaterMeters(w.s)}
	<Note tone="y" top={14}
		><b>Warmwasserzähler bei dezentraler Warmwasserbereitung?</b> Sie haben angegeben,
		dass das Warmwasser dezentral bereitet wird, zum Beispiel mit Durchlauferhitzern.
		Dabei wird das Wasser direkt in der Wohnung mit Strom erwärmt, ein Warmwasserzähler
		ist dann meist nicht nötig. Bitte prüfen Sie, ob Sie Warmwasserzähler wirklich
		brauchen.</Note
	>
{/if}
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
		beides: { icon: ICONS.both, small: "Angebote für Miete und Kauf" },
	})}
	value={w.s.kauf}
	onpick={(v) => (w.s.kauf = v)}
/>
{#if w.s.kauf === "kauf" || w.s.kauf === "beides"}
	<div class="ss-cond">
		<Note warn
			><b>Gut zu wissen:</b> Gekaufte Geräte können nicht auf die Mieter umgelegt
			werden. Bei einem Mietmodell zählt die Gerätemiete zu den umlagefähigen Betriebskosten.</Note
		>
	</div>
{/if}
{#if w.s.kauf === "miete" || w.s.kauf === "beides"}
	<div class="ss-cond">
		<Note
			>Gemietete Geräte können Sie über die Betriebskosten auf die Mieter
			umlegen.</Note
		>
	</div>
{/if}

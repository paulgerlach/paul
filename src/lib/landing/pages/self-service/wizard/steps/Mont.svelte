<!--
  Step "Montage". With a device list or bill only who installs (and the
  consultation while it's open). By questions: the shutoff and fitting
  questions for water and heat meters ("Absperrbar" Ja / Nein sets
  "Einbausätze" the same and flashes it), the reach, the plumbing question
  when it's needed, who installs (the flat rate for the devices given).
-->
<script lang="ts">
	import {
		fieldTip,
		fitterOptions,
		FITTING_OPTIONS,
		MOUNT_TIPS,
		PLUMBING_OPTIONS,
		REACH_OPTIONS,
		SHUTOFF_CIRCUIT_OPTIONS,
	} from "../data";
	import { countedMeters, fitterFee, needsShutoff, tech } from "../model";
	import Markup from "../ui/Markup.svelte";
	import { CHECK } from "../svg";
	import Note from "../ui/Note.svelte";
	import Select from "../ui/Select.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const m = $derived(w.s.mont);
	const byDevices = $derived(tech(w.s));
	const shutoff = $derived(needsShutoff(w.s));
	const plumbing = $derived(m.eat === "nein" || m.err === "schwer");
	const fitters = $derived(fitterOptions(fitterFee(w.s)));
	const counted = $derived(countedMeters(w.s));
	let flash = $state(0);

	$effect.pre(() => {
		// Without water or heat meters the shutoff questions don't apply.
		if (byDevices && !shutoff && (m.abs || m.eat)) {
			m.abs = "";
			m.eat = "";
		}
	});

	function changed() {
		if (!(m.eat === "nein" || m.err === "schwer")) m.san = "";
	}
</script>

{#snippet fitter()}
	<div>
		<Select
			label="Wer soll die Geräte montieren?"
			bind:value={m.wer}
			options={fitters}
			tip={MOUNT_TIPS.wer}
		/>
	</div>
{/snippet}

{#snippet selfNote()}
	{#if m.wer === "eigen"}
		<div class="ss-cond">
			<Note
				><b>Keine Vorkenntnisse erforderlich.</b> Jeder Hausinstallateur kann die
				Installation vornehmen. Dazu erhalten Sie von uns eine genaue Montagebeschreibung.
				Die Installationspauschale entfällt.</Note
			>
		</div>
	{/if}
{/snippet}

{#snippet advice()}
	{#if m.wer === "offen"}
		<div class="ss-cond">
			<div class="ss-bero">
				<Note
					><b>Noch unsicher, wer montiert?</b> In einem Beratungstermin klären wir
					mit Ihnen Montage, Zählertypen und Einbausituation.</Note
				>
				<label class="cb"
					><input type="checkbox" bind:checked={w.s.ber} /><i
						><Markup html={CHECK} /></i
					><span
						>Beratungstermin mit Zähleridentifikation dazubuchen <b
							>(39 € netto)</b
						></span
					></label
				>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet notes()}
	<Text
		area
		label="Hinweise zur Liegenschaft"
		bind:value={m.bem}
		placeholder="z. B. mehrere Gebäude, Schachtzugänge, Sanierung geplant"
		tip={fieldTip("mont", "bem")}
	/>
{/snippet}

{#if !byDevices}
	{@render fitter()}
	{@render selfNote()}
	{#if m.wer === "heidi"}
		<div class="ss-cond">
			<Note
				>{counted
					? `Bei ${counted} Zählern beträgt die Installationspauschale ${fitterFee(w.s).replace(" €", "")} € netto.`
					: "Die genaue Installationspauschale legen wir anhand Ihrer Geräteliste fest."}</Note
			>
		</div>
	{/if}
	{@render advice()}
	{@render notes()}
{:else}
	{#if shutoff}
		<div class="f2">
			<Select
				label="Sind Wasser- und Heizkreise absperrbar?"
				bind:value={m.abs}
				options={SHUTOFF_CIRCUIT_OPTIONS}
				tip={MOUNT_TIPS.abs}
				onchange={(v) => {
					if (v !== "ja" && v !== "nein") return;
					m.eat = v;
					flash++;
					changed();
				}}
			/>
			{#key flash}
				<Select
					label="Sind passende Einbausätze vorhanden?"
					bind:value={m.eat}
					options={FITTING_OPTIONS}
					tip={MOUNT_TIPS.eat}
					flash={flash > 0}
					onchange={changed}
				/>
			{/key}
		</div>
	{/if}
	<div class="f2">
		<Select
			label="Sind die Zähler erreichbar?"
			bind:value={m.err}
			options={REACH_OPTIONS}
			tip={MOUNT_TIPS.err}
			onchange={changed}
		/>
		{#if plumbing}
			<div class="ss-cond">
				<Select
					label="Wer übernimmt Sanitärvorarbeiten?"
					bind:value={m.san}
					options={PLUMBING_OPTIONS}
					tip={MOUNT_TIPS.san}
				/>
			</div>
		{/if}
	</div>
	{@render fitter()}
	{#if m.san === "heidi" && plumbing}
		<div class="ss-cond">
			<Note warn
				><b>Gut zu wissen:</b> Koordiniert Heidi die Sanitärvorarbeiten, suchen und
				beauftragen wir einen Sanitärbetrieb, stimmen Termine ab und weisen ihn ein.
				Dafür kann eine zusätzliche Aufwandspauschale anfallen. Am schnellsten geht
				es mit Ihrem eigenen Sanitärbetrieb.</Note
			>
		</div>
	{/if}
	{@render selfNote()}
	{@render advice()}
	{#if m.wer === "heidi"}
		<div class="ss-cond">
			<Note warn
				><b>Bitte Zählertyp und Anzahl genau angeben:</b> Stimmen Typ oder Anzahl
				der Zähler vor Ort nicht mit Ihren Angaben überein, ist ein kostenpflichtiger
				Nachtermin nötig.</Note
			>
		</div>
	{/if}
	{@render notes()}
{/if}

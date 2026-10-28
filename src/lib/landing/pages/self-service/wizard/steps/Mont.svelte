<!--
  Step "Montage". "Absperrbar" Ja / Nein sets "Einbausätze" the same and
  flashes it; the plumbing question shows only when it's needed.
-->
<script lang="ts">
	import {
		fieldTip,
		FITTER_OPTIONS,
		FITTING_OPTIONS,
		MOUNT_TIPS,
		PLUMBING_OPTIONS,
		REACH_OPTIONS,
		SHUTOFF_CIRCUIT_OPTIONS,
	} from "../data";
	import Note from "../ui/Note.svelte";
	import Select from "../ui/Select.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const m = $derived(w.s.mont);
	const plumbing = $derived(m.eat === "nein" || m.err === "schwer");
	let flash = $state(0);

	function changed() {
		if (!(m.eat === "nein" || m.err === "schwer")) m.san = "";
	}
</script>

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
<div>
	<Select
		label="Wer soll die Geräte montieren?"
		bind:value={m.wer}
		options={FITTER_OPTIONS}
		tip={MOUNT_TIPS.wer}
	/>
</div>
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
{#if m.wer === "eigen"}
	<div class="ss-cond">
		<Note
			><b>Keine Vorkenntnisse erforderlich.</b> Jeder Hausinstallateur kann die Funkzähler
			bequem selbst montieren. Die Installationspauschale entfällt.</Note
		>
	</div>
{/if}
<Text
	area
	label="Hinweise zur Liegenschaft"
	bind:value={m.bem}
	placeholder="z. B. mehrere Gebäude, Schachtzugänge, Sanierung geplant"
	tip={fieldTip("mont", "bem")}
/>

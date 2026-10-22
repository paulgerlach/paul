<!-- Step "Rauchwarnmelder bestimmen": the rooms' minimum and the total. -->
<script lang="ts">
	import { fieldTip, QUESTION_TIPS } from "../data";
	import { num } from "../model";
	import { ICONS } from "../svg";
	import Note from "../ui/Note.svelte";
	import Options from "../ui/Options.svelte";
	import Question from "../ui/Question.svelte";
	import Select from "../ui/Select.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const r = $derived(w.s.rwm);
	const min = $derived(num(r.sz) + num(r.kz) + num(r.fl));
	const n = $derived(num(r.n));
	const off = $derived(Boolean(min && n && (n < min || n > min * 2.5)));
	const tip = (k: string) => fieldTip("rwm", k);
</script>

<div class="ss-f3">
	<Text
		label="Schlafzimmer"
		bind:value={r.sz}
		placeholder="0"
		type="number"
		tip={tip("sz")}
	/>
	<Text
		label="Kinderzimmer"
		bind:value={r.kz}
		placeholder="0"
		type="number"
		tip={tip("kz")}
	/>
	<Text
		label="Flure (Rettungswege)"
		bind:value={r.fl}
		placeholder="0"
		type="number"
		tip={tip("fl")}
	/>
</div>
{#if min}
	<Note
		>Nach Ihren Raumangaben sind mindestens {min} Rauchwarnmelder nötig.</Note
	>
{/if}
<div class="f2">
	<Text
		label="Gesamtzahl Rauchwarnmelder"
		bind:value={r.n}
		placeholder={!r.n && min ? String(min) : "z. B. 12"}
		type="number"
		tip={tip("n")}
	/>
	<Select
		label="Ersetzen oder neu?"
		bind:value={r.art}
		options={[
			["neu", "Neu montieren"],
			["ersetzen", "Vorhandene ersetzen"],
			["beides", "Teils ersetzen, teils neu"],
			["unbekannt", "Unbekannt"],
		]}
		tip={tip("art")}
	/>
</div>
{#if off}
	<Note warn
		>{n < min
			? "Die Gesamtzahl liegt unter der Mindestzahl aus den Räumen. Bitte prüfen Sie die Angaben, wir markieren das zur Kontrolle."
			: "Die Gesamtzahl ist deutlich höher als die Mindestzahl. Wir markieren das zur Kontrolle."}</Note
	>
{/if}
<Question
	text="Montageart (Mehrfachauswahl)"
	kind="sub"
	tip={QUESTION_TIPS.mounting}
/>
<Options
	class="grid3"
	options={[
		{ v: "decke", label: "Normale Decke", icon: ICONS.meter },
		{ v: "schraege", label: "Dachschräge", icon: ICONS.half },
		{ v: "hoch", label: "Hohe Decke (über 3 m)", icon: ICONS.up },
	]}
	value={r.mont}
	onpick={(v) => {
		r.mont = r.mont.includes(v)
			? r.mont.filter((x) => x !== v)
			: [...r.mont, v];
	}}
/>
<Text
	area
	label="Besonderheiten"
	bind:value={r.bem}
	placeholder="Falls etwas unklar ist, hier erläutern"
	tip={tip("bem")}
/>
